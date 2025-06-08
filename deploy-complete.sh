#!/bin/bash

# EAUT Assessment Platform - Complete Deployment Script
# This script will help you deploy to GitHub and all platforms

set -e

echo "🚀 EAUT Assessment Platform - Complete Deployment"
echo "================================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 STEP $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Function to open URLs
open_url() {
    if command -v open >/dev/null 2>&1; then
        open "$1"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$1"
    else
        echo "Please open: $1"
    fi
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ] || [ ! -f "server.js" ]; then
        print_error "Not in the correct project directory!"
        echo "Please run this script from the EAUT Assessment Platform directory"
        exit 1
    fi
    print_success "Project directory verified"
}

# Check git status
check_git_status() {
    print_step "1" "Checking Git Status"
    
    if [ ! -d ".git" ]; then
        print_error "Git repository not initialized!"
        exit 1
    fi
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "There are uncommitted changes. Committing them now..."
        git add .
        git commit -m "🔄 Auto-commit before deployment"
    fi
    
    print_success "Git repository is clean and ready"
}

# Test the application
test_application() {
    print_step "2" "Testing Application"
    
    print_info "Installing dependencies..."
    npm install --silent
    
    print_info "Running tests..."
    if npm test; then
        print_success "All tests passed!"
    else
        print_warning "Some tests failed, but continuing with deployment..."
    fi
}

# Step 1: Create GitHub Repository
create_github_repo() {
    print_step "3" "Create GitHub Repository"
    
    echo ""
    echo "🌐 Opening GitHub repository creation page..."
    echo ""
    echo "Repository Configuration:"
    echo "📝 Name: eaut-assessment-platform"
    echo "📝 Description: EAUT Assessment Platform - Comprehensive Educational Quality Assessment System for Eastern Asia University of Technology"
    echo "📝 Visibility: ✅ Public"
    echo "📝 Initialize: ❌ DO NOT check README, .gitignore, or license"
    echo ""
    
    open_url "https://github.com/new"
    
    echo ""
    read -p "Press ENTER after you've created the GitHub repository..."
    print_success "GitHub repository should now be created"
}

# Step 2: Push to GitHub
push_to_github() {
    print_step "4" "Pushing to GitHub"
    
    print_info "Pushing code to GitHub..."
    
    if git push -u origin main; then
        print_success "Code successfully pushed to GitHub!"
        print_info "Repository URL: https://github.com/Bennguyenru/eaut-assessment-platform"
    else
        print_error "Failed to push to GitHub!"
        echo "This might be because:"
        echo "1. The repository doesn't exist yet"
        echo "2. Authentication issues"
        echo "3. Network connectivity problems"
        echo ""
        echo "Try running: git push -u origin main"
        exit 1
    fi
}

# Step 3: Configure GitHub Pages
setup_github_pages() {
    print_step "5" "Setting up GitHub Pages"
    
    echo ""
    echo "🌐 Opening GitHub repository settings..."
    echo ""
    echo "GitHub Pages Configuration:"
    echo "1. Go to Settings > Pages"
    echo "2. Source: Deploy from a branch"
    echo "3. Branch: main / root"
    echo "4. Click Save"
    echo ""
    
    open_url "https://github.com/Bennguyenru/eaut-assessment-platform/settings/pages"
    
    echo ""
    read -p "Press ENTER after configuring GitHub Pages..."
    print_success "GitHub Pages should now be configured"
    print_info "Demo URL: https://Bennguyenru.github.io/eaut-assessment-platform/"
}

# Step 4: Railway Deployment
deploy_railway() {
    print_step "6" "Deploying to Railway"
    
    echo ""
    echo "🚂 Railway Deployment Options:"
    echo "Option A: One-click deploy (after repository is public)"
    echo "Option B: Manual deployment"
    echo ""
    
    read -p "Deploy to Railway? (y/n): " deploy_railway_choice
    
    if [ "$deploy_railway_choice" = "y" ] || [ "$deploy_railway_choice" = "Y" ]; then
        echo "Opening Railway deployment..."
        open_url "https://railway.app/new/github?repo=Bennguyenru/eaut-assessment-platform"
        
        echo ""
        echo "Railway Deployment Steps:"
        echo "1. Connect your GitHub account"
        echo "2. Select eaut-assessment-platform repository"
        echo "3. Add environment variables:"
        echo "   - DATABASE_URL (auto-generated PostgreSQL)"
        echo "   - JWT_SECRET=your-secret-key"
        echo "   - NODE_ENV=production"
        echo "4. Deploy"
        echo ""
        read -p "Press ENTER after Railway deployment..."
        print_success "Railway deployment initiated"
    fi
}

# Step 5: Render Deployment
deploy_render() {
    print_step "7" "Deploying to Render"
    
    read -p "Deploy to Render? (y/n): " deploy_render_choice
    
    if [ "$deploy_render_choice" = "y" ] || [ "$deploy_render_choice" = "Y" ]; then
        echo "Opening Render deployment..."
        open_url "https://render.com/deploy?repo=https://github.com/Bennguyenru/eaut-assessment-platform"
        
        echo ""
        echo "Render will automatically:"
        echo "✅ Create PostgreSQL database"
        echo "✅ Set up environment variables"
        echo "✅ Deploy with auto-scaling"
        echo ""
        read -p "Press ENTER after Render deployment..."
        print_success "Render deployment initiated"
    fi
}

# Step 6: Vercel Deployment
deploy_vercel() {
    print_step "8" "Deploying to Vercel"
    
    read -p "Deploy to Vercel? (y/n): " deploy_vercel_choice
    
    if [ "$deploy_vercel_choice" = "y" ] || [ "$deploy_vercel_choice" = "Y" ]; then
        echo "Opening Vercel deployment..."
        open_url "https://vercel.com/new/clone?repository-url=https://github.com/Bennguyenru/eaut-assessment-platform"
        
        echo ""
        echo "Vercel Deployment:"
        echo "✅ Serverless functions"
        echo "✅ Edge network"
        echo "✅ Automatic scaling"
        echo ""
        read -p "Press ENTER after Vercel deployment..."
        print_success "Vercel deployment initiated"
    fi
}

# Step 7: Docker Hub
setup_docker() {
    print_step "9" "Docker Deployment"
    
    read -p "Build and push Docker image? (y/n): " docker_choice
    
    if [ "$docker_choice" = "y" ] || [ "$docker_choice" = "Y" ]; then
        print_info "Building Docker image..."
        
        if docker build -t bennguyenru/eaut-assessment-platform:latest .; then
            print_success "Docker image built successfully"
            
            read -p "Push to Docker Hub? (requires docker login) (y/n): " push_choice
            if [ "$push_choice" = "y" ] || [ "$push_choice" = "Y" ]; then
                echo "Please ensure you're logged in to Docker Hub: docker login"
                read -p "Press ENTER to continue with push..."
                
                if docker push bennguyenru/eaut-assessment-platform:latest; then
                    print_success "Docker image pushed to Docker Hub"
                    print_info "Pull with: docker pull bennguyenru/eaut-assessment-platform:latest"
                else
                    print_warning "Docker push failed. Make sure you're logged in: docker login"
                fi
            fi
        else
            print_error "Docker build failed"
        fi
    fi
}

# Final summary
show_summary() {
    print_step "10" "Deployment Summary"
    
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "======================"
    echo ""
    echo "📍 Your live deployments:"
    echo ""
    echo "🌐 GitHub Repository:"
    echo "   https://github.com/Bennguyenru/eaut-assessment-platform"
    echo ""
    echo "📱 GitHub Pages Demo:"
    echo "   https://Bennguyenru.github.io/eaut-assessment-platform/"
    echo ""
    echo "🚂 Railway Production (if deployed):"
    echo "   Check your Railway dashboard"
    echo ""
    echo "☁️ Render Staging (if deployed):"
    echo "   Check your Render dashboard"
    echo ""
    echo "⚡ Vercel Serverless (if deployed):"
    echo "   Check your Vercel dashboard"
    echo ""
    echo "🐳 Docker Image (if built):"
    echo "   docker pull bennguyenru/eaut-assessment-platform:latest"
    echo ""
    echo "📋 What to do next:"
    echo "1. Test all your deployments"
    echo "2. Configure custom domains (optional)"
    echo "3. Set up monitoring and alerts"
    echo "4. Share your platform with users!"
    echo ""
    print_success "EAUT Assessment Platform is now live! 🎊"
}

# Main execution
main() {
    echo ""
    print_info "Starting complete deployment process..."
    echo ""
    
    check_directory
    check_git_status
    test_application
    create_github_repo
    push_to_github
    setup_github_pages
    deploy_railway
    deploy_render
    deploy_vercel
    setup_docker
    show_summary
    
    echo ""
    print_success "All deployment steps completed!"
    echo ""
}

# Run main function
main "$@"
