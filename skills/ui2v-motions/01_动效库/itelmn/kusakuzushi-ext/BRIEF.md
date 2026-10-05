---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "GitHub のプロフィールの草が、その場でブロック崩しになる。やめれば元通り"
destination: x-feed
aspect: 1080x1080
language: ja
audience: GitHub を日常的に使う開発者
length: ~16s
angle: screen-recording (E1 + E2)
---

## Intent

草崩し Chrome 拡張（https://chromewebstore.google.com/detail/gbjockgldlkgpjdlnlbefgmnmfbhcbaf）の告知動画。
Web 版の動画（`../kusakuzushi-site/compositions/s10-screen.html`、ユーザーが選んだ C 案）と同じ
**画面録画の文法**で作り、X のスレッドで Web 版と並べる。

- **E1 いつもの画面で「崩す」**: 見慣れた GitHub のプロフィールで「🎮 崩す」を押すと、その場でゲームが始まる。
- **E2 ヒヤッと → 元通り**: 本物の草のマスが崩されて空になっていくが、「やめる」を押すと一瞬で緑が戻る。
  「GitHub のデータには触れない」を言葉ではなく絵で見せる落ち。
- 掴みは C と同じく、最も派手な崩壊の瞬間を冒頭に置く。

## Assets

- 拡張のソース `apps/extension/src`（main と同一、2026-09-27 確認）。**拡張のコードは改変しない**。
- 本物の公開プロフィール https://github.com/toshi0607（ログインなしの表示、ダークモード、1920×1080 の 2 倍撮り）。
- Web 版 C のカーソル SVG とエンドカードの型。
- ../../DESIGN-VISUAL.md（動画の追加 UI は夜の畑の配色。GitHub の画面そのものは実画面のまま）。

## Customizations

- 録画は決定的なハーネスで行う。拡張のモジュールをそのままページに読み込み、時間（requestAnimationFrame / performance.now）と
  乱数だけを差し替え、パドルは本物の `mousemove` イベントで自動操作する。ゲーム設定は拡張の実際の設定（エンジン初期値＋盤面の寸法）。
  人工的なのは「固定シード」「自動操作」「早回し」の 3 点だけ。
- カメラは C の原則に従う（動くのはクリックが理由になるときだけ。草が画面いっぱいなので基本は動かさない）。
- 完全に無音。テロップは入れない（エンドカードのみ）。

## Notes

- 構図でプライバシーを守る: 草のカードを中心に 1.3 倍前後で撮り、ログイン前ヘッダー（Sign in / Sign up）と左列の個人情報
  （会社・所在地・現地時刻など）は画面に入れない。引きの全景は使わない。
- エンドカードは文字だけの CTA。Google のストアバッジは使わない。
- 画面比 1:1 はユーザー確認済みの C に合わせた選択（16:9 案は以前に出したが確定していない）。
