import { type ReactNode } from "react";

// Encodes consensus semantics (proposer/precommit/miss), so fixed across light/dark.
// Tones follow the app palette (Tailwind v4): green-700 / green-400 / red-400 (--color-destructive dark).
export const CELL_COLOR = {
  proposed: "#008236",
  voted: "#05df72",
  absent: "#ff6467",
} as const;

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-3 w-3 rounded-[4px]"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs">{label}</span>
    </span>
  );
}

// Shared by the loading skeleton and the live matrix so there's no layout shift;
// data-dependent stats (live badge, avg-signed) are passed in via `trailing`.
export function ConsensusHeaderBar({
  showInactiveLegend = false,
  trailing,
}: {
  showInactiveLegend?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-card px-5 py-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight">
          Consensus signing matrix
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Validators × recent blocks · each cell is a validator&apos;s precommit
          for that block
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <LegendSwatch color={CELL_COLOR.proposed} label="Proposer" />
        <LegendSwatch color={CELL_COLOR.voted} label="Voted (precommit)" />
        <LegendSwatch color={CELL_COLOR.absent} label="Not voted" />
        {showInactiveLegend && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[4px] bg-[#e9ebef] dark:bg-[#212836]" />
            <span className="text-xs">Not in set</span>
          </span>
        )}
      </div>
      {trailing != null && (
        <div className="ml-auto flex items-center gap-4">{trailing}</div>
      )}
    </div>
  );
}
