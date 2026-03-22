import * as React from "react";
import { IconSearchOff as SearchX } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface NotFoundStateProps {
  resource?: string;
  message?: string;
  onBack?: () => void;
  className?: string;
}

export function NotFoundState({ resource, message, onBack, className }: NotFoundStateProps) {
  const displayMessage = message
    ?? (resource ? `${resource} not found.` : 'The page or resource you are looking for does not exist.');

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Not found</p>
        <p className="text-sm text-muted-foreground max-w-sm">{displayMessage}</p>
      </div>
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack}>
          Go back
        </Button>
      )}
    </div>
  );
}
