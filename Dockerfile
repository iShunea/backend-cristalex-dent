# Use official Node.js LTS image as base
FROM node:18-alpine AS base

# Install security updates and dumb-init for proper signal handling
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Production dependencies stage
FROM base AS dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage for building (if needed in future)
FROM base AS build
RUN npm ci
COPY . .

# Production stage
FROM base AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy production dependencies from dependencies stage
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

# Copy application files
COPY --chown=node:node . .

# Create necessary directories for file uploads and static files
RUN mkdir -p images files && chown -R node:node images files

# Use non-root user for security
USER node

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if(r.statusCode !== 200) throw new Error('Health check failed')})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
