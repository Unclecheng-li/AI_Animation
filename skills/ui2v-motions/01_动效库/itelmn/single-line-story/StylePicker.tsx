"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Locale } from "../i18n";
import { trackAnalyticsEvent } from "../analytics";
import { CopyButton } from "./CopyButton";

type Theme = "dark" | "light";
type ThemeFilter = "all" | Theme;

type VisualStyle = {
  id: string;
  name: string;
  theme: Theme;
  tagline: string;
  description: string;
  preview: string;
  bestFor: string[];
  palette: string[];
};

const fallbackStyle: VisualStyle = {
  id: "signal-noir",
  name: "Signal Noir",
  theme: "dark",
  tagline: "Dark, cinematic, focused",
  description: "Near-black fields and luminous data marks.",
  preview: "/previews/style-signal-noir.png",
  bestFor: ["data stories"],
  palette: ["#090d0b", "#f1f3ec", "#a9e907", "#f0b64b"],
};

export function StylePicker({ styles, locale = "en", promptTemplate }: { styles: VisualStyle[]; locale?: Locale; promptTemplate?: string }) {
  const [selectedId, setSelectedId] = useState(styles[0]?.id ?? "signal-noir");
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("all");
  const selected = styles.find((style) => style.id === selectedId) ?? styles[0] ?? fallbackStyle;
  const visibleStyles = themeFilter === "all" ? styles : styles.filter((style) => style.theme === themeFilter);
  const prompt = useMemo(
    () => (promptTemplate ?? "Use $plotbeat to turn my data into a quick, editable HyperFrames video using the {style} visual style. Choose the best template for the story and let me approve it before rendering.").replace("{style}", selected.name),
    [promptTemplate, selected.name],
  );

  function selectTheme(nextTheme: ThemeFilter) {
    trackAnalyticsEvent("select_content", {
      content_type: "style_theme",
      content_id: `theme_${nextTheme}`,
      ui_location: "style_gallery",
    });
    setThemeFilter(nextTheme);
    if (nextTheme !== "all" && selected.theme !== nextTheme) {
      const firstMatch = styles.find((style) => style.theme === nextTheme);
      if (firstMatch) setSelectedId(firstMatch.id);
    }
  }

  function selectStyle(styleId: string) {
    setSelectedId(styleId);
    trackAnalyticsEvent("select_content", {
      content_type: "visual_style",
      content_id: styleId,
      ui_location: "style_gallery",
    });
  }

  return (
    <div className="style-picker" lang={locale}>
      <div className="style-filter-strip" aria-label="Filter styles by theme">
        <span>Filter</span>
        {(["all", "dark", "light"] as const).map((theme) => (
          <button
            type="button"
            className={themeFilter === theme ? "is-active" : undefined}
            aria-pressed={themeFilter === theme}
            onClick={() => selectTheme(theme)}
            key={theme}
          >
            {theme} <b>{theme === "all" ? styles.length : styles.filter((style) => style.theme === theme).length}</b>
          </button>
        ))}
        <small>Every thumbnail is a real HyperFrames capture.</small>
      </div>

      <div className="style-tabs-shell">
        <div className="style-tabs" role="tablist" aria-label="Plotbeat visual styles">
          {visibleStyles.map((style) => {
            const active = style.id === selected.id;
            const originalIndex = styles.findIndex((candidate) => candidate.id === style.id);
            return (
              <button
                type="button"
                role="tab"
                aria-selected={active}
                className={active ? "is-active" : undefined}
                onClick={() => selectStyle(style.id)}
                key={style.id}
              >
                <span>{String(originalIndex + 1).padStart(2, "0")}</span>
                <strong>{style.name}</strong>
                <small>{style.tagline}</small>
                <em>{style.theme}</em>
              </button>
            );
          })}
        </div>
        <span className="style-scroll-hint" aria-hidden="true">SWIPE ↔</span>
      </div>

      <figure className="style-stage">
        <AnimatePresence mode="wait">
          <motion.img
            className="style-rendered-preview"
            src={selected.preview}
            alt={`HyperFrames-rendered frame in the ${selected.name} style`}
            key={selected.id}
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, scale: 1.018 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .992 }}
            transition={{ duration: .32, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
        <figcaption><span>HyperFrames capture</span><b>00:13.5 / 00:18.0</b></figcaption>
      </figure>

      <aside className="style-detail" aria-live="polite">
        <p className="poster-label">Selected style · {selected.theme}</p>
        <h3>{selected.name}</h3>
        <strong>{selected.tagline}</strong>
        <p>{selected.description}</p>
        <div className="style-palette" aria-label={`${selected.name} palette`}>
          {selected.palette.map((color) => <i style={{ background: color }} key={color} title={color} />)}
        </div>
        <ul>
          {selected.bestFor.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="style-flag"><span>Compiler flag</span><code>--style {selected.id}</code></div>
        <CopyButton
          analytics={{ contentId: selected.id, contentType: "style_prompt", location: "style_gallery" }}
          value={prompt}
          label={`Copy ${selected.name} sample prompt`}
        />
      </aside>
    </div>
  );
}
