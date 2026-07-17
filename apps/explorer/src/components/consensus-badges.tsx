"use client";

import { Badge } from "@cosmos-explorer/ui/badge";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { type CellState, STATE_LABEL } from "@/components/consensus-matrix-data";

export function LiveBadge({ paused }: { paused: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold",
        paused ? "text-consensus-warning" : "text-consensus-healthy",
      )}
    >
      <span className="relative flex h-2 w-2">
        {!paused && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-consensus-voted/70" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            paused ? "bg-consensus-warning" : "bg-consensus-voted",
          )}
        />
      </span>
      {paused ? "paused" : "live"}
    </span>
  );
}

// Tinted per-state treatment on the shared Badge (15% fill / 35% border);
// `voted` borrows the darker proposed green for readable text on the tint.
const STATE_BADGE_CLASS: Record<CellState, string> = {
  proposed:
    "border-consensus-proposed/35 bg-consensus-proposed/15 text-consensus-proposed",
  voted:
    "border-consensus-voted/35 bg-consensus-voted/15 text-consensus-proposed",
  absent:
    "border-consensus-absent/35 bg-consensus-absent/15 text-consensus-absent",
  inactive: "border-border bg-muted text-muted-foreground",
};

export function StateBadge({ state }: { state: CellState }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 font-mono text-[11px]",
        STATE_BADGE_CLASS[state],
      )}
    >
      {STATE_LABEL[state]}
    </Badge>
  );
}
