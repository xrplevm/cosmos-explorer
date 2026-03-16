"use client";

import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@cosmos-explorer/ui/chart";
import { ComponentPreview } from "@/components/component-preview";

const data = [
  { month: "Jan", transactions: 186, volume: 80 },
  { month: "Feb", transactions: 305, volume: 200 },
  { month: "Mar", transactions: 237, volume: 120 },
  { month: "Apr", transactions: 173, volume: 190 },
  { month: "May", transactions: 409, volume: 130 },
  { month: "Jun", transactions: 214, volume: 140 },
];

const barConfig = {
  transactions: {
    label: "Transactions",
    color: "oklch(0.646 0.222 41.116)",
  },
} satisfies ChartConfig;

const lineConfig = {
  transactions: {
    label: "Transactions",
    color: "oklch(0.646 0.222 41.116)",
  },
  volume: {
    label: "Volume",
    color: "oklch(0.6 0.118 184.704)",
  },
} satisfies ChartConfig;

export default function ChartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Beautiful charts built with Recharts.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Bar chart</h2>
        <ComponentPreview>
          <ChartContainer config={barConfig} className="h-[300px] w-full">
            <BarChart data={data}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="transactions"
                fill="var(--color-transactions)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Line chart</h2>
        <ComponentPreview>
          <ChartContainer config={lineConfig} className="h-[300px] w-full">
            <LineChart data={data}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="var(--color-transactions)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="var(--color-volume)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </ComponentPreview>
      </section>
    </div>
  );
}
