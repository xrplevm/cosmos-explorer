import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { DataTableSkeleton, type SkeletonColumn } from "@cosmos-explorer/ui/data-table";

import { TransactionsTableBody } from "@/components/transactions-table-body";
import { getServices } from "@/lib/services";

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
            <TransactionsTableBody transactions={transactions} />
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

const txSkeletonColumns: SkeletonColumn[] = [
  { key: "hash", header: "Hash", width: "w-28" },
  { key: "type", header: "Type", width: "w-24" },
  { key: "status", header: "Status", width: "w-16" },
  { key: "time", header: "Time", className: "text-right", width: "w-20" },
];

export function TransactionsTableSkeleton() {
  return <DataTableSkeleton title="Latest Transactions" columns={txSkeletonColumns} />;
}
