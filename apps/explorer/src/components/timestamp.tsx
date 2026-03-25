"use client";

function formatLocal(value: string): string {
  // Hasura returns timestamps without timezone — treat as UTC
  const normalized =
    value.endsWith("Z") || value.includes("+") ? value : `${value}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function Timestamp({ value }: { value: string | null | undefined }) {
  if (value == null || value.length === 0) return <>N/A</>;
  return <span suppressHydrationWarning>{formatLocal(value)}</span>;
}
