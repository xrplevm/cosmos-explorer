import Link from "next/link";
import type { ReactNode } from "react";

export type AccountTab = "messages" | "transactions";

/** URL-driven tabs: each is a link, so only the active tab's data is fetched. */
export function AccountActivityTabs({
  activeTab,
  basePath,
}: {
  activeTab: AccountTab;
  basePath: string;
}) {
  return (
    <div className="inline-flex h-9 items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
      <TabLink href={basePath} active={activeTab === "messages"}>
        Messages
      </TabLink>
      <TabLink href={`${basePath}?tab=transactions`} active={activeTab === "transactions"}>
        Transactions
      </TabLink>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all ${
        active
          ? "bg-background text-foreground shadow"
          : "hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
