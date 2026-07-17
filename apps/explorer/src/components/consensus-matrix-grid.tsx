"use client";

import type { ConsensusBlock } from "@cosmos-explorer/core";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { ValidatorAvatar } from "@/components/consensus-validator-avatar";
import {
  type BlockRate,
  CELL_CLASS,
  type CellState,
  type MatrixValidator,
  rateTone,
  type Selection,
  STATE_LABEL,
} from "@/components/consensus-matrix-data";

// The scrollable validators × blocks grid: sticky block-column header on top,
// sticky validator labels on the left, one cell per (validator, block).
export function ConsensusMatrixGrid({
  blocks,
  validators,
  stateByBlock,
  rateByBlock,
  selection,
  flash,
  onSelect,
}: {
  blocks: ConsensusBlock[];
  validators: MatrixValidator[];
  stateByBlock: Map<number, Map<string, CellState>>;
  rateByBlock: Map<number, BlockRate>;
  /** Selection to crosshair, already restricted to the current window. */
  selection: Selection | null;
  /** Heights that just entered the window (new-block flash highlight). */
  flash: Set<number>;
  onSelect: (height: number, key: string) => void;
}) {
  const latest = blocks.at(0);

  return (
    <div className="overflow-auto rounded-xl border border-border bg-card">
      <div className="min-w-full pb-6">
        {/* Header: block columns */}
        <div className="sticky top-0 z-[5] flex items-end border-b border-border bg-card">
          <div className="sticky left-0 z-[6] flex w-[240px] shrink-0 items-end bg-card py-2 pl-6 pr-3 text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
            Validator ↓ · Block →
          </div>
          <div className="flex flex-1 gap-[3px] pb-1.5 pr-6 pt-2">
            {blocks.map((block) => {
              const rate = rateByBlock.get(block.height);
              const isSelCol = selection?.height === block.height;
              const isNewest = block.height === latest?.height;
              // Header opens the block; for an `unknown-proposer-<height>`
              // gap, fall back to the first signer so the click isn't a no-op.
              const headerKey = block.proposer.consensusAddress.startsWith(
                "unknown-proposer-",
              )
                ? (block.votes[0]?.consensusAddress ?? "")
                : block.proposer.consensusAddress;
              return (
                <button
                  key={block.height}
                  type="button"
                  onClick={() => {
                    onSelect(block.height, headerKey);
                  }}
                  title={`#${block.height.toLocaleString()} · ${rate?.signed ?? 0}/${rate?.total ?? 0} signed`}
                  className={cn(
                    "flex h-[70px] min-w-[24px] flex-1 flex-col items-center justify-end gap-1 rounded-t-[5px] pb-1 transition-colors",
                    isSelCol
                      ? "bg-blue-500/15 shadow-[inset_0_-3px_0] shadow-blue-600 dark:bg-blue-400/20 dark:shadow-blue-400"
                      : flash.has(block.height)
                        ? "bg-consensus-voted/25"
                        : isNewest
                          ? "bg-consensus-voted/10"
                          : "bg-transparent",
                  )}
                >
                  <span
                    className="font-mono text-[9px] text-muted-foreground"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    #{block.height}
                  </span>
                  <span
                    className={cn(
                      "h-[3px] w-4 rounded-[2px]",
                      rateTone(rate?.pct ?? 0).bg,
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Rows: validators */}
        {validators.map((v) => {
          const isSelRow = selection?.key === v.key;
          return (
            <div
              key={v.key}
              className="flex items-center border-b border-border last:border-b-0"
            >
              <button
                type="button"
                onClick={() => { onSelect(latest?.height ?? 0, v.key); }}
                className={cn(
                  "sticky left-0 z-[2] flex w-[240px] shrink-0 items-center gap-2.5 py-1 pl-6 pr-3 text-left transition-colors",
                  isSelRow
                    ? "bg-blue-500/10 shadow-[inset_3px_0_0] shadow-blue-600 dark:bg-blue-400/15 dark:shadow-blue-400"
                    : "bg-card",
                )}
              >
                <ValidatorAvatar avatarUrl={v.avatarUrl} mono={v.mono} className="h-5 w-5" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold leading-tight">
                    {v.label}
                  </div>
                  <div
                    className={cn(
                      "font-mono text-[9.5px] leading-tight",
                      v.uptimePercent != null && rateTone(v.uptimePercent).text,
                    )}
                  >
                    up{" "}
                    {v.uptimePercent != null
                      ? `${v.uptimePercent.toFixed(1)}%`
                      : "—"}
                  </div>
                </div>
              </button>
              <div
                className={cn(
                  "flex flex-1 gap-[3px] py-1 pr-6",
                  isSelRow && "bg-blue-500/10 dark:bg-blue-400/10",
                )}
              >
                {blocks.map((block) => {
                  const state =
                    stateByBlock.get(block.height)?.get(v.key) ?? "inactive";
                  const inCol = selection?.height === block.height;
                  const isCell = inCol && isSelRow;
                  return (
                    <button
                      key={block.height}
                      type="button"
                      onClick={() => { onSelect(block.height, v.key); }}
                      title={`#${block.height.toLocaleString()} — ${STATE_LABEL[state]} · ${v.label}`}
                      aria-label={`Block ${String(block.height)}, ${v.label}: ${STATE_LABEL[state]}`}
                      className={cn(
                        "h-[17px] min-w-[24px] flex-1 rounded-[3px] transition-shadow",
                        state === "inactive" ? "bg-muted" : CELL_CLASS[state],
                        isCell &&
                          "relative z-[3] ring-2 ring-blue-600 ring-offset-1 ring-offset-card dark:ring-blue-400",
                        !isCell &&
                          (inCol || isSelRow) &&
                          "relative z-[2] ring-1 ring-blue-500/50 dark:ring-blue-400/60",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
