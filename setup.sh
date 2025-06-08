#!/bin/bash

# setup.sh - Complete setup script for EAUT Assessment Platform

set -e  # Exit on any error

echo "🚀 Setting up EAUT Assessment Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_status "Please install Node.js (version 14 or higher) from: https://nodejs.org/"
        print_status "Or use Homebrew: brew install node"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 14 ]; then
        print_error "Node.js version must be 14 or higher. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if PostgreSQL is installed
check_postgresql() {
    print_status "Checking PostgreSQL installation..."
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed!"
        print_status "Please install PostgreSQL from: https://postgresql.org/"
        print_status "Or use Homebrew: brew install postgresql"
        print_status "Then run: brew services start postgresql"
        exit 1
    fi
    
    print_success "PostgreSQL is installed"
}

# Install npm dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed successfully"
    else
        print_error "package.json not found!"
        exit 1
    fi
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Environment file created from template"
        else
            # Create basic .env file
            cat > .env << EOF
# Environment Variables for EAUT Assessment Platform
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eaut_assessment
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=eaut-assessment-platform-secret-key-$(date +%s)
JWT_EXPIRES_IN=24h
CORS_ORIGIN=*
EOF
            print_success "Basic environment file created"
        fi
    else
        print_warning "Environment file already exists, skipping..."
    fi
    
    print_status "Please review and update the .env file with your database credentials"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if database exists
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw eaut_assessment; then
        print_warning "Database 'eaut_assessment' already exists"
        read -p "Do you want to recreate it? This will delete all existing data! (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Dropping existing database..."
            dropdb -U postgres eaut_assessment
        else
            print_status "Skipping database recreation"
            return 0
        fi
    fi
    
    # Create database
    print_status "Creating database 'eaut_assessment'..."
    createdb -U postgres eaut_assessment
    
    # Import schema
    if [ -f "schema.sql" ]; then
        print_status "Importing database schema..."
        psql -U postgres -d eaut_assessment -f schema.sql
        print_success "Database schema imported"
    else
        print_error "schema.sql not found!"
        exit 1
    fi
    
    # Import sample data from init_db.sh
    if [ -f "init_db.sh" ]; then
        print_status "Importing sample data..."
        chmod +x init_db.sh
        ./init_db.sh
        print_success "Sample data imported"
    else
        print_warning "init_db.sh not found, skipping sample data import"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p logs
    mkdir -p uploads
    mkdir -p public
    print_success "Directories created"
}

# Test the setup
test_setup() {
    print_status "Testing the setup..."
    
    # Test database connection
    if psql -U postgres -d eaut_assessment -c "SELECT 1;" &> /dev/null; then
        print_success "Database connection test passed"
    else
        print_error "Database connection test failed"
        exit 1
    fi
    
    # Test if all required files exist
    required_files=("server.js" "index.html" "main.js" "styles.css" "package.json")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    print_success "All required files are present"
}

# Main setup process
main() {
    echo "=================================================="
    echo "🎓 EAUT Assessment Platform Setup"
    echo "=================================================="
    
    check_nodejs
    check_postgresql
    install_dependencies
    setup_environment
    create_directories
    setup_database
    test_setup
    
    echo ""
    echo "=================================================="
    print_success "🎉 Setup completed successfully!"
    echo "=================================================="
    echo ""
    print_status "To start the application:"
    echo "  npm start              # Production mode"
    echo "  npm run dev            # Development mode"
    echo ""
    print_status "Default login credentials:"
    echo "  Username: admin"
    echo "  Password: password"
    echo ""
    print_status "Access the application at: http://localhost:3000"
    echo ""
    print_warning "Don't forget to:"
    echo "  1. Review and update the .env file"
    echo "  2. Change default passwords in production"
    echo "  3. Configure your firewall settings"
    echo ""
}

# Run main function
main "$@"
