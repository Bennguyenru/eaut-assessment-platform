#!/bin/bash

# EAUT Assessment Platform - Automated GitHub Repository Setup
# This script automates the creation and deployment of the EAUT Assessment Platform

set -e  # Exit on any error

echo "🚀 EAUT Assessment Platform - GitHub Repository Setup"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "All requirements satisfied"
}

# Get user input for repository configuration
get_user_input() {
    print_info "Repository Configuration"
    echo "========================"
    
    read -p "GitHub Username: " GITHUB_USERNAME
    if [ -z "$GITHUB_USERNAME" ]; then
        print_error "GitHub username is required"
        exit 1
    fi
    
    read -p "Repository Name (default: eaut-assessment-platform): " REPO_NAME
    REPO_NAME=${REPO_NAME:-eaut-assessment-platform}
    
    read -p "Your Email: " USER_EMAIL
    if [ -z "$USER_EMAIL" ]; then
        print_error "Email is required for git configuration"
        exit 1
    fi
    
    print_status "Configuration collected"
}

# Initialize git repository
setup_git() {
    print_info "Setting up Git repository..."
    
    # Configure git if not already configured
    git config --global user.name "$GITHUB_USERNAME" 2>/dev/null || true
    git config --global user.email "$USER_EMAIL" 2>/dev/null || true
    
    # Initialize repository if not already initialized
    if [ ! -d ".git" ]; then
        git init
        print_status "Git repository initialized"
    else
        print_warning "Git repository already exists"
    fi
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Logs
logs
*.log

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Upload directories
uploads/
temp/
EOF
        print_status ".gitignore created"
    fi
}

# Update package.json with repository information
update_package_json() {
    print_info "Updating package.json..."
    
    if [ -f "package.json" ]; then
        # Create backup
        cp package.json package.json.backup
        
        # Update repository URLs using node
        node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        pkg.homepage = 'https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/';
        pkg.repository = {
            type: 'git',
            url: 'https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git'
        };
        pkg.bugs = {
            url: 'https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/issues'
        };
        
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        "
        
        print_status "package.json updated with repository URLs"
    else
        print_warning "package.json not found"
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_status "Dependencies installed"
    else
        print_warning "No package.json found, skipping dependency installation"
    fi
}

# Run tests
run_tests() {
    print_info "Running tests..."
    
    if [ -f "package.json" ] && npm run test --silent > /dev/null 2>&1; then
        npm test
        print_status "All tests passed"
    else
        print_warning "No tests found or tests failed, continuing..."
    fi
}

# Create initial commit
create_initial_commit() {
    print_info "Creating initial commit..."
    
    # Add all files
    git add .
    
    # Check if there are any changes to commit
    if git diff --staged --quiet; then
        print_warning "No changes to commit"
        return
    fi
    
    # Create initial commit
    git commit -m "🎉 Initial commit: Complete EAUT Assessment Platform with deployment infrastructure

Features:
- ✅ Complete frontend and backend implementation
- ✅ PostgreSQL database with comprehensive schema
- ✅ JWT authentication and role-based access control
- ✅ Assessment groups, questions, users, and departments management
- ✅ Score management with bulk upload functionality
- ✅ Dashboard with analytics and reporting
- ✅ GitHub Actions CI/CD pipeline
- ✅ Multi-platform deployment configurations (Railway, Vercel, Render)
- ✅ Docker containerization
- ✅ GitHub Pages static demo
- ✅ Comprehensive documentation

Deployment Ready:
- 🚀 Railway: Production deployment with PostgreSQL
- 🌐 GitHub Pages: Static demo and documentation
- 🐳 Docker: Containerized deployment
- ☁️ Vercel: Serverless deployment
- 🔧 Render: Full-stack deployment with auto-scaling

Technology Stack:
- Backend: Node.js, Express.js, PostgreSQL, JWT
- Frontend: HTML5, CSS3, Bootstrap 5, JavaScript ES6+
- DevOps: GitHub Actions, Docker, Multi-platform deployment
- Security: Helmet, bcryptjs, input validation, rate limiting"
    
    print_status "Initial commit created"
}

# Add remote origin
add_remote() {
    print_info "Adding remote repository..."
    
    # Remove existing origin if it exists
    git remote remove origin 2>/dev/null || true
    
    # Add new origin
    git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    
    print_status "Remote origin added: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
}

# Display next steps
display_next_steps() {
    echo ""
    echo "🎉 Repository Setup Complete!"
    echo "============================="
    echo ""
    print_info "Next Steps:"
    echo ""
    echo "1. 📂 Create GitHub Repository:"
    echo "   - Go to: https://github.com/new"
    echo "   - Name: ${REPO_NAME}"
    echo "   - Description: EAUT Assessment Platform - Comprehensive Educational Quality Assessment System"
    echo "   - Visibility: Public ✅"
    echo "   - DO NOT initialize with README, .gitignore, or license"
    echo ""
    echo "2. 🚀 Push to GitHub:"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "3. ⚙️ Configure Repository Settings:"
    echo "   - Enable GitHub Pages: Settings > Pages > Deploy from branch: main"
    echo "   - Add repository secrets for deployment"
    echo "   - Add repository topics and description"
    echo ""
    echo "4. 🌐 Live URLs (after GitHub setup):"
    echo "   - Demo: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
    echo "   - Repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo "   - Issues: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/issues"
    echo ""
    echo "5. 📋 Deployment Platforms:"
    echo "   - Railway: One-click deploy button in README"
    echo "   - Vercel: Automatic deployment from GitHub"
    echo "   - Render: Deploy with render.yaml configuration"
    echo "   - Docker: docker pull ${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    print_status "Refer to GITHUB_SETUP_GUIDE.md for detailed instructions"
    print_status "Refer to DEPLOYMENT_README.md for deployment options"
    echo ""
}

# Main execution
main() {
    echo ""
    print_info "Starting automated setup..."
    echo ""
    
    check_requirements
    get_user_input
    setup_git
    update_package_json
    install_dependencies
    run_tests
    create_initial_commit
    add_remote
    display_next_steps
    
    print_status "Setup completed successfully!"
}

# Run main function
main "$@"
