ARG BASE_IMAGE=base
FROM ${BASE_IMAGE} AS integration
ARG TURBO_TEAM=peersyst
ENV TURBO_TEAM=$TURBO_TEAM

# Include callisto
COPY apps/callisto /project/apps/callisto
# Install callisto dependencies
RUN pnpm install

# Build callisto
WORKDIR /project/apps/callisto
RUN make build

FROM gcr.io/distroless/static-debian12:debug AS release
WORKDIR /app
COPY --from=integration /project/apps/callisto/build/callisto /app/callisto
CMD [ "/app/callisto" ]
