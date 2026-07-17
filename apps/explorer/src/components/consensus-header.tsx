import { type ReactNode } from "react";
import { CELL_CLASS } from "@/components/consensus-matrix-data";

function LegendSwatch({
  swatchClass,
  label,
}: {
  swatchClass: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-[4px] ${swatchClass}`} />
      <span className="text-xs">{label}</span>
    </span>
  );
}

// Shared by the loading skeleton and the live matrix so there's no layout shift;
// data-dependent stats (live badge, avg-signed) are passed in via `trailing`.
export function ConsensusHeaderBar({
  chainName,
  showInactiveLegend = false,
  trailing,
}: {
  chainName: string;
  showInactiveLegend?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-card px-5 py-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight">
          {chainName} consensus signing matrix
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Validators × recent blocks · each cell is a validator&apos;s precommit
          for that block
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <LegendSwatch swatchClass={CELL_CLASS.proposed} label="Proposer" />
        <LegendSwatch swatchClass={CELL_CLASS.voted} label="Voted (precommit)" />
        <LegendSwatch swatchClass={CELL_CLASS.absent} label="Not voted" />
        {showInactiveLegend && (
          <LegendSwatch swatchClass="bg-muted" label="Not in set" />
        )}
      </div>
      {trailing != null && (
        <div className="ml-auto flex items-center gap-4">{trailing}</div>
      )}
    </div>
  );
}
