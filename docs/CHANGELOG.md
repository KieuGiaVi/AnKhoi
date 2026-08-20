# Nhật ký Thay đổi (CHANGELOG)

Tài liệu ghi chép toàn bộ các thay đổi hệ thống HCare+ theo từng task hoàn thành.

## [2026-08-20] Web Dashboard — Khởi tạo khung TypeScript (Vite + React)
- **Phạm vi:** `web_dashboard/`
- **Yêu cầu:** Khởi tạo project React + TypeScript bằng Vite, cài đặt `react-router-dom`, `axios`, cấu hình Axios client dùng chung với JWT interceptor, `ApiResponse<T = unknown>` và 6 feature subdirectories rỗng.
- **File chính thay đổi:** `web_dashboard/package.json`, `web_dashboard/src/shared/api/client.ts`, `web_dashboard/src/shared/types/index.ts`, `web_dashboard/src/app/AppRouter.tsx`, `web_dashboard/src/app/App.tsx`, `web_dashboard/.env.example`.
- **Kiểm thử:** `npm run build` (`tsc -b && vite build`) thành công 100%; `npm run dev` khởi động không lỗi console, điều hướng giữa `/` và `/doctor` hoạt động chính xác.
- **Review phát hiện & đã sửa:** Đổi `ApiResponse<T = any>` thành `ApiResponse<T = unknown>` theo góp ý review để tuân thủ strict rule không dùng `any`.
- **Trạng thái:** ✅ Đã duyệt & commit

## [2026-08-20] Backend — Khởi tạo khung TypeScript (Modular Monolith)
- **Phạm vi:** `backend/`
- **Yêu cầu:** Khởi tạo project backend Node.js + Express + Mongoose + TypeScript theo kiến trúc modular monolith, cấu hình 14 domain modules, `AppError`, middleware error/auth/rbac placeholder, helper `response.ts`, và endpoint health check `GET /api/health`.
- **File chính thay đổi:** `backend/package.json`, `backend/tsconfig.json`, `backend/src/app.ts`, `backend/src/server.ts`, `backend/src/config/db.ts`, `backend/src/common/types/index.ts`, `backend/src/common/utils/response.ts`, `backend/src/common/middlewares/error.middleware.ts`, `backend/src/routes/index.ts`, 14 module `index.ts`.
- **Kiểm thử:** `npm run build` (`tsc`) pass 0 lỗi; `GET http://localhost:5000/api/health` trả về đúng format `ApiResponse`.
- **Review phát hiện & đã sửa:** Đã chuyển đổi từ JavaScript sang TypeScript và sửa lỗi `moduleResolution` trong `tsconfig.json`.
- **Trạng thái:** ✅ Đã duyệt & commit
