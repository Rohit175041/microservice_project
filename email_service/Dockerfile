# Stage 1: Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy the rest of the app
COPY . .

# Stage 2: Final stage
FROM node:18-alpine

WORKDIR /app

# Install PM2 globally for production process management
RUN npm install -g pm2 && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built app from the previous stage
COPY --from=build /app .

# Use non-root user for security
USER appuser

# Expose the port your app runs on (update if needed)
EXPOSE 3000

# Start using PM2 in fork mode
CMD ["pm2-runtime", "index.js"]
