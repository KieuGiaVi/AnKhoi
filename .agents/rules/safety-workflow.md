# Rule: An toàn thao tác & Quy trình làm việc

Antigravity có thể tự chạy chuỗi hành động dài (auto-continue) không dừng lại
hỏi — nên các giới hạn dưới đây bắt buộc áp dụng, không phải gợi ý.

## Giới hạn cứng — không tự ý làm nếu chưa hỏi
- Không xóa file/thư mục ngoài phạm vi task đang làm.
- Không chạy lệnh xóa dữ liệu (`drop`, `deleteMany` không filter, reset DB)
  kể cả trên môi trường dev, trừ khi được yêu cầu rõ ràng trong task.
- Không tự ý sửa `.env`, khóa API thật, thông tin Sandbox thanh toán.
- Không tự ý cài thêm package ngoài package.json/pubspec.yaml hiện có mà
  không nêu lý do và xin xác nhận.
- Không tự mở rộng scope: nếu task yêu cầu sửa module A nhưng phát hiện cần
  sửa cả module B để chạy được, dừng lại báo cáo thay vì tự sửa luôn B.

## Git & Commit
- Mỗi module/feature khi hoàn thành 1 đơn vị công việc → 1 commit riêng,
  message rõ ràng dạng `feat(<module>): <mô tả>` / `fix(<module>): <mô tả>`.
- Không commit trực tiếp lên `main` — làm trên branch theo module
  (`feature/appointment`, `feature/wallet`...).
- Không commit file `.env`, file build, `node_modules/`.

## Testing (bắt buộc tối thiểu)
Viết test cho các nhánh logic có rủi ro sai lệch nghiệp vụ, tối thiểu:
- Khóa slot & nhả slot khi hết hạn.
- Chính sách hủy lịch/hoàn tiền (3 mốc thời gian).
- Cảnh báo dị ứng hard-stop + luồng override có ghi AuditLog.
- Bóc tách hóa đơn BHYT/bệnh nhân trả.
- Trừ/hoàn tiền Ví tạm ứng (đường happy path — không cần test race condition
  vì đã ngoài phạm vi đồ án).

## Khi agent không chắc chắn
Nếu 1 yêu cầu nghiệp vụ không khớp với SRS hoặc thiếu thông tin để quyết định
(ví dụ: mức phí giữ chỗ hủy lịch là bao nhiêu %), DỪNG LẠI và hỏi người dùng.
Không tự chọn 1 con số hợp lý rồi code tiếp.
