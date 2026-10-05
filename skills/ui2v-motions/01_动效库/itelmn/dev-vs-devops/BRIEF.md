---
workflow: general-video
flow: companion
storyboard: no
message: "So sánh Dev vs DevOps — góc 'Dev xây, DevOps vận hành' cho series 'so sánh/phân biệt kiến thức'"
destination: tiktok
aspect: 1080x1920
language: vi
length: 15-20s
---

## Intent

Video thứ hai trong series "so sánh/phân biệt kiến thức" (xem `../../DESIGN.md` cho hợp đồng
layout/màu/font/motion 3-zone dùng chung — **không lặp lại ở đây**, chỉ đổi nội dung).

Cặp khái niệm: **Dev vs DevOps**. Góc so sánh: Dev là người viết code / xây tính năng; DevOps
là người đưa code đó lên môi trường thực tế, tự động hoá và giám sát — "Dev xây, DevOps vận
hành".

## Assets

- Icon 2 card: vẽ CSS/SVG placeholder (không phụ thuộc ảnh ngoài) — trái = cửa sổ terminal với
  glyph `</>` (đại diện Dev/viết code), phải = vòng lặp vô cực SVG (đại diện DevOps/CI-CD liên
  tục).
- Giọng đọc: Vbee TTS (giọng `n_hanoi_male_protrainer_education_vc`, speed 1.1x), sinh qua
  `scripts/generate-vo.mjs` (đọc `VBEE_APP_ID`/`VBEE_ACCESS_TOKEN` từ `.env` ở **repo root**,
  dùng chung với video khác trong series). 8 clip mp3 tại `assets/vo/line-N.mp3`, thời lượng
  thật ghi ở `assets/vo/durations.json`. Nhịp caption/pose/emphasis trong `index.html` bám theo
  các mốc `[start, start+duration]` thật của từng clip.

## Customizations

Không có tuỳ biến khác biệt với template — kế thừa nguyên vẹn từ `DESIGN.md` và từ
`videos/thien-thach-vs-sao-bang/BRIEF.md` (video đầu tiên của series).

## Notes

- Kịch bản 8 dòng: hook (Dev / DevOps) → nút thắt (khác nhau là gì?) → giải Dev (2 dòng) →
  giải DevOps (2 dòng) → payoff (1 dòng, giữ khung hình tới hết).
