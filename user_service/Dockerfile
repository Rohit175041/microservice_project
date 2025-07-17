# Stage 1: Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code
COPY . .

# Stage 2: Final (production) stage
FROM node:18-alpine

WORKDIR /app

# Install PM2 globally (optional, recommended for production)
RUN npm install -g pm2 && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only necessary files from build stage
COPY --from=build /app .

# Set non-root user for better security
USER appuser

# Expose application port (adjust if needed)
EXPOSE 3000

# Start the app with PM2 in single-process mode (safe and stable)
CMD ["pm2-runtime", "index.js"]
