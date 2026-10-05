"use client";

import { MarkGithubIcon } from "@primer/octicons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronDown, Globe2, Hash, Menu, X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { localeNames, locales, localizePath, messages, type Locale } from "../i18n";
import { trackAnalyticsEvent } from "../analytics";
import { PlotbeatMark } from "./PlotbeatMark";
import { ProfilePopover } from "./ProfilePopover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

function navigation(locale: Locale) {
  const copy = messages[locale].nav;
  return [
    [copy.builder, localizePath(locale, "/style-builder")],
    [copy.styles, `${localizePath(locale)}#styles`],
    [copy.templates, `${localizePath(locale)}#templates`],
    [copy.workflow, `${localizePath(locale)}#workflow`],
    [copy.prompts, `${localizePath(locale)}#prompts`],
  ] as const;
}

function LocaleLinks({ locale, path, onSelect }: { locale: Locale; path: "/" | "/style-builder"; onSelect?: () => void }) {
  return (
    <div className="locale-links" aria-label="Language">
      {locales.map((candidate) => (
        <Link
          href={localizePath(candidate, path)}
          prefetch={false}
          hrefLang={candidate}
          lang={candidate}
          aria-current={candidate === locale ? "page" : undefined}
          data-analytics-event="language_change"
          data-analytics-id={`language_${candidate}`}
          data-analytics-location="mobile_language_sheet"
          data-analytics-destination={candidate}
          onClick={onSelect}
          key={candidate}
        >
          <span>{candidate.toUpperCase()}</span>{localeNames[candidate]}
        </Link>
      ))}
    </div>
  );
}

function LocaleMenu({ locale, path }: { locale: Locale; path: "/" | "/style-builder" }) {
  function changeLocale(candidate: string) {
    if (candidate === locale || !locales.includes(candidate as Locale)) return;
    trackAnalyticsEvent("language_change", {
      element_id: `language_${candidate}`,
      ui_location: "desktop_language_menu",
      destination: candidate,
    });
    window.location.assign(localizePath(candidate as Locale, path));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-locale-trigger" aria-label={`Language: ${localeNames[locale]}`}>
        <span>{locale.toUpperCase()}</span>
        <ChevronDown aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="header-locale-menu" align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
          {locales.map((candidate) => (
            <DropdownMenuRadioItem value={candidate} lang={candidate} key={candidate}>
              <span className="locale-code">{candidate.toUpperCase()}</span>
              <span>{localeNames[candidate]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileSheet({ children, eyebrow, id, label, onClose, reduceMotion, title }: { children: ReactNode; eyebrow: string; id: string; label: string; onClose: () => void; reduceMotion: boolean | null; title: string }) {
  return (
    <>
      <motion.button
        type="button"
        className="mobile-sheet-backdrop"
        aria-label={label}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? .01 : .2 }}
      />
      <motion.div
        className="mobile-sheet"
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 34, scale: .975 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: .985 }}
        transition={{ type: "spring", bounce: 0, duration: reduceMotion ? .01 : .38 }}
      >
        <button type="button" className="mobile-sheet-close" onClick={onClose} aria-label={label}><X aria-hidden="true" /></button>
        <span className="mobile-sheet-accent" aria-hidden="true" />
        <span className="mobile-sheet-eyebrow">{eyebrow}</span>
        <strong className="mobile-sheet-title">{title}</strong>
        {children}
      </motion.div>
    </>
  );
}

export function SiteHeader({ locale = "en", path = "/" }: { locale?: Locale; path?: "/" | "/style-builder" }) {
  const [activeSheet, setActiveSheet] = useState<"menu" | "language" | null>(null);
  const reduceMotion = useReducedMotion();
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const localeTrigger = useRef<HTMLButtonElement>(null);
  const copy = messages[locale].nav;
  const links = navigation(locale);

  useEffect(() => {
    if (!activeSheet) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setActiveSheet(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeSheet]);

  function closeSheet() {
    const trigger = activeSheet === "language" ? localeTrigger.current : menuTrigger.current;
    setActiveSheet(null);
    requestAnimationFrame(() => trigger?.focus());
  }

  return (
    <header className={`site-header${activeSheet ? " menu-is-open" : ""}`}>
      <Link className="brand" href={localizePath(locale)} prefetch={false} aria-label="Plotbeat home">
        <PlotbeatMark className="brand-mascot" />
        <span className="brand-copy"><b>Plotbeat</b><small>For HyperFrames</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href], index) => <Link href={href} prefetch={false} data-analytics-event="navigation_click" data-analytics-id={`desktop_nav_${index + 1}`} data-analytics-location="header" data-analytics-destination={index === 0 ? "style_builder" : href.split("#").at(-1)} key={href}>{label}</Link>)}
      </nav>
      <div className="header-locale-picker"><LocaleMenu locale={locale} path={path} /></div>
      <button
        ref={localeTrigger}
        type="button"
        className="mobile-locale-trigger"
        aria-label={`${copy.language}: ${localeNames[locale]}`}
        aria-expanded={activeSheet === "language"}
        aria-controls="mobile-language-sheet"
        onClick={() => setActiveSheet((current) => current === "language" ? null : "language")}
      >
        <Globe2 aria-hidden="true" />
        <span>{locale.toUpperCase()}</span>
      </button>
      <button
        ref={menuTrigger}
        type="button"
        className="mobile-menu-trigger"
        aria-label={activeSheet === "menu" ? copy.close : copy.menu}
        aria-expanded={activeSheet === "menu"}
        aria-controls="mobile-navigation"
        onClick={() => setActiveSheet((current) => current === "menu" ? null : "menu")}
      >
        {activeSheet === "menu" ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span>{copy.menu}</span>
      </button>
      <Link className="pill-button dark header-install" href={`${localizePath(locale)}#install`} prefetch={false} data-analytics-event="cta_click" data-analytics-id="header_install" data-analytics-location="header" data-analytics-destination="install_section">{copy.install} <span>↘</span></Link>

      <AnimatePresence>
        {activeSheet === "menu" ? (
          <MobileSheet eyebrow="Plotbeat" id="mobile-navigation" label={copy.close} onClose={closeSheet} reduceMotion={reduceMotion} title={copy.menu}>
            <div className="mobile-navigation">
              <nav aria-label="Mobile navigation">
                {links.map(([label, href], index) => (
                  <Link href={href} prefetch={false} onClick={() => setActiveSheet(null)} data-analytics-event="navigation_click" data-analytics-id={`mobile_nav_${index + 1}`} data-analytics-location="mobile_menu" data-analytics-destination={index === 0 ? "style_builder" : href.split("#").at(-1)} key={href}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {label}
                    {index === 0 ? <ArrowUpRight aria-label="Opens page" /> : <Hash aria-label="Jumps to section" />}
                  </Link>
                ))}
              </nav>
            </div>
          </MobileSheet>
        ) : null}
        {activeSheet === "language" ? (
          <MobileSheet eyebrow="Plotbeat" id="mobile-language-sheet" label={`Close ${copy.language}`} onClose={closeSheet} reduceMotion={reduceMotion} title={copy.language}>
            <LocaleLinks locale={locale} path={path} onSelect={() => setActiveSheet(null)} />
          </MobileSheet>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const copy = messages[locale].footer;
  return (
    <footer>
      <div className="footer-inner">
        <Link className="brand footer-brand" href={localizePath(locale)} prefetch={false}>
          <PlotbeatMark className="brand-mascot" />
          <span className="brand-copy"><b>Plotbeat</b><small>For HyperFrames</small></span>
        </Link>
        <p className="footer-credit">
          <span>{copy.madeBy}</span>
          <ProfilePopover
            analyticsId="dbgkinggg"
            eyebrow="Independent builder"
            title="Sammie / @DbgKinggg"
            statement={<>Talk is cheap, show me the <s>code</s> prompt.</>}
            githubHref="https://github.com/DbgKinggg"
            githubLabel="GitHub profile"
            href="https://samuelchen.me/"
            label="@DbgKinggg"
            showWebsiteAction={false}
            xHref="https://x.com/DbgKinggg"
            xLabel="Follow me on X"
          />
          <span>·</span>
          <span>{copy.alsoTry}</span>
          <ProfilePopover
            analyticsId="qoory"
            align="right"
            eyebrow="Market intelligence"
            title="Qoory.ai"
            description="An intelligence engine for crypto and stock markets—headlines, prices, signals, and research in one search."
            href="https://www.qoory.ai/"
            label="Qoory.ai"
            xHref="https://x.com/QooryAi"
            xLabel="@QooryAi on X"
          />
        </p>
        <div className="footer-links">
          <a className="footer-github-link" href="https://github.com/DbgKinggg/plotbeat" target="_blank" rel="noreferrer" data-analytics-event="cta_click" data-analytics-id="footer_plotbeat_github" data-analytics-location="footer" data-analytics-destination="github"><MarkGithubIcon size={15} aria-hidden="true" />{copy.github}</a>
          <a href="/llms.txt" data-analytics-event="cta_click" data-analytics-id="footer_llms" data-analytics-location="footer" data-analytics-destination="llms_txt">{copy.llms}</a>
          <Link href={localizePath(locale)} prefetch={false} data-analytics-event="navigation_click" data-analytics-id="footer_back_top" data-analytics-location="footer" data-analytics-destination="home">{copy.backTop}</Link>
        </div>
      </div>
    </footer>
  );
}
