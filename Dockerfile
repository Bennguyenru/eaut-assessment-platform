# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S eautapp -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p logs uploads public

# Change ownership to app user
RUN chown -R eautapp:nodejs /app

# Switch to app user
USER eautapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => { process.exit(1); });"

# Start application
CMD ["npm", "start"]
