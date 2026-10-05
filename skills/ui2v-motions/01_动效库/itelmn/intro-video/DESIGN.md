# DESIGN.md — Rite Workflow 紹介動画

## Style Prompt

開発者向けターミナルツールの世界観。深いインクブラックのキャンバスに、巻物（📜）と
「儀式（rite）」を想起させる暖色のアンバー/ゴールドをアクセントに据える。GitHub Dark を
基調にしたエンジニアリングらしい落ち着きと、コマンドが次々に成功していく小気味よい動きを
両立させる。誇張のない、事実に忠実で端正なトーン。

## Colors

| Role | Hex | 用途 |
|------|-----|------|
| Canvas (背景) | `#0E1117` | 全シーン共通の背景 |
| Surface (パネル) | `#161B22` | ターミナル/カードの面 |
| Border | `#30363D` | 枠線・区切り |
| Text primary | `#E6EDF3` | 見出し・本文 |
| Text muted | `#8B949E` | サブ・補助テキスト |
| Accent amber (儀式) | `#E8B339` | ブランド/強調/ロゴ |
| Terminal green | `#3FB950` | 成功 ✓ / コマンド出力 OK |
| Cyan link | `#58A6FF` | コマンド名・リンク・アクセント |

### Severity（findings 表示用）

| Level | Hex |
|-------|-----|
| CRITICAL | `#F85149` |
| HIGH | `#FF9B50` |
| MEDIUM | `#E3B341` |
| OK / resolved | `#3FB950` |

## Typography

- 見出し・本文（欧文）: **Inter**
- ターミナル/コマンド（等幅）: **JetBrains Mono**
- 日本語: **Noto Sans JP**（フォント stack で欧文等幅の後段に置きフォールバック）
- 数字カラムは `font-variant-numeric: tabular-nums`

font stack 例:
- 日本語見出し: `"Inter", "Noto Sans JP", sans-serif`
- ターミナル内日本語ラベル: `"JetBrains Mono", "Noto Sans JP", monospace`

## Motion

- entrance のみ（exit はトランジションが兼ねる。最終シーンのみ fade out 可）
- 最初の tween は 0.1–0.3s オフセット、1シーンに最低3種類の ease
- シーン間はクロスフェード（全シーン同色背景なので 0.5–0.6s の opacity 重ねで自然に繋ぐ）
- ターミナルのタイプ表示・進捗は決定論的（`SteppedEase`/幅クリップ。乱数・時刻不可）

## What NOT to Do

- 既定色 `#3b82f6` / `#333333` / フォント `Roboto` を使わない（必ず上記パレット）
- 濃色背景にフルスクリーン linear gradient を敷かない（H.264 バンディング。radial か solid+局所 glow）
- ジャンプカット禁止（必ずトランジション）。シーン内の要素はすべて entrance を持つ
- 誇張表現を書かない: レビュアーは「13人が常に並列」ではなく
  「最大13種類から PR 内容に応じて動的選定」と事実どおりに表記する
- `<br>` で強制改行しない（`max-width` で自然折返し。短い表示見出しの例外のみ可）
