# EAUT Assessment Platform

[![Build Status](https://github.com/YOUR_USERNAME/eaut-assessment-platform/workflows/Deploy/badge.svg)](https://github.com/YOUR_USERNAME/eaut-assessment-platform/actions)
[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://YOUR_USERNAME.github.io/eaut-assessment-platform/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12.0-blue.svg)](https://postgresql.org/)

Nền tảng Đánh giá Chuẩn đầu ra Chương trình Đào tạo - Trường Đại học Công nghệ Đông Á

## 🌐 Live Deployments

| Platform | URL | Status | Description |
|----------|-----|--------|-------------|
| **GitHub Pages** | [Demo Site](https://YOUR_USERNAME.github.io/eaut-assessment-platform/) | 🟢 Live | Static demo and documentation |
| **Railway** | [Production](https://eaut-assessment-platform-production.up.railway.app/) | 🟢 Live | Full application with PostgreSQL |
| **Docker Hub** | [Container](https://hub.docker.com/r/YOUR_USERNAME/eaut-assessment-platform) | 🟢 Available | Docker container image |
| **Render** | [Staging](https://eaut-assessment-platform.onrender.com/) | 🟡 Available | Auto-scaling deployment |
| **Vercel** | [Serverless](https://eaut-assessment-platform.vercel.app/) | 🟡 Available | Serverless functions |

## 🚀 Quick Deploy

Choose your preferred deployment platform:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR_TEMPLATE_ID)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/eaut-assessment-platform)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/eaut-assessment-platform)
[![Run on Docker](https://img.shields.io/badge/docker-run-blue.svg?logo=docker)](https://hub.docker.com/r/YOUR_USERNAME/eaut-assessment-platform)

## 📋 Tổng quan

EAUT Assessment Platform là một hệ thống web toàn diện được thiết kế để hỗ trợ việc đánh giá và quản lý chuẩn đầu ra (PLO - Program Learning Outcomes) của các chương trình đào tạo tại Trường Đại học Công nghệ Đông Á.

### 🎯 Tính năng chính

- **Quản lý Chương trình Đào tạo**: Tạo, chỉnh sửa và quản lý các chương trình đào tạo
- **Quản lý Chuẩn đầu ra (PLO)**: Định nghĩa và quản lý các chuẩn đầu ra chương trình
- **Quản lý Học phần**: Tạo và quản lý các học phần trong chương trình
- **Ma trận CLO-PLO**: Thiết lập mối quan hệ giữa chuẩn đầu ra học phần và chuẩn đầu ra chương trình
- **Đánh giá và Báo cáo**: Tính toán tỷ lệ đạt chuẩn và tạo báo cáo chi tiết
- **Dashboard**: Hiển thị thống kê và biểu đồ trực quan
- **Quản lý Người dùng**: Hệ thống phân quyền theo vai trò

### 👥 Vai trò Người dùng

- **Quản trị viên Hệ thống**: Quản lý toàn bộ hệ thống
- **Quản trị viên Chất lượng**: Quản lý chất lượng đào tạo
- **Trưởng Khoa/Bộ môn**: Quản lý chương trình đào tạo của khoa
- **Giảng viên**: Nhập điểm và đánh giá học phần
- **Sinh viên**: Xem kết quả đánh giá cá nhân
- **Lãnh đạo**: Xem báo cáo tổng hợp

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** với Express.js framework
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** password hashing
- **express-validator** input validation
- **helmet** security middleware
- **morgan** logging
- **cors** cross-origin resource sharing

### Frontend
- **HTML5** và **CSS3**
- **Bootstrap 5** UI framework
- **JavaScript ES6+**
- **Chart.js** data visualization
- **Bootstrap Icons** icon set

## 📦 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 14.0.0
- npm >= 6.0.0
- PostgreSQL >= 12.0
- macOS, Linux, hoặc Windows

### 1. Clone repository

```bash
git clone <repository-url>
cd eaut-assessment-platform
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Thiết lập cơ sở dữ liệu

#### Cài đặt PostgreSQL (macOS)

```bash
# Sử dụng Homebrew
brew install postgresql
brew services start postgresql

# Tạo user postgres
createuser -s postgres
```

#### Khởi tạo cơ sở dữ liệu

```bash
# Cấp quyền thực thi cho script
chmod +x init_db.sh

# Chạy script khởi tạo database
./init_db.sh
```

### 4. Cấu hình môi trường

Sao chép file `.env.example` thành `.env` và điều chỉnh các giá trị:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eaut_assessment
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

### 5. Khởi chạy ứng dụng

#### Development mode
```bash
npm run dev
```

#### Production mode
```bash
npm start
```

Truy cập ứng dụng tại: http://localhost:3000

## 🗄️ Cấu trúc Database

### Bảng chính

- **users**: Thông tin người dùng
- **roles**: Vai trò và quyền hạn
- **departments**: Khoa/Bộ môn
- **programs**: Chương trình đào tạo
- **plos**: Chuẩn đầu ra chương trình
- **courses**: Học phần
- **clos**: Chuẩn đầu ra học phần
- **clo_plo_matrix**: Ma trận CLO-PLO
- **assessments**: Đánh giá
- **scores**: Điểm số sinh viên

## 🔐 Tài khoản mặc định

| Username | Password | Vai trò |
|----------|----------|---------|
| admin | password | Quản trị viên Hệ thống |
| quality_admin | password | Quản trị viên Chất lượng |
| dept_chair | password | Trưởng Khoa |
| lecturer1 | password | Giảng viên |
| student1 | password | Sinh viên |

## 🧪 Testing

```bash
# Chạy test suite
npm test

# Chạy test với coverage
npm run test:coverage
```

## 📊 API Documentation

### Authentication

#### POST /api/auth/login
Đăng nhập người dùng

**Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "U001",
    "username": "admin",
    "email": "admin@eaut.edu.vn",
    "fullName": "Quản trị viên",
    "role": "System Administrator",
    "token": "jwt_token_here"
  }
}
```

### Programs

#### GET /api/programs
Lấy danh sách chương trình đào tạo

#### POST /api/programs
Tạo chương trình đào tạo mới

#### GET /api/programs/:id
Lấy thông tin chi tiết chương trình

### PLOs

#### GET /api/programs/:id/plos
Lấy danh sách PLO của chương trình

#### POST /api/plos
Tạo PLO mới

### Courses

#### GET /api/programs/:id/courses
Lấy danh sách học phần của chương trình

#### POST /api/courses
Tạo học phần mới

## 📁 Cấu trúc thư mục

```
eaut-assessment-platform/
├── server.js              # Server chính
├── package.json           # Dependencies và scripts
├── .env                   # Biến môi trường
├── index.html            # Giao diện chính
├── main.js               # JavaScript frontend
├── styles.css            # CSS styles
├── schema.sql            # Database schema
├── init_db.sh           # Script khởi tạo DB
├── deploy.sh            # Script deployment
├── setup_tests.sh       # Script thiết lập tests
├── README.md            # Tài liệu này
├── logs/                # Log files
└── uploads/             # File uploads
```

## 🚀 Deployment

### Deployment lên VPS

1. **Chuẩn bị VPS**:
   - Ubuntu 20.04 LTS hoặc mới hơn
   - Node.js và PostgreSQL đã cài đặt
   - Domain hoặc IP public

2. **Upload source code**:
   ```bash
   scp -r . user@your-vps:/path/to/app
   ```

3. **Chạy deployment script**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Sử dụng PM2 (Production)

```bash
# Cài đặt PM2
npm install -g pm2

# Khởi chạy ứng dụng với PM2
pm2 start server.js --name "eaut-assessment"

# Thiết lập auto-start
pm2 startup
pm2 save
```

### Docker Deployment

```bash
# Pull and run the latest image
docker pull YOUR_USERNAME/eaut-assessment-platform:latest

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://username:password@host:port/database" \
  -e JWT_SECRET="your-jwt-secret" \
  -e NODE_ENV="production" \
  --name eaut-assessment \
  YOUR_USERNAME/eaut-assessment-platform:latest
```

## 🚀 Deployment Platforms

### 🔥 Railway (Recommended)
- **Features**: Auto-scaling, PostgreSQL included, zero-config deployment
- **URL**: [Production Deployment](https://eaut-assessment-platform-production.up.railway.app/)
- **Setup**: One-click deploy button or connect GitHub repository

### 🌐 GitHub Pages
- **Features**: Static demo, free hosting, automatic updates
- **URL**: [Demo Site](https://YOUR_USERNAME.github.io/eaut-assessment-platform/)
- **Setup**: Automatic deployment via GitHub Actions

### ☁️ Render
- **Features**: Auto-scaling, managed PostgreSQL, free SSL
- **URL**: [Staging Environment](https://eaut-assessment-platform.onrender.com/)
- **Setup**: Deploy with `render.yaml` configuration

### ⚡ Vercel
- **Features**: Serverless functions, edge network, automatic scaling
- **URL**: [Serverless Deployment](https://eaut-assessment-platform.vercel.app/)
- **Setup**: Connect GitHub repository for automatic deployments

### 🐳 Docker Hub
- **Features**: Containerized deployment, portable across platforms
- **Image**: `docker pull YOUR_USERNAME/eaut-assessment-platform:latest`
- **Setup**: Use Docker Compose or Kubernetes for orchestration

## 📚 Deployment Documentation

- **Quick Setup Guide**: [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md)
- **Detailed Deployment**: [DEPLOYMENT_README.md](DEPLOYMENT_README.md)
- **Environment Configuration**: [.env.example](.env.example)
- **Development Status**: [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md)

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **Database connection error**:
   - Kiểm tra PostgreSQL đã khởi động
   - Xác minh thông tin kết nối trong `.env`

2. **Port already in use**:
   - Thay đổi PORT trong `.env`
   - Hoặc dừng process đang sử dụng port

3. **Permission denied**:
   - Cấp quyền thực thi cho scripts: `chmod +x *.sh`

4. **Deployment failures**:
   - Check GitHub Actions logs for CI/CD issues
   - Verify environment variables in deployment platform
   - Ensure PostgreSQL database is properly configured

### Logs và Monitoring

- **Application logs**: `logs/app.log`
- **GitHub Actions**: [Workflow runs](https://github.com/YOUR_USERNAME/eaut-assessment-platform/actions)
- **Railway logs**: Available in Railway dashboard
- **Docker logs**: `docker logs eaut-assessment`

## 📈 Performance Monitoring

- **Health Checks**: Built-in health endpoints at `/health`
- **Database Monitoring**: Connection pool and query performance
- **Error Tracking**: Comprehensive error logging and reporting
- **Uptime Monitoring**: External monitoring services integration

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: Security headers and protection

## 📞 Hỗ trợ

- **Email**: support@eaut.edu.vn
- **GitHub Issues**: [Report Issues](https://github.com/YOUR_USERNAME/eaut-assessment-platform/issues)
- **Documentation**: [Deployment Guides](GITHUB_SETUP_GUIDE.md)
- **Discord**: [EAUT Development Community](https://discord.gg/eaut-dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📈 Roadmap

- [ ] Mobile responsive design
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Data export/import
- [ ] Multi-language support
- [ ] SSO integration

---

**Developed with ❤️ by EAUT Development Team**
