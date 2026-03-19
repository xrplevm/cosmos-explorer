import { StatsCardsSkeleton } from "@/components/stats-cards";
import { BlocksTableSkeleton } from "@/components/blocks-table";
import { TransactionsTableSkeleton } from "@/components/transactions-table";

export default function Loading() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      <StatsCardsSkeleton />

      <div className="grid gap-6 lg:grid-cols-2">
        <BlocksTableSkeleton />
        <TransactionsTableSkeleton />
      </div>
    </div>
  );
}
