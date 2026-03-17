import { Suspense } from "react";

import { BlocksTable, BlocksTableSkeleton } from "@/components/blocks-table";
import { StatsCards, StatsCardsSkeleton } from "@/components/stats-cards";
import {
  TransactionsTable,
  TransactionsTableSkeleton,
} from "@/components/transactions-table";

export const dynamic = "force-dynamic";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<BlocksTableSkeleton />}>
          <BlocksTable />
        </Suspense>
        <Suspense fallback={<TransactionsTableSkeleton />}>
          <TransactionsTable />
        </Suspense>
      </div>
    </div>
  );
}
