"use client";

import { useEffect, useState } from "react";

function formatLocal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function Timestamp({ value }: { value: string | null | undefined }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (value != null && value.length > 0) {
      setText(formatLocal(value));
    }
  }, [value]);

  if (value == null || value.length === 0) return <>N/A</>;
  return <>{text}</>;
}
