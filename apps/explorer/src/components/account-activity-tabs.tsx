"use client";

import type { AccountActivityTab } from "@/lib/account-activity";

const TABS: { key: AccountActivityTab; label: string }[] = [
  { key: "transactions", label: "Transactions" },
  { key: "messages", label: "Messages" },
];

/** Controlled tabs — selecting a tab swaps the section in place, no navigation. */
export function AccountActivityTabs({
  active,
  onSelect,
}: {
  active: AccountActivityTab;
  onSelect: (tab: AccountActivityTab) => void;
}) {
  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => {
            onSelect(tab.key);
          }}
          aria-pressed={tab.key === active}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${
            tab.key === active
              ? "bg-background text-foreground shadow"
              : "hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
