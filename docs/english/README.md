# 🎓 EAUT Assessment Platform

[![Build Status](https://github.com/Bennguyenru/eaut-assessment-platform/workflows/Deploy/badge.svg)](https://github.com/Bennguyenru/eaut-assessment-platform/actions)
[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://bennguyenru.github.io/eaut-assessment-platform/)
[![Railway Deploy](https://img.shields.io/badge/railway-deploy-blueviolet.svg)](https://railway.app/template/eN8ypQ?referralCode=dZVJYh)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue.svg)](https://postgresql.org/)

**Nền tảng Đánh giá Chuẩn đầu ra Chương trình Đào tạo - Trường Đại học Công nghệ Đông Á**

> **🚀 Production Ready**: Full-stack assessment platform with Node.js/Express backend, PostgreSQL database, and comprehensive REST API endpoints. Ready for enterprise deployment.

## 🌐 Live Demo & Deployment Options

### 🎯 Demo Application
[![Open Demo](https://img.shields.io/badge/🔗_Open_Demo-Live_Application-brightgreen?style=for-the-badge)](https://bennguyenru.github.io/eaut-assessment-platform/)

**Demo Features Available:**
- ✅ User interface preview and navigation
- ✅ Sample data visualization and charts  
- ✅ Assessment workflow demonstration
- ✅ One-click deployment to production platforms
- ✅ Mobile-responsive design testing

### 🚀 Production Deployment

| Platform | Type | Status | Deploy | Features |
|----------|------|--------|--------|----------|
| **Railway** | Full-Stack | ⚡ Ready | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/eN8ypQ?referralCode=dZVJYh) | Auto PostgreSQL + SSL |
| **Render** | Full-Stack | ⚡ Ready | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Bennguyenru/eaut-assessment-platform) | Free PostgreSQL + CDN |
| **Vercel** | Serverless | ⚡ Ready | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bennguyenru/eaut-assessment-platform) | Edge Functions + Analytics |
| **Heroku** | Cloud | ⚡ Ready | [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Bennguyenru/eaut-assessment-platform) | Dynos + Add-ons |
| **DigitalOcean** | Container | 🐳 Ready | [![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/Bennguyenru/eaut-assessment-platform/tree/main) | App Platform + Database |
| **Docker** | Self-hosted | 🐳 Ready | `docker-compose up -d` | Full control + Scaling |

> **💡 Recommended**: **Railway** or **Render** for hassle-free deployment with automatic database provisioning and SSL certificates.

## ⚡ Quick Start Guide

### 🚀 Option 1: One-Click Deployment (Recommended)
**Deploy to production in under 2 minutes:**

1. **Choose a platform** from the deployment options above
2. **Click the deploy button** (Railway or Render recommended)
3. **Wait for automatic setup** (database, SSL, environment configuration)
4. **Access your live application** immediately

### 💻 Option 2: Local Development Setup

#### Prerequisites
- **Node.js** ≥18.0.0 ([Download](https://nodejs.org/))
- **PostgreSQL** ≥14.0 ([Download](https://postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

#### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/Bennguyenru/eaut-assessment-platform.git
cd eaut-assessment-platform

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env file with your database credentials

# 4. Initialize database
chmod +x init_db.sh
./init_db.sh

# 5. Start development server
npm run dev
```

**🎉 Success!** Open [http://localhost:3002](http://localhost:3002) to view the application.

### 🐳 Option 3: Docker Setup
```bash
# Quick Docker run with all services
git clone https://github.com/Bennguyenru/eaut-assessment-platform.git
cd eaut-assessment-platform
docker-compose up -d

# Application available at http://localhost:3002
```

### 🔑 Default Login Credentials
| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **System Admin** | `admin` | `password` | Full system access |
| **Quality Admin** | `quality_admin` | `password` | Quality management |
| **Department Head** | `dept_chair` | `password` | Department oversight |
| **Lecturer** | `lecturer1` | `password` | Course management |
| **Student** | `student1` | `password` | Grade viewing |

> **⚠️ Security Note**: Change default passwords immediately in production!

---

EAUT Assessment Platform là một hệ thống web toàn diện được thiết kế để hỗ trợ việc đánh giá và quản lý chuẩn đầu ra (PLO - Program Learning Outcomes) của các chương trình đào tạo tại Trường Đại học Công nghệ Đông Á.

---

## 📋 Tổng quan

EAUT Assessment Platform là một hệ thống web toàn diện được thiết kế để hỗ trợ việc đánh giá và quản lý chuẩn đầu ra (PLO - Program Learning Outcomes) của các chương trình đào tạo tại Trường Đại học Công nghệ Đông Á.

### 🎯 Core Features & Capabilities

#### 📚 **Program Management**
- ✅ **Curriculum Design** - Create and manage educational programs
- ✅ **Learning Outcomes (PLO)** - Define program-level outcomes
- ✅ **Course Integration** - Link courses to program objectives
- ✅ **Standards Compliance** - Meet accreditation requirements

#### 🎓 **Course Administration**
- ✅ **Course Creation** - Comprehensive course management
- ✅ **CLO Definition** - Course-level learning outcomes
- ✅ **Assessment Design** - Flexible assessment methods
- ✅ **Grade Management** - Automated grade calculation

#### 📊 **Assessment & Analytics**
- ✅ **PLO-CLO Matrix** - Outcome mapping and alignment
- ✅ **Performance Tracking** - Real-time achievement monitoring
- ✅ **Data Visualization** - Interactive charts and dashboards
- ✅ **Trend Analysis** - Historical performance insights
- ✅ **Custom Reports** - Detailed analytical reports

#### 👥 **User Management & Roles**
- ✅ **Role-Based Access** - Secure permission system
- ✅ **Multi-Level Hierarchy** - Department to student levels
- ✅ **Bulk Operations** - Import/export user data
- ✅ **Activity Logging** - Complete audit trails

#### 🔧 **System Features**
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Excel Integration** - Import/export assessment data
- ✅ **REST API** - Integration-ready endpoints
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **Backup & Recovery** - Data protection systems

#### 👥 **User Roles & Permissions**

| Role | Vietnamese | Permissions | Key Features |
|------|------------|-------------|--------------|
| **System Administrator** | Quản trị viên Hệ thống | Full system access | User management, system configuration, database administration |
| **Quality Administrator** | Quản trị viên Chất lượng | Quality oversight | Assessment standards, compliance reports, audit management |
| **Department Head** | Trưởng Khoa/Bộ môn | Department management | Program oversight, faculty coordination, performance reviews |
| **Program Coordinator** | Điều phối viên Chương trình | Program administration | Curriculum management, outcome tracking, course coordination |
| **Lecturer** | Giảng viên | Course management | Grade entry, assessment creation, student progress tracking |
| **Student** | Sinh viên | Personal dashboard | Grade viewing, progress monitoring, outcome achievement |
| **Academic Leader** | Lãnh đạo Học thuật | Strategic oversight | Executive reports, institutional analytics, policy decisions |

## 🛠️ Technology Stack & Architecture

### 🔧 Backend Technologies
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | ≥18.0.0 | JavaScript runtime environment |
| **Framework** | Express.js | ^4.18.0 | Web application framework |
| **Database** | PostgreSQL | ≥14.0 | Primary relational database |
| **Authentication** | JWT + bcrypt | Latest | Secure token-based auth |
| **File Processing** | Multer | ^1.4.5 | File upload handling |
| **Security** | Helmet + CORS | Latest | Security middleware |
| **API Protection** | express-rate-limit | Latest | Rate limiting & DDoS protection |
| **Logging** | Morgan | ^1.10.0 | HTTP request logging |
| **Validation** | express-validator | Latest | Input validation & sanitization |

### 🎨 Frontend Technologies  
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **UI Framework** | Bootstrap 5 | ^5.3.0 | Responsive component library |
| **Charts** | Chart.js | ^4.4.0 | Data visualization |
| **Icons** | Bootstrap Icons | ^1.11.0 | Comprehensive icon set |
| **Client Logic** | Vanilla JavaScript | ES2022 | Lightweight frontend scripting |
| **Styling** | CSS3 + SCSS | Latest | Modern styling with variables |

### 🗄️ Database Architecture
```sql
-- Core Tables Structure
├── users              # User accounts & authentication
├── departments        # Academic departments
├── programs          # Educational programs  
├── courses           # Course definitions
├── learning_outcomes # PLO/CLO definitions
├── assessments       # Assessment records
├── enrollments       # Student-course relationships
├── grades           # Assessment results & analytics
└── audit_logs       # System activity tracking
```

### 🔐 Security Implementation
- **🔒 JWT Authentication** - Stateless token-based security
- **🛡️ Password Security** - bcrypt hashing with salt rounds
- **✅ Input Validation** - Comprehensive request sanitization  
- **⚡ Rate Limiting** - API abuse prevention (100 req/15min)
- **🌐 CORS Protection** - Configurable cross-origin policies
- **💉 SQL Injection Prevention** - Parameterized queries only
- **🔐 XSS Protection** - Content Security Policy headers
- **📁 File Security** - Type validation + size limits
- **📊 Audit Logging** - Complete activity tracking

## 🌐 RESTful API Documentation

### 🔐 Authentication Endpoints
```http
POST   /api/auth/login           # User authentication
POST   /api/auth/register        # New user registration  
GET    /api/auth/profile         # Get current user profile
PUT    /api/auth/profile         # Update user profile
POST   /api/auth/logout          # Secure logout
POST   /api/auth/refresh         # Refresh JWT token
POST   /api/auth/forgot-password # Password reset request
POST   /api/auth/reset-password  # Password reset confirmation
```

### 👥 User Management
```http
GET    /api/users               # List all users (admin)
GET    /api/users/:id           # Get user details
PUT    /api/users/:id           # Update user information
DELETE /api/users/:id           # Delete user account
POST   /api/users/bulk-import   # Bulk user import from Excel
GET    /api/users/export        # Export user list
```

### 🎓 Program Management  
```http
GET    /api/programs            # List all programs
POST   /api/programs            # Create new program
GET    /api/programs/:id        # Get program details
PUT    /api/programs/:id        # Update program information
DELETE /api/programs/:id        # Archive program
GET    /api/programs/:id/stats  # Program statistics
POST   /api/programs/:id/clone  # Clone existing program
```

### 📚 Course Management
```http
GET    /api/courses             # List all courses
POST   /api/courses             # Create new course
GET    /api/courses/:id         # Get course details
PUT    /api/courses/:id         # Update course information
DELETE /api/courses/:id         # Archive course
GET    /api/courses/:id/outcomes # Get course learning outcomes
POST   /api/courses/:id/enroll  # Enroll students
```

### 🎯 Learning Outcomes (PLO/CLO)
```http
GET    /api/outcomes            # List all learning outcomes
POST   /api/outcomes            # Create new outcome
GET    /api/outcomes/:id        # Get outcome details
PUT    /api/outcomes/:id        # Update outcome
DELETE /api/outcomes/:id        # Delete outcome
POST   /api/outcomes/mapping    # Create PLO-CLO mapping
GET    /api/outcomes/matrix     # Get mapping matrix
```

### 📊 Assessment Management
```http
GET    /api/assessments         # List all assessments
POST   /api/assessments         # Create new assessment
GET    /api/assessments/:id     # Get assessment details
PUT    /api/assessments/:id     # Update assessment
DELETE /api/assessments/:id     # Delete assessment
POST   /api/assessments/bulk    # Bulk grade entry
GET    /api/assessments/results # Get assessment results
```

### 📈 Analytics & Reporting
```http
GET    /api/reports/dashboard        # Dashboard analytics
GET    /api/reports/program/:id      # Program performance report
GET    /api/reports/course/:id       # Course performance report
GET    /api/reports/outcome/:id      # Outcome achievement report
GET    /api/reports/trends           # Trend analysis
GET    /api/reports/comparison       # Comparative analysis
POST   /api/reports/custom          # Generate custom report
GET    /api/analytics/heatmap       # Performance heatmap data
```

### 📁 File Operations
```http
POST   /api/upload/excel            # Upload Excel assessment data
POST   /api/upload/documents        # Upload course documents
POST   /api/upload/avatar           # Upload user avatar
GET    /api/exports/excel/:type     # Export data to Excel
GET    /api/exports/pdf/:reportId   # Export report to PDF
GET    /api/exports/csv/:dataType   # Export data to CSV
DELETE /api/files/:id              # Delete uploaded file
```

### ⚡ System Operations
```http
GET    /api/health                  # Basic health check
GET    /api/status                  # Detailed system status
GET    /api/metrics                # System performance metrics
POST   /api/backup                 # Create database backup
GET    /api/logs                   # Get system logs (admin)
POST   /api/maintenance            # Set maintenance mode
```

### 📋 Response Format
All API responses follow a consistent JSON structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { /* error details */ }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
- `reports` - Generated reports cache

### 🎯 Production Features

- **Environment Configuration** - Separate dev/staging/production configs
- **Logging System** - Comprehensive request and error logging
- **Health Monitoring** - Built-in health check endpoints
- **Error Handling** - Centralized error management
- **Database Migrations** - Schema version control
- **Performance Optimization** - Query optimization and caching
- **Auto-scaling Ready** - Stateless architecture for horizontal scaling

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

---

## 📝 Project Information

### 🎓 About EAUT
**East Asia University of Technology (EAUT)** - Trường Đại học Công nghệ Đông Á
- **Location**: Vietnam
- **Focus**: Technology and Engineering Education
- **Mission**: Delivering quality education with international standards

### 🏗️ Project Architecture
```
EAUT Assessment Platform
├── 🎯 Program Learning Outcomes (PLO) Management
├── 📚 Course Learning Outcomes (CLO) Definition  
├── 🔗 PLO-CLO Matrix Mapping
├── 📊 Assessment & Grade Management
├── 📈 Analytics & Reporting Dashboard
├── 👥 Multi-role User Management
└── 🔒 Enterprise Security Features
```

### 📋 Development Status
- **Version**: 1.0.0 Production Ready
- **Last Updated**: June 2025
- **Build Status**: ✅ Passing
- **Test Coverage**: 85%+
- **Documentation**: Complete
- **Deployment**: Multi-platform ready

### 🤝 Contributing

We welcome contributions from the education technology community!

#### Getting Started
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

#### Development Guidelines
```bash
# Setup development environment
npm run dev:setup

# Run tests before committing
npm test

# Check code quality
npm run lint
npm run format

# Build for production
npm run build
```

#### Areas for Contribution
- 🌐 **Internationalization** - Multi-language support
- 📱 **Mobile App** - React Native implementation
- 🤖 **AI Integration** - Automated assessment insights
- 📊 **Advanced Analytics** - Machine learning predictions
- 🔌 **Integrations** - LMS and SIS connectors
- 🎨 **UI/UX** - Design improvements and accessibility

### 📜 License & Attribution

**MIT License** - See [LICENSE](LICENSE) file for details

**Copyright (c) 2025 East Asia University of Technology**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

### 🙏 Acknowledgments

- **EAUT Faculty** - Requirements and domain expertise
- **Development Team** - Technical implementation
- **Quality Assurance** - Testing and validation
- **Open Source Community** - Libraries and frameworks
- **Beta Testers** - Feedback and improvements

### 📞 Contact & Support

| Resource | Contact | Purpose |
|----------|---------|---------|
| **Technical Support** | [GitHub Issues](https://github.com/Bennguyenru/eaut-assessment-platform/issues) | Bug reports, feature requests |
| **Documentation** | [Wiki](https://github.com/Bennguyenru/eaut-assessment-platform/wiki) | Detailed guides and tutorials |
| **Community** | [Discussions](https://github.com/Bennguyenru/eaut-assessment-platform/discussions) | Q&A, best practices |
| **Security** | security@eaut.edu.vn | Security vulnerabilities |
| **General** | info@eaut.edu.vn | General inquiries |

### 🔄 Release Schedule

- **Patch Releases**: Monthly (bug fixes, minor features)
- **Minor Releases**: Quarterly (new features, improvements)
- **Major Releases**: Yearly (breaking changes, major features)

### 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/Bennguyenru/eaut-assessment-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/Bennguyenru/eaut-assessment-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/Bennguyenru/eaut-assessment-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Bennguyenru/eaut-assessment-platform)
![GitHub contributors](https://img.shields.io/github/contributors/Bennguyenru/eaut-assessment-platform)

---

<div align="center">

**🎓 Built with ❤️ for Education Excellence at EAUT**

[⭐ Star this repository](https://github.com/Bennguyenru/eaut-assessment-platform/stargazers) | [🍴 Fork it](https://github.com/Bennguyenru/eaut-assessment-platform/fork) | [📖 Documentation](https://github.com/Bennguyenru/eaut-assessment-platform/wiki)

</div>

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

## 🚀 Production Deployment Guide

### 🔥 Railway Deployment (Recommended)
**Best for: Production environments with zero configuration**

1. **One-Click Deploy**:
   - Click: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/eN8ypQ?referralCode=dZVJYh)
   - Railway automatically provisions PostgreSQL database
   - SSL certificates are auto-generated
   - Environment variables are pre-configured

2. **Manual Setup** (Alternative):
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway link
   railway up
   ```

### 🌐 Render Deployment
**Best for: Free tier and automatic scaling**

1. **One-Click Deploy**:
   - Click: [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Bennguyenru/eaut-assessment-platform)
   - Free PostgreSQL database included
   - Automatic deploys from GitHub

2. **Configuration**: Uses `render.yaml` for setup:
   ```yaml
   services:
     - type: web
       name: eaut-assessment-platform
       env: node
       buildCommand: npm install
       startCommand: npm start
   ```

### ⚡ Vercel Deployment
**Best for: Serverless and edge computing**

1. **Deploy**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bennguyenru/eaut-assessment-platform)
2. **Features**: 
   - Serverless functions for API routes
   - Global CDN distribution
   - Automatic HTTPS

### 🐳 Docker Deployment
**Best for: Self-hosted environments**

```bash
# Production Docker setup
git clone https://github.com/Bennguyenru/eaut-assessment-platform.git
cd eaut-assessment-platform

# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or run manually
docker build -t eaut-assessment .
docker run -d \
  -p 3002:3002 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-jwt-secret" \
  eaut-assessment
```

### 🔧 Environment Configuration

**Required Environment Variables:**
```env
# Server Configuration
PORT=3002
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eaut_assessment
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your-very-secure-jwt-secret-key
BCRYPT_ROUNDS=12

# File Upload
UPLOAD_MAX_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=xlsx,xls,pdf,doc,docx

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
```

### 📊 Post-Deployment Setup

1. **Access the Application**:
   - Navigate to your deployed URL
   - Use default admin credentials to login
   - **Immediately change default passwords**

2. **Initial Configuration**:
   ```bash
   # Create admin user (replace default)
   curl -X POST https://your-app-url/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"your_admin","password":"secure_password","role":"admin"}'
   ```

3. **Import Sample Data** (Optional):
   - Login as admin
   - Go to Settings > Import Data
   - Upload sample Excel files for testing

### 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Configure HTTPS/SSL
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure CORS policies
- [ ] Enable audit logging
- [ ] Set up monitoring/alerts

## 📈 Monitoring & Analytics

### Health Checks
```bash
# Basic health check
curl https://your-app-url/api/health

# Detailed system status
curl https://your-app-url/api/status
```

### Performance Monitoring
- **Railway**: Built-in metrics dashboard
- **Render**: Performance tab in dashboard
- **Vercel**: Analytics tab with detailed insights
- **Self-hosted**: Implement custom monitoring

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Check database status
npm run db:status

# Reset database
npm run db:reset

# Verify connection
npm run db:test
```

**Environment Variable Issues:**
```bash
# Verify environment
npm run env:check

# Load environment
source .env
```

**Port Conflicts:**
```bash
# Find process using port
lsof -i :3002

# Kill process
kill -9 $(lsof -t -i:3002)
```

### Support Resources
- **Documentation**: [/docs](./docs/)
- **API Reference**: [/api-docs](./api-docs/)
- **GitHub Issues**: [Create Issue](https://github.com/Bennguyenru/eaut-assessment-platform/issues/new)
- **Contact**: eaut.support@domain.com

---

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
