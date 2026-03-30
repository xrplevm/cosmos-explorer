import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import type { ProposalDetail, ProposalStatus } from "@cosmos-explorer/core";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
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

export function ProposalDetailsCard({ proposal }: { proposal: ProposalDetail }) {
  return (
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
  );
}
