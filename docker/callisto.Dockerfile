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
RUN CGO_ENABLED=0 make build

FROM gcr.io/distroless/static-debian12:debug AS release
WORKDIR /app
COPY --from=integration /project/apps/callisto/build/callisto /app/callisto
ENTRYPOINT [ "/app/callisto" ]
