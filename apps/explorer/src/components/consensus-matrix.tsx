"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import type { ConsensusBlock } from "@cosmos-explorer/core";
import { loadRecentConsensus } from "@/components/consensus-actions";
import { subscribeLatestHeight } from "@/lib/hasura-subscription";
import { ConsensusHeaderBar } from "@/components/consensus-header";
import { LiveBadge } from "@/components/consensus-badges";
import { ConsensusDetailPanel } from "@/components/consensus-detail-panel";
import { ConsensusMatrixGrid } from "@/components/consensus-matrix-grid";
import {
  buildMatrix,
  offsetMs,
  rateTone,
  type Selection,
  type SelectionDetail,
} from "@/components/consensus-matrix-data";

// Fallback only: idle while the WebSocket is connected (see the effect below).
const POLL_INTERVAL_MS = 5000;
const FLASH_DURATION_MS = 1600;

export function ConsensusMatrix({
  chainName,
  initialBlocks,
  pollCount,
  graphqlWs,
}: {
  chainName: string;
  initialBlocks: ConsensusBlock[];
  pollCount: number;
  graphqlWs?: string;
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [paused, setPaused] = useState(false);
  const [flash, setFlash] = useState<Set<number>>(() => new Set());
  const [sel, setSel] = useState<Selection | null>(null);
  // The detail is snapshotted on click so the panel survives once its block
  // scrolls out of the polling window.
  const [detail, setDetail] = useState<SelectionDetail | null>(null);

  const heightsRef = useRef(new Set(initialBlocks.map((b) => b.height)));
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const matrix = useMemo(() => buildMatrix(blocks), [blocks]);
  const { validators, stateByBlock, rateByBlock, avgSignedPct, hasInactive } =
    matrix;

  useEffect(() => {
    heightsRef.current = new Set(blocks.map((b) => b.height));
  }, [blocks]);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    const tick = async () => {
      if (inFlight || document.visibilityState === "hidden") return;
      inFlight = true;
      try {
        const fresh = await loadRecentConsensus(pollCount);
        if (cancelled || fresh.length === 0) return;
        const added = fresh
          .map((b) => b.height)
          .filter((h) => !heightsRef.current.has(h));
        setBlocks(fresh);
        setPaused(false);
        if (added.length > 0) {
          setFlash(new Set(added));
          clearTimeout(flashTimer.current);
          flashTimer.current = setTimeout(() => {
            if (!cancelled) setFlash(new Set());
          }, FLASH_DURATION_MS);
        }
      } catch {
        if (!cancelled) setPaused(true);
      } finally {
        inFlight = false;
      }
    };

    // Refetch only once the tip advances past what we already hold; `wsConnected`
    // gates the fallback interval below so it stays idle while the socket delivers.
    let wsConnected = false;
    const sub = graphqlWs
      ? subscribeLatestHeight(
          graphqlWs,
          (height) => {
            if (!heightsRef.current.has(height)) void tick();
          },
          (connected) => {
            wsConnected = connected;
          },
        )
      : null;

    // Fallback for no ws endpoint or a dropped socket.
    const id = setInterval(() => {
      if (wsConnected) return;
      void tick();
    }, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(id);
      clearTimeout(flashTimer.current);
      document.removeEventListener("visibilitychange", onVisible);
      sub?.close();
    };
  }, [pollCount, graphqlWs]);

  const select = (height: number, key: string) => {
    const block = blocks.find((b) => b.height === height);
    const validator = validators.find((v) => v.key === key);
    const rate = rateByBlock.get(height);
    if (!block || !validator || !rate) return;
    const firstVote = block.votes[0]?.votedAt ?? null;
    const lastVote = block.votes.at(-1)?.votedAt ?? null;
    const votedAt =
      block.votes.find((v) => v.consensusAddress === key)?.votedAt ?? null;
    setSel({ height, key });
    setDetail({
      block,
      isLatest: height === blocks.at(0)?.height,
      validator,
      state: stateByBlock.get(height)?.get(key) ?? "inactive",
      offset: offsetMs(votedAt, firstVote),
      rate,
      spreadMs: offsetMs(lastVote, firstVote),
    });
  };

  const clearSel = () => {
    setSel(null);
    setDetail(null);
  };

  // Crosshair only while the selected block is still in the window; the detail
  // panel keeps its snapshot after it scrolls out.
  const selInWindow =
    sel != null && rateByBlock.has(sel.height) ? sel : null;

  return (
    <div className="space-y-4">
      {/* Title / legend bar — static half shared with the loading skeleton */}
      <ConsensusHeaderBar
        chainName={chainName}
        showInactiveLegend={hasInactive}
        trailing={
          <>
            <LiveBadge paused={paused} />
            <div className="text-xs text-muted-foreground">
              Avg signed{" "}
              <b className={cn("font-mono", rateTone(avgSignedPct).text)}>
                {avgSignedPct.toFixed(1)}%
              </b>{" "}
              · {validators.length} validators
            </div>
          </>
        }
      />

      {detail && <ConsensusDetailPanel detail={detail} onClose={clearSel} />}

      <ConsensusMatrixGrid
        blocks={blocks}
        validators={validators}
        stateByBlock={stateByBlock}
        rateByBlock={rateByBlock}
        selection={selInWindow}
        flash={flash}
        onSelect={select}
      />
    </div>
  );
}
