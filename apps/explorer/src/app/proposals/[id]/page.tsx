import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@cosmos-explorer/ui/timeline";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import {
  formatNumber,
  formatPercent,
} from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";
import { DetailBackButton } from "@/components/detail-back-button";
import { getServices } from "@/lib/services";
import { getChainConfig } from "@/lib/config";
import type {
  ProposalDetail,
  ProposalStatus,
  ProposalTally,
} from "@cosmos-explorer/core";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { IconCheck as Check, IconClock as Clock, IconThumbUp as Vote, IconCoins as Coins } from "@tabler/icons-react";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { RawContentSection } from "@/components/proposal-content/shared/raw-content-section";
import { ProposalVotesCard, ProposalVotesCardSkeleton } from "@/components/proposal-votes-card";
import { getGovParams } from "@/lib/gov-params";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function toStatusLabel(status: ProposalStatus): string {
  switch (status) {
    case "deposit":
      return "Deposit";
    case "voting":
      return "Voting";
    case "passed":
      return "Passed";
    case "rejected":
    case "failed":
      return "Rejected";
    default:
      return "Unknown";
  }
}

function toVotePercent(value: string, total: number): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || total <= 0) {
    return null;
  }

  return (parsed / total) * 100;
}

function getTallyTotal(tally: ProposalTally | null): number {
  if (!tally) {
    return 0;
  }

  return ["yes", "no", "abstain", "noWithVeto"].reduce((sum, key) => {
    const value = Number(tally[key as keyof ProposalTally] ?? 0);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);
}


function ProgressBar({
  value,
  threshold,
  colorClass,
  label,
}: {
  value: number | null;
  threshold: number;
  colorClass: string;
  label: string;
}) {
  const filled = value != null ? Math.min(value, 100) : 0;
  const reached = value != null && value >= threshold;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={reached ? "font-semibold text-green-400" : "text-muted-foreground"}>
          {value != null ? `${value.toFixed(2)}%` : "N/A"}
          <span className="text-muted-foreground font-normal"> / {threshold}% required</span>
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full bar-animated ${reached ? "bg-green-500" : colorClass}`}
          style={{ width: `${filled}%` }}
        />
        <div
          className="absolute top-0 h-full w-px bg-white/60 z-10"
          style={{ left: `${threshold}%` }}
        />
      </div>
    </div>
  );
}


type TimelinePhase = "submitted" | "deposit" | "voting" | "result";

function getActivePhase(status: ProposalStatus): TimelinePhase {
  switch (status) {
    case "deposit":
      return "deposit";
    case "voting":
      return "voting";
    case "passed":
    case "rejected":
    case "failed":
      return "result";
    default:
      return "submitted";
  }
}

const PHASE_ORDER: TimelinePhase[] = ["submitted", "deposit", "voting", "result"];

function isPhaseCompleted(phase: TimelinePhase, activePhase: TimelinePhase): boolean {
  return PHASE_ORDER.indexOf(phase) < PHASE_ORDER.indexOf(activePhase);
}

function isPhaseActive(phase: TimelinePhase, activePhase: TimelinePhase): boolean {
  return phase === activePhase;
}

function ProposalTimeline({ proposal }: { proposal: ProposalDetail }) {
  const activePhase = getActivePhase(proposal.status);

  const phases: {
    phase: TimelinePhase;
    label: string;
    timestamp: string | null;
    icon: React.ReactNode;
  }[] = [
    {
      phase: "submitted",
      label: "Submitted",
      timestamp: proposal.submitTime,
      icon: <Check className="h-3 w-3" />,
    },
    {
      phase: "deposit",
      label: "Deposit Period",
      timestamp: proposal.depositEndTime,
      icon: <Coins className="h-3 w-3" />,
    },
    {
      phase: "voting",
      label: "Voting Period",
      timestamp: proposal.votingStartTime,
      icon: <Vote className="h-3 w-3" />,
    },
    {
      phase: "result",
      label: toStatusLabel(proposal.status),
      timestamp: proposal.votingEndTime,
      icon: <Clock className="h-3 w-3" />,
    },
  ];

  return (
    <Timeline>
      {phases.map((p, i) => {
        const completed = isPhaseCompleted(p.phase, activePhase);
        const active = isPhaseActive(p.phase, activePhase);

        return (
          <TimelineItem key={p.phase} completed={completed} active={active}>
            <TimelineDot icon={p.icon} />
            {i < phases.length - 1 && <TimelineConnector />}
            <TimelineContent>
              <TimelineTitle>{p.label}</TimelineTitle>
              {p.timestamp != null && (
                <TimelineDescription>
                  <Timestamp value={p.timestamp} />
                </TimelineDescription>
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { proposalService } = getServices();
  const { network: { endpoints } } = getChainConfig();
  const [proposal, govParams] = await Promise.all([
    proposalService.getProposalById(Number(id)),
    endpoints.cosmosApi ? getGovParams(endpoints.cosmosApi) : Promise.resolve(null),
  ]);

  if (proposal == null) {
    notFound();
  }

  const tallyTotal = getTallyTotal(proposal.tally);
  const yes = proposal.tally
    ? toVotePercent(proposal.tally.yes, tallyTotal)
    : null;
  const no = proposal.tally
    ? toVotePercent(proposal.tally.no, tallyTotal)
    : null;
  const abstain = proposal.tally
    ? toVotePercent(proposal.tally.abstain, tallyTotal)
    : null;
  const veto = proposal.tally
    ? toVotePercent(proposal.tally.noWithVeto, tallyTotal)
    : null;

  // Governance params (from network or fallback)
  const quorumThreshold = govParams?.quorum ?? 66.7;
  const yesThreshold = govParams?.threshold ?? 66.7;
  const vetoThreshold = govParams?.vetoThreshold ?? 33.4;
  const expeditedYesThreshold = govParams?.expeditedThreshold ?? 80;
  const expeditedMaxSeconds = govParams?.expeditedVotingPeriodSeconds ?? 86400;

  // Detect expedited by comparing voting period to expedited_voting_period from network
  const isExpedited = (() => {
    if (!proposal.votingStartTime || !proposal.votingEndTime) return false;
    const durationSeconds =
      (new Date(proposal.votingEndTime).getTime() - new Date(proposal.votingStartTime).getTime()) / 1000;
    return durationSeconds <= expeditedMaxSeconds * 2; // 2x buffer for clock drift
  })();
  const activeYesThreshold = isExpedited ? expeditedYesThreshold : yesThreshold;

  // Governance thresholds
  const bondedAmount = proposal.tally?.bondedTokens ? Number(proposal.tally.bondedTokens.amount) : 0;
  const turnoutPct = bondedAmount > 0 ? Math.min((tallyTotal / bondedAmount) * 100, 100) : null;
  const quorumReached = turnoutPct != null && turnoutPct >= quorumThreshold;

  const yesRaw = Number(proposal.tally?.yes ?? 0);
  const noRaw = Number(proposal.tally?.no ?? 0);
  const vetoRaw = Number(proposal.tally?.noWithVeto ?? 0);
  const nonAbstainTotal = yesRaw + noRaw + vetoRaw;
  const yesThresholdPct = nonAbstainTotal > 0 ? (yesRaw / nonAbstainTotal) * 100 : null;
  const vetoPct = tallyTotal > 0 ? (vetoRaw / tallyTotal) * 100 : null;
  const isVetoed = vetoPct != null && vetoPct >= vetoThreshold;
  const yesPasses = yesThresholdPct != null && yesThresholdPct >= activeYesThreshold;



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <DetailBackButton href="/proposals" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              #{proposal.id}
            </span>
            <StatusBadge status={toStatusLabel(proposal.status)} />
          </div>
          <h1 className="mt-2 text-lg font-bold tracking-tight sm:text-2xl">
            {proposal.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{proposal.type}</p>
        </div>
      </div>

      {/* 1. Voting + Timeline */}
      <div className="grid gap-6 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center gap-3">
              <CardTitle>Voting</CardTitle>
              {isExpedited && (
                <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/30">
                  Expedited
                </span>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Quorum */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quorum</span>
                    <span className="text-xs text-muted-foreground">{quorumThreshold}% required</span>
                  </div>
                  {quorumReached ? (
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-500/30">
                      Reached ✓
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-500/15 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-500/30">
                      Not reached
                    </span>
                  )}
                </div>
                <ProgressBar
                  value={turnoutPct}
                  threshold={quorumThreshold}
                  colorClass="bg-amber-500"
                  label=""
                />
              </div>

              <div className="border-t border-border" />

              {/* Vote distribution */}
              <div className="space-y-3">
                <span className="text-sm font-medium">Vote Distribution</span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Yes</p>
                    <p className="mt-1 text-lg font-bold text-green-400">{formatPercent(yes)}</p>
                    <p className="text-xs text-muted-foreground">{proposal.tally ? formatNumber(Number(proposal.tally.yes)) : "0"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">No</p>
                    <p className="mt-1 text-lg font-bold text-red-400">{formatPercent(no)}</p>
                    <p className="text-xs text-muted-foreground">{proposal.tally ? formatNumber(Number(proposal.tally.no)) : "0"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Abstain</p>
                    <p className="mt-1 text-lg font-bold text-zinc-400">{formatPercent(abstain)}</p>
                    <p className="text-xs text-muted-foreground">{proposal.tally ? formatNumber(Number(proposal.tally.abstain)) : "0"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">No with Veto</p>
                    <p className="mt-1 text-lg font-bold text-yellow-400">{formatPercent(veto)}</p>
                    <p className="text-xs text-muted-foreground">{proposal.tally ? formatNumber(Number(proposal.tally.noWithVeto)) : "0"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Yes threshold */}
              <ProgressBar
                value={yesThresholdPct}
                threshold={activeYesThreshold}
                colorClass="bg-blue-500"
                label="Yes votes (excl. Abstain)"
              />

              <div className="border-t border-border" />

              {/* Expected outcome */}
              {proposal.tally && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expected Outcome</span>
                  {quorumReached && yesPasses ? (
                    <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-400 border border-green-500/30">
                      Approved ✓
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-400 border border-red-500/30">
                      Not Approved
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ProposalTimeline proposal={proposal} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <p className="pb-3 text-sm text-muted-foreground leading-relaxed">
            {proposal.description || "No description available."}
          </p>
          <Separator />
          <Row label="Status">
            <StatusBadge status={toStatusLabel(proposal.status)} />
          </Row>
          <Separator />
          <Row label="Type">{proposal.type}</Row>
          <Separator />
          <Row label="Proposer">
            {proposal.proposer.length > 0 ? (
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(proposal.proposer)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-primary-soft hover:text-primary transition-colors"
                >
                  {proposal.proposer}
                </Link>
                <CopyButton
                  value={proposal.proposer}
                  label="proposer address"
                  size="xs"
                />
              </div>
            ) : (
              <span className="font-mono text-xs break-all">N/A</span>
            )}
          </Row>
        </CardContent>
      </Card>

      {/* 3. Votes */}
      <Suspense fallback={<ProposalVotesCardSkeleton />}>
        <ProposalVotesCard proposalId={Number(id)} />
      </Suspense>

      {/* 4. Raw content */}
      <RawContentSection content={proposal.content} />
    </div>
  );
}
