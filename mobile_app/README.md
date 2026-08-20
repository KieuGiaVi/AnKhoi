# HCare+ Mobile App (Flutter)

Ứng dụng di động HCare+ dành cho Bệnh nhân (khám bệnh, đặt lịch, xem hồ sơ bệnh án, ví tạm ứng).

## Hướng dẫn khởi chạy

### BƯỚC BẮT BUỘC TRƯỚC KHI BUILD LẦN ĐẦU
Khi clone repo hoặc làm việc trên máy mới, bạn **bắt buộc** phải tạo file `.env` từ `.env.example` trước khi chạy `flutter run` hoặc `flutter build`:

```bash
cd mobile_app
cp .env.example .env
```

*Lưu ý: Nếu không có file `.env`, Flutter sẽ báo lỗi không tìm thấy asset `.env` khi đóng gói.*

### Cài đặt dependencies & chạy ứng dụng

```bash
# Cài đặt dependencies
flutter pub get

# Kiểm tra lỗi tĩnh
flutter analyze

# Chạy ứng dụng trên thiết bị / emulator
flutter run
```
