# HCare+ — Đồ án Tốt nghiệp

Ứng dụng hỗ trợ quản lý Phòng khám An Khởi.

## Cấu trúc repo
```
.
├── AGENTS.md              # Ngữ cảnh gốc cho AI agent (đọc TRƯỚC mọi task)
├── .agents/rules/         # Rule chi tiết theo mảng (kiến trúc, DB, BE, FE, an toàn)
├── docs/
│   └── SRS_HCare+_v1.3.md # Đặc tả yêu cầu — nguồn sự thật cho mọi nghiệp vụ
├── backend/                # Node.js + Express + MongoDB
├── web_dashboard/           # ReactJS — Dashboard cho nhân viên
└── mobile_app/               # Flutter — App cho bệnh nhân
```

## Bắt đầu
1. Mở repo này bằng Antigravity (File → Open Folder → chọn đúng thư mục gốc
   chứa `AGENTS.md`).
2. Yêu cầu agent đọc `AGENTS.md` và toàn bộ `.agents/rules/*.md` trước khi làm
   bất kỳ việc gì.
3. Thực hiện lần lượt theo timeline ở `docs/SRS_HCare+_v1.3.md` Mục 6.

Xem chi tiết quy tắc kiến trúc, coding convention, và giới hạn an toàn trong
`.agents/rules/`.
