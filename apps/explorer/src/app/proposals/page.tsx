import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";
import type { ProposalStatus } from "@cosmos-explorer/core";
import Link from "next/link";

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

export default async function ProposalsPage() {
  const { proposalService } = getServices();
  const proposals = await proposalService.getProposals({ limit: 20, offset: 0 });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>

      <div className="space-y-3">
        {proposals.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-sm text-muted-foreground">No proposals found.</p>
            </CardContent>
          </Card>
        )}
        {proposals.map((proposal) => (
          <Link key={proposal.id} href={`/proposals/${String(proposal.id)}`} className="block">
            <Card className="transition-colors hover:bg-accent/30">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 text-sm font-mono text-muted-foreground">
                      #{proposal.id}
                    </span>
                    <CardTitle className="text-base truncate">{proposal.title}</CardTitle>
                  </div>
                  <StatusBadge status={toStatusLabel(proposal.status)} />
                </div>
                <CardDescription className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <span>{proposal.type}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>Submitted {formatTimestamp(proposal.submitTime)}</span>
                  {proposal.votingEndTime && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <span>Voting ends {formatTimestamp(proposal.votingEndTime)}</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
