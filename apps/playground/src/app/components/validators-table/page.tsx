"use client";

import { Badge } from "@cosmos-explorer/ui/badge";
import { DataTableShowcase } from "@/components/data-table-showcase";
import { mockValidators } from "@/lib/mock-data";
import type { Column } from "@/components/data-table";

type Validator = (typeof mockValidators)[number];

function ValidatorStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Active":
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
          Active
        </Badge>
      );
    case "Inactive":
      return (
        <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/20">
          Inactive
        </Badge>
      );
    case "Jailed":
      return <Badge variant="destructive">Jailed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

const columns: Column<Validator>[] = [
  {
    key: "rank",
    header: "#",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.rank}
      </span>
    ),
  },
  {
    key: "moniker",
    header: "Validator",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {row.moniker.charAt(0)}
        </div>
        <span className="text-sm text-primary">{row.moniker}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <ValidatorStatusBadge status={row.status} />,
  },
  {
    key: "votingPower",
    header: "Voting Power",
    className: "text-right",
    render: (row) => (
      <span className="font-mono text-sm">
        {row.votingPower.toLocaleString()}
      </span>
    ),
  },
  {
    key: "commission",
    header: "Commission",
    className: "text-right",
    render: (row) => (
      <span className="text-sm">{row.commission.toFixed(2)}%</span>
    ),
  },
  {
    key: "missedBlocks",
    header: "Missed Blocks",
    className: "text-right",
    render: (row) => (
      <span className="font-mono text-sm">
        {row.missedBlocks.toLocaleString()}
      </span>
    ),
  },
];

export default function ValidatorsTablePage() {
  return (
    <DataTableShowcase
      title="Validators Table"
      description="Displays validators with status, voting power, commission, and missed blocks."
      tableTitle="Validator Set"
      columns={columns}
      data={mockValidators}
      rowKey={(row) => row.rank}
    />
  );
}
