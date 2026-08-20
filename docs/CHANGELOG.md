# Nhật ký Thay đổi (CHANGELOG)

Tài liệu ghi chép toàn bộ các thay đổi hệ thống HCare+ theo từng task hoàn thành.

## [2026-08-20] Web Dashboard — Tích hợp Nền tảng Thiết kế TailAdmin React (Dashboard Layout)
- **Phạm vi:** `web_dashboard/`
- **Yêu cầu:** Đưa TailAdmin React (bản miễn phí, mã nguồn mở MIT License) vào làm nền tảng thiết kế UI chung cho tất cả các màn hình quản trị của HCare+. Yêu cầu không phá vỡ logic tính năng Auth đã hoàn thiện và tích hợp có chọn lọc bằng cách copy các component thiết yếu vào thư mục `shared/`.
- **File chính thay đổi:** `web_dashboard/package.json`, `web_dashboard/postcss.config.js`, `web_dashboard/src/index.css`, `web_dashboard/src/shared/layout/DashboardLayout.tsx`, `web_dashboard/src/shared/layout/AppSidebar.tsx`, `web_dashboard/src/shared/layout/AppHeader.tsx`, `web_dashboard/src/shared/layout/Backdrop.tsx`, `web_dashboard/src/shared/layout/SidebarContext.tsx`, `web_dashboard/src/shared/components/ui/index.tsx`, `web_dashboard/src/app/AppRouter.tsx`, `.agents/rules/frontend.md`.
- **Kiểm thử:** `npm run build` (`vite build`) thành công 100%; `npm test` (`vitest run`) pass 2/2 test files (không hồi quy lỗi); Đã chụp ảnh xác nhận trang `LoginPage` độc lập và layout Dashboard (Sidebar + Header) hiển thị chính xác.
- **Review phát hiện & đã sửa:** Xử lý dependency conflict khi setup apexcharts; sử dụng cú pháp import CSS thuần túy chuẩn Tailwind v4.
- **Trạng thái:** ⏳ Chờ review (sẵn sàng commit/push)

## [2026-08-20] Web Dashboard — Triển khai Feature Auth & Route Guard (Glassmorphism UI, Context API, Vitest)
- **Phạm vi:** `web_dashboard/`
- **Yêu cầu:** Xây dựng màn hình đăng nhập `LoginPage` thật (thay thế FeaturePlaceholder ở `/auth`), bộ Tab chuyển đổi giữa Đăng nhập Bệnh nhân (OTP 2 bước) & Đăng nhập Nhân viên (Email/Mật khẩu), quản lý state qua `AuthContext` (React Context API), lưu JWT token ở `localStorage`, tự động gắn Authorization header qua Axios interceptor, và chặn route phân quyền bằng `ProtectedRoute`.
- **File chính thay đổi:** `web_dashboard/src/shared/types/auth.ts`, `web_dashboard/src/features/auth/api/authApi.ts`, `web_dashboard/src/features/auth/context/AuthContext.tsx`, `web_dashboard/src/features/auth/components/OtpLoginForm.tsx`, `web_dashboard/src/features/auth/components/StaffLoginForm.tsx`, `web_dashboard/src/features/auth/pages/LoginPage.tsx`, `web_dashboard/src/shared/components/ProtectedRoute.tsx`, `web_dashboard/src/app/AppRouter.tsx`, `web_dashboard/src/test/*`, `web_dashboard/vite.config.ts`, `web_dashboard/package.json`.
- **Kiểm thử:** `npm run build` (`vite build`) thành công 100% (thời gian build: 560ms); `npm test` (`vitest run`) pass 2/2 test files (7/7 tests pass 100%).
- **Review phát hiện & đã sửa:**
  1. Cài đặt Vitest & Testing Library cho Web Dashboard để đảm bảo kiểm thử tự động toàn diện.
  2. OTP Helper Badge chỉ hiển thị khi field `otp` thực sự có trong API response từ backend.
  3. Bổ sung ghi chú bảo mật XSS trực tiếp trong code liên quan đến việc lưu JWT tại `localStorage`.
- **Trạng thái:** ⏳ Chờ review (sẵn sàng commit/push sau khi duyệt)

## [2026-08-20] Backend — Triển khai Module Auth & Users (Đăng ký OTP, Staff Login, RBAC)
- **Phạm vi:** `backend/`
- **Yêu cầu:** Xây dựng module `auth` và `users` độc lập, xác thực OTP bệnh nhân, đăng nhập staff (bcrypt), phát hành JWT token (thời hạn 24h, fail-fast nếu thiếu JWT_SECRET), kiểm tra RBAC thực tế qua enum `Role`, tạo hồ sơ tạm Walk-in (`is_temp: true`) và quản lý `PatientProfile`.
- **File chính thay đổi:** `backend/src/config/env.ts`, `backend/src/common/middlewares/auth.middleware.ts`, `backend/src/common/middlewares/rbac.middleware.ts`, `backend/src/modules/users/*`, `backend/src/modules/auth/*`, `backend/src/routes/index.ts`, `backend/tests/*`.
- **Kiểm thử:** `npm run build` (`tsc`) 0 lỗi; `npm test` (Jest + Supertest) pass 5/5 test suites (25/25 tests pass 100%).
- **Review phát hiện & đã sửa:**
  1. Khóa an toàn OTP trong response API (chỉ trả về OTP khi `NODE_ENV !== 'production'`).
  2. Bổ sung fail-fast throw error nếu thiếu `JWT_SECRET`.
  3. Áp dụng chỉ mục `{ unique: true, sparse: true }` cho `sdt` và `email` trong `user.model.ts`.
  4. Bổ sung unit test ở tầng service (`auth.service.test.ts`, `users.service.test.ts`), middleware (`auth.middleware.test.ts`, `rbac.middleware.test.ts`) và integration test Supertest cho chuỗi HTTP endpoints.

- **Trạng thái:** ✅ Đã duyệt (sẵn sàng commit)

## [2026-08-20] Mobile App — Khởi tạo khung Flutter (Patient App)
- **Phạm vi:** `mobile_app/`
- **Yêu cầu:** Khởi tạo project Flutter (package `com.ankhoi.hcareplus`, name `hcare_plus`), cài đặt `dio`, `provider`, `flutter_dotenv`, cấu hình `DioClient` singleton, `AppTheme`, `.env.example`, `mobile_app/README.md` (hướng dẫn copy .env) và 6 feature subdirectories rỗng (chỉ chứa `README.md`).
- **File chính thay đổi:** `mobile_app/pubspec.yaml`, `mobile_app/README.md`, `mobile_app/.env.example`, `mobile_app/lib/main.dart`, `mobile_app/lib/core/network/dio_client.dart`, `mobile_app/lib/core/theme/app_theme.dart`, `mobile_app/lib/core/constants/app_constants.dart`, `mobile_app/lib/shared/README.md`, 6 feature `README.md`.
- **Kiểm thử:** `flutter analyze` pass 0 lỗi; `flutter test` pass 100% test suite; `flutter build apk --debug` thành công 100% (thời gian build: 265.0s, file output: `build/app/outputs/flutter-apk/app-debug.apk`). Android Gradle Plugin đã tự động tải lại NDK sạch bản `28.2.13676358`.
- **Review phát hiện & đã sửa:** Bổ sung hướng dẫn bắt buộc `cp .env.example .env` trong `mobile_app/README.md`, điều hướng dùng `FeaturePlaceholder` trực tiếp trong `main.dart`, và xử lý cài đặt lại NDK corrupt.
- **Trạng thái:** ✅ Đã duyệt (sẵn sàng commit)

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
