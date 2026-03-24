"use client";

import { PriceService } from "@cosmos-explorer/price";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { createFetcher } from "@cosmos-explorer/utils";

import { useFetch } from "@/hooks/use-fetch";
import { formatPrice, formatTimestamp } from "@/lib/formatters";

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
              ? "Loading..."
              : "Unavailable"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {hasPrice && price.timestamp
          ? `Updated ${formatTimestamp(price.timestamp)}`
          : status === "loading"
            ? "Fetching live market price"
            : "No market price data available"}
      </CardContent>
    </Card>
  );
}
