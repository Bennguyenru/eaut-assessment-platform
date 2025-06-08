#!/bin/bash

# docker-setup.sh - Setup and run EAUT Assessment Platform with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        print_status "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running!"
        print_status "Please start Docker Desktop and try again."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_status "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        if ! docker compose version &> /dev/null; then
            print_error "Docker Compose is not available!"
            exit 1
        else
            COMPOSE_CMD="docker compose"
        fi
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    print_success "Docker Compose is available"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p logs uploads ssl
    print_success "Directories created"
}

# Generate self-signed SSL certificate for development
generate_ssl_cert() {
    print_status "Generating SSL certificate for development..."
    
    if [ ! -f "ssl/server.crt" ] || [ ! -f "ssl/server.key" ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/server.key \
            -out ssl/server.crt \
            -subj "/C=VN/ST=HaNoi/L=HaNoi/O=EAUT/OU=IT/CN=localhost"
        
        print_success "SSL certificate generated"
    else
        print_warning "SSL certificate already exists, skipping..."
    fi
}

# Build and start services
start_services() {
    print_status "Building and starting services..."
    
    # Stop existing containers
    $COMPOSE_CMD down --remove-orphans
    
    # Build and start
    $COMPOSE_CMD up --build -d
    
    print_success "Services started"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for database..."
    timeout 60 bash -c 'until $COMPOSE_CMD exec postgres pg_isready -U postgres; do sleep 2; done'
    
    # Wait for application
    print_status "Waiting for application..."
    timeout 60 bash -c 'until curl -f http://localhost:3000/api/health &>/dev/null; do sleep 2; done'
    
    print_success "All services are ready"
}

# Show service status
show_status() {
    print_status "Service status:"
    $COMPOSE_CMD ps
    
    echo ""
    print_status "Application URLs:"
    echo "  📱 Application: http://localhost:3000"
    echo "  💾 Database: localhost:5432"
    echo "  📊 Health Check: http://localhost:3000/api/health"
    
    echo ""
    print_status "Default login credentials:"
    echo "  Username: admin"
    echo "  Password: password"
}

# Show logs
show_logs() {
    echo ""
    print_status "Recent logs:"
    $COMPOSE_CMD logs --tail=20
    
    echo ""
    print_status "To follow logs in real-time:"
    echo "  $COMPOSE_CMD logs -f"
}

# Main setup process
main() {
    echo "=================================================="
    echo "🐳 EAUT Assessment Platform - Docker Setup"
    echo "=================================================="
    
    check_docker
    check_docker_compose
    create_directories
    generate_ssl_cert
    start_services
    wait_for_services
    show_status
    show_logs
    
    echo ""
    echo "=================================================="
    print_success "🎉 Docker setup completed successfully!"
    echo "=================================================="
    echo ""
    print_status "Useful commands:"
    echo "  $COMPOSE_CMD logs -f              # Follow logs"
    echo "  $COMPOSE_CMD ps                   # Show status"
    echo "  $COMPOSE_CMD down                 # Stop services"
    echo "  $COMPOSE_CMD up -d                # Start services"
    echo "  $COMPOSE_CMD restart eaut_app     # Restart app"
    echo ""
}

# Handle command line arguments
case "${1:-}" in
    "start")
        start_services
        ;;
    "stop")
        $COMPOSE_CMD down
        ;;
    "restart")
        $COMPOSE_CMD restart
        ;;
    "logs")
        $COMPOSE_CMD logs -f
        ;;
    "status")
        $COMPOSE_CMD ps
        ;;
    *)
        main "$@"
        ;;
esac
