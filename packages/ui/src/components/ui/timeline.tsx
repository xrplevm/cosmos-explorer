import * as React from "react";
import { cn } from "../../lib/utils";

/* ─── Root ────────────────────────────────────────────────────────────────── */

function Timeline({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn("relative space-y-0", className)}
      {...props}
    />
  );
}

/* ─── Item ────────────────────────────────────────────────────────────────── */

interface TimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Whether this item is currently active/in-progress. */
  active?: boolean;
  /** Whether this item has been completed. */
  completed?: boolean;
}

function TimelineItem({
  className,
  active,
  completed,
  ...props
}: TimelineItemProps) {
  return (
    <li
      data-active={active ? "" : undefined}
      data-completed={completed ? "" : undefined}
      className={cn("relative pb-8 pl-8 last:pb-0", className)}
      {...props}
    />
  );
}

/* ─── Connector (vertical line between dots) ──────────────────────────────── */

function TimelineConnector({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-[9px] top-5 h-[calc(100%-12px)] w-px",
        "bg-border",
        "[[data-completed]+&]:bg-primary",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Dot ─────────────────────────────────────────────────────────────────── */

interface TimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the default dot with a custom icon or element. */
  icon?: React.ReactNode;
}

function TimelineDot({ className, icon, ...props }: TimelineDotProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2",
        "border-border bg-background text-muted-foreground",
        "[[data-active]_&]:border-primary [[data-active]_&]:bg-primary [[data-active]_&]:text-primary-foreground",
        "[[data-completed]_&]:border-primary [[data-completed]_&]:bg-primary [[data-completed]_&]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      {icon ?? (
        <div className="h-2 w-2 rounded-full bg-current" />
      )}
    </div>
  );
}

/* ─── Content ─────────────────────────────────────────────────────────────── */

function TimelineContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props} />
  );
}

/* ─── Title ───────────────────────────────────────────────────────────────── */

function TimelineTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm font-medium leading-none",
        "[[data-active]_&]:text-foreground",
        "[[data-completed]_&]:text-foreground",
        "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ─── Description ─────────────────────────────────────────────────────────── */

function TimelineDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ─── Exports ─────────────────────────────────────────────────────────────── */

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  type TimelineItemProps,
  type TimelineDotProps,
};
