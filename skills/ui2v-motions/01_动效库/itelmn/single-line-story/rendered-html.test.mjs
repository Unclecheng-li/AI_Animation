import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/", headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://plotbeat.example${pathname}`, { headers: { accept: "text/html", ...headers } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete HyperFrames template gallery", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Plotbeat/);
  assert.match(html, /Data, timed/);
  assert.match(html, /to the frame\./);
  assert.match(html, /Turn your data/);
  assert.match(html, /into editable video\./);
  assert.match(html, /Built for your AI agent\. Powered by HyperFrames\./);
  assert.match(html, /Choose[\s\S]+the feeling\./);
  assert.match(html, /Signal Noir/);
  assert.match(html, /Paper Cut/);
  assert.match(html, /Studio Blueprint/);
  assert.match(html, /Preview in HyperFrames/);
  assert.match(html, /Prepared data/);
  assert.match(html, /Cleaned and ready to animate/);
  assert.match(html, /Rows in\./);
  assert.match(html, /Chart frames out\./);
  assert.match(html, /Choose the style/);
  assert.match(html, /DATA → STYLE → TIMELINE/);
  assert.match(html, /Single-line Story/);
  assert.match(html, /Multi-line Rank/);
  assert.match(html, /Bar Race/);
  assert.match(html, /Stacked-area Story/);
  assert.match(html, /Scatter Journey/);
  assert.match(html, /Animated Map/);
  assert.match(html, /KPI Dashboard/);
  assert.match(html, /Milestone Timeline/);
  assert.doesNotMatch(html, /Templates, not a renderer/);
  assert.doesNotMatch(html, /Original system illustration/);
  assert.match(html, /npx skills add DbgKinggg\/plotbeat --skill plotbeat/);
  assert.match(html, /Use \$plotbeat/);
  assert.match(html, /U\.S\. unemployment data from FRED/);
  assert.match(html, /USGS GeoJSON feed/);
  assert.match(html, /attach a file or name the data source/);
  assert.match(html, /https:\/\/hyperframes\.heygen\.com\//);
  assert.match(html, /https:\/\/github\.com\/heygen-com\/hyperframes/);
  assert.match(html, /https:\/\/github\.com\/DbgKinggg\/plotbeat/);
  assert.match(html, /hero-github-link/);
  assert.match(html, /data-analytics-event="cta_click"/);
  assert.match(html, /data-analytics-id="install_skill"/);
  assert.match(html, /data-analytics-id="open_style_builder"/);
  assert.match(html, /footer-github-link/);
  assert.match(html, /\/previews\/single-line\.mp4/);
  assert.match(html, /@DbgKinggg/);
  assert.match(html, /Qoory\.ai/);
  assert.match(html, /https:\/\/samuelchen\.me\//);
  assert.match(html, /https:\/\/x\.com\/DbgKinggg/);
  assert.match(html, /https:\/\/www\.qoory\.ai\//);
  assert.match(html, /href="\/llms\.txt"/);
  assert.doesNotMatch(html, /class="footer-links"[\s\S]*href="\/style-builder"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("ships finished metadata, local typography, responsive styles, and no starter dependency", async () => {
  const [page, layout, seo, css, packageJson, packageLock, readme, catalogText, siteChrome, profilePopover, styleBuilder, builderPage] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/seo.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../package-lock.json", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../app/data/templates.json", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteChrome.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ProfilePopover.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/StyleBuilder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/style-builder/page.tsx", import.meta.url), "utf8"),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/favicon.png", import.meta.url)),
    access(new URL("../public/favicon-32x32.png", import.meta.url)),
    access(new URL("../public/apple-touch-icon.png", import.meta.url)),
    access(new URL("../public/icon-192.png", import.meta.url)),
    access(new URL("../public/icon-512.png", import.meta.url)),
    access(new URL("../public/site.webmanifest", import.meta.url)),
    access(new URL("../public/fonts/space-grotesk.woff2", import.meta.url)),
  ]);

  assert.doesNotMatch(page, /HyperFrames owns the timeline/);
  assert.doesNotMatch(page, /generated\/data\.js/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /SITE_ORIGIN/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(layout, /SoftwareApplication/);
  assert.match(layout, /\/sitemap\.xml/);
  assert.match(layout, /\/llms\.txt/);
  assert.match(layout, /NEXT_PUBLIC_GA_MEASUREMENT_ID/);
  assert.match(layout, /G-HX3R55M324/);
  assert.match(layout, /data-plotbeat-analytics="google-analytics-4"/);
  assert.match(layout, /www\\\\\.\)\?plotbeat/);
  assert.match(layout, /allow_google_signals: false/);
  assert.match(layout, /allow_ad_personalization_signals: false/);
  assert.match(seo, /card: "summary_large_image"/);
  assert.match(seo, /\/og\.png/);
  assert.match(seo, /width: 2400/);
  assert.match(seo, /height: 1260/);
  assert.match(seo, /site: "@DbgKinggg"/);
  assert.match(seo, /creator: "@DbgKinggg"/);
  assert.match(seo, /images: \[\{ url: SOCIAL_IMAGE\.url, alt: SOCIAL_IMAGE\.alt \}\]/);
  assert.match(layout, /Plotbeat/);
  assert.match(seo, /Data, timed to the frame/);
  assert.match(css, /@font-face/);
  assert.match(css, /Plotbeat Sans/);
  assert.match(css, /space-grotesk\.woff2/);
  assert.match(css, /\.signal-bar/);
  assert.match(css, /\.signal-track[^}]+width: 200vw/s);
  assert.match(css, /\.signal-group[^}]+width: 100vw[^}]+flex: 0 0 100vw/s);
  assert.match(css, /@keyframes signal-marquee[^}]+translate3d\(0, 0, 0\)[\s\S]+translate3d\(-50%, 0, 0\)/);
  assert.match(css, /--acid:/);
  assert.match(css, /--violet:/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 380px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /prefers-reduced-transparency: reduce/);
  assert.match(css, /prefers-contrast: more/);
  assert.doesNotMatch(css, /\.style-demo-frame/);
  assert.match(css, /box-shadow/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(packageJson, /"name": "plotbeat-website"/);
  assert.match(packageLock, /"name": "plotbeat-website"/);
  assert.doesNotMatch(packageJson, /site-creator-vinext-starter/);
  assert.doesNotMatch(readme, /vinext-starter|rendered loading skeleton/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  const catalog = JSON.parse(catalogText);
  assert.equal(catalog.engine, "hyperframes");
  assert.equal(catalog.visualStyles.length, 8);
  assert.equal(catalog.visualStyles.filter((style) => style.theme === "dark").length, 4);
  assert.equal(catalog.visualStyles.filter((style) => style.theme === "light").length, 4);
  assert.ok(catalog.visualStyles.every((style) => style.preview.startsWith("/previews/style-")));
  assert.equal(catalog.templates.length, 8);
  assert.ok(catalog.templates.every((template) => template.preview.startsWith("/previews/")));
  assert.ok(catalog.templates.every((template) => template.previewVideo.endsWith(".mp4")));
  assert.ok(catalog.templates.every((template) => template.variants.length >= 2));
  assert.match(page, /LazyVideo/);
  assert.match(page, /MotionSection/);
  assert.match(page, /SiteHeader/);
  assert.match(page, /SiteFooter/);
  assert.match(page, /\/style-builder/);
  assert.match(page, /StylePicker/);
  assert.doesNotMatch(page, /Full-stack developer in Melbourne/);
  assert.match(siteChrome, /ProfilePopover/);
  assert.match(siteChrome, /Talk is cheap, show me the/);
  assert.match(siteChrome, /Follow me on X/);
  assert.match(siteChrome, /DropdownMenuRadioGroup/);
  assert.match(siteChrome, /ArrowUpRight/);
  assert.match(siteChrome, /Hash/);
  assert.match(siteChrome, /\/style-builder/);
  assert.match(profilePopover, /\(hover: none\), \(pointer: coarse\)/);
  assert.match(profilePopover, /aria-expanded=\{open\}/);
  assert.match(profilePopover, /profile-popover-backdrop/);
  assert.match(profilePopover, /profile-popover-close/);
  assert.match(profilePopover, /open \? " is-open"/);
  assert.match(profilePopover, /profile-link-icon/);
  assert.match(profilePopover, /profile-link-label/);
  assert.match(profilePopover, /profile-link-arrow/);
  assert.match(profilePopover, /profile-link-x/);
  assert.doesNotMatch(profilePopover, /AtSign/);
  assert.match(profilePopover, /event\.key === "Escape"/);
  assert.match(css, /\.profile-popover-backdrop[^}]+position: fixed/s);
  assert.match(css, /\.profile-popover-wrap\.is-open[^}]+z-index: 90/);
  assert.match(css, /\.profile-popover-links a[^}]+grid-template-columns: 20px minmax\(0, 1fr\) 20px/s);
  assert.match(css, /bottom: max\(16px, env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /max-height: calc\(100dvh/);
  assert.match(css, /\.header-install[^}]+min-height: 44px/s);
  assert.match(css, /\.style-filter-strip button[^}]+min-height: 44px/s);
  assert.match(css, /\.builder-segment button[^}]+min-height: 46px/s);
  assert.match(css, /\.copy-button\.compact[^}]+min-height: 44px/s);
  assert.match(css, /\.footer-links a[^}]+min-height: 44px/s);
  assert.match(css, /\.builder-two-up,[\s\S]+\.builder-color-grid \{ grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(builderPage, /SiteHeader/);
  assert.match(builderPage, /SiteFooter/);
  assert.match(builderPage, /className="sr-only"/);
  assert.match(styleBuilder, /"line", "area", "bars", "scatter"/);
  assert.match(styleBuilder, /Copy style JSON/);
  assert.match(styleBuilder, /Display font/);
  assert.match(styleBuilder, /Title size/);
  assert.match(styleBuilder, /Background/);
  assert.match(styleBuilder, /Paper Cut/);
  assert.match(styleBuilder, /builder-group-toggle/);
  assert.match(styleBuilder, /aria-expanded=\{open\}/);
  assert.match(styleBuilder, /animate=\{\{ height: open \? "auto" : 0, opacity: open \? 1 : 0 \}\}/);
  assert.match(styleBuilder, /inert=\{!open\}/);
  assert.match(styleBuilder, /new Set<ControlGroupId>\(\["chart"\]\)/);
  assert.doesNotMatch(styleBuilder, /window\.matchMedia/);
  assert.match(styleBuilder, /builder-mobile-actions/);
  assert.match(styleBuilder, /builder-mobile-control-strip/);
  assert.match(styleBuilder, /focusGroup\("chart"\)/);
  assert.match(styleBuilder, /\.\/ui\/select/);
  assert.match(styleBuilder, /\.\/ui\/slider/);
  assert.match(styleBuilder, /\.\/ui\/checkbox/);
  assert.match(styleBuilder, /\.\/ui\/color-picker/);
  assert.doesNotMatch(styleBuilder, /<select\b|type="range"|type="checkbox"/);
  assert.match(css, /\.builder-workspace/);
  assert.match(css, /\.step-4 h3[^}]+font-size: clamp\(28px, 2\.4vw, 36px\)/s);
  assert.match(css, /\.architecture-copy h2[^}]+padding-right: \.12em[^}]+font-size: clamp\(72px, 6\.4vw, 100px\)/s);
  assert.match(css, /\.plotbeat-select-trigger/);
  assert.match(css, /\.plotbeat-slider-thumb/);
  assert.match(css, /\.plotbeat-checkbox/);
  assert.match(css, /\.plotbeat-color-picker/);
  assert.match(css, /\.builder-group-toggle[^}]+min-height: 64px[^}]+padding: 0 18px/s);
  assert.match(css, /\.builder-control-group legend[^}]+width: 100%[^}]+padding: 0/s);
  assert.match(css, /\.builder-mobile-actions[^}]+grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1fr\)/s);
  assert.match(css, /\.builder-mobile-control-strip[^}]+overflow-x: auto[^}]+scroll-snap-type: x proximity/s);
  assert.match(css, /\.builder-stage-column[^}]+position: relative[^}]+width: 100%/s);
  assert.doesNotMatch(css, /\.builder-stage-column[^}]+position: fixed/s);
  assert.match(css, /\.builder-stage-meta/);
  assert.doesNotMatch(styleBuilder, /mode="wait"/);
  const selectComponent = await readFile(new URL("../app/components/ui/select.tsx", import.meta.url), "utf8");
  assert.match(selectComponent, /collisionPadding=\{12\}/);
  assert.match(selectComponent, /onCloseAutoFocus/);
  assert.match(selectComponent, /event\.preventDefault\(\)/);
  assert.match(packageJson, /"motion"/);
  assert.match(packageJson, /@primer\/octicons-react/);
  assert.match(packageJson, /"radix-ui"/);
  const lazyVideo = await readFile(new URL("../app/components/LazyVideo.tsx", import.meta.url), "utf8");
  const copyButton = await readFile(new URL("../app/components/CopyButton.tsx", import.meta.url), "utf8");
  const scrollReveal = await readFile(new URL("../app/components/ScrollReveal.tsx", import.meta.url), "utf8");
  const analytics = await readFile(new URL("../app/analytics.ts", import.meta.url), "utf8");
  const analyticsEvents = await readFile(new URL("../app/components/AnalyticsEvents.tsx", import.meta.url), "utf8");
  assert.match(lazyVideo, /IntersectionObserver/);
  assert.match(lazyVideo, /preload="none"/);
  assert.match(copyButton, /copy-button-states/);
  assert.match(copyButton, /copy-button-success/);
  assert.match(copyButton, /trackAnalyticsEvent\("copy_content"/);
  assert.match(copyButton, /contentType: "install_command" \| "sample_prompt" \| "style_json" \| "style_prompt"/);
  assert.match(analytics, /productionHostname/);
  assert.match(analytics, /eventName\.slice\(0, 40\)/);
  assert.match(analyticsEvents, /\[data-analytics-event\]/);
  assert.match(analyticsEvents, /element_id/);
  assert.match(layout, /AnalyticsEvents/);
  assert.match(siteChrome, /language_change/);
  assert.match(siteChrome, /navigation_click/);
  assert.match(profilePopover, /profile_click/);
  assert.match(styleBuilder, /style_control_change/);
  assert.match(styleBuilder, /builder_preview_open/);
  assert.match(styleBuilder, /style_builder_reset/);
  assert.match(scrollReveal, /inset\(-12% -8% -12% -8%\)/);
  assert.match(scrollReveal, /headline \? [^:]+ : "none"/);
  assert.doesNotMatch(page, /TimingDialCutout|dial-widget/);
  assert.doesNotMatch(css, /\.cutout-dial|\.dial-widget|@keyframes dial-scan/);
  assert.match(css, /\.copy-button\.icon-only\.is-copied[^}]+background: var\(--acid\)/s);
  assert.match(siteChrome, /mobile-menu-trigger/);
  assert.match(siteChrome, /mobile-locale-trigger/);
  assert.match(siteChrome, /MobileSheet/);
  assert.match(siteChrome, /aria-controls="mobile-navigation"/);
  assert.match(siteChrome, /aria-controls="mobile-language-sheet"/);
  assert.match(siteChrome, /event\.key === "Escape"/);
  assert.match(siteChrome, /locales\.map/);
  assert.match(css, /\.mobile-navigation/);
  assert.match(css, /\.mobile-menu-trigger[^}]+order: 4/s);
  assert.match(css, /\.plotbeat-dropdown-content\[data-state="open"\]/);
  assert.match(css, /\.mobile-sheet-backdrop[^}]+position: fixed/s);
  assert.match(css, /\.mobile-sheet[^}]+position: fixed/s);
  assert.match(css, /\.style-tabs[^}]+scroll-snap-type: x mandatory/s);
  assert.match(css, /\.builder-mobile-control-strip[^}]+padding: 12px 16px/s);
});

test("renders complete canonical, social, icon, and structured metadata", async () => {
  const response = await render("/", {
    "x-forwarded-host": "plotbeat.example",
    "x-forwarded-proto": "https",
  });
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<link rel="canonical" href="https:\/\/plotbeat\.app"/);
  assert.match(html, /property="og:title" content="Plotbeat — Data, timed to the frame"/);
  assert.match(html, /property="og:image" content="https:\/\/plotbeat\.app\/og\.png"/);
  assert.match(html, /property="og:image:width" content="2400"/);
  assert.match(html, /property="og:image:height" content="1260"/);
  assert.match(html, /property="og:image:alt" content="Plotbeat — Data, timed to the frame"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:site" content="@DbgKinggg"/);
  assert.match(html, /name="twitter:creator" content="@DbgKinggg"/);
  assert.match(html, /name="twitter:title" content="Plotbeat — Data, timed to the frame"/);
  assert.match(html, /name="twitter:description"/);
  assert.match(html, /name="twitter:image" content="https:\/\/plotbeat\.app\/og\.png"/);
  assert.match(html, /name="twitter:image:alt" content="Plotbeat — Data, timed to the frame"/);
  assert.match(html, /hrefLang="zh"|hreflang="zh"/i);
  assert.match(html, /name="robots" content="index, follow/);
  assert.match(html, /rel="manifest" href="\/site\.webmanifest"/);
  assert.match(html, /rel="apple-touch-icon"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /schema\.org/);
  assert.match(html, /SoftwareApplication/);
  assert.match(html, /data-plotbeat-analytics="google-analytics-4"/);
  assert.match(html, /G-HX3R55M324/);
});

test("serves crawler and AI discovery routes with the canonical production hostname", async () => {
  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /^application\/xml/);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /https:\/\/plotbeat\.app\/style-builder/);
  assert.match(sitemapText, /https:\/\/plotbeat\.app\/zh\//);
  assert.match(sitemapText, /https:\/\/plotbeat\.app\/ja\/style-builder/);
  assert.match(sitemapText, /hreflang="x-default"/);
  assert.doesNotMatch(sitemapText, /\/preview/);

  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("content-type") ?? "", /^text\/plain/);
  assert.match(await robots.text(), /Sitemap: https:\/\/plotbeat\.app\/sitemap\.xml/);

  const bots = await render("/bots.txt");
  assert.equal(bots.status, 200);
  assert.match(await bots.text(), /LLMs: https:\/\/plotbeat\.app\/llms\.txt/);

  const llms = await render("/llms.txt");
  assert.equal(llms.status, 200);
  const llmsText = await llms.text();
  assert.match(llmsText, /^# Plotbeat/m);
  assert.match(llmsText, /npx skills add DbgKinggg\/plotbeat --skill plotbeat/);
  assert.match(llmsText, /Live chart style builder/);
  assert.match(llmsText, /Localized pages/);
  assert.match(llmsText, /\/zh\)/);
  assert.match(llmsText, /\/pt\)/);
  assert.match(llmsText, /HyperFrames source/);
});

test("renders localized routes with translated copy and SEO alternates", async () => {
  const zhResponse = await render("/zh", {
    "x-forwarded-host": "plotbeat.example",
    "x-forwarded-proto": "https",
    "x-plotbeat-locale": "zh",
  });
  assert.equal(zhResponse.status, 200);
  const zhHtml = await zhResponse.text();
  assert.match(zhHtml, /让数据/);
  assert.match(zhHtml, /把数据变成可编辑视频/);
  assert.match(zhHtml, /data-locale="zh"/);
  assert.match(zhHtml, /过去 10 年的美国月度失业率/);
  assert.doesNotMatch(zhHtml, /踩准每一帧。/);
  assert.doesNotMatch(zhHtml, /Use \$plotbeat to fetch the last 10 years/);
  assert.match(zhHtml, /<html lang="zh"/);
  assert.match(zhHtml, /property="og:locale" content="zh_CN"/);
  assert.match(zhHtml, /rel="canonical" href="https:\/\/plotbeat\.app\/zh/);
  assert.match(zhHtml, /href="https:\/\/plotbeat\.app\/ja" hreflang="ja"/);

  const deBuilder = await render("/de/style-builder", {
    "x-forwarded-host": "plotbeat.example",
    "x-forwarded-proto": "https",
    "x-plotbeat-locale": "de",
  });
  assert.equal(deBuilder.status, 200);
  const deHtml = await deBuilder.text();
  assert.match(deHtml, /Baue dein/);
  assert.match(deHtml, /data-locale="de"/);
  assert.match(deHtml, /<html lang="de"/);
  assert.match(deHtml, /Live chart preview/);
  assert.match(deHtml, /href="\/de" class="brand"/);
});

test("server-renders the live style builder with the shared site shell", async () => {
  const response = await render("/style-builder");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Build your own/);
  assert.match(html, /visual system\./);
  assert.match(html, /Live chart preview/);
  assert.match(html, /Style controls/);
  assert.match(html, /Swiss Signal/);
  assert.match(html, /Line weight/);
  assert.match(html, /Copy style JSON/);
  assert.match(html, /Made by/);
  assert.match(html, /Qoory\.ai/);
  assert.match(html, /class="sr-only"/);
  assert.doesNotMatch(html, /Everything here is live/);
});
