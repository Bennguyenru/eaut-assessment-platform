# Hướng dẫn Cài đặt EAUT Assessment Platform trên macOS

## 📋 Yêu cầu hệ thống

- macOS 10.15 (Catalina) hoặc mới hơn
- Terminal/Command Line access
- Internet connection để tải dependencies

## 🔧 Bước 1: Cài đặt Homebrew (Package Manager)

Mở Terminal và chạy lệnh sau để cài đặt Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Sau khi cài đặt xong, thêm Homebrew vào PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

## 📦 Bước 2: Cài đặt Node.js

```bash
# Cài đặt Node.js phiên bản mới nhất
brew install node

# Kiểm tra cài đặt
node --version
npm --version
```

## 🗄️ Bước 3: Cài đặt PostgreSQL

```bash
# Cài đặt PostgreSQL
brew install postgresql@15

# Khởi động PostgreSQL service
brew services start postgresql@15

# Tạo database user (nếu chưa có)
createuser -s postgres
```

Nếu gặp lỗi khi tạo user postgres, chạy:

```bash
# Tạo user với password
createuser -s -P postgres
# Nhập password khi được yêu cầu
```

## ⚙️ Bước 4: Thiết lập Project

```bash
# Di chuyển đến thư mục project
cd "/Users/bennguyen/Downloads/Nền Tảng Đánh Giá Chất Lượng Giáo Dục Đại Học Khoa Cơ Khí"

# Cấp quyền thực thi cho các script
chmod +x *.sh

# Chạy script thiết lập tự động
./setup.sh
```

Nếu gặp lỗi với script tự động, thực hiện các bước thủ công:

```bash
# Cài đặt dependencies
npm install

# Thiết lập database
createdb -U postgres eaut_assessment
psql -U postgres -d eaut_assessment -f schema.sql
./init_db.sh

# Tạo thư mục cần thiết
mkdir -p logs uploads public
```

## 🚀 Bước 5: Khởi chạy ứng dụng

### Development mode (có auto-reload):
```bash
npm run dev
# hoặc
./start-dev.sh
```

### Production mode:
```bash
npm start
```

## 🧪 Bước 6: Kiểm tra hệ thống

```bash
# Chạy test tự động
npm test

# Kiểm tra health của server
curl http://localhost:3000/api/health
```

## 🌐 Bước 7: Truy cập ứng dụng

Mở trình duyệt và truy cập: http://localhost:3000

### Tài khoản đăng nhập mặc định:

| Username | Password | Vai trò |
|----------|----------|---------|
| admin | password | Quản trị viên Hệ thống |
| quality_admin | password | Quản trị viên Chất lượng |
| dept_chair | password | Trưởng Khoa |
| lecturer1 | password | Giảng viên |

## 🔧 Xử lý sự cố

### Lỗi: "command not found: brew"
```bash
# Cài đặt lại Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Lỗi: "command not found: node"
```bash
# Kiểm tra PATH
echo $PATH
# Thêm Homebrew vào PATH
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Lỗi: PostgreSQL connection
```bash
# Khởi động PostgreSQL
brew services start postgresql@15

# Kiểm tra service
brew services list | grep postgres

# Reset password nếu cần
psql postgres -c "ALTER USER postgres PASSWORD 'postgres';"
```

### Lỗi: Port 3000 đã được sử dụng
```bash
# Tìm process đang sử dụng port 3000
lsof -ti:3000

# Kill process nếu cần
kill -9 $(lsof -ti:3000)
```

### Lỗi: Database không tồn tại
```bash
# Tạo lại database
dropdb -U postgres eaut_assessment
createdb -U postgres eaut_assessment
psql -U postgres -d eaut_assessment -f schema.sql
./init_db.sh
```

## 📱 Cập nhật và Bảo trì

### Cập nhật dependencies:
```bash
npm update
```

### Backup database:
```bash
pg_dump -U postgres eaut_assessment > backup_$(date +%Y%m%d).sql
```

### Restore database:
```bash
psql -U postgres -d eaut_assessment < backup_file.sql
```

## 🔐 Bảo mật trong Production

1. **Đổi passwords mặc định**:
   - Cập nhật passwords trong database
   - Thay đổi JWT_SECRET trong file .env

2. **Cấu hình Firewall**:
   ```bash
   # Chỉ cho phép truy cập từ localhost trong development
   # Cấu hình reverse proxy (nginx) cho production
   ```

3. **Sử dụng HTTPS**:
   - Cài đặt SSL certificate
   - Cấu hình reverse proxy

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Log files trong thư mục `logs/`
2. Console output khi chạy server
3. Database connection trong .env file

---

**Chúc bạn cài đặt thành công! 🎉**
