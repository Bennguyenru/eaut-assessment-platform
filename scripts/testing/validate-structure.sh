#!/bin/bash

# validate-structure.sh - Validate the new scientific directory structure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
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

echo "🔍 EAUT Assessment Platform - Directory Structure Validation"
echo "==========================================================="
echo ""

# Check main directories
print_step "Checking main directory structure..."

main_dirs=(
    "docs/vietnamese"
    "docs/english" 
    "docs/api"
    "src/backend"
    "src/frontend"
    "src/database"
    "config/deployment"
    "config/environment"
    "scripts/deployment"
    "scripts/setup"
    "scripts/testing"
    "tests/unit"
    "tests/integration"
    "tests/e2e"
    "tools/monitoring"
    "tools/automation"
    "assets"
    "logs"
    "uploads"
    "ssl"
)

missing_dirs=()
for dir in "${main_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_success "$dir"
    else
        print_error "$dir (missing)"
        missing_dirs+=("$dir")
    fi
done

echo ""

# Check critical files
print_step "Checking critical files..."

critical_files=(
    "src/backend/package.json"
    "src/backend/server.js"
    "src/frontend/index.html"
    "src/frontend/styles.css"
    "src/frontend/main.js"
    "src/database/schema.sql"
    "src/database/init_db.sh"
    "config/deployment/docker-compose.yml"
    "config/deployment/Dockerfile"
    "config/environment/.env.example"
    "scripts/setup/setup.sh"
    "scripts/setup/quick-start.sh"
    "scripts/deployment/deploy.sh"
    "README.md"
)

missing_files=()
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_error "$file (missing)"
        missing_files+=("$file")
    fi
done

echo ""

# Check package.json scripts
print_step "Validating package.json scripts..."

if [ -f "src/backend/package.json" ]; then
    cd src/backend
    
    # Check if scripts reference correct paths
    required_scripts=(
        "start"
        "dev"
        "test"
        "setup"
        "setup-db"
        "deploy"
        "quick-start"
    )
    
    for script in "${required_scripts[@]}"; do
        if npm run | grep -q "$script"; then
            print_success "Script '$script' found"
        else
            print_warning "Script '$script' missing"
        fi
    done
    
    cd ../../
else
    print_error "Cannot validate package.json - file missing"
fi

echo ""

# Check environment configuration
print_step "Checking environment configuration..."

env_files=(
    "config/environment/.env.example"
    "config/environment/.env.development"  
    "config/environment/.env.production"
)

for env_file in "${env_files[@]}"; do
    if [ -f "$env_file" ]; then
        print_success "$env_file"
        
        # Check if it contains essential variables
        if grep -q "PORT" "$env_file" && grep -q "DB_HOST" "$env_file"; then
            print_info "  Essential variables present"
        else
            print_warning "  Some essential variables may be missing"
        fi
    else
        print_warning "$env_file (missing)"
    fi
done

echo ""

# Test script executability
print_step "Checking script permissions..."

executable_scripts=(
    "scripts/setup/setup.sh"
    "scripts/setup/start-dev.sh"
    "scripts/setup/quick-start.sh"
    "scripts/deployment/deploy.sh"
    "scripts/deployment/deploy-complete.sh"
    "src/database/init_db.sh"
)

for script in "${executable_scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            print_success "$script (executable)"
        else
            print_warning "$script (not executable)"
            chmod +x "$script"
            print_info "  Made executable"
        fi
    else
        print_error "$script (missing)"
    fi
done

echo ""

# Summary
print_step "Validation Summary"

if [ ${#missing_dirs[@]} -eq 0 ] && [ ${#missing_files[@]} -eq 0 ]; then
    print_success "🎉 All directory structure validations passed!"
    echo ""
    print_info "Next steps:"
    echo "  1. Run: ./scripts/setup/setup.sh (for first-time setup)"
    echo "  2. Run: ./scripts/setup/quick-start.sh (for quick start)"
    echo "  3. Test: cd src/backend && npm start"
    echo ""
else
    print_error "Validation failed!"
    
    if [ ${#missing_dirs[@]} -gt 0 ]; then
        echo ""
        print_error "Missing directories:"
        for dir in "${missing_dirs[@]}"; do
            echo "  - $dir"
        done
    fi
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        echo ""
        print_error "Missing files:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
    fi
    
    echo ""
    print_info "Please fix the missing items before proceeding."
    exit 1
fi

print_success "Scientific directory structure validation complete! ✨"
