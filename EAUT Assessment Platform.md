# EAUT Assessment Platform

Nền tảng hỗ trợ đánh giá mức độ đạt chuẩn đầu ra chương trình đào tạo, phục vụ công tác kiểm định chất lượng giáo dục bậc đại học cho khoa Cơ khí trường Đại học Công nghệ Đông Á.

## Cài đặt

### Yêu cầu hệ thống

- Node.js (v14 trở lên)
- PostgreSQL (v12 trở lên)
- npm (v6 trở lên)

### Cài đặt cơ sở dữ liệu

1. Đảm bảo PostgreSQL đã được cài đặt và đang chạy
2. Chạy script khởi tạo cơ sở dữ liệu:

```bash
cd database
./init_db.sh
```

### Cài đặt ứng dụng

1. Cài đặt các gói phụ thuộc:

```bash
cd backend
npm install
```

## Chạy ứng dụng

### Khởi động ứng dụng

```bash
./start.sh
```

Sau khi khởi động:
- Backend sẽ chạy tại: http://localhost:3000
- Frontend sẽ chạy tại: http://localhost:8080

### Dừng ứng dụng

```bash
./stop.sh
```

## Tài khoản mặc định

- Quản trị viên:
  - Tên đăng nhập: admin
  - Mật khẩu: password

- Quản trị viên chất lượng:
  - Tên đăng nhập: quality_admin
  - Mật khẩu: password

- Trưởng khoa:
  - Tên đăng nhập: dept_chair
  - Mật khẩu: password

- Giảng viên:
  - Tên đăng nhập: lecturer1
  - Mật khẩu: password

- Sinh viên:
  - Tên đăng nhập: student1
  - Mật khẩu: password

## Cấu trúc dự án

- `backend/`: Mã nguồn phía máy chủ
- `frontend/`: Mã nguồn phía người dùng
- `database/`: Script cơ sở dữ liệu
- `logs/`: Tệp nhật ký
- `tests/`: Script kiểm thử

## Tính năng chính

1. Quản lý chuẩn đầu ra chương trình đào tạo (PLO)
2. Quản lý chuẩn đầu ra học phần (CLO)
3. Quản lý ma trận CLO-PLO
4. Quản lý đánh giá và rubric
5. Nhập điểm và tính toán mức độ đạt chuẩn đầu ra
6. Báo cáo và thống kê
7. Quản lý người dùng và phân quyền

## Kiểm thử

Nền tảng bao gồm các bộ kiểm thử tự động:

1. Kiểm thử chức năng: Kiểm tra tất cả các chức năng cốt lõi
2. Kiểm thử tải: Đảm bảo hiệu suất với nhiều người dùng đồng thời
3. Kiểm thử bảo mật: Kiểm tra các lỗ hổng bảo mật phổ biến

Để chạy tất cả các kiểm thử:

```bash
cd tests
./run_all_tests.sh
```

## Hỗ trợ

Liên hệ: [admin@eaut.edu.vn](mailto:admin@eaut.edu.vn)
