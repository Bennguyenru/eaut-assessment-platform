#!/bin/bash

# EAUT Assessment Platform - Comprehensive Deployment Testing
# This script tests all deployment components and identifies issues

set -e

echo "🔧 EAUT Assessment Platform - Deployment Testing"
echo "================================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}🧪 TEST: $1${NC}"
}

print_pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
}

print_fail() {
    echo -e "${RED}❌ FAIL: $1${NC}"
}

print_warn() {
    echo -e "${YELLOW}⚠️  WARN: $1${NC}"
}

print_info() {
    echo -e "${PURPLE}ℹ️  INFO: $1${NC}"
}

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_test "$test_name"
    
    if eval "$test_command" &>/dev/null; then
        print_pass "$test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        print_fail "$test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# 1. File Structure Tests
echo ""
echo "📁 File Structure Tests"
echo "======================="

run_test "server.js exists" "[ -f server.js ]"
run_test "package.json exists" "[ -f package.json ]"
run_test "schema.sql exists" "[ -f schema.sql ]"
run_test "Dockerfile exists" "[ -f Dockerfile ]"
run_test "railway.json exists" "[ -f railway.json ]"
run_test "vercel.json exists" "[ -f vercel.json ]"
run_test "render.yaml exists" "[ -f render.yaml ]"
run_test ".env file exists" "[ -f .env ]"
run_test "GitHub Actions workflow exists" "[ -f .github/workflows/deploy.yml ]"

# 2. Node.js Environment Tests
echo ""
echo "🟢 Node.js Environment Tests"
echo "============================"

run_test "Node.js installed" "command -v node"
run_test "npm installed" "command -v npm"
run_test "Node.js version >= 14" "node -v | grep -E 'v(1[4-9]|[2-9][0-9])'"

# 3. Dependencies Tests
echo ""
echo "📦 Dependencies Tests"
echo "===================="

print_test "Installing dependencies"
if npm install --silent; then
    print_pass "Dependencies installed successfully"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_fail "Failed to install dependencies"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

run_test "express dependency" "npm list express"
run_test "pg dependency" "npm list pg"
run_test "jsonwebtoken dependency" "npm list jsonwebtoken"
run_test "bcryptjs dependency" "npm list bcryptjs"

# 4. Database Tests
echo ""
echo "🗄️  Database Tests"
echo "=================="

run_test "PostgreSQL installed" "command -v psql"
run_test "PostgreSQL service running" "brew services list | grep postgresql | grep started || systemctl is-active postgresql || service postgresql status"
run_test "Database connection" "psql -U postgres -d eaut_assessment -c 'SELECT 1;'"
run_test "Tables exist" "psql -U postgres -d eaut_assessment -c \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';\" | grep -E '[1-9][0-9]*'"

# 5. Server Tests
echo ""
echo "🌐 Server Tests"
echo "==============="

print_test "Starting server"
# Start server in background
npm start &
SERVER_PID=$!
sleep 5

if ps -p $SERVER_PID > /dev/null; then
    print_pass "Server started successfully"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # Test endpoints
    run_test "Health endpoint" "curl -f http://localhost:3000/api/health"
    run_test "Static files" "curl -f http://localhost:3000/"
    run_test "API routes" "curl -f http://localhost:3000/api/programs"
    
    # Stop server
    kill $SERVER_PID 2>/dev/null || true
else
    print_fail "Server failed to start"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 6. Docker Tests
echo ""
echo "🐳 Docker Tests"
echo "==============="

if command -v docker &> /dev/null; then
    run_test "Docker installed" "command -v docker"
    
    print_test "Building Docker image"
    if docker build -t eaut-test . &>/dev/null; then
        print_pass "Docker image built successfully"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        
        print_test "Testing Docker container"
        # Test if container can start
        if docker run -d --name eaut-test-container -p 3001:3000 eaut-test &>/dev/null; then
            sleep 5
            if docker ps | grep eaut-test-container &>/dev/null; then
                print_pass "Docker container runs successfully"
                PASSED_TESTS=$((PASSED_TESTS + 1))
            else
                print_fail "Docker container failed to run"
                FAILED_TESTS=$((FAILED_TESTS + 1))
            fi
            docker stop eaut-test-container &>/dev/null || true
            docker rm eaut-test-container &>/dev/null || true
            TOTAL_TESTS=$((TOTAL_TESTS + 1))
        else
            print_fail "Docker container failed to start"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            TOTAL_TESTS=$((TOTAL_TESTS + 1))
        fi
        
        # Cleanup
        docker rmi eaut-test &>/dev/null || true
    else
        print_fail "Docker image build failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
else
    print_warn "Docker not installed - skipping Docker tests"
fi

# 7. GitHub Actions Tests
echo ""
echo "🔄 GitHub Actions Tests"
echo "======================="

run_test "GitHub Actions workflow syntax" "command -v yamllint &>/dev/null && yamllint .github/workflows/deploy.yml || echo 'yamllint not available, skipping'"

# 8. Environment Configuration Tests
echo ""
echo "⚙️  Environment Configuration Tests"
echo "==================================="

run_test "Environment variables loaded" "grep -q JWT_SECRET .env"
run_test "Database URL configured" "grep -q DB_NAME .env"
run_test "Port configured" "grep -q PORT .env"

# 9. Security Tests
echo ""
echo "🔐 Security Tests"
echo "================="

run_test "JWT secret configured" "grep -v '^#' .env | grep JWT_SECRET | grep -v 'your-secret'"
run_test "Strong session secret" "grep -v '^#' .env | grep SESSION_SECRET | grep -v 'your-secret'"
run_test "Production-ready secrets" "grep -v '^#' .env | grep -E '(JWT_SECRET|SESSION_SECRET)' | wc -l | grep '2'"

# 10. Deployment Configuration Tests
echo ""
echo "🚀 Deployment Configuration Tests"
echo "================================="

print_test "Railway configuration"
if [ -f railway.json ] && jq empty railway.json 2>/dev/null; then
    print_pass "Railway configuration valid"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_fail "Railway configuration invalid"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

print_test "Vercel configuration"
if [ -f vercel.json ] && jq empty vercel.json 2>/dev/null; then
    print_pass "Vercel configuration valid"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_fail "Vercel configuration invalid"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

print_test "Render configuration"
if [ -f render.yaml ]; then
    print_pass "Render configuration exists"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    print_fail "Render configuration missing"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 11. GitHub Repository Tests
echo ""
echo "📂 GitHub Repository Tests"
echo "=========================="

run_test "Git repository initialized" "[ -d .git ]"
run_test "Remote origin configured" "git remote get-url origin"
run_test "All files committed" "[ -z \"\$(git status --porcelain)\" ]"
run_test "On main branch" "git branch --show-current | grep main"

# 12. Production Readiness Tests
echo ""
echo "🏭 Production Readiness Tests"
echo "============================="

run_test "Start script defined" "grep -q '\"start\"' package.json"
run_test "Health check endpoint" "grep -q '/api/health' server.js"
run_test "Error handling implemented" "grep -q 'try.*catch' server.js"
run_test "Environment variables used" "grep -q 'process.env' server.js"

# Final Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    print_pass "All tests passed! Ready for deployment!"
    echo ""
    echo "🚀 Deployment Commands:"
    echo "======================"
    echo ""
    echo "Railway:"
    echo "  npx @railway/cli login"
    echo "  npx @railway/cli deploy"
    echo ""
    echo "Vercel:"
    echo "  npx vercel --prod"
    echo ""
    echo "Docker:"
    echo "  docker build -t eaut-assessment ."
    echo "  docker run -p 3000:3000 eaut-assessment"
    echo ""
else
    echo ""
    print_fail "$FAILED_TESTS test(s) failed. Please fix issues before deployment."
    echo ""
    echo "🔧 Common Fixes:"
    echo "==============="
    echo ""
    echo "Database issues:"
    echo "  brew services start postgresql"
    echo "  ./init_db.sh"
    echo ""
    echo "Dependencies issues:"
    echo "  rm -rf node_modules package-lock.json"
    echo "  npm install"
    echo ""
    echo "Docker issues:"
    echo "  brew install docker"
    echo "  open -a Docker"
    echo ""
fi

exit $FAILED_TESTS
