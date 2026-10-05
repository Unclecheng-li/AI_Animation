<div align="center">
  <img src="website/public/brand/plotbeat-mark.svg" width="96" alt="Plotbeat-Logo" />
  <h1>Plotbeat</h1>
  <p><strong>Verwandle Daten in editierbare Videos – für KI-Agenten entwickelt und mit HyperFrames betrieben.</strong></p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.es.md">Español</a> ·
    <a href="README.de.md">Deutsch</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.pt-BR.md">Português</a>
  </p>
</div>

Plotbeat ist ein Open-Source-AI-Skill und Vorlagensystem, das CSV, JSON, URLs, APIs und öffentliche Datenquellen in deterministische, editierbare [HyperFrames](https://github.com/heygen-com/hyperframes)-Diagrammvideos umwandelt.

Plotbeat ist kein eigener Renderer. HyperFrames bleibt für Timeline, Studio-Vorschau, Validierung und Rendering zuständig; Plotbeat liefert Datencompiler, Motion-Grammatiken, visuelle Systeme, Beispielkompositionen und den Agenten-Workflow.

## In Bewegung

Das sind echte Plotbeat-Renderings, keine UI-Mockups. Klicke auf eine Vorschau, um das vollständige MP4 mit Ton zu öffnen, oder besuche die [Live-Vorlagengalerie](https://plotbeat.app/de/#templates).

<table>
  <tr>
    <td width="50%"><a href="website/public/previews/single-line.mp4"><img src="docs/assets/previews/single-line.gif" width="100%" alt="Animierte Vorschau von Single-line Story" /></a><br /><sub><strong>Single-line Story</strong> · Trends und KPI-Verlauf</sub></td>
    <td width="50%"><a href="website/public/previews/multi-line.mp4"><img src="docs/assets/previews/multi-line.gif" width="100%" alt="Animierte Vorschau von Multi-line Rank" /></a><br /><sub><strong>Multi-line Rank</strong> · Kohorten und Vergleiche</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/bar-race.mp4"><img src="docs/assets/previews/bar-race.gif" width="100%" alt="Animierte Vorschau von Bar Race" /></a><br /><sub><strong>Bar Race</strong> · Rankings und Bestenlisten</sub></td>
    <td><a href="website/public/previews/stacked-area.mp4"><img src="docs/assets/previews/stacked-area.gif" width="100%" alt="Animierte Vorschau von Stacked-area Story" /></a><br /><sub><strong>Stacked-area Story</strong> · Beitrag und Anteil</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/scatter-journey.mp4"><img src="docs/assets/previews/scatter-journey.gif" width="100%" alt="Animierte Vorschau von Scatter Journey" /></a><br /><sub><strong>Scatter Journey</strong> · Bewegung zweier Faktoren</sub></td>
    <td><a href="website/public/previews/animated-map.mp4"><img src="docs/assets/previews/animated-map.gif" width="100%" alt="Vorschau von Animated Map" /></a><br /><sub><strong>Animated Map</strong> · geografische Aktivität und Flüsse</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/kpi-dashboard.mp4"><img src="docs/assets/previews/kpi-dashboard.gif" width="100%" alt="Animierte Vorschau von KPI Dashboard" /></a><br /><sub><strong>KPI Dashboard</strong> · Geschäfts- und Portfolio-Reviews</sub></td>
    <td><a href="website/public/previews/milestone-timeline.mp4"><img src="docs/assets/previews/milestone-timeline.gif" width="100%" alt="Animierte Vorschau von Milestone Timeline" /></a><br /><sub><strong>Milestone Timeline</strong> · Launches und Produktgeschichte</sub></td>
  </tr>
</table>

## Installation

```bash
npx skills add heygen-com/hyperframes --all
npx skills add DbgKinggg/plotbeat --skill plotbeat
```

Beispiel-Prompt:

> Nutze `$plotbeat`, um die monatlichen US-Arbeitslosendaten der letzten zehn Jahre von FRED abzurufen. Nenne Quelle und Abrufdatum und verwandle sie in ein schnelles, editierbares HyperFrames-Trendvideo. Hole vor dem Rendern meine Freigabe für den Stil ein.

## Enthalten in v0.1

Enthalten sind 8 Vorlagen und 8 helle beziehungsweise dunkle Stile für Trends, Rankings, Bar Races, gestapelte Flächen, Streudiagramme, Karten, KPI-Dashboards und Meilensteine.

## Lokale Entwicklung

Benötigt Node.js 22.13 oder neuer.

```bash
git clone https://github.com/DbgKinggg/plotbeat.git
cd plotbeat
npm run prepare:single
npm run dev
```

Website:

```bash
cd website
npm install
npm run dev
```

## Release validieren

```bash
npm run package:skill
npm test
npm run release:audit
npm run check:all
npm --prefix website test
```

Lies [CONTRIBUTING.md](CONTRIBUTING.md), bevor du eine Vorlage vorschlägst. MIT-lizenziert.
