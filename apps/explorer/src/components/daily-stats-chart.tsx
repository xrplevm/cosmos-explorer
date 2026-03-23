import type { DailyStats } from "@cosmos-explorer/core";

import {
  TransactionVolumeChart,
  TransactionVolumeChartSkeleton,
} from "./transaction-volume-chart";

export { TransactionVolumeChartSkeleton };

function getMockDailyStats(): DailyStats[] {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - (6 - i));
    return {
      date: date.toISOString().slice(0, 10),
      transactions: Math.floor(Math.random() * 400 + 50),
    };
  });
}

export function DailyStatsChart() {
  const dailyStats = getMockDailyStats();

  return <TransactionVolumeChart data={dailyStats} />;
}
