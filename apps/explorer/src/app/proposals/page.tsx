import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { Pagination, PAGE_SIZE_OPTIONS } from "@cosmos-explorer/ui/pagination";
import { StatusBadge } from "@/components/status-badge";
import { formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";
import type { ProposalStatus } from "@cosmos-explorer/core";
import Link from "next/link";

const DEFAULT_PAGE_SIZE = 25;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const num = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) && num >= 1 ? num : fallback;
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

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const currentPage = parsePositiveInt(params.page, 1);
  const rawSize = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const offset = (currentPage - 1) * pageSize;

  const { proposalService } = getServices();
  const proposals = await proposalService.getProposals({ limit: pageSize + 1, offset });
  const hasNextPage = proposals.length > pageSize;
  const visibleProposals = hasNextPage ? proposals.slice(0, pageSize) : proposals;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>

      <div className="space-y-3">
        {visibleProposals.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-sm text-muted-foreground">No proposals found.</p>
            </CardContent>
          </Card>
        )}
        {visibleProposals.map((proposal) => (
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

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        buildHref={(page, size) => `/proposals?page=${String(page)}&pageSize=${String(size)}`}
      />
    </div>
  );
}
