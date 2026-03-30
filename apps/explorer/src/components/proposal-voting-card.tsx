import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { ProgressBar } from "@cosmos-explorer/ui/progress-bar";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { ProposalTally } from "@cosmos-explorer/core";
import type { VotingMetrics } from "@/lib/proposal-voting";

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
    activeYesThreshold,
    isExpedited,
    turnoutPct,
    quorumReached,
    yesThresholdPct,
    yesPasses,
  } = metrics;

  return (
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
        {tally && (
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
  );
}
