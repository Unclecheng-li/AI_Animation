<div align="center">
  <img src="website/public/brand/plotbeat-mark.svg" width="96" alt="Logo do Plotbeat" />
  <h1>Plotbeat</h1>
  <p><strong>Transforme dados em vídeo editável, criado para agentes de IA e desenvolvido com HyperFrames.</strong></p>
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

Plotbeat é uma skill de IA e um sistema de templates open source que transforma CSV, JSON, URLs, APIs e fontes públicas em vídeos de gráficos [HyperFrames](https://github.com/heygen-com/hyperframes) determinísticos e editáveis.

O Plotbeat não é um renderizador independente. O HyperFrames continua responsável pela timeline, prévia no Studio, validação e renderização; o Plotbeat fornece o compilador de dados, as gramáticas de movimento, os sistemas visuais, as composições de exemplo e o fluxo para agentes.

## Veja em movimento

São renders reais do Plotbeat, não mockups. Clique em qualquer prévia para abrir o MP4 completo com som ou explore a [galeria de templates](https://plotbeat.app/pt/#templates).

<table>
  <tr>
    <td width="50%"><a href="website/public/previews/single-line.mp4"><img src="docs/assets/previews/single-line.gif" width="100%" alt="Prévia animada de Single-line Story" /></a><br /><sub><strong>Single-line Story</strong> · tendências e histórico de KPI</sub></td>
    <td width="50%"><a href="website/public/previews/multi-line.mp4"><img src="docs/assets/previews/multi-line.gif" width="100%" alt="Prévia animada de Multi-line Rank" /></a><br /><sub><strong>Multi-line Rank</strong> · coortes e comparações</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/bar-race.mp4"><img src="docs/assets/previews/bar-race.gif" width="100%" alt="Prévia animada de Bar Race" /></a><br /><sub><strong>Bar Race</strong> · rankings e classificações</sub></td>
    <td><a href="website/public/previews/stacked-area.mp4"><img src="docs/assets/previews/stacked-area.gif" width="100%" alt="Prévia animada de Stacked-area Story" /></a><br /><sub><strong>Stacked-area Story</strong> · contribuição e participação</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/scatter-journey.mp4"><img src="docs/assets/previews/scatter-journey.gif" width="100%" alt="Prévia animada de Scatter Journey" /></a><br /><sub><strong>Scatter Journey</strong> · movimento de dois fatores</sub></td>
    <td><a href="website/public/previews/animated-map.mp4"><img src="docs/assets/previews/animated-map.gif" width="100%" alt="Prévia de Animated Map" /></a><br /><sub><strong>Animated Map</strong> · atividade geográfica e fluxos</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/kpi-dashboard.mp4"><img src="docs/assets/previews/kpi-dashboard.gif" width="100%" alt="Prévia animada de KPI Dashboard" /></a><br /><sub><strong>KPI Dashboard</strong> · revisões de negócio e portfólio</sub></td>
    <td><a href="website/public/previews/milestone-timeline.mp4"><img src="docs/assets/previews/milestone-timeline.gif" width="100%" alt="Prévia animada de Milestone Timeline" /></a><br /><sub><strong>Milestone Timeline</strong> · lançamentos e histórico de produto</sub></td>
  </tr>
</table>

## Instalação

```bash
npx skills add heygen-com/hyperframes --all
npx skills add DbgKinggg/plotbeat --skill plotbeat
```

Exemplo de prompt:

> Use `$plotbeat` para buscar no FRED os dados mensais de desemprego dos EUA dos últimos 10 anos, cite a fonte e a data de consulta e transforme-os em um vídeo de tendência HyperFrames rápido e editável. Peça minha aprovação do estilo antes de renderizar.

## Incluído na v0.1

Inclui 8 templates e 8 estilos claros e escuros para tendências, rankings, corridas de barras, áreas empilhadas, dispersão, mapas, dashboards de KPI e marcos.

## Desenvolvimento local

Requer Node.js 22.13 ou mais recente.

```bash
git clone https://github.com/DbgKinggg/plotbeat.git
cd plotbeat
npm run prepare:single
npm run dev
```

Site:

```bash
cd website
npm install
npm run dev
```

## Validar uma release

```bash
npm run package:skill
npm test
npm run release:audit
npm run check:all
npm --prefix website test
```

Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de propor um template. Licença MIT.
