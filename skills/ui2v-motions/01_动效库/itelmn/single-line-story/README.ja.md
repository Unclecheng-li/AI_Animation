<div align="center">
  <img src="website/public/brand/plotbeat-mark.svg" width="96" alt="Plotbeat ロゴ" />
  <h1>Plotbeat</h1>
  <p><strong>データを編集可能な動画へ。AI エージェント向け、HyperFrames 搭載。</strong></p>
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

Plotbeat は、CSV、JSON、URL、API、公開データを、決定論的で編集可能な [HyperFrames](https://github.com/heygen-com/hyperframes) のチャート動画へ変換するオープンソース AI スキル／テンプレートシステムです。

Plotbeat は独立したレンダラーではありません。タイムライン、Studio プレビュー、検証、レンダリングは HyperFrames が担当し、Plotbeat はデータコンパイラ、モーショングラマー、ビジュアルシステム、サンプル構成、エージェントワークフローを提供します。

## モーションプレビュー

すべて Plotbeat の実レンダーです。プレビューをクリックすると音声付きの完全版 MP4 が開きます。[ライブテンプレートギャラリー](https://plotbeat.app/ja/#templates)もご覧ください。

<table>
  <tr>
    <td width="50%"><a href="website/public/previews/single-line.mp4"><img src="docs/assets/previews/single-line.gif" width="100%" alt="Single-line Story のアニメーションプレビュー" /></a><br /><sub><strong>Single-line Story</strong> · トレンドと KPI 履歴</sub></td>
    <td width="50%"><a href="website/public/previews/multi-line.mp4"><img src="docs/assets/previews/multi-line.gif" width="100%" alt="Multi-line Rank のアニメーションプレビュー" /></a><br /><sub><strong>Multi-line Rank</strong> · コホートと比較</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/bar-race.mp4"><img src="docs/assets/previews/bar-race.gif" width="100%" alt="Bar Race のアニメーションプレビュー" /></a><br /><sub><strong>Bar Race</strong> · ランキングとリーダーボード</sub></td>
    <td><a href="website/public/previews/stacked-area.mp4"><img src="docs/assets/previews/stacked-area.gif" width="100%" alt="Stacked-area Story のアニメーションプレビュー" /></a><br /><sub><strong>Stacked-area Story</strong> · 構成とシェア</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/scatter-journey.mp4"><img src="docs/assets/previews/scatter-journey.gif" width="100%" alt="Scatter Journey のアニメーションプレビュー" /></a><br /><sub><strong>Scatter Journey</strong> · 二軸の変化</sub></td>
    <td><a href="website/public/previews/animated-map.mp4"><img src="docs/assets/previews/animated-map.gif" width="100%" alt="Animated Map のプレビュー" /></a><br /><sub><strong>Animated Map</strong> · 地理アクティビティとフロー</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/kpi-dashboard.mp4"><img src="docs/assets/previews/kpi-dashboard.gif" width="100%" alt="KPI Dashboard のアニメーションプレビュー" /></a><br /><sub><strong>KPI Dashboard</strong> · ビジネスとポートフォリオ</sub></td>
    <td><a href="website/public/previews/milestone-timeline.mp4"><img src="docs/assets/previews/milestone-timeline.gif" width="100%" alt="Milestone Timeline のアニメーションプレビュー" /></a><br /><sub><strong>Milestone Timeline</strong> · ローンチと製品履歴</sub></td>
  </tr>
</table>

## インストール

```bash
npx skills add heygen-com/hyperframes --all
npx skills add DbgKinggg/plotbeat --skill plotbeat
```

エージェントへのプロンプト例：

> `$plotbeat` を使って FRED から過去 10 年間の米国月次失業率を取得し、出典と取得日を明記して、テンポのよい編集可能な HyperFrames トレンド動画にしてください。レンダリング前にビジュアルスタイルを確認させてください。

## v0.1 の内容

8 種類のチャートテンプレートと 8 種類のライト／ダークスタイルを収録しています。トレンド、ランキング、棒グラフレース、積み上げ面、散布図、地図、KPI ダッシュボード、マイルストーンの動画に対応します。

## ローカル開発

Node.js 22.13 以降が必要です。

```bash
git clone https://github.com/DbgKinggg/plotbeat.git
cd plotbeat
npm run prepare:single
npm run dev
```

Web サイト：

```bash
cd website
npm install
npm run dev
```

## リリース検証

```bash
npm run package:skill
npm test
npm run release:audit
npm run check:all
npm --prefix website test
```

テンプレートを提案する前に [CONTRIBUTING.md](CONTRIBUTING.md) をお読みください。MIT ライセンスです。
