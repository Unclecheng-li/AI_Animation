<div align="center">
  <img src="website/public/brand/plotbeat-mark.svg" width="96" alt="Logo Plotbeat" />
  <h1>Plotbeat</h1>
  <p><strong>Transformez vos données en vidéo modifiable, conçue pour les agents IA et propulsée par HyperFrames.</strong></p>
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

Plotbeat est une skill IA et un système de modèles open source qui transforme CSV, JSON, URL, API et sources publiques en vidéos de graphiques [HyperFrames](https://github.com/heygen-com/hyperframes) déterministes et modifiables.

Plotbeat n’est pas un moteur de rendu indépendant. HyperFrames conserve la timeline, l’aperçu Studio, la validation et le rendu ; Plotbeat fournit le compilateur de données, les grammaires de mouvement, les systèmes visuels, les compositions d’exemple et le workflow agentique.

## Voir le mouvement

Ce sont de vrais rendus Plotbeat, pas des maquettes. Cliquez sur un aperçu pour ouvrir le MP4 complet avec le son, ou découvrez la [galerie de modèles](https://plotbeat.app/fr/#templates).

<table>
  <tr>
    <td width="50%"><a href="website/public/previews/single-line.mp4"><img src="docs/assets/previews/single-line.gif" width="100%" alt="Aperçu animé de Single-line Story" /></a><br /><sub><strong>Single-line Story</strong> · tendances et historique KPI</sub></td>
    <td width="50%"><a href="website/public/previews/multi-line.mp4"><img src="docs/assets/previews/multi-line.gif" width="100%" alt="Aperçu animé de Multi-line Rank" /></a><br /><sub><strong>Multi-line Rank</strong> · cohortes et comparaisons</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/bar-race.mp4"><img src="docs/assets/previews/bar-race.gif" width="100%" alt="Aperçu animé de Bar Race" /></a><br /><sub><strong>Bar Race</strong> · classements et palmarès</sub></td>
    <td><a href="website/public/previews/stacked-area.mp4"><img src="docs/assets/previews/stacked-area.gif" width="100%" alt="Aperçu animé de Stacked-area Story" /></a><br /><sub><strong>Stacked-area Story</strong> · contribution et part</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/scatter-journey.mp4"><img src="docs/assets/previews/scatter-journey.gif" width="100%" alt="Aperçu animé de Scatter Journey" /></a><br /><sub><strong>Scatter Journey</strong> · mouvement à deux facteurs</sub></td>
    <td><a href="website/public/previews/animated-map.mp4"><img src="docs/assets/previews/animated-map.gif" width="100%" alt="Aperçu de Animated Map" /></a><br /><sub><strong>Animated Map</strong> · activité géographique et flux</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/kpi-dashboard.mp4"><img src="docs/assets/previews/kpi-dashboard.gif" width="100%" alt="Aperçu animé de KPI Dashboard" /></a><br /><sub><strong>KPI Dashboard</strong> · revues métier et portefeuille</sub></td>
    <td><a href="website/public/previews/milestone-timeline.mp4"><img src="docs/assets/previews/milestone-timeline.gif" width="100%" alt="Aperçu animé de Milestone Timeline" /></a><br /><sub><strong>Milestone Timeline</strong> · lancements et historique produit</sub></td>
  </tr>
</table>

## Installation

```bash
npx skills add heygen-com/hyperframes --all
npx skills add DbgKinggg/plotbeat --skill plotbeat
```

Exemple de prompt :

> Utilisez `$plotbeat` pour récupérer sur FRED les données mensuelles du chômage aux États-Unis sur les dix dernières années, citez la source et la date de consultation, puis créez une vidéo de tendance HyperFrames rapide et modifiable. Demandez mon accord sur le style avant le rendu.

## Inclus dans la v0.1

Le projet comprend 8 modèles et 8 styles clairs ou sombres pour les tendances, classements, bar races, aires empilées, nuages de points, cartes, tableaux KPI et jalons.

## Développement local

Node.js 22.13 ou une version ultérieure est requis.

```bash
git clone https://github.com/DbgKinggg/plotbeat.git
cd plotbeat
npm run prepare:single
npm run dev
```

Site web :

```bash
cd website
npm install
npm run dev
```

## Valider une release

```bash
npm run package:skill
npm test
npm run release:audit
npm run check:all
npm --prefix website test
```

Lisez [CONTRIBUTING.md](CONTRIBUTING.md) avant de proposer un modèle. Licence MIT.
