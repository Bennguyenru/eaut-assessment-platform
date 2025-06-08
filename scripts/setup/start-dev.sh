#!/bin/bash

# start-dev.sh - Development start script with automatic reloading

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting EAUT Assessment Platform in Development Mode${NC}"
echo ""

# Check if nodemon is installed
if ! command -v npx nodemon &> /dev/null; then
    echo -e "${YELLOW}Installing nodemon for development...${NC}"
    npm install -g nodemon
fi

# Check if .env file exists
if [ ! -f "config/environment/.env" ]; then
    echo -e "${YELLOW}Warning: config/environment/.env file not found. Using default settings.${NC}"
fi

# Change to backend directory
cd src/backend

# Start the application with nodemon for auto-reloading
echo -e "${GREEN}Starting server with auto-reload...${NC}"
echo -e "${BLUE}Access the application at: http://localhost:3000${NC}"
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo ""

NODE_ENV=development npx nodemon server.js
