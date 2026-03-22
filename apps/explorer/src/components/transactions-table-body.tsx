"use client";

import Link from "next/link";
import type { TransactionSummary } from "@cosmos-explorer/core";
import type { Column } from "@cosmos-explorer/ui/data-table";
import { AnimatedTableBody } from "@cosmos-explorer/ui/animated-table-body";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";

import { Badge } from "@cosmos-explorer/ui/badge";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import { StatusBadge } from "@/components/status-badge";
import { formatHash } from "@/lib/formatters";
import { RelativeTime } from "@/components/relative-time";

const columns: Column<TransactionSummary>[] = [
  {
    key: "hash",
    header: "Hash",
    render: (tx) => (
      <Link
        href={`/transactions/${tx.hash}`}
        className="font-mono text-sm text-primary hover:underline"
      >
        {formatHash(tx.hash)}
      </Link>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (tx) => (
      <Badge variant="outline">
        {tx.type === "EthereumTx" && (
          <IconCurrencyEthereum className="h-3.5 w-3.5" />
        )}
        {tx.type}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (tx) => <StatusBadge status={tx.success ? "Success" : "Failed"} />,
  },
  {
    key: "time",
    header: "Time",
    className: "text-right",
    render: (tx) => (
      <span className="text-sm text-muted-foreground">
        <RelativeTime timestamp={tx.timestamp} />
      </span>
    ),
  },
];

export function TransactionsTableBody({
  transactions,
}: {
  transactions: TransactionSummary[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <AnimatedTableBody
        columns={columns}
        data={transactions}
        rowKey={(tx) => tx.hash}
      />
    </Table>
  );
}
