# Rule: Kiến trúc & Cấu trúc thư mục (Modular)

Áp dụng cho toàn repo. Mục tiêu: mỗi module tự chứa, dễ tái sử dụng, dễ xoá/thay
thế mà không ảnh hưởng module khác.

## Backend — modular monolith theo domain

```
backend/
  src/
    config/                # env, kết nối DB, hằng số toàn cục
    common/                 # DÙNG CHUNG cho mọi module — KHÔNG chứa logic nghiệp vụ
      middlewares/          # auth.middleware, error.middleware, rbac.middleware
      utils/                 # response wrapper, date helper...
      errors/                # AppError, các mã lỗi chuẩn
    modules/
      auth/                  # đăng ký/đăng nhập OTP, JWT
      users/                 # User, PatientProfile, hồ sơ tạm walk-in
      catalog/               # Ingredient, Medicine, Service, Bảng giá kép
      appointment/           # Appointment, slot locking 5 phút, hủy lịch/hoàn tiền
      wallet/                # Wallet & Transaction, nạp/trừ/hoàn
      insurance/             # Logic tính mức hưởng BHYT (mock)
      medical-record/        # MedicalRecord, khám & chỉ định
      lab/                   # LabOrder & Result, upload file KTV
      prescription/          # Prescription, cảnh báo dị ứng hard-stop
      pharmacy/              # Cấp phát thuốc, trừ tồn kho
      billing/                # Invoice, bóc tách BHYT/bệnh nhân trả
      notification/           # Notification model + Socket.io gateway
      audit/                  # AuditLog — ghi từ middleware dùng chung
      admin/                  # RBAC config, báo cáo doanh thu
    routes/                  # gom router của từng module lại thành 1 router gốc
    app.js
    server.js
  tests/
    <tên module>/            # test mirror đúng cấu trúc modules/
```

### Quy tắc bên trong 1 module (bắt buộc, đặt tên nhất quán)
```
modules/<ten-module>/
  <ten-module>.model.js       # Mongoose schema — đúng field đã khai báo ở database.md
  <ten-module>.service.js     # logic nghiệp vụ thuần, KHÔNG import Express req/res
  <ten-module>.controller.js  # nhận req/res, gọi service, KHÔNG chứa business logic
  <ten-module>.routes.js      # khai báo endpoint, gắn middleware
  <ten-module>.validation.js  # schema validate input (Joi/Zod/express-validator)
  index.js                    # export routes + (nếu cần) service cho module khác import
```

### Nguyên tắc giao tiếp giữa các module
- Module A muốn dùng logic của module B → import từ `modules/B/index.js`,
  KHÔNG bao giờ import thẳng vào file nội bộ (`B/b.service.js`) của module khác.
- Không có "God service" gọi trực tiếp vào model của module khác. Nếu cần dữ
  liệu chéo module, gọi qua service được export công khai.
- `audit/` không bị module khác gọi trực tiếp để ghi log — dùng 1 hàm
  `logAudit()` export sẵn, gọi từ middleware chung hoặc từ service khi cần.

## Frontend Web (React) — feature-based

```
web_dashboard/
  src/
    app/                # routing, layout tổng, providers
    shared/             # component dùng chung, hooks, api client (axios instance)
    features/
      auth/
      reception/        # Lễ tân: check-in, walk-in, thu ngân
      doctor/           # Bác sĩ: khám, kê đơn, nhận kết quả
      lab/               # KTV: upload kết quả
      pharmacy/          # Dược sĩ: cấp phát
      admin/             # Quản trị: danh mục, báo cáo, audit log
```
Mỗi thư mục trong `features/` tự chứa `components/`, `hooks/`, `api.js`,
`pages/` riêng — không dùng chung state ngoài phạm vi feature trừ khi qua
`shared/`.

## Mobile App (Flutter) — feature-based

```
mobile_app/
  lib/
    core/              # network client, theme, constants, DI
    shared/            # widget dùng chung, utils
    features/
      auth/
      profile/          # hồ sơ sức khỏe, dị ứng
      booking/           # đặt lịch, slot
      wallet/             # ví tạm ứng
      chatbot/            # AI gợi ý chuyên khoa
      emr/                 # xem hồ sơ bệnh án, kết quả CLS
```

## Khi tạo module/feature mới
1. Copy đúng khung thư mục ở trên, không tự sáng tạo cấu trúc khác.
2. Đặt tên file/thư mục bằng tiếng Anh, kebab-case cho thư mục, camelCase cho biến.
3. Nếu 1 tính năng cần sửa > 2 module cùng lúc, dừng lại báo cho người dùng biết
   phạm vi thay đổi trước khi code.
