# Rule: Mô hình dữ liệu (MongoDB / Mongoose)

Nguồn sự thật: SRS Mục 4. Đây là danh sách entity CHUẨN — không tự thêm bớt field,
không tự đổi tên collection. Nếu thấy thiếu field cần cho 1 tính năng, DỪNG LẠI
và hỏi thay vì tự bổ sung.

| Collection | Field chính |
|---|---|
| User | _id, ho_ten, email, mat_khau_hash, role, is_temp, chuyen_khoa, trang_thai |
| PatientProfile | user_id, chi_so_sinh_ton, ma_the_bhyt, muc_huong, danh_sach_di_ung (ref Ingredient) |
| Ingredient | danh mục hoạt chất chuẩn |
| Medicine | _id, ten_thuoc, hoat_chat (ref Ingredient), ton_kho, gia_dich_vu, gia_bhyt |
| Service | _id, ten_dich_vu, loai (Kham/CLS), gia_dich_vu, gia_bhyt |
| Appointment | patient_id, doctor_id, service_id, slot_time, hinh_thuc (BHYT/Dịch vụ), trang_thai (Pending_Payment/Booked/Checked-in/Cancelled/No-show) |
| Wallet & Transaction | patient_id, so_du, lich_su_giao_dich (Nạp/Trừ phí/Hoàn tiền) |
| MedicalRecord | patient_id, appointment_id, chan_doan_icd, trieu_chung |
| LabOrder & Result | record_id, loai_cls, trang_thai, file_url, thoi_gian_hoan_tat |
| Prescription | record_id, danh_sach_thuoc (ref Medicine), lieu_dung, trang_thai_cap_phat |
| Invoice | appointment_id, tong_tien, dong_bhyt_tra, dong_benh_nhan_tra, trang_thai |
| Notification | user_id, noi_dung, loai_su_kien, trang_thai_doc (Read/Unread) |
| AuditLog | user_id, hanh_dong, doi_tuong_tac_dong, ly_do, timestamp |

## Quy tắc thiết kế schema
- Mỗi entity ở bảng trên = đúng 1 file `*.model.js` trong module tương ứng
  (xem `architecture.md` để biết entity nào thuộc module nào).
- `Wallet & Transaction` là 2 collection liên kết: `Wallet` (số dư hiện tại) và
  `Transaction` (lịch sử) — KHÔNG gộp lịch sử giao dịch làm mảng con phình to
  trong document `Wallet` (tránh document quá lớn, khó phân trang).
- `LabOrder & Result` tương tự: có thể tách `LabOrder` (lệnh chỉ định) và
  `LabResult` (kết quả trả về) nếu 1 lệnh có thể có nhiều lần trả kết quả —
  nhưng phải giữ liên kết 1-1 hoặc 1-n rõ ràng bằng `record_id`.
- Toàn bộ timestamp dùng `createdAt/updatedAt` mặc định của Mongoose
  (`{ timestamps: true }`), không tự đặt tên field ngày giờ khác nhau giữa
  các collection.
- Trường tiền tệ (so_du, gia_dich_vu, gia_bhyt, tong_tien...) lưu dạng số
  nguyên (đơn vị VNĐ), không dùng float để tránh sai số làm tròn.
- `AuditLog` là collection append-only — không viết code cho phép
  update/delete bản ghi AuditLog từ bất kỳ API nào.
- Không tạo thêm collection ngoài danh sách trên nếu chưa xác nhận với
  người dùng — kể cả khi có vẻ "tiện" (ví dụ tách thêm collection Log riêng
  cho từng module).
