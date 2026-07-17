"use client";

import Link from "next/link";
import { Badge } from "@cosmos-explorer/ui/badge";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { RelativeTime } from "@/components/relative-time";
import { formatHash } from "@/lib/formatters";
import { StateBadge } from "@/components/consensus-badges";
import { ValidatorAvatar } from "@/components/consensus-validator-avatar";
import {
  formatUtc,
  monoOf,
  rateTone,
  type SelectionDetail,
  validatorLabel,
} from "@/components/consensus-matrix-data";

// Fixed overlay pinned to the bottom of the content column (full-width on
// mobile), floating in front of the matrix. marginBottom:0 cancels the
// space-y-4 bottom margin this non-last child would otherwise get
// (Tailwind v4), which would lift it off the bottom.
export function ConsensusDetailPanel({
  detail,
  onClose,
}: {
  detail: SelectionDetail;
  onClose: () => void;
}) {
  return (
    <div
      style={{ marginBottom: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 grid max-h-[46vh] gap-6 overflow-auto border-t border-border bg-card p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] sm:grid-cols-2 md:left-60"
    >
      <button
        type="button"
        onClick={onClose}
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
            <Badge
              variant="outline"
              className="rounded-md border-transparent bg-consensus-healthy/15 px-2 font-mono text-[10.5px] text-consensus-proposed"
            >
              Latest
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="rounded-md border-transparent bg-muted px-2 font-mono text-[10.5px] text-muted-foreground"
            >
              Finalized
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            <RelativeTime timestamp={detail.block.timestamp} />
          </span>
        </div>
        <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1 text-xs">
          <dt className="text-muted-foreground">Hash</dt>
          <dd className="flex items-center gap-2 font-mono">
            {formatHash(detail.block.hash)}
            <CopyButton value={detail.block.hash} label="block hash" size="xs" />
          </dd>
          <dt className="text-muted-foreground">Time</dt>
          <dd className="font-mono">{formatUtc(detail.block.timestamp)}</dd>
          <dt className="text-muted-foreground">Proposer</dt>
          <dd className="flex items-center gap-1.5">
            <ValidatorAvatar
              avatarUrl={detail.block.proposer.avatarUrl}
              mono={monoOf(validatorLabel(detail.block.proposer))}
              className="h-[18px] w-[18px]"
            />
            {validatorLabel(detail.block.proposer)}
          </dd>
          <dt className="text-muted-foreground">Precommits</dt>
          <dd
            className={cn(
              "font-mono font-semibold",
              rateTone(detail.rate.pct).text,
            )}
          >
            {detail.rate.signed}/{detail.rate.total}
            <span className="ml-1 font-normal text-muted-foreground">
              · {detail.rate.pct.toFixed(1)}% signed
            </span>
          </dd>
          <dt className="text-muted-foreground">Missed</dt>
          <dd
            className={cn(
              "font-mono font-semibold",
              detail.rate.total - detail.rate.signed > 0 &&
                "text-consensus-absent",
            )}
          >
            {detail.rate.total - detail.rate.signed}
          </dd>
          <dt className="text-muted-foreground">Precommit spread</dt>
          <dd className="font-mono">
            {detail.spreadMs != null
              ? `${(detail.spreadMs / 1000).toFixed(2)}s`
              : "—"}
            <span className="ml-1 text-muted-foreground">· first → last</span>
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
            mono={detail.validator.mono}
            className="h-6 w-6"
          />
          <span className="text-sm font-bold">{detail.validator.label}</span>
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
            className={cn(
              "font-mono font-semibold",
              detail.validator.uptimePercent != null &&
                rateTone(detail.validator.uptimePercent).text,
            )}
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
  );
}
