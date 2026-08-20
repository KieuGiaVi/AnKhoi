# Rule: Ghi Nhật ký Thay đổi (Changelog)

Mọi agent (Antigravity) khi hoàn thành 1 task có thay đổi file trong repo
(scaffold, thêm module, sửa logic, sửa bug...) PHẢI cập nhật
`docs/CHANGELOG.md` như bước cuối cùng của task đó — không cần người dùng
nhắc lại mỗi lần.

## Khi nào ghi log
- Sau khi hoàn thành 1 plan đã được người dùng Approve và verify xong
  (build/test qua).
- Không ghi log cho các bước dò lỗi, thử nghiệm tạm thời, hoặc câu hỏi/trả lời
  thuần túy không đổi file.
- Nếu 1 task bị làm lại/sửa lại do review phát hiện vấn đề, KHÔNG sửa mục log
  cũ — thêm 1 mục log mới, ghi rõ trong phần "Yêu cầu" là thay thế/bổ sung cho
  mục ngày nào.

## Định dạng 1 mục log (thêm vào ĐẦU file, ngay dưới dòng mô tả, mục mới nhất luôn nằm trên cùng)

```markdown
## [YYYY-MM-DD] <Tên phạm vi ngắn gọn — vd: "Backend — Module appointment">
- **Phạm vi:** <thư mục/module bị ảnh hưởng>
- **Yêu cầu:** <tóm tắt 1-2 câu task được giao>
- **File chính thay đổi:** <liệt kê file mới/sửa quan trọng, không cần liệt kê hết file phụ trợ nhỏ>
- **Kiểm thử:** <lệnh đã chạy + kết quả — build/test pass hay fail>
- **Review phát hiện & đã sửa:** <nếu có vấn đề bị phát hiện lúc review và đã sửa, ghi ngắn gọn — nếu không có, ghi "Không phát sinh vấn đề">
- **Trạng thái:** <✅ Đã duyệt & commit / ⏳ Chờ xác nhận / ❌ Bị từ chối, cần làm lại>
```

## Nguyên tắc
- Dùng ngày thực tế lúc hoàn thành task (không phải ngày task được giao).
- Viết ngắn gọn, đủ để người đọc sau này (kể cả không có mặt lúc code) hiểu
  được đã làm gì và tại sao — đây cũng là tư liệu dùng cho báo cáo đồ án.
- Không copy nguyên văn diff code vào log — chỉ tên file và mô tả ngắn.
- File này CHỈ ghi log, không phải nơi để lưu quyết định thiết kế lâu dài
  (quyết định thiết kế thuộc về SRS hoặc các rule file khác).
