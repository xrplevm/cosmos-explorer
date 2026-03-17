import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";

import { StatusBadge } from "@/components/status-badge";
import { formatHash } from "@/lib/formatters";
import { getServices } from "@/lib/services";
import { RelativeTime } from "@/components/relative-time";

export async function TransactionsTable() {
  try {
    const { transactionService } = getServices();
    const transactions = await transactionService.getLatestTransactions(7);

    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest Transactions</CardTitle>
          <Link
            href="/transactions"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See More
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.hash} className="h-[50px]">
                    <TableCell>
                      <Link
                        href={`/transactions/${transaction.hash}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {formatHash(transaction.hash)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{transaction.type}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={transaction.success ? "Success" : "Failed"}
                      />
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      <RelativeTime timestamp={transaction.timestamp} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  } catch {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest Transactions</CardTitle>
          <Link
            href="/transactions"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See More
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Transactions are temporarily unavailable.
          </p>
        </CardContent>
      </Card>
    );
  }
}

export function TransactionsTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-16" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-[50px] w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
