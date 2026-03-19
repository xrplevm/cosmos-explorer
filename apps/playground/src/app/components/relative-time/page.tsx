"use client";

import { useEffect, useMemo, useState } from "react";
import { ComponentPreview } from "@/components/component-preview";

function computeRelativeTime(timestamp: string): string {
  const normalized =
    timestamp.endsWith("Z") || timestamp.includes("+")
      ? timestamp
      : `${timestamp}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return timestamp;

  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diff < 60) return `${String(diff)}s ago`;
  if (diff < 3600) return `${String(Math.floor(diff / 60))}m ago`;
  if (diff < 86400) return `${String(Math.floor(diff / 3600))}h ago`;
  return `${String(Math.floor(diff / 86400))}d ago`;
}

function RelativeTime({ timestamp }: { timestamp: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(computeRelativeTime(timestamp));
    const interval = setInterval(() => {
      setText(computeRelativeTime(timestamp));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timestamp]);

  return <span className="text-sm text-muted-foreground">{text}</span>;
}

function useTimestamps() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return useMemo(() => {
    if (!mounted) return null;
    const now = Date.now();
    return {
      secondsAgo: new Date(now - 30 * 1000).toISOString(),
      minutesAgo: new Date(now - 5 * 60 * 1000).toISOString(),
      hoursAgo: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      daysAgo: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }, [mounted]);
}

export default function RelativeTimePage() {
  const timestamps = useTimestamps();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relative Time</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live-updating relative timestamp display. Updates every second.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Time ranges</h2>

        {timestamps ? (
          <>
            <ComponentPreview title="Seconds ago">
              <RelativeTime timestamp={timestamps.secondsAgo} />
            </ComponentPreview>

            <ComponentPreview title="Minutes ago">
              <RelativeTime timestamp={timestamps.minutesAgo} />
            </ComponentPreview>

            <ComponentPreview title="Hours ago">
              <RelativeTime timestamp={timestamps.hoursAgo} />
            </ComponentPreview>

            <ComponentPreview title="Days ago">
              <RelativeTime timestamp={timestamps.daysAgo} />
            </ComponentPreview>
          </>
        ) : (
          <ComponentPreview title="Loading...">
            <span className="text-sm text-muted-foreground">—</span>
          </ComponentPreview>
        )}
      </section>
    </div>
  );
}
