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
#    npx turbo run lint --filter=callisto
# Check types callisto
# RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
#     npx turbo run check-types --filter=callisto
# Test callisto
# RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
#     npx turbo run test --filter=callisto
# Build callisto
WORKDIR /project/apps/callisto
RUN make build

FROM gcr.io/distroless/static-debian12:debug AS release
WORKDIR /app
COPY --from=integration /project/apps/callisto/build/callisto /app/callisto
CMD [ "/app/callisto" ]
