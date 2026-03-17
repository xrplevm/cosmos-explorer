import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { formatPercent, formatTimestamp, formatTokenAmount } from "@/lib/formatters";
import { getServices } from "@/lib/services";
import type { ProposalStatus, ProposalTally } from "@cosmos-explorer/core";
import { notFound } from "next/navigation";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">{label}</span>
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
    return <p className="text-sm text-muted-foreground">No tally data available.</p>;
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

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { proposalService } = getServices();
  const proposal = await proposalService.getProposalById(Number(id));

  if (proposal == null) {
    notFound();
  }

  const tallyTotal = getTallyTotal(proposal.tally);
  const yes = proposal.tally ? toVotePercent(proposal.tally.yes, tallyTotal) : null;
  const no = proposal.tally ? toVotePercent(proposal.tally.no, tallyTotal) : null;
  const abstain = proposal.tally
    ? toVotePercent(proposal.tally.abstain, tallyTotal)
    : null;
  const veto = proposal.tally
    ? toVotePercent(proposal.tally.noWithVeto, tallyTotal)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">#{proposal.id}</span>
          <StatusBadge status={toStatusLabel(proposal.status)} />
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{proposal.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{proposal.type}</p>
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
            <span className="font-mono text-xs break-all">{proposal.proposer}</span>
          </Row>
          <Separator />
          <Row label="Submit Time">{formatTimestamp(proposal.submitTime)}</Row>
          <Separator />
          <Row label="Deposit End">{formatTimestamp(proposal.depositEndTime)}</Row>
          <Separator />
          <Row label="Voting Start">{formatTimestamp(proposal.votingStartTime)}</Row>
          <Separator />
          <Row label="Voting End">{formatTimestamp(proposal.votingEndTime)}</Row>
          <Separator />
          <Row label="Bonded Snapshot">
            {formatTokenAmount(proposal.tally?.bondedTokens, 0)}
          </Row>
          <Separator />
          <Row label="Metadata">
            <span className="font-mono text-xs break-all">
              {proposal.metadata || "N/A"}
            </span>
          </Row>
        </CardContent>
      </Card>

      <Card>
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
              <p className="mt-1 text-xl font-bold">{formatPercent(abstain)}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">No with Veto</p>
              <p className="mt-1 text-xl font-bold text-yellow-400">
                {formatPercent(veto)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{proposal.description || "No description available."}</p>
            <div>
              <p className="mb-2 font-medium text-foreground">Content</p>
              <pre className="max-w-full overflow-x-auto rounded-md bg-muted p-3 text-xs">
                {JSON.stringify(proposal.content, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
