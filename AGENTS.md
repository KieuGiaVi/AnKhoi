# AGENTS.md — HCare+ (Đồ án Tốt nghiệp)

Đây là ngữ cảnh gốc mà mọi agent (Antigravity, Claude Code...) phải đọc trước khi
thực hiện bất kỳ tác vụ nào trong repo này. Các rule chi tiết theo từng mảng nằm
tại `.agents/rules/*.md` — đọc file tương ứng trước khi động vào phần đó.

## Dự án là gì
HCare+ — ứng dụng hỗ trợ quản lý Phòng khám An Khởi. Đồ án tốt nghiệp, phạm vi
theo tài liệu `docs/SRS_HCare+_v1.3.md` (nguồn sự thật duy nhất cho nghiệp vụ —
nếu code và SRS lệch nhau, SRS thắng, phải hỏi lại người dùng trước khi tự suy diễn).

## Kiến trúc tổng thể
- `mobile_app/` — Flutter, dành cho Bệnh nhân.
- `web_dashboard/` — ReactJS, dành cho Lễ tân/Bác sĩ/KTV/Dược sĩ/Admin.
- `backend/` — Node.js + Express + MongoDB (Mongoose), kiến trúc **modular monolith**
  chia theo domain, KHÔNG viết theo kiểu MVC dồn hết vào 3 thư mục controllers/
  models/routes chung. Mỗi domain là 1 module độc lập, tự chứa route–controller–
  service–model–validation của riêng nó.
- Giao tiếp real-time qua Socket.io ở mức cơ bản (best-effort), nguồn sự thật về
  trạng thái luôn là bản ghi `Notification` trong DB — không bao giờ tin tưởng
  tuyệt đối kênh socket.

## 6 Actor chính (map trực tiếp sang module & thư mục feature)
Bệnh nhân, Bác sĩ, Lễ tân, Kỹ thuật viên CLS, Dược sĩ, Quản trị viên.
Xem chi tiết trách nhiệm từng actor tại SRS Mục 1.3 và Mục 3.

## 13 Entity chuẩn (không tự ý đổi tên, không tự ý thêm field ngoài SRS)
User, PatientProfile, Ingredient, Medicine, Service, Appointment,
Wallet & Transaction, MedicalRecord, LabOrder & Result, Prescription,
Invoice, Notification, AuditLog.
Field chi tiết từng entity: xem `.agents/rules/database.md`.

## Nguyên tắc làm việc bắt buộc
1. Trước khi tạo/sửa code ở mảng nào, đọc rule file tương ứng trong `.agents/rules/`.
2. Không tự ý mở rộng phạm vi — mọi tính năng nằm trong bảng "Ngoài phạm vi" của
   SRS Mục 2 và Mục 8 (Medical Override, Interleaving Queue, DICOM Viewer,
   Chunked Upload, Row-level lock cho Ví, BHYT fallback thật...) TUYỆT ĐỐI
   KHÔNG cài đặt trừ khi được yêu cầu rõ ràng.
3. Mỗi module backend phải độc lập: xóa 1 module không được làm vỡ module khác
   trừ quan hệ dữ liệu đã khai báo rõ (ref).
4. Không tự động chạy migrate/seed production hoặc xoá dữ liệu mà không hỏi.
5. Luôn viết test tối thiểu cho logic nghiệp vụ có nhánh rẽ (cảnh báo dị ứng,
   bóc tách hóa đơn, khóa slot, chính sách hoàn tiền).
6. Khi không chắc một quyết định thiết kế, dừng lại và hỏi thay vì đoán.
