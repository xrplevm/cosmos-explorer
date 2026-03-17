"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { registry } from "@/lib/registry";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-60 border-r border-border bg-background">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          cosmos-explorer/ui
        </Link>
      </div>
      <nav className="space-y-1 p-3">
        <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Components
        </p>
        {registry.map((item) => {
          const href = `/components/${item.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={item.slug}
              href={href}
              className={cn(
                "block rounded-md px-2 py-1.5 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
