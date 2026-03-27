ARG BASE_IMAGE=base
FROM ${BASE_IMAGE} AS integration
ARG TURBO_TEAM=peersyst
ENV TURBO_TEAM=$TURBO_TEAM
ARG NETWORK=mainnet
ENV NETWORK=$NETWORK

# Include explorer
COPY apps/explorer /project/apps/explorer
# Install explorer dependencies
RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN pnpm install

# Lint explorer
RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
    npx turbo run lint --filter=@cosmos-explorer/explorer
# Typecheck explorer
RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
    npx turbo run typecheck --filter=@cosmos-explorer/explorer

# Build explorer — chain config mounted as a secret (not persisted in any image layer)
RUN --mount=type=secret,id=turbo_token,env=TURBO_TOKEN \
    npx turbo run build --filter=@cosmos-explorer/explorer

FROM node:20.9.0-alpine AS release
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=integration /project/apps/explorer/.next/standalone ./
COPY --from=integration /project/apps/explorer/public ./apps/explorer/public
COPY --from=integration /project/apps/explorer/.next/static ./apps/explorer/.next/static

EXPOSE 3000
CMD ["node", "apps/explorer/server.js"]
