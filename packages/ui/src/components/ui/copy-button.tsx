"use client";

import * as React from "react";
import { IconCheck as Check, IconCopy as Copy } from "@tabler/icons-react";
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
  /**
   * Square icon button size. `icon` — 36×36 (default). `sm` — 32×32. `xs` — 24×24 (dense rows).
   */
  size?: "icon" | "sm" | "xs";
}

const sizeClass: Record<NonNullable<CopyButtonProps["size"]>, string> = {
  icon: "",
  sm: "h-8 w-8 min-h-8 min-w-8 p-0",
  xs: "h-6 w-6 min-h-6 min-w-6 p-0",
};

const iconSizeClass: Record<NonNullable<CopyButtonProps["size"]>, string> = {
  icon: "size-4",
  /** Override Button `[&_svg]:size-4` on the trigger */
  sm: "!size-3.5",
  xs: "!size-3",
};

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
  const icn = iconSizeClass[size];

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size="icon"
            className={cn("shrink-0", sizeClass[size], className)}
            disabled={value.length === 0}
            aria-label={copied ? `${label} copied` : `Copy ${label}`}
            onClick={() => {
              void handleCopy();
            }}
          >
            {copied ? (
              <Check className={cn(icn, "text-primary")} />
            ) : (
              <Copy className={icn} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
