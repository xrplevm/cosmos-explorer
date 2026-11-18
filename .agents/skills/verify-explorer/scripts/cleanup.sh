#!/usr/bin/env bash
# Stop the instance launch.sh started, by the pid it recorded, never by
# process name. Evidence under .verify-explorer/evidence/ is kept.
#
#   .agents/skills/verify-explorer/scripts/cleanup.sh
set -euo pipefail

ROOT="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
STATE="${VERIFY_EXPLORER_DIR:-$ROOT/.verify-explorer}"
RUN="$STATE/run"
source "$(dirname "$0")/process-identity.sh"

if [ -f "$RUN/pid" ]; then
  PID="$(cat "$RUN/pid")"
  IDENTITY=$(cat "$RUN/process-identity" 2>/dev/null || true)
  if same_process "$PID" "$IDENTITY"; then
    if ! kill "$PID" && same_process "$PID" "$IDENTITY"; then
      exit 1
    fi
    for _ in $(seq 1 10); do same_process "$PID" "$IDENTITY" || break; sleep 1; done
    if same_process "$PID" "$IDENTITY" && ! kill -9 "$PID" && same_process "$PID" "$IDENTITY"; then
      exit 1
    fi
    echo "cleanup: stopped pid $PID"
  else
    echo "cleanup: no matching process for pid $PID; cleared the stale run record"
  fi
  rm -f "$RUN/pid" "$RUN/process-identity" "$RUN/port" "$RUN/network"
else
  echo "cleanup: nothing this skill started is running"
fi

if [ -d "$STATE/evidence" ]; then
  echo "cleanup: evidence kept in $STATE/evidence/"
fi
