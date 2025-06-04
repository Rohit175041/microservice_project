# Stage 1: Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm install --production && npm cache clean --force

COPY . .

# Stage 2: Final stage
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app .

CMD ["node", "index.js"]
