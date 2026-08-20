# Rule: Frontend (React Web Dashboard & Flutter Mobile App)

## React Web Dashboard (TypeScript)
- Dự án khởi tạo bằng Vite template `react-ts`. Component có JSX → `.tsx`;
  hook/helper/gọi API không JSX → `.ts`.
- Mỗi feature trong `features/<ten>/` tự chứa `api.ts` (gọi API riêng của
  feature đó qua client dùng chung ở `shared/api/client.ts`), `types.ts`
  (định nghĩa DTO/response type của feature), `pages/`, `components/`, `hooks/`.
- State cục bộ trong feature dùng React state/hook thường; chỉ đưa lên state
  toàn cục (context/store) khi > 1 feature thực sự cần dùng chung (ví dụ
  thông tin `currentUser` sau đăng nhập).
- Gọi API qua 1 instance axios duy nhất ở `shared/api/client.ts` có sẵn
  interceptor gắn JWT — không tạo instance axios riêng trong từng feature.
  Định nghĩa sẵn generic `ApiResponse<T>` trong `shared/types/` khớp với
  format backend trả về (`{ success, data, message, errorCode? }`).
- Props của mọi component định nghĩa bằng `interface <TenComponent>Props`,
  không dùng `any` cho props hoặc kết quả gọi API.
- Component UI Admin Panel tối ưu ngang (Tablet/PC) theo NFR 5.3 — vùng
  chạm nút thao tác tối thiểu 44×44px cho các trang dùng trên tablet
  (Bác sĩ, KTV, Dược sĩ, Lễ tân).

## Flutter Mobile App
- Mỗi feature trong `lib/features/<ten>/` tự chứa `presentation/` (screen +
  widget), `application/` (state management: Provider/Riverpod/Bloc — chọn
  1 phương án duy nhất cho toàn app, không trộn), `data/` (gọi API, model).
- `core/network/` chứa 1 Dio/http client dùng chung cho toàn app, tự động
  gắn JWT — các feature import từ đây, không tự khởi tạo client riêng.
- Màn hình Bệnh nhân tối ưu dọc (portrait), thao tác vuốt/chạm đơn giản
  theo NFR 5.3.
- Presigned URL khi hiển thị file kết quả (ảnh/PDF): tải trực tiếp qua URL
  BE trả về, không tự cache file xuống local trừ khi được yêu cầu.

## Chung cho cả hai
- Không tự chọn thêm thư viện UI/state management ngoài những gì đã thống
  nhất — nếu thấy cần, hỏi trước khi thêm dependency mới.
- Text hiển thị cho người dùng: tiếng Việt. Tên biến/hàm/component: tiếng Anh.
- Mọi form nhập liệu nhạy cảm (dị ứng, BHYT, thanh toán) phải có validate
  phía client TRƯỚC khi gọi API, nhưng không được thay thế validate phía
  server (BE luôn validate lại).
