import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { isLocale, messages } from "./i18n";
import { createPageMetadata, SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN, SITE_TITLE } from "./seo";
import { AnalyticsEvents } from "./components/AnalyticsEvents";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-HX3R55M324";
const HAS_GOOGLE_ANALYTICS = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID ?? "");

function googleAnalyticsBootstrap(measurementId: string) {
  return `
    if (/^(www\\.)?plotbeat\\.app$/i.test(window.location.hostname)) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
      window.gtag('js', new Date());
      window.gtag('config', ${JSON.stringify(measurementId)}, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });

      var googleTag = document.createElement('script');
      googleTag.async = true;
      googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(${JSON.stringify(measurementId)});
      document.head.appendChild(googleTag);
    }
  `;
}

async function getRequestLocale() {
  const requestHeaders = await headers();
  return requestHeaders.get("x-plotbeat-locale") ?? "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = createPageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" });

  return {
    ...baseMetadata,
    metadataBase: new URL(SITE_ORIGIN),
    title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
    applicationName: SITE_NAME,
    authors: [{ name: "Sammie / DbgKinggg", url: "https://samuelchen.me/" }],
    creator: "Sammie / DbgKinggg",
    publisher: SITE_NAME,
    category: "technology",
    classification: "Open-source data visualization and video tooling",
    keywords: [
      "data visualization video",
      "HyperFrames templates",
      "editable chart video",
      "AI agent skill",
      "motion graphics",
      "open source",
      "Plotbeat",
    ],
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.png", sizes: "256x256", type: "image/png" },
      ],
      shortcut: "/favicon.svg",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    referrer: "origin-when-cross-origin",
    formatDetection: { address: false, email: false, telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#c8ff57",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestLocale = await getRequestLocale();
  const locale = isLocale(requestLocale) ? requestLocale : "en";
  const localizedDescription = messages[locale].metaDescription;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: SITE_NAME,
        description: localizedDescription,
        inLanguage: locale,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_ORIGIN}/#software`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        description: localizedDescription,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web, macOS, Windows, Linux",
        softwareVersion: "0.1",
        isAccessibleForFree: true,
        license: "https://opensource.org/license/mit",
        codeRepository: "https://github.com/DbgKinggg/plotbeat",
        creator: {
          "@type": "Person",
          name: "Sammie / DbgKinggg",
          url: "https://samuelchen.me/",
          sameAs: ["https://github.com/DbgKinggg", "https://x.com/DbgKinggg"],
        },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Editable HyperFrames chart video templates",
          "Live visual style builder",
          "Data-source and file-driven workflows",
          "Deterministic seek-safe motion",
        ],
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="description" content={localizedDescription} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Plotbeat documentation for AI agents" />
        {HAS_GOOGLE_ANALYTICS && GA_MEASUREMENT_ID ? (
          <script
            data-plotbeat-analytics="google-analytics-4"
            dangerouslySetInnerHTML={{ __html: googleAnalyticsBootstrap(GA_MEASUREMENT_ID) }}
          />
        ) : null}
      </head>
      <body>
        <AnalyticsEvents />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
