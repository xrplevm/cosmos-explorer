import {
  Card,
  CardContent,
  CardDescription,
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
import { formatHash, formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";

export async function TransactionsTable() {
  const { transactionService } = getServices();
  const transactions = await transactionService.getLatestTransactions(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
        <CardDescription>Most recently indexed transactions</CardDescription>
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
                <TableRow key={transaction.hash}>
                  <TableCell className="font-mono text-xs">
                    {formatHash(transaction.hash)}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={transaction.success ? "Success" : "Failed"}
                    />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatTimestamp(transaction.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
