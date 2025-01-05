# Use the official Node.js image as the base
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy the rest of the application
COPY . .

# Install dependencies
RUN corepack enable
RUN yarn set version stable
RUN yarn install

# Build the Nuxt 3 application
RUN yarn build

# Use a lightweight image for production
FROM node:18-alpine AS production-stage

# Set working directory
WORKDIR /app

# Copy built application from the build stage
COPY --from=build-stage /app/.output /app/.output

# Start the Nuxt application
CMD ["node", ".output/server/index.mjs"]
