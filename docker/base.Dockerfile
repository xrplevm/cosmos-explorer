# syntax=docker/dockerfile:1
FROM node:20.9.0 AS base
ARG PNPM_VERSION=9.7.0
ARG TURBO_TEAM=peersyst
ENV TURBO_TEAM=$TURBO_TEAM
WORKDIR /project
RUN npm install -g pnpm@${PNPM_VERSION}

# Install Go v1.22
RUN apt-get update && apt-get install -y wget && \
    wget https://go.dev/dl/go1.22.10.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.10.linux-amd64.tar.gz && \
    rm go1.22.10.linux-amd64.tar.gz && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add Go to PATH
ENV PATH="/usr/local/go/bin:${PATH}"

# Add project files
COPY . /project
# Install package and app dependencies
RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN pnpm install
# Build packages
RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN pnpm run build:packages
