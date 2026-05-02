# Stage 1: Build stage
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Stage 2: Runtime stage (Multi-stage build)
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependencies and application code from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./

# Create uploads and images directories with correct permissions if they don't exist
RUN mkdir -p uploads images && chown -R node:node /usr/src/app

# Use non-root user (Non-root user requirement)
USER node

# Expose the application port
EXPOSE 5001

# Healthcheck configuration (Healthcheck configured requirement)
# We use a simple Node.js script to check if the server is responding, avoiding the need to install curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/', (r) => { if (r.statusCode !== 200) process.exit(1); process.exit(0); }).on('error', () => process.exit(1))"

# Start the application
CMD [ "npm", "start" ]
