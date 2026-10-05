"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MarkGithubIcon } from "@primer/octicons-react";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Globe2, X } from "lucide-react";

type ProfilePopoverProps = {
  align?: "left" | "right";
  analyticsId: string;
  description?: string;
  eyebrow: string;
  githubHref?: string;
  githubLabel?: string;
  href: string;
  label: string;
  showWebsiteAction?: boolean;
  statement?: ReactNode;
  title: string;
  xHref?: string;
  xLabel?: string;
};

const spring = { type: "spring" as const, stiffness: 390, damping: 30, mass: 0.72 };

export function ProfilePopover({
  align = "left",
  analyticsId,
  description,
  eyebrow,
  githubHref,
  githubLabel,
  href,
  label,
  showWebsiteAction = true,
  statement,
  title,
  xHref,
  xLabel,
}: ProfilePopoverProps) {
  const [open, setOpen] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(false);
  const reduceMotion = useReducedMotion();
  const popoverId = useId();
  const triggerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    const syncMobileSheet = () => setMobileSheet(media.matches);
    syncMobileSheet();
    media.addEventListener("change", syncMobileSheet);
    return () => media.removeEventListener("change", syncMobileSheet);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function closeMobileSheet() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <span
      className={`profile-popover-wrap profile-popover-${align}${open ? " is-open" : ""}`}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setOpen(false); }}
      onFocus={() => { if (!mobileSheet) setOpen(true); }}
      onBlur={(event) => {
        if (!mobileSheet && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <motion.a
        ref={triggerRef}
        className="profile-trigger"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-controls={popoverId}
        aria-expanded={open}
        aria-haspopup="dialog"
        data-analytics-event="profile_click"
        data-analytics-id={`${analyticsId}_trigger`}
        data-analytics-location="footer"
        data-analytics-destination="website"
        onClick={(event) => {
          const touchLayout = mobileSheet || window.matchMedia("(hover: none), (pointer: coarse)").matches;
          if (!touchLayout) return;
          event.preventDefault();
          setOpen((current) => !current);
        }}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={spring}
      >
        {label}<span aria-hidden="true">↗</span>
      </motion.a>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              className="profile-popover-backdrop"
              aria-label={`Close ${title} preview`}
              onClick={closeMobileSheet}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
            />
            <motion.span
              className="profile-popover"
              id={popoverId}
              role="dialog"
              aria-modal={mobileSheet || undefined}
              aria-label={`${title} preview`}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.94, rotate: align === "right" ? 1.5 : -1.5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
              transition={reduceMotion ? { duration: 0.01 } : spring}
            >
              <button type="button" className="profile-popover-close" onClick={closeMobileSheet} aria-label={`Close ${title} preview`}><X aria-hidden="true" /></button>
              <span className="profile-popover-accent" aria-hidden="true" />
              <span className="profile-popover-eyebrow">{eyebrow}</span>
              <strong>{title}</strong>
              {description ? <span className="profile-popover-description">{description}</span> : null}
              {statement ? <span className="profile-popover-statement">{statement}</span> : null}
              {showWebsiteAction || githubHref || xHref ? (
                <span className="profile-popover-links">
                  {showWebsiteAction ? (
                    <a href={href} target="_blank" rel="noreferrer" data-analytics-event="profile_click" data-analytics-id={`${analyticsId}_website`} data-analytics-location="footer_popover" data-analytics-destination="website">
                      <span className="profile-link-icon" aria-hidden="true"><Globe2 /></span>
                      <span className="profile-link-label">Visit website</span>
                      <span className="profile-link-arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {githubHref ? (
                    <a href={githubHref} target="_blank" rel="noreferrer" data-analytics-event="profile_click" data-analytics-id={`${analyticsId}_github`} data-analytics-location="footer_popover" data-analytics-destination="github">
                      <span className="profile-link-icon" aria-hidden="true"><MarkGithubIcon size={16} /></span>
                      <span className="profile-link-label">{githubLabel ?? "GitHub"}</span>
                      <span className="profile-link-arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {xHref ? (
                    <a href={xHref} target="_blank" rel="noreferrer" data-analytics-event="profile_click" data-analytics-id={`${analyticsId}_x`} data-analytics-location="footer_popover" data-analytics-destination="x">
                      <span className="profile-link-icon profile-link-x" aria-hidden="true">𝕏</span>
                      <span className="profile-link-label">{xLabel ?? "View on X"}</span>
                      <span className="profile-link-arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </span>
              ) : null}
            </motion.span>
          </>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
