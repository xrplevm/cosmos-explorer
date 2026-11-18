#!/usr/bin/env bash
# Build the explorer for one network and serve it the way production does
# (Next.js standalone output, as docker/explorer.Dockerfile's release stage).
#
#   .agents/skills/verify-explorer/scripts/launch.sh [mainnet|testnet|devnet] [--reuse]
#
# NETWORK is read at build time (pages are prerendered for it) and at run
# time, so a build serves exactly one network. --reuse skips the build when
# the last one was for the same network. Ready means the overview page
# renders its heading, not that the port answers.
set -euo pipefail

NETWORK="${1:-testnet}"
REUSE="${2:-}"
PORT="${VERIFY_EXPLORER_PORT:-3100}"
case "$NETWORK" in mainnet | testnet | devnet) ;; *)
  echo "launch: unknown network '$NETWORK' (mainnet, testnet or devnet)" >&2
  exit 2
  ;;
esac

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
APP="$ROOT/apps/explorer"
STATE="${VERIFY_EXPLORER_DIR:-$ROOT/.verify-explorer}"
RUN="$STATE/run"
mkdir -p "$RUN"

if [ -f "$RUN/pid" ] && kill -0 "$(cat "$RUN/pid")" 2>/dev/null; then
  echo "launch: an instance this skill started is already running (pid $(cat "$RUN/pid"), $(cat "$RUN/network") on :$(cat "$RUN/port")). Run cleanup.sh first." >&2
  exit 1
fi
if curl -s -o /dev/null --max-time 2 "http://127.0.0.1:$PORT/"; then
  echo "launch: something else already answers on :$PORT; set VERIFY_EXPLORER_PORT to a free port." >&2
  exit 1
fi

if [ "$REUSE" = "--reuse" ] && [ "$(cat "$RUN/build-network" 2>/dev/null)" = "$NETWORK" ] &&
  [ -f "$APP/.next/standalone/apps/explorer/server.js" ]; then
  echo "launch: reusing the $NETWORK build ($(cat "$APP/.next/BUILD_ID"))"
else
  echo "launch: building the explorer for $NETWORK (log: $RUN/build.log)"
  (cd "$ROOT" && NETWORK="$NETWORK" pnpm turbo run build --filter=@cosmos-explorer/explorer >"$RUN/build.log" 2>&1) || {
    echo "launch: build failed; last lines of $RUN/build.log:" >&2
    tail -20 "$RUN/build.log" >&2
    exit 1
  }
  echo "$NETWORK" >"$RUN/build-network"
fi

# The standalone server does not carry static assets or public/; the
# Dockerfile copies them in the same way.
STANDALONE="$APP/.next/standalone"
mkdir -p "$STANDALONE/apps/explorer/.next"
rm -rf "$STANDALONE/apps/explorer/.next/static" "$STANDALONE/apps/explorer/public"
cp -r "$APP/.next/static" "$STANDALONE/apps/explorer/.next/static"
cp -r "$APP/public" "$STANDALONE/apps/explorer/public"

# Background the server itself, not a subshell around it, so the recorded
# pid is the server's and cleanup.sh stops what it means to.
cd "$STANDALONE"
NODE_ENV=production NETWORK="$NETWORK" PORT="$PORT" HOSTNAME=127.0.0.1 \
  nohup node apps/explorer/server.js >"$RUN/server.log" 2>&1 &
echo $! >"$RUN/pid"
cd "$ROOT"
echo "$NETWORK" >"$RUN/network"
echo "$PORT" >"$RUN/port"

# The overview streams (Suspense); a cold first render can take over 10s.
DEADLINE=$((SECONDS + 120))
while [ "$SECONDS" -lt "$DEADLINE" ]; do
  # Capture, then match: `curl | grep -q` fails under pipefail when grep
  # exits on its first match and curl dies of SIGPIPE.
  HTML="$(curl -s --max-time 30 "http://127.0.0.1:$PORT/" || true)"
  if [[ "$HTML" == *'>Overview</h1>'* ]]; then
    echo "launch: ready, $NETWORK on http://127.0.0.1:$PORT (pid $(cat "$RUN/pid"), log $RUN/server.log)"
    exit 0
  fi
  if ! kill -0 "$(cat "$RUN/pid")" 2>/dev/null; then
    echo "launch: the server exited; last lines of $RUN/server.log:" >&2
    tail -20 "$RUN/server.log" >&2
    exit 1
  fi
  sleep 1
done
echo "launch: the overview never rendered within 120s; see $RUN/server.log" >&2
exit 1
