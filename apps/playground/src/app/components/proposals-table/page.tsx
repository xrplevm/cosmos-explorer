"use client";

import { Badge } from "@cosmos-explorer/ui/badge";
import { DataTableShowcase } from "@/components/data-table-showcase";
import { mockProposals } from "@/lib/mock-data";
import type { Column } from "@/components/data-table";

type Proposal = (typeof mockProposals)[number];

function ProposalStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Passed":
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
          Passed
        </Badge>
      );
    case "Rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "Voting":
      return (
        <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/20">
          Voting
        </Badge>
      );
    case "Deposit":
      return (
        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20">
          Deposit
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

const columns: Column<Proposal>[] = [
  {
    key: "id",
    header: "#",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">{row.id}</span>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (row) => (
      <span className="text-sm font-medium text-primary">{row.title}</span>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (row) => (
      <Badge variant="outline" className="text-xs">
        {row.type}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <ProposalStatusBadge status={row.status} />,
  },
  {
    key: "votingEnd",
    header: "Voting End",
    className: "text-right",
    render: (row) => (
      <span className="text-sm text-muted-foreground">
        {row.votingEnd ?? "—"}
      </span>
    ),
  },
];

export default function ProposalsTablePage() {
  return (
    <DataTableShowcase
      title="Proposals Table"
      description="Displays governance proposals with status, type, and voting period."
      tableTitle="Proposals"
      columns={columns}
      data={mockProposals}
      rowKey={(row) => row.id}
    />
  );
}
