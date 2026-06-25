# syntax = docker/dockerfile:1

# Base image with Node.js
ARG NODE_VERSION=24.3.0
FROM node:${NODE_VERSION}-slim as base

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install dependencies stage
FROM base as deps

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Final stage for running the app
FROM base

# Copy dependencies and application
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

# Cloud Run sets PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD [ "npm", "run", "start" ]
