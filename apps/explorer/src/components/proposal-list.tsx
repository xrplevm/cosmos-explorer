"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { Input } from "@cosmos-explorer/ui/input";
import {
  IconSearch as Search,
  IconX as X,
} from "@tabler/icons-react";
import { ProposalIcon } from "@cosmos-explorer/ui/proposal-icon";
import { StatusBadge } from "@/components/status-badge";
import { Timestamp } from "@/components/timestamp";
import Link from "next/link";
import type { ProposalSummary, ProposalStatus } from "@cosmos-explorer/core";

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

export function ProposalList({ proposals }: { proposals: ProposalSummary[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length === 0) return proposals;
    return proposals.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        p.type.toLowerCase().includes(q),
    );
  }, [search, proposals]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, ID, or type..."
            className="pl-9 pr-8"
            value={search}
            onChange={(e) => { setSearch(e.target.value); }}
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => { setSearch(""); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-sm text-muted-foreground">
                {search.trim().length > 0
                  ? "No proposals found matching your search."
                  : "No proposals found."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((proposal, i) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
            <Link href={`/proposals/${String(proposal.id)}`} className="block">
              <Card className="card-hover transition-colors hover:bg-accent/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ProposalIcon type={proposal.type} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0 text-xs font-mono text-muted-foreground">
                            #{proposal.id}
                          </span>
                          <CardTitle className="text-base truncate">{proposal.title}</CardTitle>
                        </div>
                        <StatusBadge status={toStatusLabel(proposal.status)} />
                      </div>
                      <CardDescription className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                        <span>{proposal.type}</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>Submitted <Timestamp value={proposal.submitTime} /></span>
                        {proposal.votingEndTime && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span>Voting ends <Timestamp value={proposal.votingEndTime} /></span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
