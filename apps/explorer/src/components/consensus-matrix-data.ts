import type { ConsensusBlock } from "@cosmos-explorer/core";

// `inactive` = not in this block's active set (but appears elsewhere in the window).
export type CellState = "proposed" | "voted" | "absent" | "inactive";

export const STATE_LABEL: Record<CellState, string> = {
  proposed: "Proposer",
  voted: "Voted",
  absent: "Not voted",
  inactive: "Not in set",
};

// Consensus state → cell fill; tokens defined in app/globals.css (@theme).
export const CELL_CLASS = {
  proposed: "bg-consensus-proposed",
  voted: "bg-consensus-voted",
  absent: "bg-consensus-absent",
} as const;

// Signed-rate → status tone (design's sc()): healthy / warning / poor.
// Literal class names so Tailwind's scanner picks them up; tokens live in
// app/globals.css (@theme).
export function rateTone(pct: number): { text: string; bg: string } {
  return pct >= 95
    ? { text: "text-consensus-healthy", bg: "bg-consensus-healthy" }
    : pct >= 85
      ? { text: "text-consensus-warning", bg: "bg-consensus-warning" }
      : { text: "text-consensus-poor", bg: "bg-consensus-poor" };
}

interface ValidatorLike {
  consensusAddress: string;
  operatorAddress: string;
  moniker: string | null;
}

export function validatorLabel(v: ValidatorLike): string {
  return v.moniker ?? (v.operatorAddress || v.consensusAddress);
}

export function monoOf(label: string): string {
  const clean = label.replace(/[^a-zA-Z]/g, "");
  return (clean.slice(0, 2) || "VA").toUpperCase();
}

export function offsetMs(
  iso: string | null,
  baseIso: string | null,
): number | null {
  if (iso == null || baseIso == null) return null;
  const t = new Date(iso).getTime();
  const base = new Date(baseIso).getTime();
  if (Number.isNaN(t) || Number.isNaN(base)) return null;
  return Math.max(0, t - base);
}

export function formatUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toISOString().replace("T", " ").slice(0, 19)} UTC`;
}

export interface MatrixValidator {
  key: string;
  operatorAddress: string;
  label: string;
  mono: string;
  avatarUrl: string | null;
  signed: number;
  total: number;
  /** Signing uptime over the slashing window (~1 week); null if unavailable. */
  uptimePercent: number | null;
}

export interface BlockRate {
  signed: number;
  total: number;
  pct: number;
}

export interface MatrixData {
  validators: MatrixValidator[];
  stateByBlock: Map<number, Map<string, CellState>>;
  rateByBlock: Map<number, BlockRate>;
  avgSignedPct: number;
  hasInactive: boolean;
}

export interface Selection {
  height: number;
  key: string;
}

export interface SelectionDetail {
  block: ConsensusBlock;
  isLatest: boolean;
  validator: MatrixValidator;
  state: CellState;
  offset: number | null;
  rate: BlockRate;
  /** Time from the first to the last precommit gathered for the block, in ms. */
  spreadMs: number | null;
}

export function buildMatrix(blocks: ConsensusBlock[]): MatrixData {
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
