<div align="center">
  <img src="website/public/brand/plotbeat-mark.svg" width="96" alt="Plotbeat 로고" />
  <h1>Plotbeat</h1>
  <p><strong>데이터를 편집 가능한 영상으로. AI 에이전트를 위해 만들고 HyperFrames로 구동합니다.</strong></p>
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

Plotbeat는 CSV, JSON, URL, API 및 공개 데이터 소스를 결정론적이고 편집 가능한 [HyperFrames](https://github.com/heygen-com/hyperframes) 차트 영상으로 바꾸는 오픈소스 AI 스킬 및 템플릿 시스템입니다.

Plotbeat는 별도의 렌더러가 아닙니다. HyperFrames가 타임라인, Studio 미리보기, 검증, 렌더링을 담당하고 Plotbeat는 데이터 컴파일러, 모션 문법, 시각 시스템, 샘플 컴포지션과 에이전트 워크플로를 제공합니다.

## 모션 미리보기

모두 Plotbeat에서 실제로 렌더링한 결과입니다. 미리보기를 클릭하면 사운드가 포함된 전체 MP4가 열립니다. [라이브 템플릿 갤러리](https://plotbeat.app/ko/#templates)도 확인해 보세요.

<table>
  <tr>
    <td width="50%"><a href="website/public/previews/single-line.mp4"><img src="docs/assets/previews/single-line.gif" width="100%" alt="Single-line Story 애니메이션 미리보기" /></a><br /><sub><strong>Single-line Story</strong> · 추세와 KPI 기록</sub></td>
    <td width="50%"><a href="website/public/previews/multi-line.mp4"><img src="docs/assets/previews/multi-line.gif" width="100%" alt="Multi-line Rank 애니메이션 미리보기" /></a><br /><sub><strong>Multi-line Rank</strong> · 코호트와 비교</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/bar-race.mp4"><img src="docs/assets/previews/bar-race.gif" width="100%" alt="Bar Race 애니메이션 미리보기" /></a><br /><sub><strong>Bar Race</strong> · 순위와 리더보드</sub></td>
    <td><a href="website/public/previews/stacked-area.mp4"><img src="docs/assets/previews/stacked-area.gif" width="100%" alt="Stacked-area Story 애니메이션 미리보기" /></a><br /><sub><strong>Stacked-area Story</strong> · 기여도와 비중</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/scatter-journey.mp4"><img src="docs/assets/previews/scatter-journey.gif" width="100%" alt="Scatter Journey 애니메이션 미리보기" /></a><br /><sub><strong>Scatter Journey</strong> · 두 요인의 움직임</sub></td>
    <td><a href="website/public/previews/animated-map.mp4"><img src="docs/assets/previews/animated-map.gif" width="100%" alt="Animated Map 미리보기" /></a><br /><sub><strong>Animated Map</strong> · 지리 활동과 흐름</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/kpi-dashboard.mp4"><img src="docs/assets/previews/kpi-dashboard.gif" width="100%" alt="KPI Dashboard 애니메이션 미리보기" /></a><br /><sub><strong>KPI Dashboard</strong> · 비즈니스와 포트폴리오 검토</sub></td>
    <td><a href="website/public/previews/milestone-timeline.mp4"><img src="docs/assets/previews/milestone-timeline.gif" width="100%" alt="Milestone Timeline 애니메이션 미리보기" /></a><br /><sub><strong>Milestone Timeline</strong> · 출시와 제품 기록</sub></td>
  </tr>
</table>

## 설치

```bash
npx skills add heygen-com/hyperframes --all
npx skills add DbgKinggg/plotbeat --skill plotbeat
```

에이전트 프롬프트 예시:

> `$plotbeat`를 사용해 FRED에서 지난 10년간 미국 월별 실업률 데이터를 가져오고 출처와 조회 날짜를 명시한 뒤 빠르고 편집 가능한 HyperFrames 추세 영상으로 만들어 주세요. 렌더링 전에 시각 스타일을 확인받아 주세요.

## v0.1 구성

추세, 순위, 막대그래프 레이스, 누적 영역, 산점도, 지도, KPI 대시보드와 마일스톤 영상을 위한 8개 템플릿과 8개 라이트/다크 스타일이 포함됩니다.

## 로컬 개발

Node.js 22.13 이상이 필요합니다.

```bash
git clone https://github.com/DbgKinggg/plotbeat.git
cd plotbeat
npm run prepare:single
npm run dev
```

웹사이트:

```bash
cd website
npm install
npm run dev
```

## 릴리스 검증

```bash
npm run package:skill
npm test
npm run release:audit
npm run check:all
npm --prefix website test
```

새 템플릿을 제안하기 전에 [CONTRIBUTING.md](CONTRIBUTING.md)를 읽어 주세요. MIT 라이선스입니다.
