"use client";

import { ErrorState } from "@cosmos-explorer/ui";
import type { AppError } from "@cosmos-explorer/core";

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <ErrorState error={error as AppError} onRetry={reset} />
    </div>
  );
}
