"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import type { ConsensusBlock } from "@cosmos-explorer/core";
import { RelativeTime } from "@/components/relative-time";
import { formatHash } from "@/lib/formatters";
import { loadRecentConsensus } from "@/components/consensus-actions";
import { subscribeLatestHeight } from "@/lib/hasura-subscription";
import { CELL_COLOR, ConsensusHeaderBar } from "@/components/consensus-header";

// Fallback only: idle while the WebSocket is connected (see the effect below).
const POLL_INTERVAL_MS = 5000;
const FLASH_DURATION_MS = 1600;

// `inactive` = not in this block's active set (but appears elsewhere in the window).
type CellState = "proposed" | "voted" | "absent" | "inactive";

const STATE_LABEL: Record<CellState, string> = {
  proposed: "Proposer",
  voted: "Voted",
  absent: "Not voted",
  inactive: "Not in set",
};

// Signed-rate → status color (design's sc()): healthy / warning / poor.
function rateColor(pct: number): string {
  return pct >= 95 ? "#12a37a" : pct >= 85 ? "#e0982a" : "#e0555f";
}

interface ValidatorLike {
  consensusAddress: string;
  operatorAddress: string;
  moniker: string | null;
}

function validatorLabel(v: ValidatorLike): string {
  return v.moniker ?? (v.operatorAddress || v.consensusAddress);
}

function monoOf(label: string): string {
  const clean = label.replace(/[^a-zA-Z]/g, "");
  return (clean.slice(0, 2) || "VA").toUpperCase();
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function offsetMs(iso: string | null, baseIso: string | null): number | null {
  if (iso == null || baseIso == null) return null;
  const t = new Date(iso).getTime();
  const base = new Date(baseIso).getTime();
  if (Number.isNaN(t) || Number.isNaN(base)) return null;
  return Math.max(0, t - base);
}

function formatUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toISOString().replace("T", " ").slice(0, 19)} UTC`;
}

// Deterministic colored emblem derived from the validator's label, for
// validators without a keybase avatar in consensus data.
function emblemImage(seed: number): string {
  const hue = seed % 360;
  const hue2 = (hue + 42) % 360;
  const c1 = `hsl(${hue} 52% 40%)`;
  const c2 = `hsl(${hue2} 62% 56%)`;
  const shapes = [
    `<circle cx="72" cy="30" r="40" fill="${c2}"/>`,
    `<rect x="-10" y="56" width="120" height="60" fill="${c2}"/>`,
    `<polygon points="0,100 100,100 0,20" fill="${c2}"/>`,
    `<circle cx="30" cy="30" r="24" fill="${c2}"/><circle cx="74" cy="74" r="24" fill="${c2}"/>`,
    `<rect x="0" y="0" width="46" height="100" fill="${c2}"/>`,
    `<polygon points="50,4 96,50 50,96 4,50" fill="${c2}"/>`,
  ];
  const shape = shapes[seed % shapes.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='${c1}'/>${shape}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function Emblem({
  seed,
  size,
  mono,
}: {
  seed: number;
  size: number;
  mono: string;
}) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[5px] font-mono font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        textShadow: "0 1px 2px rgba(0,0,0,.45)",
        backgroundImage: emblemImage(seed),
        backgroundSize: "cover",
      }}
    >
      {mono}
    </span>
  );
}

// Falls back to the generated emblem on no avatarUrl or a broken image URL.
function ValidatorAvatar({
  avatarUrl,
  seed,
  mono,
  size,
}: {
  avatarUrl: string | null;
  seed: number;
  mono: string;
  size: number;
}) {
  const [failed, setFailed] = useState(false);
  if (avatarUrl != null && avatarUrl.length > 0 && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        aria-hidden
        onError={() => { setFailed(true); }}
        className="shrink-0 rounded-[5px] object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return <Emblem seed={seed} size={size} mono={mono} />;
}

interface MatrixValidator {
  key: string;
  operatorAddress: string;
  label: string;
  mono: string;
  seed: number;
  avatarUrl: string | null;
  signed: number;
  total: number;
  /** Signing uptime over the slashing window (~1 week); null if unavailable. */
  uptimePercent: number | null;
}

interface BlockRate {
  signed: number;
  total: number;
  pct: number;
}

interface MatrixData {
  validators: MatrixValidator[];
  stateByBlock: Map<number, Map<string, CellState>>;
  rateByBlock: Map<number, BlockRate>;
  avgSignedPct: number;
  hasInactive: boolean;
}

function buildMatrix(blocks: ConsensusBlock[]): MatrixData {
  const universe = new Map<string, MatrixValidator>();
  const stateByBlock = new Map<number, Map<string, CellState>>();

  const register = (
    v: ValidatorLike & {
      avatarUrl: string | null;
      uptimePercent?: number | null;
    },
  ): void => {
    if (universe.has(v.consensusAddress)) return;
    const label = validatorLabel(v);
    universe.set(v.consensusAddress, {
      key: v.consensusAddress,
      operatorAddress: v.operatorAddress,
      label,
      mono: monoOf(label),
      seed: hashString(label),
      avatarUrl: v.avatarUrl,
      uptimePercent: v.uptimePercent ?? null,
      signed: 0,
      total: 0,
    });
  };

  for (const block of blocks) {
    const map = new Map<string, CellState>();
    for (const v of block.votes) {
      register(v);
      map.set(v.consensusAddress, "voted");
    }
    for (const v of block.missed) {
      register(v);
      map.set(v.consensusAddress, "absent");
    }
    // Proposer takes precedence over a plain vote. Skip the
    // `unknown-proposer-<height>` placeholder — counting it would inflate
    // signed/total and skew avgSignedPct by a non-existent signer.
    if (!block.proposer.consensusAddress.startsWith("unknown-proposer-")) {
      register(block.proposer);
      map.set(block.proposer.consensusAddress, "proposed");
    }
    stateByBlock.set(block.height, map);
  }

  // In-window tally only — long-run uptime comes from uptimePercent, not this sample.
  for (const v of universe.values()) {
    for (const block of blocks) {
      const st = stateByBlock.get(block.height)?.get(v.key) ?? "inactive";
      if (st === "inactive") continue;
      v.total += 1;
      if (st === "voted" || st === "proposed") v.signed += 1;
    }
  }

  const rateByBlock = new Map<number, BlockRate>();
  for (const [height, map] of stateByBlock) {
    let signed = 0;
    for (const st of map.values()) {
      if (st === "voted" || st === "proposed") signed += 1;
    }
    const total = map.size;
    rateByBlock.set(height, {
      signed,
      total,
      pct: total > 0 ? (signed / total) * 100 : 0,
    });
  }

  const validators = [...universe.values()].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );

  const rates = [...rateByBlock.values()];
  const avgSignedPct =
    rates.length > 0
      ? rates.reduce((sum, r) => sum + r.pct, 0) / rates.length
      : 0;

  const hasInactive = validators.some((v) => v.total < blocks.length);

  return { validators, stateByBlock, rateByBlock, avgSignedPct, hasInactive };
}

interface Selection {
  height: number;
  key: string;
}

interface SelectionDetail {
  block: ConsensusBlock;
  isLatest: boolean;
  validator: MatrixValidator;
  state: CellState;
  votedAt: string | null;
  offset: number | null;
  rate: BlockRate;
  /** Time from the first to the last precommit gathered for the block, in ms. */
  spreadMs: number | null;
}

function LiveBadge({ paused }: { paused: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold"
      style={{ color: paused ? "#e0982a" : "#12a37a" }}
    >
      <span className="relative flex h-2 w-2">
        {!paused && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2fd39a]/70" />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: paused ? "#e0982a" : "#2fd39a" }}
        />
      </span>
      {paused ? "paused" : "live"}
    </span>
  );
}

function StateBadge({ state }: { state: CellState }) {
  if (state === "inactive") {
    return (
      <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
        {STATE_LABEL[state]}
      </span>
    );
  }
  const color = CELL_COLOR[state];
  return (
    <span
      className="rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold"
      style={{
        backgroundColor: `${color}26`,
        color: state === "voted" ? "#0e8464" : color,
        border: `1px solid ${color}59`,
      }}
    >
      {STATE_LABEL[state]}
    </span>
  );
}

export function ConsensusMatrix({
  initialBlocks,
  pollCount,
  graphqlWs,
}: {
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
      votedAt,
      offset: offsetMs(votedAt, firstVote),
      rate,
      spreadMs: offsetMs(lastVote, firstVote),
    });
  };

  const clearSel = () => {
    setSel(null);
    setDetail(null);
  };

  const latest = blocks.at(0);

  // Crosshair only while the selected block is still in the window; the detail
  // panel keeps its snapshot after it scrolls out.
  const selInWindow =
    sel != null && rateByBlock.has(sel.height) ? sel : null;

  return (
    <div className="space-y-4">
      {/* Title / legend bar — static half shared with the loading skeleton */}
      <ConsensusHeaderBar
        showInactiveLegend={hasInactive}
        trailing={
          <>
            <LiveBadge paused={paused} />
            <div className="text-xs text-muted-foreground">
              Avg signed{" "}
              <b
                className="font-mono"
                style={{ color: rateColor(avgSignedPct) }}
              >
                {avgSignedPct.toFixed(1)}%
              </b>{" "}
              · {validators.length} validators
            </div>
          </>
        }
      />

      {/* Detail panel — fixed overlay pinned to the bottom of the content
          column (full-width on mobile), floating in front of the matrix.
          marginBottom:0 cancels the space-y-4 bottom margin this non-last child
          would otherwise get (Tailwind v4), which would lift it off the bottom. */}
      {detail && (
        <div
          style={{ marginBottom: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 grid max-h-[46vh] gap-6 overflow-auto border-t border-border bg-card p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] sm:grid-cols-2 md:left-60"
        >
          <button
            type="button"
            onClick={clearSel}
            className="absolute right-4 top-4 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            ✕ Close
          </button>

          {/* Block */}
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
              Block
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-lg font-semibold">
                #{detail.block.height.toLocaleString()}
              </span>
              {detail.isLatest ? (
                <span
                  className="rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold"
                  style={{ backgroundColor: "#12a37a26", color: "#0e8464" }}
                >
                  Latest
                </span>
              ) : (
                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10.5px] font-semibold text-muted-foreground">
                  Finalized
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                <RelativeTime timestamp={detail.block.timestamp} />
              </span>
            </div>
            <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1 text-xs">
              <dt className="text-muted-foreground">Hash</dt>
              <dd className="flex items-center gap-2 font-mono">
                {formatHash(detail.block.hash)}
                <CopyButton
                  value={detail.block.hash}
                  label="block hash"
                  size="xs"
                />
              </dd>
              <dt className="text-muted-foreground">Time</dt>
              <dd className="font-mono">{formatUtc(detail.block.timestamp)}</dd>
              <dt className="text-muted-foreground">Proposer</dt>
              <dd className="flex items-center gap-1.5">
                <ValidatorAvatar
                  avatarUrl={detail.block.proposer.avatarUrl}
                  seed={hashString(validatorLabel(detail.block.proposer))}
                  mono={monoOf(validatorLabel(detail.block.proposer))}
                  size={18}
                />
                {validatorLabel(detail.block.proposer)}
              </dd>
              <dt className="text-muted-foreground">Precommits</dt>
              <dd
                className="font-mono font-semibold"
                style={{ color: rateColor(detail.rate.pct) }}
              >
                {detail.rate.signed}/{detail.rate.total}
                <span className="ml-1 font-normal text-muted-foreground">
                  · {detail.rate.pct.toFixed(1)}% signed
                </span>
              </dd>
              <dt className="text-muted-foreground">Missed</dt>
              <dd
                className="font-mono font-semibold"
                style={
                  detail.rate.total - detail.rate.signed > 0
                    ? { color: "#eb6b73" }
                    : undefined
                }
              >
                {detail.rate.total - detail.rate.signed}
              </dd>
              <dt className="text-muted-foreground">Precommit spread</dt>
              <dd className="font-mono">
                {detail.spreadMs != null
                  ? `${(detail.spreadMs / 1000).toFixed(2)}s`
                  : "—"}
                <span className="ml-1 text-muted-foreground">
                  · first → last
                </span>
              </dd>
              <dt className="text-muted-foreground">Gas</dt>
              <dd className="font-mono">
                {detail.block.totalGas > 0
                  ? detail.block.totalGas.toLocaleString()
                  : "—"}
              </dd>
            </dl>
            <Link
              href={`/blocks/${String(detail.block.height)}`}
              className="mt-3 inline-block text-xs text-primary-soft transition-colors hover:text-primary"
            >
              View block #{detail.block.height.toLocaleString()} →
            </Link>
          </div>

          {/* Validator */}
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
              Validator
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <ValidatorAvatar
                avatarUrl={detail.validator.avatarUrl}
                seed={detail.validator.seed}
                mono={detail.validator.mono}
                size={24}
              />
              <span className="text-sm font-bold">
                {detail.validator.label}
              </span>
              <StateBadge state={detail.state} />
            </div>
            <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1 text-xs">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="font-mono">
                {detail.validator.operatorAddress ? (
                  <Link
                    href={`/validators/${detail.validator.operatorAddress}`}
                    className="text-primary-soft transition-colors hover:text-primary"
                  >
                    {formatHash(detail.validator.operatorAddress)}
                  </Link>
                ) : (
                  formatHash(detail.validator.key)
                )}
              </dd>
              <dt className="text-muted-foreground">Precommit</dt>
              <dd className="font-mono">
                {detail.state === "absent"
                  ? "No precommit received"
                  : detail.state === "proposed"
                    ? "block (proposer)"
                    : detail.state === "voted"
                      ? "block"
                      : "not in this block's set"}
              </dd>
              <dt className="text-muted-foreground">Signature</dt>
              <dd className="font-mono">
                {detail.state === "proposed"
                  ? "proposed @ block time"
                  : detail.state === "voted"
                    ? detail.offset != null
                      ? `+${(detail.offset / 1000).toFixed(2)}s after first precommit`
                      : "precommitted"
                    : "—"}
              </dd>
              <dt className="text-muted-foreground">Uptime (~1w)</dt>
              <dd
                className="font-mono font-semibold"
                style={
                  detail.validator.uptimePercent != null
                    ? { color: rateColor(detail.validator.uptimePercent) }
                    : undefined
                }
              >
                {detail.validator.uptimePercent != null
                  ? `${detail.validator.uptimePercent.toFixed(2)}%`
                  : "—"}
                <span className="ml-1 font-normal text-muted-foreground">
                  · {detail.validator.signed}/{detail.validator.total} in view
                </span>
              </dd>
            </dl>
          </div>
        </div>
      )}

      {/* Matrix */}
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
                const isSelCol = selInWindow?.height === block.height;
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
                      select(block.height, headerKey);
                    }}
                    title={`#${block.height.toLocaleString()} · ${rate?.signed ?? 0}/${rate?.total ?? 0} signed`}
                    className={cn(
                      "flex h-[70px] min-w-[24px] flex-1 flex-col items-center justify-end gap-1 rounded-t-[5px] pb-1 transition-colors",
                      isSelCol
                        ? "bg-blue-500/15 shadow-[inset_0_-3px_0] shadow-blue-600 dark:bg-blue-400/20 dark:shadow-blue-400"
                        : flash.has(block.height)
                          ? "bg-[#2fd39a]/25"
                          : isNewest
                            ? "bg-[#2fd39a]/10"
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
                      className="h-[3px] w-4 rounded-[2px]"
                      style={{ backgroundColor: rateColor(rate?.pct ?? 0) }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rows: validators */}
          {validators.map((v) => {
            const isSelRow = selInWindow?.key === v.key;
            return (
              <div
                key={v.key}
                className="flex items-center border-b border-border last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => { select(latest?.height ?? 0, v.key); }}
                  className={cn(
                    "sticky left-0 z-[2] flex w-[240px] shrink-0 items-center gap-2.5 py-1 pl-6 pr-3 text-left transition-colors",
                    isSelRow
                      ? "bg-blue-500/10 shadow-[inset_3px_0_0] shadow-blue-600 dark:bg-blue-400/15 dark:shadow-blue-400"
                      : "bg-card",
                  )}
                >
                  <ValidatorAvatar avatarUrl={v.avatarUrl} seed={v.seed} mono={v.mono} size={20} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold leading-tight">
                      {v.label}
                    </div>
                    <div
                      className="font-mono text-[9.5px] leading-tight"
                      style={
                        v.uptimePercent != null
                          ? { color: rateColor(v.uptimePercent) }
                          : undefined
                      }
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
                    const inCol = selInWindow?.height === block.height;
                    const isCell = inCol && isSelRow;
                    return (
                      <button
                        key={block.height}
                        type="button"
                        onClick={() => { select(block.height, v.key); }}
                        title={`#${block.height.toLocaleString()} — ${STATE_LABEL[state]} · ${v.label}`}
                        aria-label={`Block ${String(block.height)}, ${v.label}: ${STATE_LABEL[state]}`}
                        className={cn(
                          "h-[17px] min-w-[24px] flex-1 rounded-[3px] transition-shadow",
                          state === "inactive" && "bg-[#e9ebef] dark:bg-[#212836]",
                          isCell &&
                            "relative z-[3] ring-2 ring-blue-600 ring-offset-1 ring-offset-card dark:ring-blue-400",
                          !isCell &&
                            (inCol || isSelRow) &&
                            "relative z-[2] ring-1 ring-blue-500/50 dark:ring-blue-400/60",
                        )}
                        style={
                          state === "inactive"
                            ? undefined
                            : { backgroundColor: CELL_COLOR[state] }
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
