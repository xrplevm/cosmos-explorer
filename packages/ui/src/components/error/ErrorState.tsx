import * as React from "react";
import { IconAlertTriangle as AlertTriangle } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface ErrorStateProps {
  error?: unknown;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function getDisplayMessage(error: unknown, fallback?: string): string {
  if (fallback) return fallback;
  if (error instanceof Error) {
    const code = (error as Error & { code?: string }).code;
    if (code === 'NOT_FOUND')      return 'The requested resource could not be found.';
    if (code === 'NETWORK_ERROR')  return 'Unable to connect. Please check your connection and try again.';
    if (code === 'RATE_LIMIT')     return 'Too many requests. Please wait a moment and try again.';
    if (code === 'UPSTREAM_ERROR') return 'The data service is temporarily unavailable.';
  }
  return 'Something went wrong. Please try again.';
}

export function ErrorState({ error, message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          {getDisplayMessage(error, message)}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
