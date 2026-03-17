"use client";

import { useEffect, useState } from "react";

function computeRelativeTime(timestamp: string): string {
  // Hasura returns timestamps without timezone — treat as UTC
  const normalized = timestamp.endsWith("Z") || timestamp.includes("+") ? timestamp : `${timestamp}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return timestamp;

  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function RelativeTime({ timestamp }: { timestamp: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(computeRelativeTime(timestamp));
    const interval = setInterval(() => {
      setText(computeRelativeTime(timestamp));
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return <>{text}</>;
}
