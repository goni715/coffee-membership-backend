# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for TypeScript build)
RUN yarn install --frozen-lockfile

# Copy application source code and configuration files
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript project and resolve aliases (tsc-alias)
RUN yarn build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy dependency definition files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy compiled JavaScript files from the builder stage
COPY --from=builder /app/dist ./dist

# Use non-root node user for security
USER node

# Expose backend port
EXPOSE 5050

# Start application
CMD ["node", "dist/server.js"]
