#!/bin/bash

# EAUT Assessment Platform - Quick Start Script
# Sử dụng cấu trúc thư mục mới đã được sắp xếp khoa học

set -e

echo "🎓 EAUT Assessment Platform - Quick Start"
echo "========================================"

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js không được tìm thấy. Vui lòng cài đặt Node.js ≥18.0.0"
    exit 1
fi

# Kiểm tra PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL không được tìm thấy. Vui lòng cài đặt PostgreSQL ≥14.0"
    exit 1
fi

echo "✅ Dependencies đã sẵn sàng"

# Thiết lập biến môi trường
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/src/backend"
DATABASE_DIR="$PROJECT_ROOT/src/database"
CONFIG_DIR="$PROJECT_ROOT/config"

echo "📁 Project Root: $PROJECT_ROOT"

# 1. Cài đặt dependencies
echo ""
echo "📦 Cài đặt Dependencies..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencies đã được cài đặt"
else
    echo "✅ Dependencies đã tồn tại"
fi

# 2. Thiết lập môi trường
echo ""
echo "⚙️ Thiết lập Environment..."
cd "$PROJECT_ROOT"

if [ ! -f ".env" ]; then
    if [ -f "$CONFIG_DIR/environment/.env.development" ]; then
        cp "$CONFIG_DIR/environment/.env.development" .env
        echo "✅ Environment development đã được sao chép"
    else
        cp "$CONFIG_DIR/environment/.env.example" .env
        echo "✅ Environment template đã được sao chép"
        echo "⚠️  Vui lòng chỉnh sửa file .env với thông tin database của bạn"
    fi
else
    echo "✅ File .env đã tồn tại"
fi

# 3. Khởi tạo database
echo ""
echo "🗄️ Khởi tạo Database..."
cd "$DATABASE_DIR"

if [ -f "init_db.sh" ]; then
    chmod +x init_db.sh
    ./init_db.sh
    echo "✅ Database đã được khởi tạo"
else
    echo "⚠️  Script init_db.sh không tìm thấy"
fi

# 4. Tạo các thư mục cần thiết
echo ""
echo "📁 Tạo thư mục cần thiết..."
cd "$PROJECT_ROOT"

mkdir -p logs uploads ssl
echo "✅ Thư mục logs, uploads, ssl đã được tạo"

# 5. Kiểm tra cấu hình
echo ""
echo "🔍 Kiểm tra cấu hình..."

if [ -f "$BACKEND_DIR/server.js" ]; then
    echo "✅ Server.js đã sẵn sàng"
else
    echo "❌ Server.js không tìm thấy"
    exit 1
fi

# 6. Khởi động ứng dụng
echo ""
echo "🚀 Khởi động ứng dụng..."
cd "$BACKEND_DIR"

echo "📝 Chạy lệnh: npm run dev"
echo ""
echo "🌐 Ứng dụng sẽ chạy tại: http://localhost:3002"
echo "📊 API Health Check: http://localhost:3002/api/health"
echo ""
echo "🔑 Tài khoản mặc định:"
echo "   - Admin: admin / password"
echo "   - Quality Admin: quality_admin / password"
echo "   - Lecturer: lecturer1 / password"
echo ""

# Khởi động server với environment development
if [ -f "$PROJECT_ROOT/.env" ]; then
    echo "🎯 Sử dụng environment file: .env"
fi

npm run dev || npm start

echo ""
echo "✅ EAUT Assessment Platform đã được khởi động thành công!"
