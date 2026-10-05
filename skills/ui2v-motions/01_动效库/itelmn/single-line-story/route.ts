import { locales, localizePath } from "../i18n";
import { SITE_ORIGIN } from "../seo";

const pages = [
  { path: "/", changeFrequency: "weekly", priority: "1.0" },
  { path: "/style-builder", changeFrequency: "weekly", priority: "0.9" },
] as const;

function xmlEscape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export function GET() {
  const origin = SITE_ORIGIN;
  const urls = pages.flatMap(({ path, changeFrequency, priority }) => locales.map((locale) => `  <url>
    <loc>${xmlEscape(new URL(localizePath(locale, path), origin).href)}</loc>
${locales.map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${xmlEscape(new URL(localizePath(alternate, path), origin).href)}" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(new URL(path, origin).href)}" />
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`)).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400",
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
