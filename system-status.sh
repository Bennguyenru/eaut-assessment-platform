#!/bin/bash

# system-status.sh - Check system status and health

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check system requirements
check_system_requirements() {
    print_header "System Requirements Check"
    
    # Check macOS version
    if [[ "$OSTYPE" == "darwin"* ]]; then
        MACOS_VERSION=$(sw_vers -productVersion)
        print_success "macOS version: $MACOS_VERSION"
    else
        print_warning "Not running on macOS"
    fi
    
    # Check available disk space
    DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -lt 80 ]; then
        print_success "Disk usage: ${DISK_USAGE}% (Available)"
    else
        print_warning "Disk usage: ${DISK_USAGE}% (Running low)"
    fi
    
    # Check memory
    MEMORY_GB=$(echo "$(sysctl -n hw.memsize) / 1024 / 1024 / 1024" | bc)
    print_success "Total memory: ${MEMORY_GB}GB"
    
    echo ""
}

# Check dependencies
check_dependencies() {
    print_header "Dependencies Check"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js: $NODE_VERSION"
    else
        print_error "Node.js: Not installed"
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm: $NPM_VERSION"
    else
        print_error "npm: Not installed"
    fi
    
    # Check PostgreSQL
    if command -v psql &> /dev/null; then
        PSQL_VERSION=$(psql --version | awk '{print $3}')
        print_success "PostgreSQL: $PSQL_VERSION"
    else
        print_error "PostgreSQL: Not installed"
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
        print_success "Docker: $DOCKER_VERSION"
    else
        print_warning "Docker: Not installed (optional)"
    fi
    
    # Check Homebrew
    if command -v brew &> /dev/null; then
        BREW_VERSION=$(brew --version | head -n1 | awk '{print $2}')
        print_success "Homebrew: $BREW_VERSION"
    else
        print_warning "Homebrew: Not installed"
    fi
    
    echo ""
}

# Check project files
check_project_files() {
    print_header "Project Files Check"
    
    required_files=(
        "package.json"
        "server.js"
        "index.html"
        "main.js"
        "styles.css"
        "schema.sql"
        ".env"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file"
        else
            print_error "$file: Missing"
        fi
    done
    
    # Check directories
    required_dirs=("logs" "uploads")
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            print_success "Directory: $dir"
        else
            print_warning "Directory: $dir (will be created)"
        fi
    done
    
    echo ""
}

# Check services
check_services() {
    print_header "Services Check"
    
    # Check if PostgreSQL is running
    if brew services list | grep postgresql | grep started &> /dev/null; then
        print_success "PostgreSQL service: Running"
    else
        print_error "PostgreSQL service: Not running"
    fi
    
    # Check if Node.js app is running
    if lsof -ti:3000 &> /dev/null; then
        PID=$(lsof -ti:3000)
        print_success "EAUT Application: Running (PID: $PID)"
    else
        print_warning "EAUT Application: Not running"
    fi
    
    echo ""
}

# Check database connectivity
check_database() {
    print_header "Database Check"
    
    # Check if database exists
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw eaut_assessment 2>/dev/null; then
        print_success "Database 'eaut_assessment': Exists"
        
        # Check table count
        TABLE_COUNT=$(psql -U postgres -d eaut_assessment -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)
        if [ "$TABLE_COUNT" -gt 0 ]; then
            print_success "Database tables: $TABLE_COUNT tables found"
        else
            print_warning "Database tables: No tables found"
        fi
        
        # Check sample data
        USER_COUNT=$(psql -U postgres -d eaut_assessment -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)
        if [ "$USER_COUNT" -gt 0 ]; then
            print_success "Sample data: $USER_COUNT users found"
        else
            print_warning "Sample data: No users found"
        fi
        
    else
        print_error "Database 'eaut_assessment': Does not exist"
    fi
    
    echo ""
}

# Check network connectivity
check_network() {
    print_header "Network Check"
    
    # Check if port 3000 is available or in use
    if lsof -ti:3000 &> /dev/null; then
        print_warning "Port 3000: In use"
    else
        print_success "Port 3000: Available"
    fi
    
    # Check if port 5432 is available or in use (PostgreSQL)
    if lsof -ti:5432 &> /dev/null; then
        print_success "Port 5432: In use (PostgreSQL)"
    else
        print_warning "Port 5432: Not in use"
    fi
    
    # Test localhost connectivity
    if curl -s http://localhost:3000/api/health &> /dev/null; then
        print_success "Application health check: Passed"
    else
        print_warning "Application health check: Failed (app not running)"
    fi
    
    echo ""
}

# Show environment information
show_environment() {
    print_header "Environment Information"
    
    if [ -f ".env" ]; then
        print_success "Environment file: Found"
        echo "Current settings:"
        grep -E "^(PORT|NODE_ENV|DB_)" .env | while read line; do
            echo "  $line"
        done
    else
        print_warning "Environment file: Not found"
    fi
    
    echo ""
}

# Show recommendations
show_recommendations() {
    print_header "Recommendations"
    
    # Check if Node.js is not installed
    if ! command -v node &> /dev/null; then
        echo "📦 Install Node.js:"
        echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        echo "   nvm install 18"
        echo "   OR: brew install node"
        echo ""
    fi
    
    # Check if PostgreSQL is not installed
    if ! command -v psql &> /dev/null; then
        echo "🗄️  Install PostgreSQL:"
        echo "   brew install postgresql@15"
        echo "   brew services start postgresql@15"
        echo ""
    fi
    
    # Check if database doesn't exist
    if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw eaut_assessment 2>/dev/null; then
        echo "🔧 Setup database:"
        echo "   ./setup.sh"
        echo "   OR manually: createdb -U postgres eaut_assessment"
        echo ""
    fi
    
    # Check if app is not running
    if ! lsof -ti:3000 &> /dev/null; then
        echo "🚀 Start the application:"
        echo "   npm start (production)"
        echo "   npm run dev (development)"
        echo "   ./docker-setup.sh (Docker)"
        echo ""
    fi
    
    echo ""
}

# Main status check
main() {
    echo ""
    print_header "🎓 EAUT Assessment Platform - System Status"
    echo ""
    
    check_system_requirements
    check_dependencies
    check_project_files
    check_services
    check_database
    check_network
    show_environment
    show_recommendations
    
    print_header "Status Check Complete"
    echo ""
    echo "For more help, see:"
    echo "  📖 README.md"
    echo "  🍎 INSTALL-macOS.md"
    echo "  🐳 Docker: ./docker-setup.sh"
    echo ""
}

# Run the status check
main "$@"
