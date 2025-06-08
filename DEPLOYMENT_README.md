# 🚀 EAUT Assessment Platform - GitHub Deployment Guide

![Deploy Status](https://github.com/eaut-dev/assessment-platform/workflows/Deploy%20EAUT%20Assessment%20Platform/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## 📋 Quick Deploy Options

### 🔥 One-Click Deployments

| Platform | Status | Deploy Button | Notes |
|----------|--------|---------------|--------|
| **Railway** | ✅ Ready | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id) | Full-stack with PostgreSQL |
| **Render** | ✅ Ready | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/eaut-dev/assessment-platform) | Auto-scaling with database |
| **Vercel** | ⚠️ Serverless | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eaut-dev/assessment-platform) | Serverless functions |
| **GitHub Pages** | 📱 Demo | [View Demo](https://eaut-dev.github.io/assessment-platform) | Static demo only |

### 🐳 Docker Deployment

```bash
# Quick Docker run
docker run -p 3000:3000 ghcr.io/eaut-dev/assessment-platform:latest

# Or with Docker Compose
git clone https://github.com/eaut-dev/assessment-platform.git
cd assessment-platform
docker-compose up -d
```

## 🛠️ Manual Deployment

### Prerequisites

- Node.js >= 14.0.0
- PostgreSQL >= 12.0
- Git

### 1. Clone and Setup

```bash
git clone https://github.com/eaut-dev/assessment-platform.git
cd assessment-platform
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup

```bash
# Create database
createdb eaut_assessment

# Run migrations
psql -d eaut_assessment -f schema.sql
bash init_db.sh
```

### 4. Start Application

```bash
# Development
npm run dev

# Production
npm start
```

## 🌐 Platform-Specific Guides

### Railway Deployment

1. Fork this repository
2. Connect to Railway
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy automatically

**Environment Variables for Railway:**
```
NODE_ENV=production
DATABASE_URL=${{ RAILWAY_POSTGRESQL_URL }}
JWT_SECRET=your-secure-secret
```

### Render Deployment

1. Fork this repository  
2. Create new Web Service in Render
3. Connect your GitHub repo
4. Render will auto-detect settings from `render.yaml`
5. Add PostgreSQL database
6. Environment variables are auto-configured

### Vercel Deployment

> ⚠️ **Note**: Vercel deployment is serverless and has limitations with PostgreSQL connections.

1. Fork this repository
2. Import to Vercel
3. Add Vercel Postgres addon
4. Configure environment variables
5. Deploy

### VPS/Self-Hosted

Complete guide: [VPS Deployment Guide](docs/VPS_DEPLOYMENT.md)

```bash
# Basic VPS setup
git clone https://github.com/eaut-dev/assessment-platform.git
cd assessment-platform
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Server port | No | `3000` |
| `DATABASE_URL` | Full database URL | Yes* | - |
| `DB_HOST` | Database host | Yes* | `localhost` |
| `DB_PORT` | Database port | Yes* | `5432` |
| `DB_NAME` | Database name | Yes* | `eaut_assessment` |
| `DB_USER` | Database user | Yes* | `postgres` |
| `DB_PASSWORD` | Database password | Yes* | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | Token expiration | No | `24h` |

*Either `DATABASE_URL` or individual `DB_*` variables are required.

## 📊 Health Check

All deployments include a health check endpoint:

```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-06-08T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## 🔒 Security Considerations

- Always use strong `JWT_SECRET` in production
- Enable SSL/HTTPS in production
- Configure proper CORS origins
- Use environment variables for sensitive data
- Enable rate limiting (configured by default)

## 🧪 Testing Deployment

```bash
# Install test dependencies
npm install --dev

# Run tests
npm test

# Health check
curl -f http://localhost:3000/api/health
```

## 📝 Default Credentials

**⚠️ Change these in production!**

| Username | Password | Role |
|----------|----------|------|
| `admin` | `password` | System Administrator |
| `quality_admin` | `password` | Quality Administrator |
| `dept_chair` | `password` | Department Chair |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@eaut.edu.vn
- 🐛 Issues: [GitHub Issues](https://github.com/eaut-dev/assessment-platform/issues)
- 📖 Documentation: [Wiki](https://github.com/eaut-dev/assessment-platform/wiki)
- 💬 Discussions: [GitHub Discussions](https://github.com/eaut-dev/assessment-platform/discussions)

---

**Made with ❤️ by EAUT Development Team**
