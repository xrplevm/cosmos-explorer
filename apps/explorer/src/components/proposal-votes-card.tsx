import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Pagination } from "@cosmos-explorer/ui/pagination";
import { DataTableSkeleton, type SkeletonColumn } from "@cosmos-explorer/ui/data-table";
import { getServices } from "@/lib/services";
import { ProposalVotesTable } from "@/components/proposal-votes-table";
import type { Validator, VoteOption } from "@cosmos-explorer/core";
import Link from "next/link";
import {
  IconThumbUp,
  IconThumbDown,
  IconMinus,
  IconHandStop,
  IconList,
} from "@tabler/icons-react";

const VOTE_FILTERS: {
  value: VoteOption | "all";
  label: string;
  icon: React.ReactNode;
  activeClass: string;
}[] = [
  { value: "all", label: "All", icon: <IconList className="h-3.5 w-3.5" />, activeClass: "bg-foreground text-background" },
  { value: "yes", label: "Yes", icon: <IconThumbUp className="h-3.5 w-3.5" />, activeClass: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "no", label: "No", icon: <IconThumbDown className="h-3.5 w-3.5" />, activeClass: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "abstain", label: "Abstain", icon: <IconMinus className="h-3.5 w-3.5" />, activeClass: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
  { value: "noWithVeto", label: "No with Veto", icon: <IconHandStop className="h-3.5 w-3.5" />, activeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
];

interface ProposalVotesCardProps {
  proposalId: number;
  page: number;
  pageSize: number;
  basePath: string;
  voteFilter: VoteOption | "all";
}

function buildHref(basePath: string, page: number, pageSize: number, voteFilter: VoteOption | "all") {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (pageSize !== 25) params.set("pageSize", String(pageSize));
  if (voteFilter !== "all") params.set("voteFilter", voteFilter);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export async function ProposalVotesCard({
  proposalId,
  page,
  pageSize,
  basePath,
  voteFilter,
}: ProposalVotesCardProps) {
  const { proposalService, validatorService } = getServices();
  const offset = (page - 1) * pageSize;
  const option = voteFilter === "all" ? null : voteFilter;

  const [{ votes, total }, validatorSet] = await Promise.all([
    proposalService.getProposalVotes(proposalId, { limit: pageSize, offset, option }),
    validatorService.getValidatorSet(),
  ]);

  const validatorByDelegate = new Map<string, Validator>();
  for (const v of validatorSet.items) {
    if (v.selfDelegateAddress) {
      validatorByDelegate.set(v.selfDelegateAddress, v);
    }
  }

  const hasNextPage = offset + votes.length < total;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle>
            Votes
            {total > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({total.toLocaleString()} total)
              </span>
            )}
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {VOTE_FILTERS.map((f) => {
              const isActive = voteFilter === f.value;
              return (
                <Link
                  key={f.value}
                  href={buildHref(basePath, 1, pageSize, f.value)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? f.activeClass
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {f.icon}
                  {f.label}
                </Link>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          <ProposalVotesTable votes={votes} validatorByDelegate={validatorByDelegate} />
        </CardContent>
      </Card>

      {total > pageSize && (
        <Pagination
          currentPage={page}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          basePath={buildHref(basePath, 1, pageSize, voteFilter).split("?")[0]}
        />
      )}
    </div>
  );
}

const votesSkeletonColumns: SkeletonColumn[] = [
  { key: "validator", header: "Validator", width: "w-36" },
  { key: "address", header: "Address", width: "w-28" },
  { key: "vote", header: "Vote", width: "w-20" },
  { key: "block", header: "Block", width: "w-20" },
  { key: "time", header: "Time", className: "text-right", width: "w-28" },
];

export function ProposalVotesCardSkeleton() {
  return (
    <DataTableSkeleton
      title="Votes"
      columns={votesSkeletonColumns}
      rows={10}
    />
  );
}
