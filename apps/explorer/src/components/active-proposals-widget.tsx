import Link from "next/link";
import { getServices, getCachedGovParams } from "@/lib/services";
import { VotingCountdown } from "@/components/voting-countdown";
import { ProgressBar } from "@cosmos-explorer/ui/progress-bar";
import { computeVotingMetrics } from "@/lib/proposal-voting";
import type { VotingMetrics } from "@/lib/proposal-voting";
import type { ProposalDetail } from "@cosmos-explorer/core";

function isProposalExpired(endTime: string | null): boolean {
  if (!endTime) return false;
  return new Date(endTime).getTime() < Date.now();
}

// ── Proposal strip ────────────────────────────────────────────────────────────

function ProposalStrip({
  proposal,
  metrics,
}: {
  proposal: ProposalDetail;
  metrics: VotingMetrics;
}) {
  return (
    <Link
      href={`/proposals/${proposal.id}`}
      className="flex w-full items-center rounded-lg border border-border bg-accent/20 px-3 py-2.5 transition-colors hover:bg-background/50"
    >
      {/* Left: badges + title + countdown */}
      <div className="min-w-0 w-1/2">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <span className="font-mono text-[10px] text-muted-foreground">#{proposal.id}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold border ${
              metrics.isExpedited
                ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
            }`}
          >
            {metrics.isExpedited ? "Expedited" : "Regular"}
          </span>
        </div>
        <p className="truncate text-sm font-semibold leading-snug">{proposal.title}</p>
        {proposal.votingEndTime && (
          <div className="mt-1">
            <VotingCountdown
              endTime={proposal.votingEndTime}
              startTime={proposal.votingStartTime}
            />
          </div>
        )}
      </div>

      {/* Right: bars + outcome */}
      <div className="flex w-1/2 flex-col gap-1.5 pl-4">
        <ProgressBar
          label="Quorum"
          value={metrics.turnoutPct}
          threshold={metrics.quorumThreshold}
          colorClass="bg-amber-500"
          size="sm"
        />
        <ProgressBar
          label="Yes"
          value={metrics.yesThresholdPct}
          threshold={metrics.activeYesThreshold}
          colorClass="bg-blue-500"
          size="sm"
        />
        <div className="flex justify-end pt-0.5">
          {metrics.approved ? (
            <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-400 border border-green-500/30">
              Approved ✓
            </span>
          ) : (
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/30">
              Not Approved
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function ActiveProposalsWidgetSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex w-full items-center rounded-lg border border-border bg-accent/20 px-3 py-2.5">
        {/* Left: badges + title + countdown placeholder */}
        <div className="w-1/2 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-8 animate-pulse rounded bg-muted" />
            <div className="h-4 w-14 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="space-y-1.5 pt-1">
            <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
            <div className="flex items-end gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="h-4 w-6 animate-pulse rounded bg-muted" />
                  <div className="h-1.5 w-5 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
            <div className="h-1 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </div>
        {/* Right: progress bars + outcome placeholder */}
        <div className="flex w-1/2 flex-col gap-1.5 pl-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <div className="h-2.5 w-10 animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
            </div>
          ))}
          <div className="flex justify-end pt-0.5">
            <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

export async function ActiveProposalsWidget() {
  const { proposalService } = getServices();

  const [allProposals, govParams] = await Promise.all([
    proposalService.getActiveProposals(5),
    getCachedGovParams(),
  ]);

  // Filter out proposals whose voting period has already ended (stale DB status)
  const proposals = allProposals.filter(
    (p) => !isProposalExpired(p.votingEndTime)
  );

  if (proposals.length === 0) return null;

  // Show only the most recent proposal
  const featured = proposals[0];
  const metrics = computeVotingMetrics(
    featured.tally,
    govParams,
    featured.votingStartTime,
    featured.votingEndTime,
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Active Proposals
          <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
            {proposals.length}
          </span>
        </h2>
        <Link
          href="/proposals"
          className="text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          View open proposals →
        </Link>
      </div>

      <ProposalStrip proposal={featured} metrics={metrics} />
    </div>
  );
}
