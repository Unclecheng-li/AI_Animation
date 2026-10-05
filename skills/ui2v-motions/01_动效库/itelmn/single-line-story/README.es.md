<div align="center">
  <img src="website/public/brand/plotbeat-mark.svg" width="96" alt="Logo de Plotbeat" />
  <h1>Plotbeat</h1>
  <p><strong>Convierte datos en vídeo editable, creado para agentes de IA y desarrollado con HyperFrames.</strong></p>
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

Plotbeat es una skill de IA y un sistema de plantillas open source que convierte CSV, JSON, URLs, APIs y fuentes públicas en vídeos de gráficos deterministas y editables con [HyperFrames](https://github.com/heygen-com/hyperframes).

Plotbeat no es un renderizador independiente. HyperFrames conserva la timeline, la vista previa en Studio, la validación y el render; Plotbeat aporta el compilador de datos, las gramáticas de movimiento, los sistemas visuales, las composiciones de ejemplo y el flujo para agentes.

## Véalo en movimiento

Son renders reales de Plotbeat, no maquetas. Haz clic en cualquier vista previa para abrir el MP4 completo con sonido o visita la [galería de plantillas](https://plotbeat.app/es/#templates).

<table>
  <tr>
    <td width="50%"><a href="website/public/previews/single-line.mp4"><img src="docs/assets/previews/single-line.gif" width="100%" alt="Vista previa animada de Single-line Story" /></a><br /><sub><strong>Single-line Story</strong> · tendencias e historial KPI</sub></td>
    <td width="50%"><a href="website/public/previews/multi-line.mp4"><img src="docs/assets/previews/multi-line.gif" width="100%" alt="Vista previa animada de Multi-line Rank" /></a><br /><sub><strong>Multi-line Rank</strong> · cohortes y comparaciones</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/bar-race.mp4"><img src="docs/assets/previews/bar-race.gif" width="100%" alt="Vista previa animada de Bar Race" /></a><br /><sub><strong>Bar Race</strong> · rankings y clasificaciones</sub></td>
    <td><a href="website/public/previews/stacked-area.mp4"><img src="docs/assets/previews/stacked-area.gif" width="100%" alt="Vista previa animada de Stacked-area Story" /></a><br /><sub><strong>Stacked-area Story</strong> · contribución y cuota</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/scatter-journey.mp4"><img src="docs/assets/previews/scatter-journey.gif" width="100%" alt="Vista previa animada de Scatter Journey" /></a><br /><sub><strong>Scatter Journey</strong> · movimiento de dos factores</sub></td>
    <td><a href="website/public/previews/animated-map.mp4"><img src="docs/assets/previews/animated-map.gif" width="100%" alt="Vista previa de Animated Map" /></a><br /><sub><strong>Animated Map</strong> · actividad geográfica y flujos</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/kpi-dashboard.mp4"><img src="docs/assets/previews/kpi-dashboard.gif" width="100%" alt="Vista previa animada de KPI Dashboard" /></a><br /><sub><strong>KPI Dashboard</strong> · revisiones de negocio y cartera</sub></td>
    <td><a href="website/public/previews/milestone-timeline.mp4"><img src="docs/assets/previews/milestone-timeline.gif" width="100%" alt="Vista previa animada de Milestone Timeline" /></a><br /><sub><strong>Milestone Timeline</strong> · lanzamientos e historia de producto</sub></td>
  </tr>
</table>

## Instalación

```bash
npx skills add heygen-com/hyperframes --all
npx skills add DbgKinggg/plotbeat --skill plotbeat
```

Ejemplo de prompt:

> Usa `$plotbeat` para obtener de FRED los datos mensuales de desempleo de EE. UU. de los últimos 10 años, cita la fuente y la fecha de consulta, y conviértelos en un vídeo de tendencia HyperFrames rápido y editable. Permíteme aprobar el estilo antes del render.

## Incluido en v0.1

Incluye 8 plantillas y 8 estilos claros y oscuros para tendencias, rankings, carreras de barras, áreas apiladas, dispersión, mapas, dashboards KPI e hitos.

## Desarrollo local

Requiere Node.js 22.13 o posterior.

```bash
git clone https://github.com/DbgKinggg/plotbeat.git
cd plotbeat
npm run prepare:single
npm run dev
```

Sitio web:

```bash
cd website
npm install
npm run dev
```

## Validar una release

```bash
npm run package:skill
npm test
npm run release:audit
npm run check:all
npm --prefix website test
```

Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de proponer una plantilla. Licencia MIT.
