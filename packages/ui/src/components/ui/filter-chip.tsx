import * as React from "react";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";

export interface FilterChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  selected: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export function FilterChip({
  label,
  selected,
  icon: Icon,
  className,
  ...props
}: FilterChipProps) {
  return (
    <Badge
      asChild
      variant={selected ? "default" : "outline"}
      className={cn("cursor-pointer px-3 py-1 text-xs", className)}
    >
      <button type="button" {...props}>
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </button>
    </Badge>
  );
}
