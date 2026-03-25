ARG BASE_IMAGE=base
FROM ${BASE_IMAGE} AS integration
ARG TURBO_TEAM=peersyst
ENV TURBO_TEAM=$TURBO_TEAM

# Include callisto
COPY apps/callisto /project/apps/callisto
# Install callisto dependencies
RUN pnpm install

# Lint callisto
# RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
#     npx turbo run lint --filter=@cosmos-explorer/callisto-app
# Typecheck callisto
# RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
#     npx turbo run typecheck --filter=@cosmos-explorer/callisto-app

# Build callisto (static binary for distroless)
WORKDIR /project/apps/callisto
RUN make build

FROM debian:12 AS release

# Install wget
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copy callisto binary to /usr/local/bin
COPY --from=integration /project/apps/callisto/build/callisto /usr/local/bin/callisto

# Make sure it's executable
RUN chmod +x /usr/local/bin/callisto

WORKDIR /app
ENTRYPOINT [ "callisto" ]
