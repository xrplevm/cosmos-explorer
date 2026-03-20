"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "../../lib/utils";

export interface CopyButtonProps {
  /** String to copy to the clipboard. */
  value: string;
  /** Shown in tooltips and `aria-label` for screen readers. */
  label?: string;
  className?: string;
  /** Passed through to the underlying button. Defaults to `ghost`. */
  variant?: ButtonProps["variant"];
  /** Icon button sizing. */
  size?: "icon" | "sm";
}

export function CopyButton({
  value,
  label = "text",
  className,
  variant = "ghost",
  size = "icon",
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const resetRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  React.useEffect(() => {
    return () => {
      if (resetRef.current !== undefined) {
        clearTimeout(resetRef.current);
      }
    };
  }, []);

  const handleCopy = React.useCallback(async () => {
    if (value.length === 0) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (resetRef.current !== undefined) {
        clearTimeout(resetRef.current);
      }
      resetRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }, [value]);

  const tooltip = copied ? "Copied" : `Copy ${label}`;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size={size}
            className={cn("shrink-0", className)}
            disabled={value.length === 0}
            aria-label={copied ? `${label} copied` : `Copy ${label}`}
            onClick={() => {
              void handleCopy();
            }}
          >
            {copied ? (
              <Check className="size-4 text-primary" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
