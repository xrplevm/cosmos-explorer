import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import { getChainConfig } from "@/lib/config";
import { ConsensusHeaderBar } from "@/components/consensus-header";
import { RECENT_BLOCK_COUNT } from "./constants";

// Mirrors ConsensusMatrix's layout so loading reads as this page, not a generic skeleton.
const COLUMNS = RECENT_BLOCK_COUNT;
const ROWS = 10;

export default function ConsensusLoading() {
  return (
    <div className="space-y-4">
      {/* Real static header (title + legend) rendered immediately; only the
          data-dependent stats on the right are skeletons. */}
      <ConsensusHeaderBar
        chainName={getChainConfig().network.chainName}
        trailing={
          <>
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-44" />
          </>
        }
      />

      {/* Matrix */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="min-w-full pb-6">
          {/* Header: block columns */}
          <div className="flex items-end border-b border-border">
            <div className="flex w-[240px] shrink-0 items-end py-2 pl-6 pr-3">
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex flex-1 gap-[3px] pb-1.5 pr-6 pt-2">
              {Array.from({ length: COLUMNS }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[70px] min-w-[24px] flex-1 rounded-t-[5px]"
                />
              ))}
            </div>
          </div>

          {/* Rows: validators */}
          {Array.from({ length: ROWS }).map((_, r) => (
            <div
              key={r}
              className="flex items-center border-b border-border last:border-b-0"
            >
              <div className="flex w-[240px] shrink-0 items-center gap-2.5 py-1 pl-6 pr-3">
                <Skeleton className="h-5 w-5 rounded-[5px]" />
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-12" />
                </div>
              </div>
              <div className="flex flex-1 gap-[3px] py-1 pr-6">
                {Array.from({ length: COLUMNS }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[17px] min-w-[24px] flex-1 rounded-[3px]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
