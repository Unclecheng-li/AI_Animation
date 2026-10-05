---
workflow: general-video
flow: companion
storyboard: no
message: "Format 'so sánh/phân biệt kiến thức' viral cho TikTok/Reels — nhận diện 2 khái niệm hay bị nhầm, hook nhanh, giải quyết tò mò trong 15-20s"
destination: tiktok
aspect: 1080x1920
language: vi
length: 15-20s per topic
---

## Intent

Một **template tái sử dụng** cho một kênh video giáo dục ngắn dạng "so sánh/phân biệt kiến thức"
trên TikTok/Reels/Facebook Reels. Mỗi video trong series lấy một cặp khái niệm hay bị nhầm
(ví dụ: Thiên thạch vs Sao băng, Vi khuẩn vs Virus, Biển vs Đại dương...) và giải thích khác
biệt cốt lõi trong 15-20 giây. Giọng điệu: nhanh, tò mò, giáo dục nhẹ nhàng, không nghiêm túc quá.

Layout cố định 3 phần (không đổi giữa các video, chỉ nội dung/ảnh/audio thay đổi):

- **Nửa trên**: 2 ảnh minh họa tĩnh đặt cạnh nhau — trái = khái niệm A, phải = khái niệm B.
- **Giữa**: caption chạy động theo lời thoại, từ khóa quan trọng tô màu đỏ nổi bật.
- **Nửa dưới**: avatar 2D MC (nhân vật hoạt hình đơn giản) đổi giữa các pose — chỉ tay trái,
  chỉ tay phải, nhún vai thắc mắc, chỉ tay giải thích — đồng bộ với nhịp lời thoại. Không lipsync
  âm vị thật; chỉ có "mấp máy môi" 2 frame đơn giản nếu có sẵn ảnh miệng mở/đóng.

Nhịp kịch bản chuẩn (mỗi topic ~15-20s):

1. 0–2s **Hook**: "Đây là [A]" / "Đây là [B]" — nhận diện nhanh, 2 ảnh xuất hiện.
2. 2–4s **Nút thắt**: "Sự khác nhau là gì?" — MC nhún vai, caption câu hỏi.
3. 4–8s **Giải A**: định nghĩa siêu ngắn cho A, MC chỉ tay trái.
4. 8–12s **Giải B**: định nghĩa siêu ngắn cho B, nhấn khác biệt cốt lõi, MC chỉ tay phải.
5. 12s+ **Outro nhẹ**: giữ khung hình, không cần logo/CTA cầu kỳ cho bản demo.

## Assets

- Ảnh minh họa A/B: người dùng sẽ cung cấp cho từng topic thật; demo dùng placeholder vẽ
  bằng CSS/SVG (thiên thạch vs sao băng) để không phụ thuộc file ngoài.
- Avatar MC 4 pose: người dùng sẽ cung cấp ảnh nhân vật thật sau; demo dùng nhân vật 2D vẽ
  bằng CSS/SVG với animation xoay tay/nhún vai để mô phỏng 4 pose.
- Giọng đọc: Vbee TTS (giọng `n_hanoi_male_protrainer_education_vc`, speed 1.1x), sinh qua
  `scripts/generate-vo.mjs` (đọc `VBEE_APP_ID`/`VBEE_ACCESS_TOKEN` từ `.env`, theo hướng dẫn
  API trong `vbee.md`). 8 clip mp3 tại `assets/vo/line-N.mp3`, thời lượng thật ghi ở
  `assets/vo/durations.json`. Toàn bộ nhịp caption/pose/emphasis trong `index.html` bám theo
  các mốc `[start, start+duration]` thật của từng clip — không còn ước lượng.

## Customizations

- Caption: highlight từ khóa bằng màu đỏ (`--accent-red`), chạy theo dòng, không chạy từng
  chữ (word-by-word) để giữ tốc độ đọc nhanh phù hợp định dạng 15-20s.
- Layout 3 phần là **hợp đồng cố định của template** — khi nhân bản cho topic mới, chỉ thay
  nội dung text, 2 ảnh, audio và giữ nguyên cấu trúc composition.

## Notes

- Đây là composition mẫu đầu tiên của template; mục tiêu là chứng minh đúng layout + nhịp +
  phong cách để nhân bản, không phải video final để publish ngay.
- Không dùng TTS/nhạc nền qua `/media-use` cho phần thoại chính (Vbee ngoài luồng); có thể
  dùng `/media-use` sau này cho SFX pop/whoosh nếu người dùng muốn.
