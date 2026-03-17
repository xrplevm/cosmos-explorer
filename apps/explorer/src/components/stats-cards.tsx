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
  formatPrice,
  formatTimestamp,
} from "@/lib/formatters";
import { getChainConfig } from "@/lib/config";
import { getServices } from "@/lib/services";

export async function StatsCards() {
  const config = getChainConfig();
  const { chainStatsService } = getServices();
  const stats = await chainStatsService.getChainStats({
    priceDenom: config.network.primaryToken.denom,
  });
  const hasPrice = stats.price?.priceUsd != null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Latest Block</CardDescription>
          <CardTitle className="text-2xl">
            {stats.latestBlock?.height?.toLocaleString() ?? "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {stats.latestBlock?.timestamp
            ? formatTimestamp(stats.latestBlock.timestamp)
            : "No block data"}
        </CardContent>
      </Card>

      <Card>
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

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Price</CardDescription>
          <CardTitle className="text-2xl">
            {hasPrice ? formatPrice(stats.price?.priceUsd) : "Unavailable"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {hasPrice && stats.price?.timestamp
            ? `Updated ${formatTimestamp(stats.price.timestamp)}`
            : "No indexed price data available"}
        </CardContent>
      </Card>

      <Card>
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
