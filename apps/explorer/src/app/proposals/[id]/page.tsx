import { Card, CardContent, CardHeader, CardTitle } from "@cosmos-explorer/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { DetailBackButton } from "@/components/detail-back-button";
import { getServices, getCachedGovParams } from "@/lib/services";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RawContentSection } from "@/components/proposal-content/shared/raw-content-section";
import { ProposalVotesCard, ProposalVotesCardSkeleton } from "@/components/proposal-votes-card";
import { ProposalDepositsCard, ProposalDepositsCardSkeleton } from "@/components/proposal-deposits-card";
import { ProposalTimeline } from "@/components/proposal-timeline";
import { ProposalVotingCard } from "@/components/proposal-voting-card";
import { ProposalDetailsCard } from "@/components/proposal-details-card";
import { computeVotingMetrics } from "@/lib/proposal-voting";
import type { ProposalStatus } from "@cosmos-explorer/core";

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

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { proposalService } = getServices();
  const [proposal, govParams] = await Promise.all([
    proposalService.getProposalById(Number(id)),
    getCachedGovParams(),
  ]);

  if (proposal == null) {
    notFound();
  }

  const metrics = computeVotingMetrics(
    proposal.tally,
    govParams,
    proposal.votingStartTime,
    proposal.votingEndTime,
  );

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
          <ProposalVotingCard tally={proposal.tally} metrics={metrics} />
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
      <ProposalDetailsCard proposal={proposal} />

      {/* 3. Votes */}
      <Suspense fallback={<ProposalVotesCardSkeleton />}>
        <ProposalVotesCard proposalId={Number(id)} />
      </Suspense>

      {/* 4. Raw content */}
      <RawContentSection content={proposal.content} />

      {/* 5. Deposits */}
      <Suspense fallback={<ProposalDepositsCardSkeleton />}>
        <ProposalDepositsCard proposalId={Number(id)} />
      </Suspense>
    </div>
  );
}
