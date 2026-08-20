# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## HCare+ — Ứng dụng hỗ trợ quản lý Phòng khám An Khởi
**Phiên bản:** Đồ án Tốt nghiệp v1.3 (Bản Chốt Hạ - Final Cut)
**Mô hình kiến trúc:** Client-Server (Flutter Mobile App & Node.js/MongoDB Backend)

> Tài liệu này được giới hạn phạm vi để phù hợp với quy mô thực tế của một đồ án
> tốt nghiệp (1–3 sinh viên, 12–16 tuần). Các cơ chế vận hành phức tạp đòi hỏi hạ
> tầng lớn đã được lược bỏ và chuyển sang phần định hướng phát triển tương lai.

---

## 1. Giới thiệu tổng quan

### 1.1. Mục tiêu hệ thống
Xây dựng hệ thống số hóa quy trình vận hành phòng khám ở mức vừa đủ để chứng minh
tính khả thi kỹ thuật. Triển khai luồng khép kín từ đặt lịch đến lưu hồ sơ điện
tử. Tích hợp AI phân tích triệu chứng để tạo điểm nhấn công nghệ.

### 1.2. Công nghệ triển khai
- **Mobile App:** Flutter cho phân hệ Bệnh nhân.
- **Web Dashboard:** ReactJS cho nhân viên phòng khám.
- **Backend & Cơ sở dữ liệu:** Node.js/Express + MongoDB (Mongoose ODM).
- **Lưu trữ Cloud:** Firebase Storage hoặc AWS S3 (Free Tier) cho file y khoa.
- **Real-time:** Socket.io ở mức cơ bản để thông báo kết quả.

---

## 2. Bảng Phân Định Phạm Vi (Scoping)

| Phân hệ / Nghiệp vụ | Trong phạm vi (Tiến hành cài đặt) | Ngoài phạm vi (Hướng phát triển mở rộng) |
|---|---|---|
| Quản lý Hàng chờ | Xếp hàng FIFO cơ bản theo giờ check-in. Lễ tân chủ động xếp slot bằng tay. | Thuật toán Xen kẽ (Interleaving Queue), Auto Re-queue, Cờ Cấp cứu (Emergency Flag). |
| Thanh toán & Ví | Nạp ví qua Sandbox, trừ phí tự động. Hoàn tiền khi hủy lịch hợp lệ. | Tạm ứng treo (Medical Override), nạp hộ tại quầy. Khóa giao dịch mức bản ghi. |
| Bảo hiểm Y tế | Tính mức hưởng bằng dữ liệu Mock. Bóc tách hóa đơn 2 dòng cơ bản. | Kết nối API quốc gia thật, cơ chế fallback/đối soát tự động. |
| Lưu trữ & File | Upload file lên Cloud Storage và truy xuất qua Presigned URL. | Upload phân đoạn (Chunked Upload), cấu phần DICOM Viewer chuyên dụng. |
| Real-time | Thông báo qua Socket.io + lưu bản ghi Notification trong DB. | Cơ chế đảm bảo truyền tải nâng cao khi mất kết nối kéo dài. |

---

## 3. Đặc tả chức năng theo phân hệ

### 3.1. Phân hệ Bệnh nhân (Mobile App)
- **Tài khoản & Hồ sơ:** Đăng ký, đăng nhập qua OTP. Cập nhật chỉ số sinh tồn và
  tiền sử dị ứng theo danh mục Hoạt chất (không nhập tự do).
- **Trợ lý ảo (AI Chatbot):** Bệnh nhân mô tả triệu chứng; AI gợi ý chuyên khoa
  phù hợp. Yêu cầu xác nhận màn hình Miễn trừ trách nhiệm (Disclaimer) trước khi
  sử dụng.
- **Đặt lịch khám:** Chọn dịch vụ → bác sĩ → slot thời gian → chọn hình thức
  khám (BHYT/Dịch vụ). Slot thời gian bị khóa tạm thời (5 phút) ở bước thanh
  toán để chống đặt trùng.
- **Chính sách hủy lịch & Hoàn tiền:**
  - Hủy trước 24 giờ: Tự động hoàn 100% tiền vào Ví.
  - Hủy trong khoảng 2–24 giờ: Trừ phí giữ chỗ theo cấu hình, hoàn phần còn lại.
  - Không đến khám (No-show): Không hoàn tiền, lưu vết lịch sử để Admin thống kê.
- **Thanh toán Tạm ứng:** Nạp tiền Ví tạm ứng qua ZaloPay Sandbox, tự động trừ
  tiền khi phát sinh phí (CLS, mua thuốc).
- **Bệnh án Điện tử (EMR):** Xem lịch sử khám và tải file kết quả qua Presigned
  URL có thời hạn cứng.

### 3.2. Phân hệ Bác sĩ (Web/Tablet)
- **Khám & Chỉ định:** Ghi nhận triệu chứng, mã bệnh ICD. Tạo lệnh Cận lâm sàng.
- **Nhận kết quả:** Nhận thông báo Real-time khi có kết quả CLS mới. Lưu trạng
  thái "chưa đọc/đã đọc" để không bỏ sót. Xem ảnh JPG/PDF kết quả bằng trình
  duyệt mặc định.
- **Kê đơn thuốc:** Hệ thống hiển thị cảnh báo chéo (hard-stop) nếu kê thuốc
  chứa hoạt chất bệnh nhân dị ứng. Bác sĩ phải ghi chú lý do chuyên môn nếu
  muốn bỏ qua cảnh báo này (lưu Audit Log).

### 3.3. Phân hệ Lễ tân (Web Dashboard)
- **Check-in:** Quét mã QR check-in trong khung giờ cho phép (trước 30 phút).
- **Điều phối luồng:** Tạo hồ sơ tạm (đánh dấu là tài khoản khách/tạm thời) cho
  khách Walk-in, thao tác chỉ định vào các slot thời gian trống hiện tại một
  cách thủ công.
- **Thu ngân:** Bóc tách hóa đơn thành dòng BHYT chi trả và dòng Bệnh nhân chi
  trả. Đối với khách Walk-in (hồ sơ tạm), thực hiện thu tiền mặt trực tiếp theo
  hóa đơn mà không cần thông qua Ví tạm ứng. In hóa đơn xác nhận.

### 3.4. Phân hệ Kỹ thuật viên (Web/Tablet)
- **Cập nhật kết quả:** Upload file kết quả (JPG/PDF) lên hệ thống. File được
  mã hóa và lưu trữ tại Cloud Storage.
- **Hoàn tất ca chụp:** Bấm "Hoàn tất" để lưu URL kết quả vào Database, đồng
  thời trigger luồng thông báo Socket.io gửi tới Bác sĩ chỉ định.

### 3.5. Phân hệ Dược sĩ (Web/Tablet)
- **Cấp phát:** Quét mã đơn thuốc, xác nhận cấp phát và tự động trừ số lượng
  tồn kho (Inventory).
- **Trực quan hóa:** Giao diện phân tách rành mạch "Thuốc BHYT" và "Thuốc Dịch
  vụ" để tránh cấp phát nhầm nguồn.

### 3.6. Phân hệ Quản trị viên (Web Dashboard)
- **Ma trận Phân quyền (RBAC):**
  - Admin: Toàn quyền quản lý hệ thống.
  - Bác sĩ: Xem/sửa hồ sơ khám bệnh, kê đơn, chỉ định CLS.
  - Lễ tân: Quản lý lịch hẹn, check-in, hóa đơn.
  - KTV: Xem lệnh CLS, upload kết quả.
  - Dược sĩ: Xem đơn thuốc, xuất kho.
- **Danh mục hệ thống:** Quản lý chuyên khoa, bác sĩ, danh mục thuốc (Medicine)
  và danh mục hoạt chất dị ứng (Ingredient). Cấu hình Bảng giá kép (Giá Dịch vụ
  & Giá Cơ sở BHYT).
- **Báo cáo & Audit Log:** Xem báo cáo doanh thu cơ bản. Xem lịch sử (Audit Log)
  các thao tác nhạy cảm: Bác sĩ bỏ qua cảnh báo dị ứng, thao tác hoàn tiền của
  lễ tân.

---

## 4. Mô hình dữ liệu tổng quát (MongoDB Entities)

| Entity (Collection) | Mô tả & Trường dữ liệu chính |
|---|---|
| User | `_id, ho_ten, email, mat_khau_hash, role, is_temp, chuyen_khoa, trang_thai` |
| PatientProfile | `user_id, chi_so_sinh_ton, ma_the_bhyt, muc_huong, danh_sach_di_ung (ref Ingredient)` |
| Ingredient | Danh mục hoạt chất chuẩn, dùng cho khai báo dị ứng |
| Medicine | `_id, ten_thuoc, hoat_chat (ref Ingredient), ton_kho, gia_dich_vu, gia_bhyt` |
| Service | `_id, ten_dich_vu, loai (Kham/CLS), gia_dich_vu, gia_bhyt` |
| Appointment | `patient_id, doctor_id, service_id, slot_time, hinh_thuc (BHYT/Dịch vụ), trang_thai (Pending_Payment/Booked/Checked-in/Cancelled/No-show)` |
| Wallet & Transaction | `patient_id, so_du, lich_su_giao_dich (Nạp/Trừ phí/Hoàn tiền)` |
| MedicalRecord | `patient_id, appointment_id, chan_doan_icd, trieu_chung` |
| LabOrder & Result | `record_id, loai_cls, trang_thai, file_url, thoi_gian_hoan_tat` |
| Prescription | `record_id, danh_sach_thuoc (ref Medicine), lieu_dung, trang_thai_cap_phat` |
| Invoice | `appointment_id, tong_tien, dong_bhyt_tra, dong_benh_nhan_tra, trang_thai` |
| Notification | `user_id, noi_dung, loai_su_kien, trang_thai_doc (Read/Unread)` |
| AuditLog | `user_id, hanh_dong, doi_tuong_tac_dong, ly_do, timestamp` |

---

## 5. Yêu cầu phi chức năng (NFR)

- **5.1. Hiệu năng:** Thời gian phản hồi API trung bình dưới 1 giây trong điều
  kiện demo. Hệ thống hoạt động ổn định với 20–30 người dùng thao tác đồng thời.
- **5.2. Bảo mật:** Mật khẩu được băm (hash) bằng bcrypt. Tất cả API yêu cầu
  xác thực JWT. Toàn bộ giao tiếp Client–Server được mã hóa qua kênh truyền
  HTTPS/TLS. Có màn hình xin sự đồng ý (consent) khi thu thập dữ liệu y tế
  cá nhân.
- **5.3. Khả năng sử dụng (Usability):**
  - Mobile App (Bệnh nhân): UI tối ưu màn hình dọc, thao tác vuốt/chạm đơn giản.
  - Web Dashboard (Nhân viên): UI dạng Admin Panel tối ưu màn hình ngang
    (Tablet/PC). Vùng chạm thao tác trên Tablet tối thiểu 44×44px.
- **5.4. Khả dụng & Sao lưu:** Cho phép xuất (dump) dữ liệu MongoDB thủ công
  trước các buổi demo/báo cáo tiến độ.

---

## 6. Kế hoạch triển khai (Timeline dự kiến 14–16 tuần)

| Giai đoạn | Tuần | Nội dung thực hiện chính |
|---|---|---|
| 1. Phân tích & Thiết kế | 1–2 | Chốt đặc tả yêu cầu, thiết kế ERD chi tiết, vẽ Wireframe/Figma UI |
| 2. Dựng nền tảng Base | 3–4 | Dựng Backend (Auth, JWT, RBAC), thiết lập MongoDB, khởi tạo project Flutter/React |
| 3. Phân hệ Bệnh nhân | 5–7 | Code luồng Tài khoản, Đặt lịch hẹn, Tích hợp Sandbox thanh toán, AI Chatbot |
| 4. Phân hệ Nhân sự | 8–10 | Code Dashboard Lễ tân (Check-in), Bác sĩ (Khám, Kê đơn), KTV (Upload kết quả) |
| 5. Dược sĩ & Admin | 11–12 | Code Quản lý tồn kho, Cấp phát thuốc, Báo cáo và Audit Log |
| 6. Tích hợp & Testing | 13–14 | Tích hợp end-to-end, test các luồng ngoại lệ (Hủy lịch, Cảnh báo dị ứng) |
| 7. Đóng gói & Báo cáo | 15–16 | Viết cuốn Báo cáo đồ án, chuẩn bị slide và kịch bản demo chạy thật |

---

## 7. Tiêu chí nghiệm thu (Definition of Done)

Đồ án được xem là hoàn thành phần cài đặt khi chạy trơn tru kịch bản demo
(không có bug nghiêm trọng) sau:

1. Bệnh nhân tạo tài khoản, nạp tiền Sandbox thành công và đặt lịch (bao gồm
   bước chọn BHYT/Dịch vụ). Bệnh nhân thao tác hủy lịch hợp lệ và được hoàn
   tiền.
2. Lễ tân check-in thành công một bệnh nhân đã đặt lịch, và tạo thành công hồ
   sơ tạm cho khách Walk-in.
3. Bác sĩ gọi khám, cố tình kê thuốc chứa hoạt chất dị ứng → Hệ thống chặn lại
   (Hard-stop).
4. KTV upload kết quả dạng PDF lên Cloud → Pop-up thông báo (Notification)
   hiện ngay trên màn hình bác sĩ.
5. Dược sĩ xuất thuốc thành công, Invoice thu tiền chính xác. Admin xem được
   báo cáo doanh thu và Audit Log.

---

## 8. Hướng phát triển mở rộng (Future Scope)

Để bảo vệ tư duy hệ thống trước hội đồng, các tính năng doanh nghiệp sau được
định hướng phát triển ở tương lai (**không cài đặt trong đồ án này**):

- **Thuật toán Hàng chờ nâng cao:** Xếp hàng xen kẽ (Interleaving Queue) để tự
  động hóa tính toán thời gian chờ giữa khách Online và Walk-in. Tính năng
  Auto Re-queue.
- **Bảo vệ tài chính & Y khoa:** Cờ "Cấp cứu" và "Tạm ứng treo" (Medical
  Override) để ưu tiên xử lý bệnh nhân khẩn cấp mà không bị chặn bởi Ví thanh
  toán. Khóa bản ghi (Row-level lock) chống Race Condition cho Ví.
- **Hạ tầng y tế sâu:** Upload phân đoạn (Chunked Upload) cho file X-quang
  dung lượng lớn. Tích hợp thư viện DICOM Viewer (Cornerstone.js) chuyên dụng.
- **Mở rộng sinh trắc học:** Ứng dụng IoT kết nối trực tiếp với máy đo huyết
  áp, nhịp tim tại phòng khám để đẩy thẳng chỉ số sinh tồn vào EMR của bệnh
  nhân.
