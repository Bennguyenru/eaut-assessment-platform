#!/bin/bash

# Deployment script for EAUT Assessment Platform

# Set variables
APP_DIR="/home/ubuntu/workspace/eaut_assessment_platform"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
DB_DIR="$APP_DIR/database"
LOG_DIR="$APP_DIR/logs"

# Create log directory if it doesn't exist
mkdir -p $LOG_DIR

# Install dependencies
echo "Installing dependencies..."
cd $BACKEND_DIR
npm init -y
npm install express body-parser cors pg bcryptjs jsonwebtoken dotenv

# Make database initialization script executable
chmod +x $DB_DIR/init_db.sh

# Create .env file for backend
cat > $BACKEND_DIR/.env << EOF
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=eaut_assessment
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=eaut-assessment-platform-secret-key
EOF

# Create start script
cat > $APP_DIR/start.sh << EOF
#!/bin/bash

# Start EAUT Assessment Platform

# Set variables
APP_DIR="/home/ubuntu/workspace/eaut_assessment_platform"
BACKEND_DIR="\$APP_DIR/backend"
FRONTEND_DIR="\$APP_DIR/frontend"
LOG_DIR="\$APP_DIR/logs"

# Start backend server
echo "Starting backend server..."
cd \$BACKEND_DIR
node server.js > \$LOG_DIR/backend.log 2>&1 &
BACKEND_PID=\$!
echo "Backend server started with PID \$BACKEND_PID"

# Start frontend server
echo "Starting frontend server..."
cd \$FRONTEND_DIR
python3 -m http.server 8080 > \$LOG_DIR/frontend.log 2>&1 &
FRONTEND_PID=\$!
echo "Frontend server started with PID \$FRONTEND_PID"

echo "EAUT Assessment Platform started successfully!"
echo "Backend running at http://localhost:3000"
echo "Frontend running at http://localhost:8080"
EOF

# Make start script executable
chmod +x $APP_DIR/start.sh

# Create stop script
cat > $APP_DIR/stop.sh << EOF
#!/bin/bash

# Stop EAUT Assessment Platform

# Find and kill backend process
BACKEND_PID=\$(ps aux | grep "node server.js" | grep -v grep | awk '{print \$2}')
if [ -n "\$BACKEND_PID" ]; then
    echo "Stopping backend server (PID \$BACKEND_PID)..."
    kill \$BACKEND_PID
    echo "Backend server stopped."
else
    echo "Backend server is not running."
fi

# Find and kill frontend process
FRONTEND_PID=\$(ps aux | grep "python3 -m http.server 8080" | grep -v grep | awk '{print \$2}')
if [ -n "\$FRONTEND_PID" ]; then
    echo "Stopping frontend server (PID \$FRONTEND_PID)..."
    kill \$FRONTEND_PID
    echo "Frontend server stopped."
else
    echo "Frontend server is not running."
fi

echo "EAUT Assessment Platform stopped successfully!"
EOF

# Make stop script executable
chmod +x $APP_DIR/stop.sh

# Create README file
cat > $APP_DIR/README.md << EOF
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

- \`backend/\`: Mã nguồn phía máy chủ
- \`frontend/\`: Mã nguồn phía người dùng
- \`database/\`: Script cơ sở dữ liệu
- \`logs/\`: Tệp nhật ký

## Tính năng chính

1. Quản lý chuẩn đầu ra chương trình đào tạo (PLO)
2. Quản lý chuẩn đầu ra học phần (CLO)
3. Quản lý ma trận CLO-PLO
4. Quản lý đánh giá và rubric
5. Nhập điểm và tính toán mức độ đạt chuẩn đầu ra
6. Báo cáo và thống kê
7. Quản lý người dùng và phân quyền

## Hỗ trợ

Liên hệ: [admin@eaut.edu.vn](mailto:admin@eaut.edu.vn)
EOF

echo "Deployment setup completed successfully!"
