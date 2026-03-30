import type { ReactNode } from "react";

export interface VoteFilter {
  value: string;
  label: string;
  icon: ReactNode;
  activeClass: string;
}

interface VotingCountProps {
  filters: VoteFilter[];
  active: string;
  onFilterChange: (value: string) => void;
  counts: Record<string, number>;
}

export function VotingCount({
  filters,
  active,
  onFilterChange,
  counts,
}: VotingCountProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {filters.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => { onFilterChange(f.value); }}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              isActive
                ? f.activeClass
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {f.icon}
            {f.label} ({counts[f.value] ?? 0})
          </button>
        );
      })}
    </div>
  );
}
