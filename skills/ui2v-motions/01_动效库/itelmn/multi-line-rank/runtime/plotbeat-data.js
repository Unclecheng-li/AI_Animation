(function installHyperFramesDataViz(global) {
  "use strict";

  const EPSILON = 1e-9;

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(from, to, progress) {
    return from + (to - from) * progress;
  }

  function smoothstep(edge0, edge1, value) {
    if (edge0 === edge1) return value < edge0 ? 0 : 1;
    const progress = clamp((value - edge0) / (edge1 - edge0));
    return progress * progress * (3 - 2 * progress);
  }

  function smootherstep(edge0, edge1, value) {
    if (edge0 === edge1) return value < edge0 ? 0 : 1;
    const progress = clamp((value - edge0) / (edge1 - edge0));
    return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
  }

  function createTransitionState(progress, config) {
    const entrance = smootherstep(0, config.introEnd, progress);
    const outro = smootherstep(config.outroStart, 1, progress);
    const panelOpen = clamp(entrance * (1 - outro));
    return {
      entrance,
      entranceTitle: smootherstep(0.08, 0.58, entrance),
      entranceChart: smootherstep(0.16, 0.82, entrance),
      entranceDetail: smootherstep(0.34, 1, entrance),
      outro,
      panelOpen,
      seamEnergy: Math.pow(Math.sin(panelOpen * Math.PI), 0.55),
    };
  }

  function applyTransitionOverlay(elements, transition) {
    elements.transitionTop.style.transform = `translateY(${-100 * transition.panelOpen}%)`;
    elements.transitionBottom.style.transform = `translateY(${100 * transition.panelOpen}%)`;
    elements.transitionSeam.style.opacity = String(transition.seamEnergy * 0.88);
    elements.transitionSeam.style.transform = `scaleX(${0.34 + transition.seamEnergy * 0.66})`;
  }

  function parseTimestamp(value) {
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) {
      throw new Error(`Invalid data-video date: ${value}`);
    }
    return timestamp;
  }

  function normalizePoints(points) {
    if (!Array.isArray(points)) throw new Error("A data-video series must contain a points array.");

    const normalized = points.map((point, index) => {
      const value = Number(point.value);
      if (!Number.isFinite(value)) {
        throw new Error(`Invalid numeric value at point ${index}: ${point.value}`);
      }
      return {
        date: String(point.date),
        timestamp: parseTimestamp(point.date),
        value,
      };
    });

    normalized.sort((a, b) => a.timestamp - b.timestamp);
    if (normalized.length < 2) throw new Error("A line-story template needs at least two data points.");
    return normalized;
  }

  function buildPrefixDomains(points) {
    const domains = [];
    let min = points[0].value;
    let max = points[0].value;

    points.forEach((point) => {
      min = Math.min(min, point.value);
      max = Math.max(max, point.value);
      if (min >= 0) {
        domains.push({ min: 0, max: Math.max(1, max * 1.3) });
      } else if (max <= 0) {
        domains.push({ min: Math.min(-1, min * 1.3), max: 0 });
      } else {
        const span = Math.max(max - min, 1);
        const padding = span * 0.16;
        domains.push({ min: min - padding, max: max + padding });
      }
    });

    return domains;
  }

  function monotonePath(points) {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    const slopes = [];
    const tangents = [];

    for (let index = 0; index < points.length - 1; index += 1) {
      const dx = Math.max(EPSILON, points[index + 1].x - points[index].x);
      slopes.push((points[index + 1].y - points[index].y) / dx);
    }

    tangents[0] = slopes[0];
    tangents[points.length - 1] = slopes[slopes.length - 1];

    for (let index = 1; index < points.length - 1; index += 1) {
      tangents[index] = slopes[index - 1] * slopes[index] <= 0
        ? 0
        : (slopes[index - 1] + slopes[index]) / 2;
    }

    for (let index = 0; index < slopes.length; index += 1) {
      if (Math.abs(slopes[index]) < EPSILON) {
        tangents[index] = 0;
        tangents[index + 1] = 0;
        continue;
      }

      const a = tangents[index] / slopes[index];
      const b = tangents[index + 1] / slopes[index];
      const magnitude = Math.hypot(a, b);
      if (magnitude > 3) {
        const scale = 3 / magnitude;
        tangents[index] = scale * a * slopes[index];
        tangents[index + 1] = scale * b * slopes[index];
      }
    }

    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      const dx = next.x - current.x;
      path += [
        " C",
        (current.x + dx / 3).toFixed(2),
        (current.y + (tangents[index] * dx) / 3).toFixed(2),
        (next.x - dx / 3).toFixed(2),
        (next.y - (tangents[index + 1] * dx) / 3).toFixed(2),
        next.x.toFixed(2),
        next.y.toFixed(2),
      ].join(" ");
    }
    return path;
  }

  function linePath(points) {
    if (points.length === 0) return "";
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");
  }

  function areaPath(points, baseline) {
    if (points.length === 0) return "";
    const line = linePath(points);
    const first = points[0];
    const last = points[points.length - 1];
    return `${line} L ${last.x.toFixed(2)} ${baseline.toFixed(2)} L ${first.x.toFixed(2)} ${baseline.toFixed(2)} Z`;
  }

  function formatElapsed(fromTimestamp, toTimestamp) {
    const days = Math.max(0, (toTimestamp - fromTimestamp) / 86400000);
    const years = days / 365.2425;
    if (years >= 2) return `${formatValue(years, years >= 10 ? 0 : 1)} years`;
    const months = days / 30.4375;
    if (months >= 2) return `${formatValue(months, months >= 10 ? 0 : 1)} months`;
    return `${Math.max(1, Math.round(days))} days`;
  }

  function formatDate(timestamp, mode = "month-year") {
    const date = new Date(timestamp);
    if (mode === "year") return String(date.getUTCFullYear());
    if (mode === "iso") return date.toISOString().slice(0, 10);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function formatValue(value, decimals = 1) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  function readableTextColor(color) {
    const match = /^#([0-9a-f]{6})$/i.exec(color ?? "");
    if (!match) return "#071006";
    const channels = [0, 2, 4].map((offset) => {
      const value = Number.parseInt(match[1].slice(offset, offset + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    const darkContrast = (luminance + 0.05) / 0.05;
    const lightContrast = 1.05 / (luminance + 0.05);
    return darkContrast >= lightContrast ? "#071006" : "#f1f4f3";
  }

  function createSingleLineModel(input, spec = {}, geometry = {}) {
    const series = input?.series?.[0];
    if (!series) throw new Error("The single-line-story template requires one series.");

    const points = normalizePoints(series.points);
    const prefixDomains = buildPrefixDomains(points);
    const config = {
      introHold: spec.introHold ?? 0.02,
      introEnd: spec.introEnd ?? 0.06,
      finaleStart: spec.finaleStart ?? 0.88,
      finaleDuration: spec.finaleDuration ?? 0.065,
      outroStart: spec.outroStart ?? 0.955,
      valueDecimals: spec.valueDecimals ?? 1,
      dateFormat: spec.dateFormat ?? "month-year",
      plotLeft: geometry.plotLeft ?? 92,
      plotRight: geometry.plotRight ?? 1408,
      plotTop: geometry.plotTop ?? 26,
      plotBottom: geometry.plotBottom ?? 608,
      gridRows: geometry.gridRows ?? 5,
      pathStyle: spec.pathStyle ?? "linear",
    };

    function renderState(progress) {
      const normalizedProgress = clamp(progress);
      const dataProgress = clamp(
        (normalizedProgress - config.introHold) / (config.finaleStart - config.introHold),
      );
      const fractionalIndex = dataProgress * (points.length - 1);
      const leftIndex = Math.min(points.length - 2, Math.floor(fractionalIndex));
      const segmentProgress = fractionalIndex >= points.length - 1 ? 1 : fractionalIndex - leftIndex;
      const rightIndex = Math.min(points.length - 1, leftIndex + 1);

      const currentPoint = {
        timestamp: lerp(points[leftIndex].timestamp, points[rightIndex].timestamp, segmentProgress),
        value: lerp(points[leftIndex].value, points[rightIndex].value, segmentProgress),
      };

      const currentDomain = prefixDomains[leftIndex];
      const nextDomain = prefixDomains[rightIndex];
      const domain = {
        min: lerp(currentDomain.min, nextDomain.min, segmentProgress),
        max: lerp(currentDomain.max, nextDomain.max, segmentProgress),
      };

      const visiblePoints = points.slice(0, leftIndex + 1).map((point) => ({ ...point }));
      if (dataProgress > 0 || visiblePoints.length === 0) {
        visiblePoints.push({
          date: formatDate(currentPoint.timestamp, "iso"),
          timestamp: currentPoint.timestamp,
          value: currentPoint.value,
        });
      }

      const firstTimestamp = points[0].timestamp;
      const lastTimestamp = points[points.length - 1].timestamp;
      const timeSpan = Math.max(EPSILON, lastTimestamp - firstTimestamp);
      const valueSpan = Math.max(EPSILON, domain.max - domain.min);
      const plotWidth = config.plotRight - config.plotLeft;
      const plotHeight = config.plotBottom - config.plotTop;

      const mapped = visiblePoints.map((point) => ({
        x: config.plotLeft + ((point.timestamp - firstTimestamp) / timeSpan) * plotWidth,
        y: config.plotBottom - ((point.value - domain.min) / valueSpan) * plotHeight,
      }));

      if (mapped.length === 1) mapped[0].x = config.plotLeft;
      const endpoint = mapped[mapped.length - 1];
      const pathBuilder = config.pathStyle === "smooth" ? monotonePath : linePath;
      const gridValues = Array.from({ length: config.gridRows }, (_, index) => {
        const rowProgress = index / (config.gridRows - 1);
        return {
          value: lerp(domain.max, domain.min, rowProgress),
          y: lerp(config.plotTop, config.plotBottom, rowProgress),
        };
      });

      const finale = smootherstep(
        config.finaleStart,
        Math.min(config.outroStart, config.finaleStart + config.finaleDuration),
        normalizedProgress,
      );
      const transition = createTransitionState(normalizedProgress, config);
      const firstValue = points[0].value;
      const change = ((currentPoint.value - firstValue) / Math.max(EPSILON, Math.abs(firstValue))) * 100;
      const midTimestamp = lerp(firstTimestamp, currentPoint.timestamp, 0.5);
      const peakPoint = visiblePoints.reduce((peak, point) => point.value > peak.value ? point : peak, visiblePoints[0]);

      return {
        progress: normalizedProgress,
        dataProgress,
        fractionalIndex,
        path: pathBuilder(mapped),
        areaPath: areaPath(mapped, config.plotBottom),
        endpoint,
        gridValues,
        domain,
        currentPoint,
        currentDate: formatDate(currentPoint.timestamp, config.dateFormat),
        currentValue: formatValue(currentPoint.value, config.valueDecimals),
        firstDate: formatDate(firstTimestamp, config.dateFormat),
        midDate: formatDate(midTimestamp, config.dateFormat),
        change,
        changeLabel: `${change >= 0 ? "+" : ""}${formatValue(change, 1)}%`,
        elapsedLabel: formatElapsed(firstTimestamp, currentPoint.timestamp),
        peakDate: formatDate(peakPoint.timestamp, config.dateFormat),
        peakValue: formatValue(peakPoint.value, config.valueDecimals),
        finale,
        ...transition,
        chartOpacity: 1 - finale * 0.58,
        liveOpacity: 1 - finale,
        ambient: 0.5 + Math.sin(normalizedProgress * Math.PI * 8) * 0.5,
      };
    }

    return { input, series, points, config, renderState };
  }

  function createSingleLineController(options) {
    const model = createSingleLineModel(options.data, options.spec, options.geometry);
    const root = options.root ?? document;
    const get = (selector) => {
      const element = root.querySelector(selector);
      if (!element) throw new Error(`Missing single-line template element: ${selector}`);
      return element;
    };

    const elements = {
      liveFrame: get("#live-frame"),
      chartTitle: get("#chart-title"),
      chartLayer: get("#chart-layer"),
      area: get("#series-area"),
      line: get("#series-line"),
      glow: get("#series-glow"),
      endpoint: get("#series-endpoint"),
      endpointHalo: get("#series-endpoint-halo"),
      endpointLabel: get("#series-endpoint-label"),
      liveGroup: get("#live-readout"),
      liveBaseline: get("#live-baseline"),
      liveDate: get("#live-date"),
      liveValue: get("#live-value"),
      liveUnit: get("#live-unit"),
      liveChange: get("#live-change"),
      xStart: get("#x-date-start"),
      xMid: get("#x-date-mid"),
      xEnd: get("#x-date-end"),
      xEndChip: get("#x-date-chip"),
      finale: get("#finale-lockup"),
      finaleLead: get("#finale-lead"),
      finaleValue: get("#finale-value"),
      finaleDate: get("#finale-date"),
      finaleChange: get("#finale-change"),
      finalePeak: get("#finale-peak"),
      ambientGlow: get("#ambient-glow"),
      titlePrefix: get("#chart-title-prefix"),
      titleAccent: get("#chart-title-accent"),
      titleSuffix: get("#chart-title-suffix"),
      source: get("#chart-source"),
      footer: get("#live-frame .footer-mark"),
      gridRows: [...root.querySelectorAll(".grid-row")],
      transitionTop: get("#transition-top"),
      transitionBottom: get("#transition-bottom"),
      transitionSeam: get("#transition-seam"),
      finaleSweep: get("#finale-sweep"),
    };
    elements.finaleItems = [
      elements.finaleLead,
      elements.finaleValue,
      get("#finale-lockup .finale-change-row"),
      elements.finaleDate,
      elements.finalePeak,
    ];

    const title = options.data.title ?? `What if ${model.series.label} kept compounding?`;
    const accentText = options.data.accentText ?? model.series.label;
    const accentIndex = title.toLocaleLowerCase().indexOf(accentText.toLocaleLowerCase());
    elements.titlePrefix.textContent = accentIndex >= 0 ? title.slice(0, accentIndex) : title;
    elements.titleAccent.textContent = accentIndex >= 0 ? title.slice(accentIndex, accentIndex + accentText.length) : "";
    elements.titleSuffix.textContent = accentIndex >= 0 ? title.slice(accentIndex + accentText.length) : "";
    elements.source.textContent = `Data: ${options.data.source ?? "User-supplied dataset"}`;
    elements.liveBaseline.textContent = options.data.baselineLabel ?? "Current observed value";
    elements.liveUnit.textContent = options.data.unit ?? "";
    elements.finaleLead.textContent = options.data.finaleKicker
      ?? `${formatValue(model.points[0].value, model.config.valueDecimals)} ${options.data.unit ?? ""} became`;

    function renderAt(progress) {
      const state = model.renderState(progress);
      const liveContent = 1 - smootherstep(0, 0.34, state.finale);
      const titleOpacity = state.entranceTitle * liveContent;
      const detailOpacity = state.entranceDetail * liveContent;
      const edgeDetailOpacity = smootherstep(0.96, 1, state.entrance) * liveContent;
      const chartOpacity = state.entranceChart * (1 - state.outro * 0.72);
      applyTransitionOverlay(elements, state);
      elements.area.setAttribute("d", state.areaPath);
      elements.line.setAttribute("d", state.path);
      elements.glow.setAttribute("d", state.path);
      elements.endpoint.setAttribute("cx", state.endpoint.x);
      elements.endpoint.setAttribute("cy", state.endpoint.y);
      elements.endpointHalo.setAttribute("cx", state.endpoint.x);
      elements.endpointHalo.setAttribute("cy", state.endpoint.y);
      elements.endpointLabel.setAttribute("x", Math.min(state.endpoint.x + 28, model.config.plotRight + 20));
      elements.endpointLabel.setAttribute("y", state.endpoint.y + 12);
      elements.endpointLabel.textContent = `${state.currentValue}${options.data.unit ? ` ${options.data.unit}` : ""}`;
      elements.endpointHalo.setAttribute("r", 14 + state.ambient * 8);
      elements.endpointHalo.style.opacity = String(0.16 + state.ambient * 0.22);
      elements.liveDate.textContent = state.currentDate;
      elements.liveValue.textContent = state.currentValue;
      elements.liveChange.textContent = state.changeLabel;
      elements.xStart.textContent = state.firstDate;
      elements.xMid.textContent = state.midDate;
      elements.xEnd.textContent = state.currentDate;
      elements.xMid.setAttribute("x", lerp(model.config.plotLeft, state.endpoint.x, 0.5));
      elements.xMid.style.opacity = state.dataProgress >= 0.3 ? "1" : "0";
      const chipCenter = clamp(state.endpoint.x, model.config.plotLeft + 70, model.config.plotRight - 70);
      elements.xEndChip.setAttribute("transform", `translate(${(chipCenter - 1520).toFixed(2)} 0)`);
      elements.xEndChip.style.opacity = state.dataProgress >= 0.14 ? String(detailOpacity) : "0";
      elements.liveFrame.style.opacity = String(
        state.entranceChart * (1 - state.finale * 0.64) * (1 - state.outro * 0.64),
      );
      elements.liveFrame.style.transform = `translateY(${lerp(22, -8 * state.finale, state.entrance)}px) scale(${lerp(0.985, 1, state.entrance) - state.finale * 0.018})`;
      elements.chartTitle.style.opacity = String(titleOpacity);
      elements.chartTitle.style.transform = `translateY(${lerp(22, 0, state.entranceTitle)}px)`;
      elements.liveGroup.style.opacity = String(detailOpacity);
      elements.liveGroup.style.transform = `translateX(${lerp(28, 0, state.entranceDetail)}px)`;
      elements.endpointLabel.style.opacity = String(detailOpacity);
      elements.xStart.style.opacity = String(detailOpacity);
      elements.xMid.style.opacity = state.dataProgress >= 0.3 ? String(detailOpacity) : "0";
      elements.source.style.opacity = String(edgeDetailOpacity);
      elements.footer.style.opacity = String(edgeDetailOpacity);
      elements.chartLayer.style.opacity = String(chartOpacity);
      elements.chartLayer.style.transform = `translateY(${lerp(18, 0, state.entranceChart)}px)`;
      elements.ambientGlow.style.opacity = String((0.13 + state.ambient * 0.08) * state.entranceChart * (1 - state.outro));
      const finaleVisibility = state.finale * (1 - state.outro * 0.88);
      elements.finale.style.opacity = String(finaleVisibility);
      elements.finale.style.transform = `translateY(${lerp(34, 0, state.finale)}px) scale(${lerp(0.976, 1, state.finale) - state.outro * 0.012})`;
      const sweepProgress = smootherstep(0.04, 0.56, state.finale);
      const sweepFade = 1 - smootherstep(0.58, 1, state.finale);
      elements.finaleSweep.style.opacity = String(sweepProgress * sweepFade * 0.72);
      elements.finaleSweep.style.transform = `scaleX(${sweepProgress})`;
      elements.finaleItems.forEach((item, index) => {
        const itemStart = 0.06 + index * 0.1;
        const itemProgress = smootherstep(itemStart, Math.min(1, itemStart + 0.38), state.finale);
        item.style.opacity = String(itemProgress * (1 - state.outro * 0.9));
        item.style.transform = `translateY(${lerp(26 - index * 2, 0, itemProgress)}px)`;
      });
      elements.finaleValue.textContent = `${state.currentValue}${options.data.unit ? ` ${options.data.unit}` : ""}`;
      elements.finaleDate.textContent = `${state.currentDate} · ${state.elapsedLabel}`;
      elements.finaleChange.textContent = state.changeLabel;
      elements.finalePeak.textContent = `Peak ${state.peakDate} · ${state.peakValue}${options.data.unit ? ` ${options.data.unit}` : ""}`;

      elements.gridRows.forEach((row, index) => {
        const tick = state.gridValues[index];
        if (!tick) return;
        const line = row.querySelector("line");
        const label = row.querySelector("text");
        line.setAttribute("y1", tick.y);
        line.setAttribute("y2", tick.y);
        label.setAttribute("y", tick.y + 7);
        label.textContent = formatValue(tick.value, model.config.valueDecimals);
        label.style.opacity = String(detailOpacity);
      });
      return state;
    }

    renderAt(0);
    return { model, renderAt };
  }

  function createMultiLineModel(input, spec = {}, geometry = {}) {
    if (!Array.isArray(input?.series) || input.series.length < 2) {
      throw new Error("The multi-line-rank template requires at least two series.");
    }

    const series = input.series.map((entry, index) => ({
      id: String(entry.id ?? `series-${index + 1}`),
      label: String(entry.label ?? entry.id ?? `Series ${index + 1}`),
      color: entry.color ?? `hsl(${(index * 47) % 360} 72% 58%)`,
      points: normalizePoints(entry.points),
    }));
    const timestamps = series[0].points.map((point) => point.timestamp);

    series.forEach((entry) => {
      if (entry.points.length !== timestamps.length) {
        throw new Error("Every multi-line series must contain the same number of dates in v0.1.");
      }
      entry.points.forEach((point, index) => {
        if (point.timestamp !== timestamps[index]) {
          throw new Error("Every multi-line series must use the same ordered dates in v0.1.");
        }
      });
    });

    const config = {
      introHold: spec.introHold ?? 0.02,
      introEnd: spec.introEnd ?? 0.06,
      finaleStart: spec.finaleStart ?? 0.88,
      finaleDuration: spec.finaleDuration ?? 0.07,
      outroStart: spec.outroStart ?? 0.955,
      valueDecimals: spec.valueDecimals ?? 1,
      dateFormat: spec.dateFormat ?? "month-year",
      maxRanked: Math.min(spec.maxRanked ?? series.length, series.length),
      plotLeft: geometry.plotLeft ?? 88,
      plotRight: geometry.plotRight ?? 1218,
      plotTop: geometry.plotTop ?? 30,
      plotBottom: geometry.plotBottom ?? 604,
      gridRows: geometry.gridRows ?? 5,
      pathStyle: spec.pathStyle ?? "linear",
    };

    const prefixDomains = [];
    const rankFrames = [];
    let cumulativeMin = Number.POSITIVE_INFINITY;
    let cumulativeMax = Number.NEGATIVE_INFINITY;

    timestamps.forEach((_, timeIndex) => {
      const values = series.map((entry) => entry.points[timeIndex].value);
      cumulativeMin = Math.min(cumulativeMin, ...values);
      cumulativeMax = Math.max(cumulativeMax, ...values);
      if (cumulativeMin >= 0) {
        prefixDomains.push({ min: 0, max: Math.max(1, cumulativeMax * 1.3) });
      } else if (cumulativeMax <= 0) {
        prefixDomains.push({ min: Math.min(-1, cumulativeMin * 1.3), max: 0 });
      } else {
        const span = Math.max(cumulativeMax - cumulativeMin, 1);
        const padding = span * 0.14;
        prefixDomains.push({ min: cumulativeMin - padding, max: cumulativeMax + padding });
      }

      const ranks = new Map();
      series
        .map((entry) => ({ id: entry.id, value: entry.points[timeIndex].value }))
        .sort((a, b) => b.value - a.value || a.id.localeCompare(b.id))
        .forEach((entry, rank) => ranks.set(entry.id, rank));
      rankFrames.push(ranks);
    });

    function renderState(progress) {
      const normalizedProgress = clamp(progress);
      const dataProgress = clamp(
        (normalizedProgress - config.introHold) / (config.finaleStart - config.introHold),
      );
      const fractionalIndex = dataProgress * (timestamps.length - 1);
      const leftIndex = Math.min(timestamps.length - 2, Math.floor(fractionalIndex));
      const segmentProgress = fractionalIndex >= timestamps.length - 1 ? 1 : fractionalIndex - leftIndex;
      const rightIndex = Math.min(timestamps.length - 1, leftIndex + 1);
      const rankProgress = smoothstep(0, 1, segmentProgress);
      const currentTimestamp = lerp(timestamps[leftIndex], timestamps[rightIndex], segmentProgress);

      const currentDomain = prefixDomains[leftIndex];
      const nextDomain = prefixDomains[rightIndex];
      const domain = {
        min: lerp(currentDomain.min, nextDomain.min, segmentProgress),
        max: lerp(currentDomain.max, nextDomain.max, segmentProgress),
      };
      const valueSpan = Math.max(EPSILON, domain.max - domain.min);
      const timeSpan = Math.max(EPSILON, timestamps[timestamps.length - 1] - timestamps[0]);
      const plotWidth = config.plotRight - config.plotLeft;
      const plotHeight = config.plotBottom - config.plotTop;

      const renderedSeries = series.map((entry) => {
        const leftPoint = entry.points[leftIndex];
        const rightPoint = entry.points[rightIndex];
        const currentValue = lerp(leftPoint.value, rightPoint.value, segmentProgress);
        const visible = entry.points.slice(0, leftIndex + 1).map((point) => ({ ...point }));
        if (dataProgress > 0 || visible.length === 0) {
          visible.push({ timestamp: currentTimestamp, value: currentValue });
        }
        const mapped = visible.map((point) => ({
          x: config.plotLeft + ((point.timestamp - timestamps[0]) / timeSpan) * plotWidth,
          y: config.plotBottom - ((point.value - domain.min) / valueSpan) * plotHeight,
        }));
        if (mapped.length === 1) mapped[0].x = config.plotLeft;
        const endpoint = mapped[mapped.length - 1];
        const rank = lerp(
          rankFrames[leftIndex].get(entry.id),
          rankFrames[rightIndex].get(entry.id),
          rankProgress,
        );
        const initialValue = entry.points[0].value;
        const multiplier = Math.abs(initialValue) < EPSILON ? null : currentValue / initialValue;
        const pathBuilder = config.pathStyle === "smooth" ? monotonePath : linePath;
        return {
          ...entry,
          value: currentValue,
          valueLabel: formatValue(currentValue, config.valueDecimals),
          multiplier,
          multiplierLabel: multiplier === null ? "—" : `×${formatValue(multiplier, multiplier >= 100 ? 0 : 1)}`,
          rank,
          path: pathBuilder(mapped),
          endpoint,
        };
      });

      const ranked = [...renderedSeries].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
      const gridValues = Array.from({ length: config.gridRows }, (_, index) => {
        const rowProgress = index / (config.gridRows - 1);
        return {
          value: lerp(domain.max, domain.min, rowProgress),
          y: lerp(config.plotTop, config.plotBottom, rowProgress),
        };
      });
      const finale = smootherstep(
        config.finaleStart,
        Math.min(config.outroStart, config.finaleStart + config.finaleDuration),
        normalizedProgress,
      );
      const transition = createTransitionState(normalizedProgress, config);

      return {
        progress: normalizedProgress,
        dataProgress,
        fractionalIndex,
        currentTimestamp,
        currentDate: formatDate(currentTimestamp, config.dateFormat),
        firstDate: formatDate(timestamps[0], config.dateFormat),
        midDate: formatDate(lerp(timestamps[0], currentTimestamp, 0.5), config.dateFormat),
        domain,
        gridValues,
        series: renderedSeries,
        ranked,
        finale,
        ...transition,
        chartOpacity: 1 - finale * 0.7,
        liveOpacity: 1 - finale,
        ambient: 0.5 + Math.sin(normalizedProgress * Math.PI * 10) * 0.5,
      };
    }

    return { input, series, timestamps, config, renderState };
  }

  function createMultiLineController(options) {
    const model = createMultiLineModel(options.data, options.spec, options.geometry);
    const root = options.root ?? document;
    const get = (selector) => {
      const element = root.querySelector(selector);
      if (!element) throw new Error(`Missing multi-line template element: ${selector}`);
      return element;
    };
    const svgNamespace = "http://www.w3.org/2000/svg";
    const seriesLayer = get("#multi-series-layer");
    const rankingList = get("#ranking-list");
    const finaleRows = get("#finale-ranking-rows");

    const seriesElements = new Map();
    model.series.forEach((entry, seriesIndex) => {
      const group = document.createElementNS(svgNamespace, "g");
      const glow = document.createElementNS(svgNamespace, "path");
      const line = document.createElementNS(svgNamespace, "path");
      const halo = document.createElementNS(svgNamespace, "circle");
      const endpoint = document.createElementNS(svgNamespace, "circle");
      const endpointText = document.createElementNS(svgNamespace, "text");
      group.id = `series-${entry.id}`;
      glow.setAttribute("class", "multi-line-glow");
      glow.setAttribute("stroke", entry.color);
      line.setAttribute("class", "multi-line-path");
      line.setAttribute("stroke", entry.color);
      halo.setAttribute("class", "multi-line-halo");
      halo.setAttribute("fill", entry.color);
      halo.setAttribute("r", "13");
      endpoint.setAttribute("class", "multi-line-endpoint");
      endpoint.setAttribute("fill", entry.color);
      endpoint.setAttribute("stroke", entry.color);
      endpoint.setAttribute("r", "15");
      if (seriesIndex === 0) endpoint.id = "multi-motion-probe-endpoint";
      endpointText.setAttribute("class", "multi-line-endpoint-rank");
      endpointText.setAttribute("fill", readableTextColor(entry.color));
      endpointText.setAttribute("text-anchor", "middle");
      endpointText.setAttribute("dominant-baseline", "central");
      endpointText.setAttribute("data-layout-ignore", "");
      endpointText.setAttribute("data-layout-allow-overlap", "");
      group.append(glow, line, halo, endpoint, endpointText);
      seriesLayer.append(group);

      const row = document.createElement("div");
      row.className = "ranking-row";
      row.id = `rank-${entry.id}`;
      row.setAttribute("data-layout-allow-overlap", "");
      row.innerHTML = `<span class="ranking-position">01</span><i style="background:${entry.color}"></i><span class="ranking-name"></span><strong class="ranking-multiplier">×1.0</strong><strong class="ranking-value">0.0</strong>`;
      row.querySelector(".ranking-name").textContent = entry.label;
      rankingList.append(row);
      seriesElements.set(entry.id, { group, glow, line, halo, endpoint, endpointText, row });
    });

    for (let index = 0; index < model.config.maxRanked; index += 1) {
      const row = document.createElement("div");
      row.className = "finale-ranking-row";
      row.setAttribute("data-layout-allow-overlap", "");
      row.innerHTML = '<span class="finale-rank">01</span><i></i><span class="finale-rank-name"></span><strong class="finale-rank-multiplier">×1.0</strong><strong class="finale-rank-value">0.0</strong>';
      finaleRows.append(row);
    }

    const elements = {
      liveFrame: get("#multi-live-frame"),
      chartTitle: get("#multi-chart-title"),
      chartLayer: get("#multi-chart-layer"),
      rankingPanel: get("#ranking-panel"),
      finale: get("#multi-finale"),
      finaleDate: get("#multi-finale-date"),
      titlePrefix: get("#multi-title-prefix"),
      titleAccent: get("#multi-title-accent"),
      titleSuffix: get("#multi-title-suffix"),
      source: get("#multi-chart-source"),
      footer: get("#multi-live-frame .footer-mark"),
      xStart: get("#multi-x-start"),
      xMid: get("#multi-x-mid"),
      xEnd: get("#multi-x-end"),
      xEndChip: get("#multi-x-date-chip"),
      ambientGlow: get("#multi-ambient-glow"),
      gridRows: [...root.querySelectorAll(".multi-grid-row")],
      finaleRows: [...finaleRows.children],
      finaleHeading: get("#multi-finale .finale-heading"),
      transitionTop: get("#transition-top"),
      transitionBottom: get("#transition-bottom"),
      transitionSeam: get("#transition-seam"),
      finaleSweep: get("#multi-finale-sweep"),
    };

    const title = options.data.title ?? "What if every series started together?";
    const accentText = options.data.accentText ?? "every series";
    const accentIndex = title.toLocaleLowerCase().indexOf(accentText.toLocaleLowerCase());
    elements.titlePrefix.textContent = accentIndex >= 0 ? title.slice(0, accentIndex) : title;
    elements.titleAccent.textContent = accentIndex >= 0 ? title.slice(accentIndex, accentIndex + accentText.length) : "";
    elements.titleSuffix.textContent = accentIndex >= 0 ? title.slice(accentIndex + accentText.length) : "";
    elements.source.textContent = `Data: ${options.data.source ?? "User-supplied dataset"}`;
    const rankRowHeight = Math.min(46, 690 / model.config.maxRanked);
    rankingList.style.setProperty("--rank-row-height", `${rankRowHeight}px`);
    for (const item of seriesElements.values()) item.row.style.height = `${rankRowHeight}px`;

    function renderAt(progress) {
      const state = model.renderState(progress);
      const liveContent = 1 - smootherstep(0, 0.34, state.finale);
      const titleOpacity = state.entranceTitle * liveContent;
      const detailOpacity = state.entranceDetail * liveContent;
      const edgeDetailOpacity = smootherstep(0.96, 1, state.entrance) * liveContent;
      const chartOpacity = state.entranceChart * (1 - state.outro * 0.72);
      applyTransitionOverlay(elements, state);
      elements.xStart.textContent = state.firstDate;
      elements.xMid.textContent = state.midDate;
      elements.xEnd.textContent = state.currentDate;
      const leadingEndpoint = state.series[0].endpoint;
      elements.xMid.setAttribute("x", lerp(model.config.plotLeft, leadingEndpoint.x, 0.5));
      elements.xMid.style.opacity = state.dataProgress >= 0.3 ? "1" : "0";
      const chipCenter = clamp(leadingEndpoint.x, model.config.plotLeft + 67.5, model.config.plotRight - 67.5);
      elements.xEndChip.setAttribute("transform", `translate(${(chipCenter - 1147.5).toFixed(2)} 0)`);
      elements.xEndChip.style.opacity = state.dataProgress >= 0.14 ? String(detailOpacity) : "0";
      elements.liveFrame.style.opacity = String(
        state.entranceChart * (1 - state.finale * 0.66) * (1 - state.outro * 0.64),
      );
      elements.liveFrame.style.transform = `translateY(${lerp(22, -8 * state.finale, state.entrance)}px) scale(${lerp(0.985, 1, state.entrance) - state.finale * 0.018})`;
      elements.chartTitle.style.opacity = String(titleOpacity);
      elements.chartTitle.style.transform = `translateY(${lerp(22, 0, state.entranceTitle)}px)`;
      elements.rankingPanel.style.opacity = String(detailOpacity);
      elements.rankingPanel.style.transform = `translateX(${lerp(30, 0, state.entranceDetail)}px)`;
      elements.xStart.style.opacity = String(detailOpacity);
      elements.xMid.style.opacity = state.dataProgress >= 0.3 ? String(detailOpacity) : "0";
      elements.source.style.opacity = String(edgeDetailOpacity);
      elements.footer.style.opacity = String(edgeDetailOpacity);
      elements.chartLayer.style.opacity = String(chartOpacity);
      elements.chartLayer.style.transform = `translateY(${lerp(18, 0, state.entranceChart)}px)`;
      elements.ambientGlow.style.opacity = String((0.12 + state.ambient * 0.09) * state.entranceChart * (1 - state.outro));
      const finaleVisibility = state.finale * (1 - state.outro * 0.88);
      elements.finale.style.opacity = String(finaleVisibility);
      elements.finale.style.transform = `translateY(${lerp(32, 0, state.finale)}px) scale(${lerp(0.976, 1, state.finale) - state.outro * 0.012})`;
      const sweepProgress = smootherstep(0.04, 0.56, state.finale);
      const sweepFade = 1 - smootherstep(0.58, 1, state.finale);
      elements.finaleSweep.style.opacity = String(sweepProgress * sweepFade * 0.72);
      elements.finaleSweep.style.transform = `scaleX(${sweepProgress})`;
      const headingProgress = smootherstep(0.05, 0.42, state.finale);
      const dateProgress = smootherstep(0.14, 0.5, state.finale);
      elements.finaleHeading.style.opacity = String(headingProgress * (1 - state.outro * 0.9));
      elements.finaleHeading.style.transform = `translateY(${lerp(26, 0, headingProgress)}px)`;
      elements.finaleDate.style.opacity = String(dateProgress * (1 - state.outro * 0.9));
      elements.finaleDate.style.transform = `translateY(${lerp(20, 0, dateProgress)}px)`;
      elements.finaleDate.textContent = `${state.currentDate} · ${formatElapsed(model.timestamps[0], state.currentTimestamp)}`;

      [...state.ranked].reverse().forEach((entry) => {
        seriesLayer.append(seriesElements.get(entry.id).group);
      });

      state.series.forEach((entry) => {
        const item = seriesElements.get(entry.id);
        item.glow.setAttribute("d", entry.path);
        item.line.setAttribute("d", entry.path);
        item.halo.setAttribute("cx", entry.endpoint.x);
        item.halo.setAttribute("cy", entry.endpoint.y);
        item.endpoint.setAttribute("cx", entry.endpoint.x);
        item.endpoint.setAttribute("cy", entry.endpoint.y);
        item.endpointText.setAttribute("x", entry.endpoint.x);
        item.endpointText.setAttribute("y", entry.endpoint.y + 0.5);
        item.endpointText.style.opacity = String(detailOpacity);
        item.halo.style.opacity = String(0.1 + state.ambient * 0.12);
        item.row.style.transform = `translateY(${entry.rank * rankRowHeight}px)`;
        const currentRank = state.ranked.findIndex((rankedEntry) => rankedEntry.id === entry.id);
        item.row.style.opacity = currentRank < model.config.maxRanked ? "1" : "0";
        item.row.querySelector(".ranking-position").textContent = String(currentRank + 1).padStart(2, "0");
        item.row.querySelector(".ranking-multiplier").textContent = entry.multiplierLabel;
        item.row.querySelector(".ranking-value").textContent = `${entry.valueLabel}${options.data.unit ? ` ${options.data.unit}` : ""}`;
        item.endpointText.textContent = String(currentRank + 1);
      });

      elements.gridRows.forEach((row, index) => {
        const tick = state.gridValues[index];
        if (!tick) return;
        const line = row.querySelector("line");
        const label = row.querySelector("text");
        line.setAttribute("y1", tick.y);
        line.setAttribute("y2", tick.y);
        label.setAttribute("y", tick.y + 7);
        label.textContent = formatValue(tick.value, model.config.valueDecimals);
        label.style.opacity = String(detailOpacity);
      });

      elements.finaleRows.forEach((row, index) => {
        const entry = state.ranked[index];
        if (!entry) return;
        row.querySelector(".finale-rank").textContent = String(index + 1).padStart(2, "0");
        row.querySelector("i").style.background = entry.color;
        row.querySelector(".finale-rank-name").textContent = entry.label;
        row.querySelector(".finale-rank-multiplier").textContent = entry.multiplierLabel;
        row.querySelector(".finale-rank-value").textContent = `${entry.valueLabel}${options.data.unit ? ` ${options.data.unit}` : ""}`;
        const rowStart = 0.22 + index * 0.024;
        const rowProgress = smootherstep(rowStart, Math.min(1, rowStart + 0.34), state.finale);
        row.style.opacity = String(rowProgress * (1 - state.outro * 0.9));
        row.style.transform = `translateY(${lerp(18, 0, rowProgress)}px)`;
      });
      return state;
    }

    renderAt(0);
    return { model, renderAt };
  }

  global.HFDataViz = Object.freeze({
    createSingleLineController,
    createSingleLineModel,
    createMultiLineController,
    createMultiLineModel,
    formatDate,
    formatValue,
    formatElapsed,
    linePath,
    areaPath,
    monotonePath,
    normalizePoints,
    clamp,
    lerp,
    smoothstep,
    smootherstep,
    createTransitionState,
  });
})(window);
