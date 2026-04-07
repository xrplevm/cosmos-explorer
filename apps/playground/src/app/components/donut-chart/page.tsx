"use client";

import { DonutChart } from "@cosmos-explorer/ui/donut-chart";
import { ComponentPreview } from "@/components/component-preview";

const voteSegments = [
  { label: "Yes", value: 4500, color: "#4ade80" },
  { label: "No", value: 1200, color: "#f87171" },
  { label: "Abstain", value: 800, color: "#a1a1aa" },
  { label: "No with Veto", value: 500, color: "#facc15" },
];

const twoSegments = [
  { label: "Used", value: 72, color: "#3b82f6" },
  { label: "Free", value: 28, color: "#334155" },
];

const manySegments = [
  { label: "Staking", value: 35, color: "#8b5cf6" },
  { label: "DeFi", value: 25, color: "#06b6d4" },
  { label: "NFTs", value: 15, color: "#f97316" },
  { label: "Gaming", value: 12, color: "#ec4899" },
  { label: "Infrastructure", value: 8, color: "#22c55e" },
  { label: "Other", value: 5, color: "#64748b" },
];

const emptySegments = [
  { label: "Yes", value: 0, color: "#4ade80" },
  { label: "No", value: 0, color: "#f87171" },
];

export default function DonutChartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Donut Chart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pie chart with percentage labels on each slice.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Vote distribution</h2>
        <ComponentPreview>
          <DonutChart segments={voteSegments} size={220} />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Two segments</h2>
        <ComponentPreview>
          <DonutChart segments={twoSegments} size={200} />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Many segments</h2>
        <ComponentPreview>
          <DonutChart segments={manySegments} size={240} />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Small</h2>
        <ComponentPreview>
          <DonutChart segments={voteSegments} size={120} />
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Empty state</h2>
        <ComponentPreview>
          <DonutChart segments={emptySegments} size={200} />
        </ComponentPreview>
      </section>
    </div>
  );
}
