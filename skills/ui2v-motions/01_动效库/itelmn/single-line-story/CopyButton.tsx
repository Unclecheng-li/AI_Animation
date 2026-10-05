"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent } from "../analytics";

type CopyAnalytics = {
  contentId: string;
  contentType: "install_command" | "sample_prompt" | "style_json" | "style_prompt";
  location: string;
};

export function CopyButton({ analytics, value, label, compact = false, iconOnly = false }: { analytics?: CopyAnalytics; value: string; label: string; compact?: boolean; iconOnly?: boolean }) {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(value);
    if (analytics) {
      trackAnalyticsEvent("copy_content", {
        content_id: analytics.contentId,
        content_type: analytics.contentType,
        ui_location: analytics.location,
      });
    }
    setCopied(true);
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  const idleState = reduceMotion
    ? { opacity: copied ? 0 : 1 }
    : { opacity: copied ? 0 : 1, y: copied ? -7 : 0, scale: copied ? 0.82 : 1, rotate: copied ? 8 : 0 };
  const copiedState = reduceMotion
    ? { opacity: copied ? 1 : 0 }
    : { opacity: copied ? 1 : 0, y: copied ? 0 : 7, scale: copied ? 1 : 0.82, rotate: copied ? 0 : -8 };
  const stateTransition = { duration: reduceMotion ? 0.01 : 0.16, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.button
      className={`${compact ? "copy-button compact" : "copy-button"}${iconOnly ? " icon-only" : ""}${copied ? " is-copied" : ""}`}
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 430, damping: 28, mass: 0.65 }}
    >
      <span className="copy-button-states" aria-hidden="true">
        <motion.span
          className="copy-button-state copy-button-idle"
          initial={false}
          animate={idleState}
          transition={stateTransition}
        >
          {iconOnly ? <span className="copy-glyph"><i /><i /></span> : label}
        </motion.span>
        <motion.span
          className="copy-button-state copy-button-success"
          initial={false}
          animate={copiedState}
          transition={stateTransition}
        >
          <span className="check-glyph" />
          {!iconOnly ? <span>Copied</span> : null}
        </motion.span>
      </span>
    </motion.button>
  );
}
