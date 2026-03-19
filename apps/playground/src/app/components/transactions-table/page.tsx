"use client";

import { Badge } from "@cosmos-explorer/ui/badge";
import { DataTableShowcase } from "@/components/data-table-showcase";
import { mockTransactions, formatHash } from "@/lib/mock-data";
import type { Column } from "@/components/data-table";

type Tx = (typeof mockTransactions)[number];

function StatusBadge({ success }: { success: boolean }) {
  if (success) {
    return (
      <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
        Success
      </Badge>
    );
  }
  return <Badge variant="destructive">Failed</Badge>;
}

const columns: Column<Tx>[] = [
  {
    key: "hash",
    header: "Hash",
    render: (row) => (
      <span className="font-mono text-sm text-primary">
        {formatHash(row.hash)}
      </span>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (row) => <span className="text-sm">{row.type}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge success={row.success} />,
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

export default function TransactionsTablePage() {
  return (
    <DataTableShowcase
      title="Transactions Table"
      description="Displays the latest transactions with hash, type, status, and time."
      tableTitle="Latest Transactions"
      columns={columns}
      data={mockTransactions}
      rowKey={(row) => row.hash}
    />
  );
}
