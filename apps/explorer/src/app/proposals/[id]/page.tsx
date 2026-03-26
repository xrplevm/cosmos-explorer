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
import { PAGE_SIZE_OPTIONS } from "@cosmos-explorer/ui/pagination-constants";
import { StatusBadge } from "@/components/status-badge";
import {
  formatNumber,
  formatPercent,
  formatTokenAmount,
} from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";
import { DetailBackButton } from "@/components/detail-back-button";
import { getServices } from "@/lib/services";
import { getChainConfig } from "@/lib/config";
import type {
  ProposalDetail,
  ProposalStatus,
  ProposalTally,
  VoteOption,
} from "@cosmos-explorer/core";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { IconCheck as Check, IconClock as Clock, IconThumbUp as Vote, IconCoins as Coins } from "@tabler/icons-react";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { ProposalContentRoot } from "@/components/proposal-content";
import { ProposalVotesCard, ProposalVotesCardSkeleton } from "@/components/proposal-votes-card";

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

function VoteBar({
  yes,
  no,
  abstain,
  veto,
}: {
  yes: number | null;
  no: number | null;
  abstain: number | null;
  veto: number | null;
}) {
  if (yes == null || no == null || abstain == null || veto == null) {
    return (
      <p className="text-sm text-muted-foreground">No tally data available.</p>
    );
  }

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
      <div className="bg-green-500" style={{ width: `${yes}%` }} />
      <div className="bg-red-500" style={{ width: `${no}%` }} />
      <div className="bg-zinc-400" style={{ width: `${abstain}%` }} />
      <div className="bg-yellow-500" style={{ width: `${veto}%` }} />
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

const DEFAULT_VOTE_PAGE_SIZE = 25;

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number,
): number {
  const num = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) && num >= 1 ? num : fallback;
}

export default async function ProposalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const votePage = parsePositiveInt(resolvedSearchParams.page, 1);
  const rawVotePageSize = parsePositiveInt(resolvedSearchParams.pageSize, DEFAULT_VOTE_PAGE_SIZE);
  const votePageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawVotePageSize)
    ? rawVotePageSize
    : DEFAULT_VOTE_PAGE_SIZE;

  const VALID_VOTE_FILTERS = ["yes", "no", "abstain", "noWithVeto"] as const;
  const rawVoteFilter = resolvedSearchParams.voteFilter;
  const voteFilter: VoteOption | "all" =
    typeof rawVoteFilter === "string" &&
    (VALID_VOTE_FILTERS as readonly string[]).includes(rawVoteFilter)
      ? (rawVoteFilter as VoteOption)
      : "all";

  const { proposalService } = getServices();
  const { network: { primaryToken } } = getChainConfig();
  const proposal = await proposalService.getProposalById(Number(id));

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

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <DetailBackButton href="/proposals" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">
              #{proposal.id}
            </span>
            <StatusBadge status={toStatusLabel(proposal.status)} />
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {proposal.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{proposal.type}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
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
                  className="min-w-0 flex-1 break-all font-mono text-xs text-foreground hover:underline"
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
          <Separator />
          <Row label="Bonded Snapshot">
            {formatTokenAmount(proposal.tally?.bondedTokens, primaryToken)}
          </Row>
          <Separator />
          <Row label="Metadata">
            <span className="font-mono text-xs break-all">
              {proposal.metadata ?? "N/A"}
            </span>
          </Row>
        </CardContent>
      </Card>

      <Suspense fallback={<ProposalVotesCardSkeleton />}>
        <ProposalVotesCard
          proposalId={Number(id)}
          page={votePage}
          pageSize={votePageSize}
          basePath={`/proposals/${id}`}
          voteFilter={voteFilter}
        />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Voting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VoteBar yes={yes} no={no} abstain={abstain} veto={veto} />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Yes</p>
                  <p className="mt-1 text-xl font-bold text-green-400">
                    {formatPercent(yes)}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">No</p>
                  <p className="mt-1 text-xl font-bold text-red-400">
                    {formatPercent(no)}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Abstain</p>
                  <p className="mt-1 text-xl font-bold">
                    {formatPercent(abstain)}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">No with Veto</p>
                  <p className="mt-1 text-xl font-bold text-yellow-400">
                    {formatPercent(veto)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Yes Votes</p>
                  <p className="mt-1 text-sm font-medium">
                    {proposal.tally ? formatNumber(Number(proposal.tally.yes)) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">No Votes</p>
                  <p className="mt-1 text-sm font-medium">
                    {proposal.tally ? formatNumber(Number(proposal.tally.no)) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Abstain Votes</p>
                  <p className="mt-1 text-sm font-medium">
                    {proposal.tally ? formatNumber(Number(proposal.tally.abstain)) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Veto Votes</p>
                  <p className="mt-1 text-sm font-medium">
                    {proposal.tally ? formatNumber(Number(proposal.tally.noWithVeto)) : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3">
                <p className="text-xs text-muted-foreground">
                  Total Votes: <span className="font-medium text-foreground">{formatNumber(tallyTotal)}</span>
                </p>
                {proposal.tally?.bondedTokens != null && (
                  <p className="text-xs text-muted-foreground">
                    Turnout: <span className="font-medium text-foreground">{formatPercent(tallyTotal > 0 && Number(proposal.tally.bondedTokens.amount) > 0 ? (tallyTotal / Number(proposal.tally.bondedTokens.amount)) * 100 : null)}</span>
                  </p>
                )}
              </div>
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

      <ProposalContentRoot proposal={proposal} />
    </div>
  );
}
