# intro-video — 来歴と取り扱い

旧 Demo（v0.11.0 で `media/intro-video-v2` の v2 フルカットへ差し替え済み）の HyperFrames ソース。

## 来歴

- もとは独立ディレクトリ `~/Projects/work/rite-intro-video/` で制作していたものを、本リポジトリ管理下（`media/intro-video/`）へ取り込んだ。
- 取り込み時点ではソース内容を改変せず as-is でインポートし、別コミットで v0.7 仕様へ更新した。

## ビルド / プレビュー

```bash
cd media/intro-video
npm run check    # hyperframes lint && validate && inspect（HTML 妥当性の検証）
npm run dev      # hyperframes preview（ブラウザでプレビュー）
npm run render   # hyperframes render（MP4 を生成）
```

レンダリングには HyperFrames（`npx hyperframes`）+ headless Chromium + ffmpeg が必要。

## コミットしないもの（`.gitignore` 済み）

| 対象 | 理由 |
|------|------|
| `*.mp4`（`rite-intro.mp4` / `rite-intro-bgm*.mp4` 等） | `npm run render` で再生成可能なビルド成果物。README の再生動画は GitHub の添付（user-attachments）として別途アップロードする |
| `*.mp3`（BGM） | 後述のライセンス制約のため |

## BGM について

- 楽曲: **BombinSound — Technology**（Pixabay, track ID `499581`）
- 入手元: <https://pixabay.com/users/bombinsound-54782632/>
- ライセンス: [Pixabay Content License](https://pixabay.com/service/terms/) — 商用利用可・帰属表示不要。**ただし「creative effort を加えず実質同形のまま単体（standalone）で配布すること」を禁止**している。
- そのため**生の mp3 を本リポジトリにはコミットしない**（公開リポへ置くと単体ダウンロード可能となり standalone 配布に該当しうるため）。BGM 付きでレンダリングする場合は、上記 Pixabay ページから `bombinsound-technology-tech-technology-90-second-499581.mp3` を取得し、このディレクトリ直下に置くこと。
- BGM を映像に合成した**動画そのもの（新たな創作物）**の配布は Pixabay ライセンス上問題ない。
