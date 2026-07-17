"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { VotingCount } from "@cosmos-explorer/ui/voting-count";
import { ProposalVotesTable } from "@/components/proposal-votes-table";
import type { ProposalVote, VoteOption } from "@cosmos-explorer/core";
import type { SerializableValidator } from "@/components/proposal-votes-card";
import { cn } from "@cosmos-explorer/ui/lib/utils";
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
  validatorMap: Record<string, SerializableValidator>;
  didNotVote: SerializableValidator[];
}

export function ProposalVotesContent({
  votes,
  validatorMap,
  didNotVote,
}: ProposalVotesContentProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [showAllVotes, setShowAllVotes] = useState(false);
  const [page, setPage] = useState(1);

  // All raw votes sorted oldest to newest.
  const allVotes = useMemo(
    () => [...votes].sort((a, b) => a.height - b.height),
    [votes],
  );

  // Only the last vote per validator (highest block), oldest to newest.
  const latestVotes = useMemo(() => {
    const latestByVoter = new Map<string, ProposalVote>();
    for (const v of votes) {
      const existing = latestByVoter.get(v.voterAddress);
      if (!existing || v.height > existing.height) {
        latestByVoter.set(v.voterAddress, v);
      }
    }
    return [...latestByVoter.values()].sort((a, b) => a.height - b.height);
  }, [votes]);

  const displayVotes = showAllVotes ? allVotes : latestVotes;

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: displayVotes.length + didNotVote.length,
      didNotVote: didNotVote.length,
    };
    for (const v of displayVotes) {
      counts[v.option] = (counts[v.option] ?? 0) + 1;
    }
    return counts;
  }, [displayVotes, didNotVote]);

  const filtered = useMemo(() => {
    if (filter === "didNotVote") return [];
    if (filter === "all") return displayVotes;
    return displayVotes.filter((v) => v.option === filter);
  }, [displayVotes, filter]);

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
        <div className="flex items-start justify-between gap-2">
          <CardTitle>
            Votes
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filter === "didNotVote"
                ? `${didNotVote.length.toLocaleString()} did not vote`
                : filter === "all"
                  ? `${displayVotes.length.toLocaleString()} total`
                  : `${filtered.length.toLocaleString()} of ${displayVotes.length.toLocaleString()}`
              })
            </span>
          </CardTitle>
          <button
            type="button"
            onClick={() => { setShowAllVotes((s) => !s); setPage(1); }}
            role="switch"
            aria-checked={showAllVotes}
            className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
                showAllVotes ? "bg-primary border-primary" : "bg-muted border-border",
              )}
            >
              <span
                className={cn(
                  "inline-block h-3.5 w-3.5 rounded-full bg-foreground transition-transform",
                  showAllVotes ? "translate-x-[18px]" : "translate-x-[3px]",
                )}
              />
            </span>
            Show all votes
          </button>
        </div>
        <VotingCount
          filters={VOTE_FILTERS}
          active={filter}
          onFilterChange={(v) => { handleFilter(v as FilterValue); }}
          counts={voteCounts}
        />
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
