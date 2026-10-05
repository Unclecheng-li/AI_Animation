---
format: 1080x1080
duration: 22s
message: "積み上げた1年の草は、その場で崩せる"
arc: 見慣れた草 → 崩れる → 加速 → ゼロ → CTA
audience: GitHub を日常的に使う開発者（X のタイムライン）
mode: collaborative
music: none
---

## Video direction

**Palette** — canvas は `frame.md` の `cream`(#0C110D)、文字は `ink-black`(#E4EDE2)、補助文字は
`cream-muted`(#8DA08C)、罫線は `border-dark`(#28332A)。**アクセントは `fire-orange`(#FFB224) ただ一色**。
緑は録画の中の草だけに存在し、数字・文字・罫線・UI には一切使わない（DESIGN-VISUAL.md の最重要ルール
「緑は草だけのもの」）。唯一の例外は Frame 5 でロゴを組む粒 — あれは「タイトルロゴが草でできている」
という製品自身のシグネチャーの引用なので、緑であることに意味がある。

**Type** — 見出し・数字・掛け声は display ランプ（DotGothic16）。読ませる文は body ランプ
（IBM Plex Sans JP）。DotGothic16 は固定幅のピクセル字形なので、プリセットが持つ負のトラッキングと
lowercase 指定は日本語では無効 — 適用しない。

**Motion grammar** — 長い尾を引くイージング（power3 既定、跳ねるより滑らか）。ナレーションがないので、
**reveal を合わせる相手は崩壊のビート**（最初のヒット・マルチボール化・最後の1個）。各フレームの t=0 では
そのビートが既に起きたものだけを出し、残りはビートが来た瞬間に出す。front-load 禁止。

**Camera** — 盤面は**常に全体が見えたまま**。Frame 2 でごく緩やかに寄り（1.00→1.15）、Frame 3 で
戻す（1.15→1.00）。それ以外でカメラを動かさない。寄りは映像クリップに焼き込み済み
（HyperFrames は動画を host root に hoist するため、フレーム内の transform が効かない）。

寄りを強くしない理由: 1マスに寄せるとボールとパドルが画面外に出て、「ボールが草を割っている」
という因果そのものが消える。1080 幅でも 1 セルは約 16px あり、GitHub の実寸（10px）より大きいので、
寄らなくても日は数えられる。

**Rhythm** — 意図的に静止させるのは2箇所: Frame 1 の Scene 1（発射前）と Frame 4 の Scene 3（0 の余韻）。
この2つが静かであることが、Frame 3 の加速を効かせる。

**Counter** — 読めるのは Frame 1 の `3,089` と Frame 4 の `0` の両端だけ。その間は桁が読み取れない
速さで回り続ける。中間値は特定個人の contribution 数であって視聴者には意味がなく、読めてしまうと
Frame 1 で作った自分ごと感を壊す。

**Caption band** — 下 17%（約 184px）には何も置かない。キャプションは無効だが下端の一貫性のため空ける。

**Negative list** — スキャンライン・CRT 湾曲・グロー・ブラー・ビネット・独自パーティクル（録画内の
ものを除く）は使わない（DESIGN-VISUAL.md が明示的に禁止）。UI に緑を使わない。角丸と影を足さない
（broadside は flat plane / sharp corners）。front-load して固まるスライドショーにも、要素が各自
浮遊するスクリーンセーバーにもしない。

## Frame 1 — 素の草

- type: hook
- scene: 見慣れた contribution graph が暗い地に置かれ、その上に 3,089 が立ち上がる
- duration: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/01-intact.html
- blueprint: dataviz-countup (Adapt)
- focal: assets/board-intact.png
- roles: board-intact = background（**dim しない** — 草の階調が読めることが掴みの全て）
- asset_candidates: assets/board-intact.png
- asset_note: 録画 t=0.0 の無傷の盤面から草の帯だけを切り出した 1920x270

1 コマ目で「あ、俺の GitHub だ」と分からせるのが全て。X はミュート自動再生で 1 秒目に
止められるので、ここで説明を挟む余裕はない。**草は最初から本物**（@toshi0607 の 1 年分、
365 日 3,089 contributions）。パドルもボールも写さず、草の帯だけを切り出してあるので、
GitHub のプロフィールページを見ているのとほぼ同じ絵になる。

Adapt: count-up の signature は残す。ただしリングもチャートも出さない — 数字ひとつだけ。
数字が「積み上がる」方向に走ることで、動画後半でそれが逆走する対称構造ができる。

Scene 1 (0.0–0.7s): 草の帯だけが画面中央やや下に full-width strip で横いっぱい。完全な静止。
数字も文字もまだ出さない。「見慣れた草」以外の情報を 1 つも置かない。
Scene 2 (0.7–2.3s): 帯の上の空きに数字が 0 から 3,089 へ駆け上がる（value-scaled counter →
`counting-dynamic-scale`）。値が増えるにつれ字面も大きくなり、着地で最大。upper-third、画面幅の
約 55%。草は動かない。
Scene 3 (2.3–4.0s): 数字が止まり、その直下に「2025年に生やした草」が body ランプで薄く現れる。
以降ホールド。jitter も入れない — この静けさが Frame 2 の衝撃を作る。

## Frame 2 — 崩れる

- type: product_intro
- scene: ボールが飛び込んで最初のブロックが割れ、カウンターが初めて落ちる。同時にグリッドへ寄る
- duration: 4.5s
- transition_in: cut
- status: animated
- src: compositions/frames/02-break.html
- blueprint: compose
- focal: assets/play-break.mp4
- roles: play-break = background（**dim しない** — 盤面そのものが主役）
- asset_candidates: assets/play-break-zoom.mp4
- asset_note: 録画 t=0.25–4.75。クリップ内 t=0.52 で最初のブロックが割れる。1.00→1.15 の寄りを焼き込み済み

ここが転換点。静止していた草にアンバーのボールが飛び込み、ブロックが割れる。
**割れた瞬間にカウンターがガクッと落ちる**。数字と当たり判定が同期していることが、
この動画のすべての説得力を持っている。

Frame 1 が草の帯だけだったのに対し、ここで初めて盤面全体（パドルとボール）が入る。
「GitHub の草」から「ゲーム」への切り替わりが、フレームの切り替わりと一致する。

blueprint は当てない。実プレイ映像とカウンターが同一平面で動くショットで、既存のシェイプ
（video-text-pivot は映像が脇へ退く）とは構造が違う。

Scene 1 (0.0–0.5s): 引きに変わり盤面全体が入る。カウンターは `3,089` のまま upper-third に残る。
ボールが上昇中。
Scene 2 (0.5–1.7s): クリップ内 0.52s で最初のブロックが割れる。**同じフレームでカウンターが
ガクッと落ち**、そのまま桁が読めない速さで回り始める。映像側では緩やかな寄りが始まる（焼き込み済み）。
Scene 3 (1.7–3.1s): 寄りは続くが盤面全体は保たれたまま。ボール・パドル・落下アイテムと
崩れた穴が同時に見え、因果が読める。連続ヒットのたびにカウンターが跳ねる。
Scene 4 (3.1–4.5s): 「崩せます」が display ランプで hard-cut で 1 回だけ出る
（`discrete-text-sequence`）。盤面の下、キャプション帯の上。出たら動かさずホールド。

## Frame 3 — 加速

- type: feature_showcase
- scene: 連鎖的に崩れ、カウンターが加速して落ちていく。テキストなし
- duration: 6.5s
- transition_in: cut
- status: animated
- src: compositions/frames/03-cascade.html
- blueprint: compose
- focal: assets/play-cascade.mp4
- roles: play-cascade = background（dim しない）
- asset_candidates: assets/play-cascade-zoom.mp4
- asset_note: 録画 t=5.0–33.07 の 28.1 秒を 4.32 倍速で 6.5 秒に圧縮。1.15→1.00 の引きを焼き込み済み

動画でいちばん長く、いちばん気持ちのいい区間。**テキストを一切置かない**。
草が減り、数字が回る、それだけで持たせる。

加速は演出ではなくエンジンが生んだもの。序盤はボール 1 個で 1 個ずつしか崩せないが、
アイテムでマルチボールが増えると指数的に効き、終盤は 180 個近いボールが同時に盤面を舐める
（実測: t=20s で 9 個 / t=30s で 177 個）。4.32 倍速はその自然な加速をさらに押し上げるだけで、
崩壊のリズムを作っているのは実際のゲームの挙動。

Scene 1 (0.0–1.6s): 寄った状態から引き始める（pan / focus-lock → `viewport-change`）。
崩壊はまだ散発で、ボールは数個。
Scene 2 (1.6–4.2s): 引きながらマルチボールが増える。盤面の空きが目に見えて広がる。
カウンターは回り続ける。テキストは置かない。
Scene 3 (4.2–6.5s): 引き切って盤面全体が入る。残り数十個が一気に消える。カメラは止まり、
崩壊だけが動く。

## Frame 4 — ゼロ

- type: benefit_highlight
- scene: 盤面が空になり、カウンターが 0 で止まる。一拍の静止
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/frames/04-zero.html
- blueprint: dataviz-countup (Adapt)
- focal: assets/board-empty.png
- roles: board-empty = background（dim しない）
- asset_candidates: assets/board-empty.png
- asset_note: 録画 t=34.5 の空の帯。Frame 1 と同じ切り出し位置・同じ 1920x270

`3,089` が `0` になる。動きを全部止めて**一拍置く**のがこのフレームの仕事。
Frame 3 の加速からここへ落ちる落差が、動画のオチになる。

Adapt: Frame 1 のカウントアップの鏡像。**同じ位置・同じ字面で、今度は着地が 0**。
帯も Frame 1 と同一の切り出しなので、草が一本もない以外は完全に同じ絵になり、
「さっきまでここに 1 年分あった」が言葉なしで伝わる。

草が一本もない盤面は、開発者にとって一番見たくない絵でもある。その居心地の悪さは狙って残す
（自虐にはしない。あくまで「崩し切った」という達成として置く）。

Scene 1 (0.0–0.9s): 空の帯が Frame 1 とまったく同じ位置・同じ大きさで座る。カウンターはまだ回っている。
Scene 2 (0.9–1.7s): カウンターが `0` に着地して止まる（`counting-dynamic-scale`）。着地で一段大きく。
Scene 3 (1.7–3.5s): 完全静止。jitter も入れない。空の帯と `0` だけが残る。

## Frame 5 — CTA

- type: cta
- scene: 空になった盤面の粒が集まってタイトルロゴになり、URL が出る
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/frames/05-cta.html
- blueprint: logo-assemble-lockup (Adapt)
- focal: none（テキストのみ。映像は使わない）
- asset_candidates: none

Adapt: 「マークが画面上に存在するようになる」signature は残す。ただしロゴを組む部品は汎用の図形では
なく、**草のセルと同じ形・同じ緑階調の小さな四角**にする。崩れて消えたはずの草が集まってタイトルに
なる、という製品自身のシグネチャー（DESIGN-VISUAL.md「タイトルロゴが草でできている」）の引用。
素材を足さずに、今まで画面にあったものだけで締められるのが良いところ。

Scene 1 (0.0–1.3s): 空の帯の位置から草色の粒が中央へ集まり、「草崩し」の字形を組む
（cluster→outward expansion の逆走 → `center-outward-expansion`）。centered、画面幅の約 60%。
Scene 2 (1.3–2.3s): 字形が確定した直後、その下に細い罫線が引かれ、`kusakuzushi.toshi0607.com` が
fire-orange で現れる。
Scene 3 (2.3–3.5s): 「GitHubのユーザー名だけ」が body ランプで最後に現れてホールド。
キャプション帯の上に収める。

Chrome 拡張はストア未公開なので触れない。
