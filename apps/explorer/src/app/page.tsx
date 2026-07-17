import { Suspense } from "react";

import { BlocksTable, BlocksTableSkeleton } from "@/components/blocks-table";
import { RefreshInterval } from "@/components/refresh-interval";
import { StatsCards, StatsCardsSkeleton } from "@/components/stats-cards";
import {
  TransactionsTable,
  TransactionsTableSkeleton,
} from "@/components/transactions-table";
import {
  ActiveProposalsWidget,
  ActiveProposalsWidgetSkeleton,
} from "@/components/active-proposals-widget";
import { getChainConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function OverviewPage() {
  const graphqlWs = getChainConfig().network.endpoints.graphqlWs;

  return (
    <div className="space-y-6">
      <RefreshInterval graphqlWs={graphqlWs} intervalMs={5000} />
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<ActiveProposalsWidgetSkeleton />}>
        <ActiveProposalsWidget />
      </Suspense>

      <div className="grid gap-6 xl:grid-cols-2">
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
