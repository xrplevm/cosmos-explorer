import { Badge } from "@cosmos-explorer/ui/badge";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import Link from "next/link";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { StatusBadge } from "@/components/status-badge";
import { formatHash } from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";
import type { TransactionSummary } from "@cosmos-explorer/core";

export function AccountTransactionsCard({
  transactions,
  error,
}: {
  transactions: TransactionSummary[];
  error: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="py-8 text-center text-sm text-destructive">
            Failed to load transactions. Please try again later.
          </p>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Messages</TableHead>
                  <TableHead className="text-right">Block</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/transactions/${tx.hash}`}
                          className="font-mono text-sm text-primary-soft hover:text-primary transition-colors"
                        >
                          {formatHash(tx.hash)}
                        </Link>
                        <CopyButton value={tx.hash} label="tx hash" size="xs" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {tx.type === "EthereumTx" && (
                          <IconCurrencyEthereum className="h-3.5 w-3.5" />
                        )}
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.success ? "Success" : "Failed"} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {tx.messageCount}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      <Link
                        href={`/blocks/${String(tx.height)}`}
                        className="text-primary-soft hover:text-primary transition-colors"
                      >
                        #{tx.height.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      <Timestamp value={tx.timestamp} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
