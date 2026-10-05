(function () {
  "use strict";

  const ns = "http://www.w3.org/2000/svg";
  const palette = ["#c8ff57", "#82ddff", "#ff765f", "#8b7cff", "#fffdf7", "#ffbf47", "#53d6a6", "#fa7fc2"];
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const mix = (a, b, amount) => a + (b - a) * amount;
  const compact = (value, decimals = 0) => {
    const number = Number(value) || 0;
    if (Math.abs(number) >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (Math.abs(number) >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toFixed(decimals);
  };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const dateLabel = (raw) => {
    const [year, month = "01", day = "01"] = String(raw).split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[clamp(Number(month) - 1, 0, 11)]} ${Number(day) > 1 ? `${Number(day)}, ` : ""}${year}`;
  };

  function svgElement(tag, attributes = {}) {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function baseMarkup(data, kicker, mode) {
    return `
      <div class="pb-ambient" data-layout-allow-overflow></div>
      <header class="pb-header">
        <div><p>${esc(kicker)}</p><h1>${esc(data.title)}</h1></div>
        <span class="pb-mode">${esc(mode)}</span>
      </header>
      <div id="pb-stage" class="pb-stage"></div>
      <footer class="pb-footer"><span>Source · ${esc(data.source)}</span><b>PLOTBEAT · FOR HYPERFRAMES</b></footer>`;
  }

  function mountScatter(root, data, spec) {
    root.innerHTML = baseMarkup(data, "Trajectory over time", spec.scatterMode === "bubble" ? "Bubble trail" : "Connected trail");
    const stage = root.querySelector("#pb-stage");
    stage.innerHTML = `<div class="pb-plot-shell"><svg id="pb-scatter" viewBox="0 0 1330 660"></svg><div id="pb-date" class="pb-live-chip"></div></div><aside id="pb-rail" class="pb-side-rail"><p>Live positions</p><div id="pb-scatter-list"></div></aside>`;
    const svg = stage.querySelector("#pb-scatter");
    const left = 112, top = 82, width = 1085, height = 455;
    const all = data.series.flatMap((entry) => entry.points);
    const minX = Math.min(...all.map((point) => point.x));
    const maxX = Math.max(...all.map((point) => point.x));
    const minY = Math.min(...all.map((point) => point.y));
    const maxY = Math.max(...all.map((point) => point.y));
    const x = (value) => left + ((value - minX) / Math.max(1, maxX - minX)) * width;
    const y = (value) => top + height - ((value - minY) / Math.max(1, maxY - minY)) * height;

    for (let index = 0; index <= 4; index += 1) {
      const gx = left + (width * index) / 4;
      const gy = top + (height * index) / 4;
      svg.append(svgElement("line", { class: "pb-grid", x1: gx, x2: gx, y1: top, y2: top + height }));
      svg.append(svgElement("line", { class: "pb-grid", x1: left, x2: left + width, y1: gy, y2: gy }));
    }
    const xCaption = svgElement("text", { class: "pb-axis-caption", x: left + width, y: top + height + 58, "text-anchor": "end" });
    xCaption.textContent = data.xLabel || "X signal";
    const yCaption = svgElement("text", { class: "pb-axis-caption", x: left, y: top - 22 });
    yCaption.textContent = data.yLabel || "Y signal";
    svg.append(xCaption, yCaption);

    const rows = [];
    const paths = data.series.map((entry, seriesIndex) => {
      const color = entry.color || palette[seriesIndex % palette.length];
      const path = svgElement("path", { class: "pb-scatter-path", stroke: color, d: `M ${entry.points.map((point) => `${x(point.x)} ${y(point.y)}`).join(" L ")}` });
      const halo = svgElement("circle", { class: "pb-point-halo", fill: color, r: 25 });
      const dot = svgElement("circle", { class: "pb-point", fill: color, r: 10 });
      svg.append(path, halo, dot);
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      const row = document.createElement("div");
      row.className = "pb-rail-row";
      row.innerHTML = `<i style="background:${color}"></i><strong>${esc(entry.label)}</strong><span>0 · 0</span>`;
      stage.querySelector("#pb-scatter-list").appendChild(row);
      rows.push({ value: row.querySelector("span"), color });
      return { entry, path, length, halo, dot };
    });
    const liveDate = stage.querySelector("#pb-date");

    return (progress) => {
      const safe = clamp(progress);
      paths.forEach(({ entry, path, length, halo, dot }, index) => {
        const scaled = safe * (entry.points.length - 1);
        const lower = Math.floor(scaled);
        const upper = Math.min(entry.points.length - 1, lower + 1);
        const amount = scaled - lower;
        const pointX = mix(entry.points[lower].x, entry.points[upper].x, amount);
        const pointY = mix(entry.points[lower].y, entry.points[upper].y, amount);
        const px = x(pointX), py = y(pointY);
        path.style.strokeDashoffset = `${length * (1 - safe)}`;
        dot.setAttribute("cx", px); dot.setAttribute("cy", py);
        halo.setAttribute("cx", px); halo.setAttribute("cy", py);
        halo.setAttribute("r", spec.scatterMode === "bubble" ? 20 + mix(entry.points[lower].size || 1, entry.points[upper].size || 1, amount) * 2.2 : 25);
        rows[index].value.textContent = `${compact(pointX, 1)} · ${compact(pointY, 1)}`;
        rows[index].value.style.color = (spec.style || "signal-noir") === "paper-cut"
          ? "var(--pb-accent-text)"
          : rows[index].color;
      });
      const points = data.series[0].points;
      liveDate.textContent = dateLabel(points[Math.min(points.length - 1, Math.round(safe * (points.length - 1)))].date);
      liveDate.style.left = `${9 + safe * 76}%`;
    };
  }

  function mountMap(root, data, spec) {
    root.innerHTML = baseMarkup(data, "Geographic signal", spec.mapMode === "flow" ? "Connection flow" : "Pulse map");
    const stage = root.querySelector("#pb-stage");
    stage.innerHTML = `<div class="pb-map-shell"><svg id="pb-map" viewBox="0 0 1500 650" aria-label="Animated world map"><g class="pb-land"><path d="M120 190 L220 96 380 76 508 126 542 215 471 251 413 342 292 322 238 267 142 263Z"/><path d="M462 361 L526 376 570 477 534 597 463 528 429 414Z"/><path d="M665 136 L797 76 958 104 1015 178 953 232 872 221 826 298 724 279 646 217Z"/><path d="M947 113 L1131 92 1380 171 1361 265 1247 282 1172 241 1093 318 998 289 932 217Z"/><path d="M1176 421 L1284 386 1403 442 1351 541 1243 562 1156 492Z"/></g><g id="pb-map-links"></g><g id="pb-map-points"></g></svg><div id="pb-map-caption" class="pb-map-caption"></div></div>`;
    const svg = stage.querySelector("#pb-map");
    const pointLayer = stage.querySelector("#pb-map-points");
    const linkLayer = stage.querySelector("#pb-map-links");
    const project = (item) => ({ x: 750 + (item.longitude / 180) * 650, y: 330 - (item.latitude / 90) * 255 });
    const nodes = data.items.map((item, index) => {
      const position = project(item);
      const color = item.color || palette[index % palette.length];
      const halo = svgElement("circle", { class: "pb-map-halo", cx: position.x, cy: position.y, r: 12, fill: color });
      const point = svgElement("circle", { class: "pb-map-point", cx: position.x, cy: position.y, r: 7, fill: color });
      const labelOffsets = [
        { dx: -14, dy: -13, anchor: "end" }, { dx: 14, dy: -13, anchor: "start" },
        { dx: 14, dy: -13, anchor: "start" }, { dx: 14, dy: 28, anchor: "start" },
        { dx: 14, dy: -13, anchor: "start" }, { dx: 14, dy: 28, anchor: "start" },
        { dx: 14, dy: -13, anchor: "start" }, { dx: 14, dy: 28, anchor: "start" },
      ];
      const offset = labelOffsets[index % labelOffsets.length];
      const label = svgElement("text", { class: "pb-map-label", x: position.x + offset.dx, y: position.y + offset.dy, "text-anchor": offset.anchor });
      label.textContent = item.location;
      pointLayer.append(halo, point, label);
      if (index > 0) {
        const previous = project(data.items[index - 1]);
        const curve = svgElement("path", { class: "pb-map-link", d: `M ${previous.x} ${previous.y} Q ${(previous.x + position.x) / 2} ${Math.min(previous.y, position.y) - 65} ${position.x} ${position.y}` });
        linkLayer.appendChild(curve);
      }
      return { item, halo, point, label };
    });
    const links = [...linkLayer.querySelectorAll("path")];
    links.forEach((link) => {
      const length = link.getTotalLength();
      link.dataset.length = length;
      link.style.strokeDasharray = `${length}`;
    });
    const caption = stage.querySelector("#pb-map-caption");

    return (progress) => {
      const safe = clamp(progress);
      const scaled = safe * data.items.length;
      nodes.forEach(({ item, halo, point, label }, index) => {
        const local = clamp(scaled - index);
        point.style.opacity = local;
        label.style.opacity = clamp(local * 1.4 - 0.25);
        halo.style.opacity = local * (0.18 + 0.12 * Math.sin(safe * Math.PI * 8 + index));
        halo.setAttribute("r", 10 + local * (16 + item.value * 0.12));
        point.setAttribute("r", 4 + local * Math.min(14, 5 + item.value * 0.05));
      });
      links.forEach((link, index) => {
        const local = clamp(scaled - index - 0.55);
        link.style.strokeDashoffset = `${Number(link.dataset.length) * (1 - local)}`;
        link.style.opacity = spec.mapMode === "flow" ? `${local}` : `${local * 0.42}`;
      });
      const liveIndex = Math.min(data.items.length - 1, Math.floor(Math.max(0, scaled - 0.001)));
      caption.innerHTML = `<span>${String(liveIndex + 1).padStart(2, "0")} / ${String(data.items.length).padStart(2, "0")}</span><strong>${esc(data.items[liveIndex].location)}</strong><b>${compact(data.items[liveIndex].value, 0)} ${esc(data.unit)}</b>`;
    };
  }

  function mountKpi(root, data, spec) {
    root.innerHTML = baseMarkup(data, "Live performance board", spec.kpiMode === "radial" ? "Radial progress" : "Metric cards");
    const stage = root.querySelector("#pb-stage");
    stage.innerHTML = `<div id="pb-kpi-grid" class="pb-kpi-grid pb-kpi-${esc(spec.kpiMode)}"></div><div class="pb-kpi-summary"><span>Portfolio signal</span><strong id="pb-kpi-summary-value">0%</strong><p>of targets reached</p></div>`;
    const rows = data.items.map((item, index) => {
      const color = item.color || palette[index % palette.length];
      const card = document.createElement("article");
      card.className = "pb-kpi-card";
      card.innerHTML = `<div><span>${String(index + 1).padStart(2, "0")}</span><i style="background:${color}"></i></div><p>${esc(item.metric)}</p><strong>0</strong><small>Target · ${compact(item.target, item.decimals || 0)} ${esc(item.unit || data.unit)}</small><div class="pb-kpi-track"><i style="background:${color}"></i></div><b>${item.change >= 0 ? "+" : ""}${compact(item.change, 1)}%</b>`;
      stage.querySelector("#pb-kpi-grid").appendChild(card);
      return { item, card, value: card.querySelector("strong"), fill: card.querySelector(".pb-kpi-track i") };
    });
    const summary = stage.querySelector("#pb-kpi-summary-value");
    return (progress) => {
      const safe = clamp(progress);
      let targetScore = 0;
      rows.forEach(({ item, card, value, fill }, index) => {
        const local = clamp((safe - index * 0.055) / 0.72);
        const current = item.value * local;
        value.textContent = `${compact(current, item.decimals || 0)}${item.suffix || ""}`;
        fill.style.transform = `scaleX(${clamp((item.value / Math.max(1, item.target)) * local)})`;
        card.style.opacity = `${0.18 + local * 0.82}`;
        card.style.transform = `translateY(${(1 - local) * 26}px)`;
        targetScore += clamp(item.value / Math.max(1, item.target));
      });
      summary.textContent = `${Math.round((targetScore / data.items.length) * 100 * safe)}%`;
    };
  }

  function mountTimeline(root, data, spec) {
    root.innerHTML = baseMarkup(data, "Milestones in motion", spec.timelineMode === "chapters" ? "Chapter cards" : "Continuous timeline");
    const stage = root.querySelector("#pb-stage");
    stage.innerHTML = `<div class="pb-timeline-shell pb-timeline-${esc(spec.timelineMode)}"><div class="pb-timeline-line"><i id="pb-timeline-progress"></i><span id="pb-timeline-playhead"></span></div><div id="pb-milestones" class="pb-milestones"></div><div id="pb-timeline-live" class="pb-timeline-live"></div></div>`;
    const milestones = data.items.map((item, index) => {
      const card = document.createElement("article");
      const above = index % 2 === 0;
      card.className = `pb-milestone ${above ? "above" : "below"}`;
      card.style.left = `${7 + (index / Math.max(1, data.items.length - 1)) * 86}%`;
      card.innerHTML = `<i style="background:${item.color || palette[index % palette.length]}"></i><time>${dateLabel(item.date)}</time><strong>${esc(item.title)}</strong><p>${esc(item.description || item.category || "Milestone")}</p>`;
      stage.querySelector("#pb-milestones").appendChild(card);
      return card;
    });
    const progressLine = stage.querySelector("#pb-timeline-progress");
    const playhead = stage.querySelector("#pb-timeline-playhead");
    const live = stage.querySelector("#pb-timeline-live");
    return (progress) => {
      const safe = clamp(progress);
      const scaled = safe * data.items.length;
      progressLine.style.transform = `scaleX(${safe})`;
      playhead.style.left = `${5 + safe * 90}%`;
      milestones.forEach((card, index) => {
        const local = clamp((scaled - index) * 1.7);
        card.style.opacity = `${local}`;
        card.style.transform = `translate(-50%, ${card.classList.contains("above") ? (1 - local) * 22 : -(1 - local) * 22}px)`;
      });
      const index = Math.min(data.items.length - 1, Math.floor(Math.max(0, scaled - 0.001)));
      live.innerHTML = `<span>${String(index + 1).padStart(2, "0")} / ${String(data.items.length).padStart(2, "0")}</span><strong>${esc(data.items[index].title)}</strong><time>${dateLabel(data.items[index].date)}</time>`;
    };
  }

  window.PlotbeatScenes = {
    mount(root, data, spec) {
      if (data.template === "scatter-journey") return mountScatter(root, data, spec);
      if (data.template === "animated-map") return mountMap(root, data, spec);
      if (data.template === "kpi-dashboard") return mountKpi(root, data, spec);
      if (data.template === "milestone-timeline") return mountTimeline(root, data, spec);
      throw new Error(`Unsupported Plotbeat scene: ${data.template}`);
    },
  };
})();
