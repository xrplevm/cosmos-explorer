"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { ProposalVotesTable } from "@/components/proposal-votes-table";
import type { ProposalVote, VoteOption } from "@cosmos-explorer/core";
import type { SerializableValidator } from "@/components/proposal-votes-card";
import {
  IconThumbUp,
  IconThumbDown,
  IconMinus,
  IconHandStop,
  IconList,
  IconCircleOff,
} from "@tabler/icons-react";

type FilterValue = VoteOption | "all" | "didNotVote";

const VOTE_FILTERS: {
  value: FilterValue;
  label: string;
  icon: React.ReactNode;
  activeClass: string;
}[] = [
  { value: "all", label: "All", icon: <IconList className="h-3.5 w-3.5" />, activeClass: "bg-foreground text-background" },
  { value: "yes", label: "Yes", icon: <IconThumbUp className="h-3.5 w-3.5" />, activeClass: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "no", label: "No", icon: <IconThumbDown className="h-3.5 w-3.5" />, activeClass: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "abstain", label: "Abstain", icon: <IconMinus className="h-3.5 w-3.5" />, activeClass: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
  { value: "noWithVeto", label: "No with Veto", icon: <IconHandStop className="h-3.5 w-3.5" />, activeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "didNotVote", label: "Did Not Vote", icon: <IconCircleOff className="h-3.5 w-3.5" />, activeClass: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
];

const PAGE_SIZE = 10;

interface ProposalVotesContentProps {
  votes: ProposalVote[];
  total: number;
  validatorMap: Record<string, SerializableValidator>;
  didNotVote: SerializableValidator[];
}

export function ProposalVotesContent({
  votes,
  total,
  validatorMap,
  didNotVote,
}: ProposalVotesContentProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [page, setPage] = useState(1);

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = { all: total + didNotVote.length, didNotVote: didNotVote.length };
    for (const v of votes) {
      counts[v.option] = (counts[v.option] ?? 0) + 1;
    }
    return counts;
  }, [votes, total, didNotVote]);

  const filtered = useMemo(() => {
    if (filter === "all" || filter === "didNotVote") return votes;
    return votes.filter((v) => v.option === filter);
  }, [votes, filter]);

  const showDidNotVote = filter === "all" || filter === "didNotVote";
  const allItems = [...filtered, ...(showDidNotVote ? didNotVote : [])];
  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = page * PAGE_SIZE;

  // Split the page window across votes and didNotVote
  const paginatedVotes = filtered.slice(Math.max(0, startIdx), Math.min(filtered.length, endIdx));
  const didNotVoteStart = Math.max(0, startIdx - filtered.length);
  const didNotVoteEnd = Math.max(0, endIdx - filtered.length);
  const paginatedDidNotVote = showDidNotVote ? didNotVote.slice(didNotVoteStart, didNotVoteEnd) : [];

  function handleFilter(value: FilterValue) {
    setFilter(value);
    setPage(1);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Votes
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({filter === "didNotVote"
              ? `${didNotVote.length.toLocaleString()} did not vote`
              : filter === "all"
                ? `${total.toLocaleString()} total`
                : `${filtered.length.toLocaleString()} of ${total.toLocaleString()}`
            })
          </span>
        </CardTitle>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {VOTE_FILTERS.map((f) => {
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => { handleFilter(f.value); }}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? f.activeClass
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {f.icon}
                {f.label} ({voteCounts[f.value] ?? 0})
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ProposalVotesTable
          votes={paginatedVotes}
          validatorMap={validatorMap}
          didNotVote={paginatedDidNotVote}
        />
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => { setPage((p) => p - 1); }}
              className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => { setPage((p) => p + 1); }}
              className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
