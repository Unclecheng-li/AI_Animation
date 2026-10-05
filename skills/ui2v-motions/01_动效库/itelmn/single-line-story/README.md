# Plotbeat website

The public website for [Plotbeat](https://github.com/DbgKinggg/plotbeat), an open-source AI skill and HyperFrames template system for turning data into editable chart videos.

## Local development

```bash
npm install
npm run dev
```

The local site runs at [http://localhost:3000](http://localhost:3000).

## Google Analytics

The production site uses the GA4 web stream `G-HX3R55M324`. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` only when a deployment needs to override that default. The Google tag only activates on `plotbeat.app` or `www.plotbeat.app`, so local and preview traffic does not pollute production analytics.

Plotbeat relies on GA4 Enhanced Measurement for initial page loads and client-side history changes. Keep **Page views → Page changes based on browser history events** enabled for the Plotbeat web stream. Google Signals and ad-personalization signals are disabled in the site integration.

Product events use a deliberately small vocabulary:

- `cta_click`, `navigation_click`, `language_change`, and `profile_click`
- `copy_content` after a clipboard write succeeds
- GA4's recommended `select_content` event for styles, themes, and builder presets
- `style_control_change`, `style_builder_reset`, `builder_section_open`, `builder_section_toggle`, and `builder_preview_open`

Event parameters are controlled identifiers such as `element_id`, `ui_location`, `content_type`, and `control_name`. Plotbeat never sends prompt text, copied content, user-entered builder text, or other personally identifiable information as event parameters.

## Validation

```bash
npm run lint
npm test
```

`npm test` creates the Cloudflare-compatible production build and checks the rendered home, style builder, sitemap, robots, bots, and LLM discovery routes.

## Main routes

- `/` — product overview, installation, templates, workflow, and prompts
- `/style-builder` — live style builder
- `/sitemap.xml` — canonical sitemap for `https://plotbeat.app`
- `/robots.txt` and `/bots.txt` — crawler policy
- `/llms.txt` — AI-agent product documentation

The site uses vinext and builds to a Cloudflare Worker-compatible ESM bundle. Cloudflare Workers Builds deploys commits to `main` that change `website/**`, using `website/` as the build root, `npm run build` as the build command, and `npx wrangler deploy` as the deploy command. The apex domain is canonical; Cloudflare redirects `www.plotbeat.app` to `https://plotbeat.app` while preserving paths and query strings.
