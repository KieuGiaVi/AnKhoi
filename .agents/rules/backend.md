# Rule: Backend (Node.js / Express / MongoDB / TypeScript)

## Ngôn ngữ & tooling
- Toàn bộ backend viết bằng TypeScript (`.ts`), `tsconfig.json` bật
  `strict: true`, `noImplicitAny: true`.
- Chạy dev bằng gói `tsx` (`tsx watch src/server.ts`) — không dùng `ts-node`
  hay Babel để tránh chồng chéo công cụ.
- Build production bằng `tsc` biên dịch ra `dist/`, chạy bằng `node dist/server.js`.
- Cài kèm type definition cho mọi package thiếu type sẵn:
  `@types/node`, `@types/express`, `@types/cors`, `@types/bcrypt`,
  `@types/jsonwebtoken`.
- Không dùng `any` để né lỗi type — nếu chưa biết kiểu chính xác, định nghĩa
  `interface`/`type` tạm và ghi TODO, không dùng `any` như giải pháp cuối.

## Chuẩn code
- Dùng async/await, không dùng callback lồng nhau. Mọi controller bọc bằng
  1 hàm `catchAsync` chung trong `common/utils` (nhận
  `(req: Request, res: Response, next: NextFunction) => Promise<void>`) —
  không try/catch lặp lại ở từng controller.
- Response trả về theo 1 format thống nhất toàn hệ thống, định nghĩa bằng
  generic type: `ApiResponse<T> = { success: boolean; data?: T; message: string; errorCode?: string }`.
  Định nghĩa 1 lần trong `common/utils/response.ts` + `common/types/`, mọi
  module dùng lại, không tự chế format riêng.
- Validate input ở tầng route (middleware validation, dùng Joi hoặc Zod) trước
  khi vào controller — controller không tự validate lại. Nếu dùng Zod, tận
  dụng `z.infer<typeof schema>` để suy ra type input tự động thay vì viết tay.
- Không viết business logic trong file `*.routes.ts` hoặc `*.controller.ts`.
  Toàn bộ logic (tính giá, kiểm tra dị ứng, bóc tách hóa đơn...) nằm trong
  `*.service.ts` để có thể unit test độc lập không cần khởi động Express.
- Mỗi Mongoose model đi kèm 1 interface mô tả document, ví dụ
  `interface IUser extends Document { hoTen: string; role: Role; ... }`,
  và `Schema<IUser>` dùng interface đó — không khai báo Schema không kiểu.

## Authentication & Authorization
- JWT access token, thời hạn ngắn (theo NFR 5.2). Middleware `auth.middleware`
  giải mã token, gắn `req.user`.
- Middleware `rbac.middleware(allowedRoles)` áp dụng theo đúng ma trận ở
  SRS Mục 3.6 — không hard-code role check rải rác trong từng controller.
- Không bao giờ trả mật khẩu (kể cả đã hash) trong bất kỳ response nào.

## Các nghiệp vụ có nhánh rẽ — BẮT BUỘC viết đúng theo SRS, không tự suy diễn
- **Khóa slot 5 phút**: khi bắt đầu thanh toán, set `trang_thai = Pending_Payment`
  kèm thời điểm hết hạn; có job/cron hoặc kiểm tra lazy để nhả slot nếu quá hạn
  chưa thanh toán.
- **Chính sách hủy lịch**: áp đúng 3 mốc ở SRS 3.1 (>24h hoàn 100%, 2–24h trừ
  phí giữ chỗ theo cấu hình, no-show không hoàn) — mốc phí giữ chỗ đọc từ
  config, không hard-code số cứng trong code.
- **Cảnh báo dị ứng hard-stop**: so khớp `hoat_chat` trong đơn thuốc với
  `danh_sach_di_ung` của `PatientProfile`. Nếu trùng, chặn API kê đơn trừ khi
  có field `override_reason` — khi có override, bắt buộc ghi `AuditLog`.
- **Bóc tách hóa đơn 2 dòng**: `dong_bhyt_tra` tính theo `muc_huong` ×
  `gia_bhyt`; `dong_benh_nhan_tra` là phần còn lại. Với khách walk-in
  (`is_temp = true`), không đụng tới Wallet — thu trực tiếp theo Invoice.
- **Real-time**: mọi sự kiện đẩy qua Socket.io PHẢI đi kèm ghi 1 bản ghi
  `Notification` trong DB tại cùng thời điểm — client luôn có thể fetch lại
  danh sách chưa đọc khi kết nối lại.

## Việc KHÔNG được tự làm
- Không tự thêm cơ chế lock/queue nâng cao cho Wallet (row-level lock) —
  đây là hạng mục "ngoài phạm vi" (SRS Mục 8).
- Không tự tích hợp API BHYT quốc gia thật — chỉ dùng dữ liệu mock do Admin
  cấu hình sẵn.
- Không tự thêm rate-limiting, caching layer (Redis...) trừ khi được yêu cầu.
