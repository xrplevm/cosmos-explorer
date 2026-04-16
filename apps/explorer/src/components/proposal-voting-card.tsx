"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { ProgressBar } from "@cosmos-explorer/ui/progress-bar";
import { DonutChart } from "@cosmos-explorer/ui/donut-chart";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@cosmos-explorer/ui/tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { ProposalTally } from "@cosmos-explorer/core";
import type { VotingMetrics } from "@/lib/proposal-voting";

const VOTE_COLORS = {
  yes: "#4ade80",
  no: "#f87171",
  abstain: "#a1a1aa",
  noWithVeto: "#facc15",
} as const;

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex text-muted-foreground hover:text-foreground transition-colors">
          <IconInfoCircle size={14} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

interface ProposalVotingCardProps {
  tally: ProposalTally | null;
  metrics: VotingMetrics;
}

export function ProposalVotingCard({ tally, metrics }: ProposalVotingCardProps) {
  const {
    yes,
    no,
    abstain,
    veto,
    quorumThreshold,
    isExpedited,
    turnoutPct,
    quorumReached,
    yesPasses,
  } = metrics;

  const chartSegments = [
    { label: "Yes", value: Number(tally?.yes ?? 0), color: VOTE_COLORS.yes },
    { label: "No", value: Number(tally?.no ?? 0), color: VOTE_COLORS.no },
    { label: "Abstain", value: Number(tally?.abstain ?? 0), color: VOTE_COLORS.abstain },
    { label: "No with Veto", value: Number(tally?.noWithVeto ?? 0), color: VOTE_COLORS.noWithVeto },
  ];

  return (
    <TooltipProvider>
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
                <InfoTip text="Minimum percentage of bonded tokens that must vote for the result to be valid." />
                <span className="text-xs text-muted-foreground">
                  {turnoutPct != null ? `${turnoutPct.toFixed(2)}%` : "N/A"}{" "}
                  ({quorumThreshold}% required)
                </span>
              </div>
              {quorumReached ? (
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-500/30">
                  Reached
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
              showThresholdLabel={false}
            />
          </div>

          <div className="border-t border-border" />

          {/* Vote distribution — boxes left, donut right */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Vote Distribution</span>
              <InfoTip text="Breakdown of votes. Abstain counts toward quorum but is excluded from the yes/no ratio. No with Veto can block a proposal if it reaches 33.4% of all votes." />
            </div>
            <div className="flex items-center gap-6">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Yes</p>
                  <p className="mt-1 text-lg font-bold text-green-400">{formatPercent(yes)}</p>
                  <p className="text-xs text-muted-foreground">{tally ? formatNumber(Number(tally.yes)) : "0"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">No</p>
                  <p className="mt-1 text-lg font-bold text-red-400">{formatPercent(no)}</p>
                  <p className="text-xs text-muted-foreground">{tally ? formatNumber(Number(tally.no)) : "0"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Abstain</p>
                  <p className="mt-1 text-lg font-bold text-zinc-400">{formatPercent(abstain)}</p>
                  <p className="text-xs text-muted-foreground">{tally ? formatNumber(Number(tally.abstain)) : "0"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">No with Veto</p>
                  <p className="mt-1 text-lg font-bold text-yellow-400">{formatPercent(veto)}</p>
                  <p className="text-xs text-muted-foreground">{tally ? formatNumber(Number(tally.noWithVeto)) : "0"}</p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:block">
                <DonutChart segments={chartSegments} size={200} />
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Expected outcome */}
          {tally && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Expected Outcome</span>
                <InfoTip text="A proposal is approved when quorum is reached, Yes votes exceed the threshold among non-abstain votes, and No with Veto stays below 33.4%." />
              </div>
              {quorumReached && yesPasses ? (
                <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-400 border border-green-500/30">
                  Approved
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
    </TooltipProvider>
  );
}
