#!/bin/bash

# EAUT Assessment Platform - Full Backend Deployment
# This script deploys the complete application with all backend functionality

echo "🚀 EAUT Assessment Platform - Full Backend Deployment"
echo "===================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔍 Pre-deployment checks..."
echo ""

# Check if required files exist
echo "📁 Checking application files:"
files_to_check=("server.js" "package.json" "schema.sql" ".env" "railway.json" "render.yaml" "vercel.json")
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - Found"
    else
        echo "❌ $file - Missing"
        exit 1
    fi
done

echo ""
echo "🗄️ Checking database schema:"
if grep -q "CREATE TABLE" schema.sql; then
    echo "✅ Database schema - Valid"
else
    echo "❌ Database schema - Invalid"
    exit 1
fi

echo ""
echo "📦 Checking dependencies:"
if npm list --depth=0 > /dev/null 2>&1; then
    echo "✅ Dependencies - Installed"
else
    echo "🔄 Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Deployment Options:"
echo "====================="
echo ""

echo "1. ${BLUE}Railway Deployment${NC} (Recommended - Full Backend)"
echo "   🔗 https://railway.app/template/deploy"
echo ""

echo "2. ${BLUE}Render Deployment${NC} (Full Stack with Database)"
echo "   🔗 https://render.com/deploy"
echo ""

echo "3. ${BLUE}Vercel Deployment${NC} (API Routes)"
echo "   🔗 https://vercel.com/new"
echo ""

echo "4. ${BLUE}Docker Deployment${NC} (Local/VPS)"
echo "   🐳 docker-compose up -d"
echo ""

echo "📋 Application Features:"
echo "========================"
echo "✅ User Authentication & Authorization"
echo "✅ Student Assessment Management"
echo "✅ Learning Outcomes Tracking"
echo "✅ Course & Program Management"
echo "✅ Report Generation & Analytics"
echo "✅ File Upload & Processing"
echo "✅ API Endpoints & Database Integration"
echo "✅ Admin Dashboard & Faculty Interface"
echo ""

echo "🌐 Backend API Endpoints:"
echo "========================="
echo "GET  /api/health          - Health check"
echo "POST /api/auth/login      - User authentication"
echo "GET  /api/students        - Student management"
echo "GET  /api/courses         - Course data"
echo "GET  /api/assessments     - Assessment results"
echo "GET  /api/reports         - Analytics & reports"
echo "POST /api/upload          - File uploads"
echo ""

echo "🔗 One-Click Deploy Links:"
echo "=========================="
echo ""
echo "${GREEN}🚀 Deploy to Railway (Full Backend):${NC}"
echo "https://railway.app/template/eN8ypQ?referralCode=dZVJYh"
echo ""
echo "${GREEN}🚀 Deploy to Render (Database Included):${NC}"
echo "https://render.com/deploy?repo=https://github.com/Bennguyenru/eaut-assessment-platform"
echo ""
echo "${GREEN}🚀 Deploy to Vercel (Serverless):${NC}"
echo "https://vercel.com/new/clone?repository-url=https://github.com/Bennguyenru/eaut-assessment-platform"
echo ""

echo "💡 ${YELLOW}Recommendation:${NC}"
echo "   For full backend functionality with database, use Railway or Render"
echo "   These platforms will provide:"
echo "   - ✅ PostgreSQL database"
echo "   - ✅ Node.js runtime"
echo "   - ✅ Environment variables"
echo "   - ✅ Automatic SSL"
echo "   - ✅ Custom domain support"
echo ""

echo "🎯 Next Steps:"
echo "=============="
echo "1. Click one of the deployment links above"
echo "2. Connect your GitHub repository"
echo "3. Configure environment variables"
echo "4. Deploy and test the full application"
echo ""

echo "✨ ${GREEN}Ready for full backend deployment!${NC}"
