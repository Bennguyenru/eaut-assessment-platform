# Hướng dẫn triển khai nền tảng đánh giá chuẩn đầu ra lên VPS cá nhân

Tài liệu này cung cấp hướng dẫn chi tiết để triển khai nền tảng đánh giá chuẩn đầu ra lên VPS cá nhân của bạn. Hướng dẫn này bao gồm cả việc triển khai frontend và backend, cũng như cấu hình cơ sở dữ liệu.

## Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị VPS](#chuẩn-bị-vps)
3. [Triển khai cơ sở dữ liệu](#triển-khai-cơ-sở-dữ-liệu)
4. [Triển khai Backend API](#triển-khai-backend-api)
5. [Triển khai Frontend](#triển-khai-frontend)
6. [Cấu hình Nginx](#cấu-hình-nginx)
7. [Cấu hình SSL/TLS](#cấu-hình-ssltls)
8. [Khởi động và kiểm tra](#khởi-động-và-kiểm-tra)
9. [Bảo trì và sao lưu](#bảo-trì-và-sao-lưu)

## Yêu cầu hệ thống

- VPS với ít nhất 1GB RAM, 1 CPU core
- Hệ điều hành: Ubuntu 20.04 LTS hoặc mới hơn
- Nginx hoặc Apache
- PostgreSQL 12 hoặc mới hơn
- Python 3.8 hoặc mới hơn
- Node.js 14 hoặc mới hơn (tùy chọn, nếu bạn muốn xây dựng lại frontend)
- Certbot (cho SSL/TLS)

## Chuẩn bị VPS

### 1. Cập nhật hệ thống

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Cài đặt các gói cần thiết

```bash
sudo apt install -y python3 python3-pip python3-venv nginx postgresql postgresql-contrib certbot python3-certbot-nginx git
```

### 3. Tạo thư mục cho ứng dụng

```bash
sudo mkdir -p /var/www/eaut_assessment
sudo chown -R $USER:$USER /var/www/eaut_assessment
```

## Triển khai cơ sở dữ liệu

### 1. Cấu hình PostgreSQL

```bash
sudo -u postgres psql -c "CREATE USER eaut_admin WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "CREATE DATABASE eaut_assessment;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE eaut_assessment TO eaut_admin;"
sudo -u postgres psql -c "ALTER USER eaut_admin WITH SUPERUSER;"
```

### 2. Nhập schema

Sao chép tệp schema.sql từ thư mục database của dự án vào VPS của bạn, sau đó nhập vào cơ sở dữ liệu:

```bash
# Giả sử bạn đã tải tệp schema.sql lên thư mục /tmp
sudo -u postgres psql -d eaut_assessment -f /tmp/schema.sql
```

## Triển khai Backend API

### 1. Tạo thư mục cho backend

```bash
mkdir -p /var/www/eaut_assessment/backend
cd /var/www/eaut_assessment/backend
```

### 2. Tạo môi trường ảo Python

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Tạo cấu trúc thư mục

```bash
mkdir -p src/models src/routes src/static src/templates
```

### 4. Sao chép mã nguồn backend

Sao chép tất cả các tệp từ thư mục backend của dự án vào thư mục `/var/www/eaut_assessment/backend/src`.

### 5. Cài đặt các gói phụ thuộc

```bash
pip install flask flask-sqlalchemy psycopg2-binary flask-login flask-wtf flask-cors gunicorn
pip freeze > requirements.txt
```

### 6. Tạo file main.py

Tạo tệp `/var/www/eaut_assessment/backend/src/main.py` với nội dung sau:

```python
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Cấu hình cơ sở dữ liệu
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USERNAME', 'eaut_admin')}:{os.getenv('DB_PASSWORD', 'your_secure_password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'eaut_assessment')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'eaut-assessment-platform-secret-key')

db = SQLAlchemy(app)

# Import các routes
from src.routes import auth, programs, courses, clos, plos, matrix, reports

# Đăng ký các blueprint
app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(programs.bp, url_prefix='/api/programs')
app.register_blueprint(courses.bp, url_prefix='/api/courses')
app.register_blueprint(clos.bp, url_prefix='/api/clos')
app.register_blueprint(plos.bp, url_prefix='/api/plos')
app.register_blueprint(matrix.bp, url_prefix='/api/matrix')
app.register_blueprint(reports.bp, url_prefix='/api/reports')

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
```

### 7. Tạo file WSGI

Tạo tệp `/var/www/eaut_assessment/backend/wsgi.py` với nội dung sau:

```python
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app

if __name__ == "__main__":
    app.run()
```

### 8. Tạo file systemd service

Tạo tệp `/etc/systemd/system/eaut_assessment.service` với nội dung sau:

```ini
[Unit]
Description=EAUT Assessment Platform Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/eaut_assessment/backend
Environment="PATH=/var/www/eaut_assessment/backend/venv/bin"
ExecStart=/var/www/eaut_assessment/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 wsgi:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### 9. Cấp quyền và khởi động service

```bash
sudo chown -R www-data:www-data /var/www/eaut_assessment
sudo systemctl daemon-reload
sudo systemctl start eaut_assessment
sudo systemctl enable eaut_assessment
```

## Triển khai Frontend

### 1. Tạo thư mục cho frontend

```bash
mkdir -p /var/www/eaut_assessment/frontend
cd /var/www/eaut_assessment/frontend
```

### 2. Sao chép mã nguồn frontend

Sao chép tất cả các tệp từ thư mục frontend của dự án vào thư mục `/var/www/eaut_assessment/frontend`.

### 3. Cập nhật cấu hình API endpoint

Chỉnh sửa tệp `/var/www/eaut_assessment/frontend/js/main.js` để trỏ đến API endpoint của backend. Tìm dòng có chứa `const API_URL = ` và cập nhật thành:

```javascript
const API_URL = 'http://your-domain.com/api';
```

Thay `your-domain.com` bằng tên miền hoặc địa chỉ IP của VPS của bạn.

## Cấu hình Nginx

### 1. Tạo file cấu hình Nginx

Tạo tệp `/etc/nginx/sites-available/eaut_assessment` với nội dung sau:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Thay bằng tên miền hoặc địa chỉ IP của bạn

    # Frontend
    location / {
        root /var/www/eaut_assessment/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Kích hoạt cấu hình Nginx

```bash
sudo ln -s /etc/nginx/sites-available/eaut_assessment /etc/nginx/sites-enabled/
sudo nginx -t  # Kiểm tra cấu hình
sudo systemctl restart nginx
```

## Cấu hình SSL/TLS

### 1. Cài đặt chứng chỉ SSL/TLS với Certbot

```bash
sudo certbot --nginx -d your-domain.com
```

Thay `your-domain.com` bằng tên miền của bạn. Làm theo hướng dẫn trên màn hình để hoàn tất quá trình cài đặt.

## Khởi động và kiểm tra

### 1. Khởi động lại tất cả các dịch vụ

```bash
sudo systemctl restart eaut_assessment
sudo systemctl restart nginx
```

### 2. Kiểm tra trạng thái

```bash
sudo systemctl status eaut_assessment
sudo systemctl status nginx
```

### 3. Kiểm tra logs

```bash
sudo journalctl -u eaut_assessment
sudo tail -f /var/log/nginx/error.log
```

### 4. Truy cập ứng dụng

Mở trình duyệt và truy cập `https://your-domain.com` để kiểm tra frontend.

Truy cập `https://your-domain.com/api/health` để kiểm tra backend API.

## Bảo trì và sao lưu

### 1. Sao lưu cơ sở dữ liệu

```bash
# Tạo thư mục sao lưu
mkdir -p /var/backups/eaut_assessment

# Sao lưu cơ sở dữ liệu
sudo -u postgres pg_dump eaut_assessment > /var/backups/eaut_assessment/db_backup_$(date +%Y%m%d).sql
```

### 2. Tạo script sao lưu tự động

Tạo tệp `/etc/cron.daily/eaut_assessment_backup` với nội dung sau:

```bash
#!/bin/bash

# Tạo thư mục sao lưu
mkdir -p /var/backups/eaut_assessment

# Sao lưu cơ sở dữ liệu
sudo -u postgres pg_dump eaut_assessment > /var/backups/eaut_assessment/db_backup_$(date +%Y%m%d).sql

# Sao lưu mã nguồn
tar -czf /var/backups/eaut_assessment/src_backup_$(date +%Y%m%d).tar.gz /var/www/eaut_assessment

# Giữ lại 7 bản sao lưu gần nhất
find /var/backups/eaut_assessment -name "db_backup_*.sql" -type f -mtime +7 -delete
find /var/backups/eaut_assessment -name "src_backup_*.tar.gz" -type f -mtime +7 -delete
```

### 3. Cấp quyền thực thi cho script sao lưu

```bash
sudo chmod +x /etc/cron.daily/eaut_assessment_backup
```

## Khắc phục sự cố

### 1. Kiểm tra logs

```bash
# Logs của backend
sudo journalctl -u eaut_assessment

# Logs của Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 2. Khởi động lại dịch vụ

```bash
sudo systemctl restart eaut_assessment
sudo systemctl restart nginx
```

### 3. Kiểm tra kết nối cơ sở dữ liệu

```bash
sudo -u postgres psql -d eaut_assessment -c "SELECT 1;"
```

### 4. Kiểm tra cấu hình Nginx

```bash
sudo nginx -t
```

## Kết luận

Bạn đã hoàn thành việc triển khai nền tảng đánh giá chuẩn đầu ra lên VPS cá nhân của mình. Nền tảng này bao gồm:

1. Backend API được triển khai với Flask và Gunicorn
2. Frontend được triển khai dưới dạng trang web tĩnh
3. Cơ sở dữ liệu PostgreSQL
4. Nginx làm reverse proxy và phục vụ tệp tĩnh
5. Chứng chỉ SSL/TLS từ Let's Encrypt

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình triển khai, vui lòng kiểm tra logs và các bước khắc phục sự cố được đề cập ở trên.
