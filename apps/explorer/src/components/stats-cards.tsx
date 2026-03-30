import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";

import {
  formatBlockTime,
} from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";
import { getChainConfig } from "@/lib/config";
import { getServices } from "@/lib/services";

import { MarketPriceCard } from "./market-price-card";

export async function StatsCards() {
  const config = getChainConfig();
  const { chainStatsService } = getServices();
  const stats = await chainStatsService.getChainStats({
    priceDenom: config.network.primaryToken.denom,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:shadow-[0_4px_24px_oklch(0_0_0/0.3)]">
        <CardHeader className="pb-2">
          <CardDescription>Latest Block</CardDescription>
          <CardTitle className="text-2xl">
            {stats.latestBlock?.height.toLocaleString() ?? "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {stats.latestBlock?.timestamp
            ? <Timestamp value={stats.latestBlock.timestamp} />
            : "No block data"}
        </CardContent>
      </Card>

      <Card className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:shadow-[0_4px_24px_oklch(0_0_0/0.3)]">
        <CardHeader className="pb-2">
          <CardDescription>Average Block Time</CardDescription>
          <CardTitle className="text-2xl">
            {formatBlockTime(stats.averageBlockTime)}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Rolling average from recent indexed blocks
        </CardContent>
      </Card>

      <MarketPriceCard
        assetsByDenom={config.price.assetsByDenom}
        baseUrl={config.price.baseUrl}
        denom={config.network.primaryToken.denom}
      />

      <Card className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:shadow-[0_4px_24px_oklch(0_0_0/0.3)]">
        <CardHeader className="pb-2">
          <CardDescription>Active Validators</CardDescription>
          <CardTitle className="text-2xl">
            {stats.validators.active.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {stats.validators.total.toLocaleString()} total
        </CardContent>
      </Card>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
