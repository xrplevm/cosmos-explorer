"use client";

import { PriceService } from "@cosmos-explorer/price";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import { createFetcher } from "@cosmos-explorer/utils";

import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";

interface MarketPriceCardProps {
  assetsByDenom: Record<string, string>;
  baseUrl: string;
  denom: string;
}

export function MarketPriceCard({
  assetsByDenom,
  baseUrl,
  denom,
}: MarketPriceCardProps) {
  const assetId = assetsByDenom[denom] ?? "";
  const requestKey = `${baseUrl}:${denom}:${assetId}`;
  const { data: price, status } = useFetch(requestKey, async () => {
    const priceFetcher = createFetcher({
      baseUrl,
      headers: {
        accept: "application/json",
      },
    });
    const priceService = new PriceService(priceFetcher, {
      assetsByDenom,
    });

    return priceService.getCurrentPrice(denom);
  });

  const hasPrice = price?.priceUsd != null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Price</CardDescription>
        <CardTitle className="text-2xl">
          {hasPrice
            ? formatPrice(price.priceUsd)
            : status === "loading"
              ? <Skeleton className="h-8 w-20" />
              : "Unavailable"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {hasPrice && price.timestamp
          ? <>Updated <Timestamp value={price.timestamp} /></>
          : status === "loading"
            ? <Skeleton className="h-3 w-32" />
            : "No market price data available"}
      </CardContent>
    </Card>
  );
}
