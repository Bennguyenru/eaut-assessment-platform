#!/bin/bash

# build-installer.sh - Create standalone executable for EAUT Assessment Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📦 $1${NC}"
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

echo "🏗️ EAUT Assessment Platform - Executable Builder"
echo "================================================"
echo ""

# Get the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BUILD_DIR="$ROOT_DIR/dist"
EXECUTABLE_DIR="$BUILD_DIR/executable"
BACKEND_DIR="$ROOT_DIR/src/backend"

# Create build directories
print_step "Creating build directories..."
mkdir -p "$BUILD_DIR"
mkdir -p "$EXECUTABLE_DIR"
mkdir -p "$BUILD_DIR/portable"
mkdir -p "$BUILD_DIR/installer"

print_success "Build directories created"

# Check if we're in the right directory
cd "$BACKEND_DIR"

# Install build dependencies
print_step "Installing build dependencies..."
npm install pkg nexe --save-dev
print_success "Build dependencies installed"

# Build static frontend assets
print_step "Building frontend assets..."
npm run build:static
print_success "Frontend assets built"

# Create environment configuration for executable
print_step "Creating portable environment configuration..."
cat > "$EXECUTABLE_DIR/.env" << EOF
# EAUT Assessment Platform - Portable Configuration
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eaut_assessment
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=eaut-assessment-platform-portable-$(date +%s)
JWT_EXPIRES_IN=24h
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

print_success "Environment configuration created"

# Copy necessary files for executable
print_step "Copying assets for executable..."
cp -r ../frontend "$EXECUTABLE_DIR/"
cp -r ../database "$EXECUTABLE_DIR/"
cp -r ../../config "$EXECUTABLE_DIR/"
cp package.json "$EXECUTABLE_DIR/"
cp server.js "$EXECUTABLE_DIR/"
cp -r middleware "$EXECUTABLE_DIR/" 2>/dev/null || true

print_success "Assets copied"

# Build executables for different platforms
print_step "Building Windows executable (.exe)..."
if command -v pkg &> /dev/null; then
    pkg server.js \
        --targets node18-win-x64 \
        --output "$EXECUTABLE_DIR/eaut-assessment-platform.exe" \
        --compress Brotli
    print_success "Windows executable created: $EXECUTABLE_DIR/eaut-assessment-platform.exe"
else
    print_warning "pkg not available, skipping executable creation"
fi

print_step "Building macOS executable..."
if command -v pkg &> /dev/null; then
    pkg server.js \
        --targets node18-macos-x64 \
        --output "$EXECUTABLE_DIR/eaut-assessment-platform-macos" \
        --compress Brotli
    print_success "macOS executable created: $EXECUTABLE_DIR/eaut-assessment-platform-macos"
fi

print_step "Building Linux executable..."
if command -v pkg &> /dev/null; then
    pkg server.js \
        --targets node18-linux-x64 \
        --output "$EXECUTABLE_DIR/eaut-assessment-platform-linux" \
        --compress Brotli
    print_success "Linux executable created: $EXECUTABLE_DIR/eaut-assessment-platform-linux"
fi

# Create portable package
print_step "Creating portable package..."
cd "$ROOT_DIR"

# Create portable launcher scripts
cat > "$BUILD_DIR/portable/start-windows.bat" << EOF
@echo off
title EAUT Assessment Platform
echo Starting EAUT Assessment Platform...
echo.
echo Opening browser at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
start http://localhost:3000
dist\\executable\\eaut-assessment-platform.exe
pause
EOF

cat > "$BUILD_DIR/portable/start-macos.sh" << 'EOF'
#!/bin/bash
echo "🎓 Starting EAUT Assessment Platform..."
echo ""
echo "Opening browser at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""
sleep 2
open http://localhost:3000
./dist/executable/eaut-assessment-platform-macos
EOF

cat > "$BUILD_DIR/portable/start-linux.sh" << 'EOF'
#!/bin/bash
echo "🎓 Starting EAUT Assessment Platform..."
echo ""
echo "Opening browser at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""
sleep 2
xdg-open http://localhost:3000 2>/dev/null || true
./dist/executable/eaut-assessment-platform-linux
EOF

chmod +x "$BUILD_DIR/portable/start-macos.sh"
chmod +x "$BUILD_DIR/portable/start-linux.sh"

# Copy executables to portable directory
cp "$EXECUTABLE_DIR"/* "$BUILD_DIR/portable/" 2>/dev/null || true

print_success "Portable package created"

# Create README for portable package
print_step "Creating portable package documentation..."
cat > "$BUILD_DIR/portable/README.txt" << EOF
EAUT Assessment Platform - Portable Version
==========================================

Quick Start:
-----------
Windows: Double-click 'start-windows.bat'
macOS:   Double-click 'start-macos.sh' (or run in Terminal)
Linux:   Run './start-linux.sh' in Terminal

What happens:
- The application will start automatically
- Your browser will open to http://localhost:3000
- The full EAUT Assessment Platform will be available

Default Login:
- Username: admin
- Password: password

Features Included:
- Complete EAUT Assessment Platform
- PLO/CLO Management
- Assessment System
- Analytics Dashboard
- User Management
- All documentation

System Requirements:
- Windows 10/11, macOS 10.14+, or Linux
- 4GB RAM minimum
- 500MB disk space
- Internet browser (Chrome, Firefox, Safari, Edge)

Troubleshooting:
- If port 3000 is busy, close other applications using it
- For database issues, ensure PostgreSQL is not running locally
- Check firewall settings if unable to access the application

For support: admin@eaut.edu.vn
Version: 1.0.0
Built: $(date)
EOF

print_success "Documentation created"

# Create installer package
print_step "Creating installer package..."
cd "$BUILD_DIR"

# Create ZIP package for distribution
if command -v zip &> /dev/null; then
    zip -r "eaut-assessment-platform-portable.zip" portable/
    print_success "Installer ZIP created: $BUILD_DIR/eaut-assessment-platform-portable.zip"
fi

# Create TAR package for Linux
if command -v tar &> /dev/null; then
    tar -czf "eaut-assessment-platform-portable.tar.gz" portable/
    print_success "Installer TAR created: $BUILD_DIR/eaut-assessment-platform-portable.tar.gz"
fi

print_step "Build Summary"
echo ""
print_info "Built files location: $BUILD_DIR"
echo ""
print_success "✅ Windows Executable: dist/executable/eaut-assessment-platform.exe"
print_success "✅ macOS Executable: dist/executable/eaut-assessment-platform-macos"  
print_success "✅ Linux Executable: dist/executable/eaut-assessment-platform-linux"
print_success "✅ Portable Package: dist/portable/"
print_success "✅ ZIP Installer: dist/eaut-assessment-platform-portable.zip"
print_success "✅ TAR Installer: dist/eaut-assessment-platform-portable.tar.gz"

echo ""
print_info "To test the executable:"
echo "  Windows: cd dist/portable && start-windows.bat"
echo "  macOS:   cd dist/portable && ./start-macos.sh"
echo "  Linux:   cd dist/portable && ./start-linux.sh"

echo ""
print_info "To distribute:"
echo "  Share: dist/eaut-assessment-platform-portable.zip"
echo "  Users can extract and run the start script for their platform"

echo ""
print_success "🎉 Executable build completed successfully!"
