"use client";

import { DataTableShowcase } from "@/components/data-table-showcase";
import { mockBlocks, formatHash } from "@/lib/mock-data";
import type { Column } from "@/components/data-table";

type Block = (typeof mockBlocks)[number];

const columns: Column<Block>[] = [
  {
    key: "height",
    header: "Height",
    render: (row) => (
      <span className="font-mono text-sm text-primary">
        {row.height.toLocaleString()}
      </span>
    ),
  },
  {
    key: "proposer",
    header: "Proposer",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {row.proposer.charAt(0)}
        </div>
        <span className="text-sm text-primary">{row.proposer}</span>
      </div>
    ),
  },
  {
    key: "hash",
    header: "Hash",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">
        {formatHash(row.hash)}
      </span>
    ),
  },
  {
    key: "txs",
    header: "Txs",
    render: (row) => row.txs,
  },
  {
    key: "time",
    header: "Time",
    className: "text-right",
    render: (row) => (
      <span className="text-muted-foreground">{row.time}</span>
    ),
  },
];

export default function BlocksTablePage() {
  return (
    <DataTableShowcase
      title="Blocks Table"
      description="Displays the latest blocks with height, proposer, hash, and time."
      tableTitle="Latest Blocks"
      columns={columns}
      data={mockBlocks}
      rowKey={(row) => row.height}
    />
  );
}
