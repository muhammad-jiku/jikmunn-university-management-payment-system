# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.11.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including dev dependencies needed for build)
RUN yarn install --frozen-lockfile

################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

WORKDIR /app

# Generate Prisma client
COPY prisma ./prisma
RUN yarn prisma generate

################################################################################
# Create a stage for building the application.
# Run the build script.
# Build stage
FROM base AS build

WORKDIR /app

# Copy the rest of the source files into the image.
COPY . .
# Generate Prisma client
RUN yarn prisma generate
# Compile TS -> JS
RUN yarn build

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage bind mounts to package.json and yarn.lock to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

WORKDIR /app

# Copy entrypoint
COPY --from=build /app/entrypoint.sh ./entrypoint.sh

# # before chmod +x entrypoint.sh
RUN apk add --no-cache bash

# # Make the entrypoint script executable 
RUN chmod +x ./entrypoint.sh

# # Install bash & normalize entrypoint
# RUN apk add --no-cache bash dos2unix \
#  && dos2unix entrypoint.sh \
#  && chmod +x entrypoint.sh

# Create the log dirs and chown them to `node`
RUN mkdir -p /app/logs/winston/successes /app/logs/winston/errors \
 && chown -R node:node /app/logs


# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=deps  /app/prisma     ./prisma
COPY --from=build /app/dist       ./dist

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application 
# Make the entrypoint script executable and set it as entrypoint
ENTRYPOINT ["./entrypoint.sh"]