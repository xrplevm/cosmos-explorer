"use client";

import * as React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { cn } from "../../lib/utils";

export interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutChartSegment[];
  size?: number;
  className?: string;
  children?: React.ReactNode;
}

const RADIAN = Math.PI / 180;

function renderLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) {
  if (percent < 0.03) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

export function DonutChart({
  segments,
  size = 180,
  className,
  children,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const hasData = total > 0;

  const data = hasData
    ? segments.filter((s) => s.value > 0)
    : [{ label: "empty", value: 1, color: "var(--color-muted)" }];

  const outerRadius = size / 2;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
          label={hasData ? renderLabel : undefined}
          labelLine={false}
        >
          {data.map((segment) => (
            <Cell key={segment.label} fill={segment.color} />
          ))}
        </Pie>
      </PieChart>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
