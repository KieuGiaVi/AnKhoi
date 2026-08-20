---
trigger: always_on
---

## Quy trình thiết kế UI (áp dụng từ Bước 3, module catalog trở đi)

1. Mọi module mới: MOCKUP UI trước (dữ liệu giả, dựng nhanh để duyệt layout/luồng),
   KHÔNG code thẳng vào project. Duyệt xong mới sang bước 2.
2. Backend thật — thiết kế API/schema khớp với mockup đã chốt.
3. Frontend thật — code lại theo mockup đã duyệt, nối API thật.

## Template giao diện Admin
- Web Dashboard dùng nền tảng thiết kế từ **TailAdmin React** (React + Vite + TS +
  Tailwind, https://github.com/TailAdmin/free-react-tailwind-admin-dashboard).
- Áp dụng cho: layout tổng thể (sidebar, header, bảng dữ liệu, form, biểu đồ,
  card thống kê) — dùng cho các màn hình quản trị/danh mục/báo cáo.
- KHÔNG áp dụng máy móc cho các luồng nghiệp vụ đặc thù của phòng khám
  (đặt lịch có khóa slot, luồng khám bệnh, đơn thuốc...) — những phần này tự
  thiết kế, chỉ tái dùng component cơ bản (card, table, button, input...) từ
  TailAdmin để đồng bộ giao diện.