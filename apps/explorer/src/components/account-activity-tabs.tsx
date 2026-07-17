import Link from "next/link";

export type AccountActivityTab = "transactions" | "messages";

const TABS: { key: AccountActivityTab; label: string }[] = [
  { key: "transactions", label: "Transactions" },
  { key: "messages", label: "Messages" },
];

/** URL-driven tabs (server-rendered) so each tab keeps its own paginated URL. */
export function AccountActivityTabs({
  basePath,
  active,
}: {
  basePath: string;
  active: AccountActivityTab;
}) {
  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`${basePath}?tab=${tab.key}`}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${
            tab.key === active
              ? "bg-background text-foreground shadow"
              : "hover:text-foreground"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
