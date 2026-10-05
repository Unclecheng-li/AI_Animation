import type { Metadata } from "next";
import { localeAlternates, messages, ogLocales, type Locale } from "./i18n";

export const SITE_NAME = "Plotbeat";
export const SITE_ORIGIN = "https://plotbeat.app";
export const SITE_TITLE = "Plotbeat — Data, timed to the frame";
export const SITE_DESCRIPTION = "Turn files, APIs, and public data sources into deterministic, editable HyperFrames chart videos with an open-source AI skill and reusable motion templates.";

const SOCIAL_IMAGE = {
  url: "/og.png",
  width: 2400,
  height: 1260,
  alt: "Plotbeat — Data, timed to the frame",
};

export function createPageMetadata({
  title,
  description,
  path,
  locale = "en",
}: {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, languages: { ...localeAlternates(path.replace(`/${locale}`, "") || "/"), "x-default": path.replace(`/${locale}`, "") || "/" } },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: ogLocales[locale],
      alternateLocale: Object.values(ogLocales).filter((candidate) => candidate !== ogLocales[locale]),
      type: "website",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@DbgKinggg",
      creator: "@DbgKinggg",
      images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }],
    },
  };
}

export function createLocalizedMetadata(locale: Locale, path = "/") {
  const copy = messages[locale];
  return createPageMetadata({ title: copy.metaTitle, description: copy.metaDescription, path: locale === "en" ? path : `/${locale}${path === "/" ? "" : path}`, locale });
}
