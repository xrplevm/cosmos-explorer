import { cn } from "../../lib/utils";

export interface ProgressBarProps {
  /** Percentage value (0-100) */
  value: number | null;
  /** Threshold marker position (percentage) */
  threshold: number;
  /** Fill color class (default: "bg-primary") */
  colorClass?: string;
  /** Text label displayed above the bar */
  label?: string;
  /** Size variant: "sm" for compact, "md" for default */
  size?: "sm" | "md";
  /** Show "/ X% required" text next to the value */
  showThresholdLabel?: boolean;
}

export function ProgressBar({
  value,
  threshold,
  colorClass = "bg-primary",
  label,
  size = "md",
  showThresholdLabel = true,
}: ProgressBarProps) {
  const filled = value != null ? Math.min(value, 100) : 0;
  const reached = value != null && value >= threshold;

  const isSm = size === "sm";
  const barHeight = isSm ? "h-1.5" : "h-3";
  const labelSize = isSm ? "text-[10px]" : "text-xs";
  const valueDecimals = isSm ? 1 : 2;
  const thresholdLine = isSm ? "bg-white/40" : "bg-white/60";

  return (
    <div className={cn("space-y-1", !isSm && "space-y-1.5")}>
      {(label || showThresholdLabel) && (
        <div className={cn("flex items-center justify-between", labelSize)}>
          {label && <span className="text-muted-foreground">{label}</span>}
          <span
            className={
              reached
                ? "font-semibold text-green-400"
                : "text-muted-foreground"
            }
          >
            {value != null ? `${value.toFixed(valueDecimals)}%` : "N/A"}
            {showThresholdLabel && (
              <span className="text-muted-foreground font-normal">
                {" "}
                / {threshold}%{!isSm && " required"}
              </span>
            )}
          </span>
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          barHeight,
        )}
      >
        <div
          className={cn(
            "h-full origin-left animate-[bar-fill_0.8s_cubic-bezier(0.22,1,0.36,1)_both]",
            reached ? "bg-green-500" : colorClass,
          )}
          style={{ width: `${filled}%` }}
        />
        <div
          className={cn("absolute top-0 h-full w-px z-10", thresholdLine)}
          style={{ left: `${threshold}%` }}
        />
      </div>
    </div>
  );
}
