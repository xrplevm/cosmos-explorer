"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { registry } from "@/lib/registry";

const defaultCollapsed = Object.fromEntries(
  registry.map((c) => [c.name, true]),
);

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(defaultCollapsed);
  const [search, setSearch] = useState("");

  const query = search.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!query) return registry;
    return registry
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [query]);

  function toggleCategory(name: string) {
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-60 border-r border-border bg-background">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          cosmos-explorer/ui
        </Link>
      </div>
      <div className="border-b border-border px-3 py-2">
        <div className="relative">
          <svg
            className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); }}
            className="w-full rounded-md border border-border bg-transparent py-1.5 pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <nav className="space-y-1 p-3 overflow-y-auto h-[calc(100vh-3.5rem-3rem)]">
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-xs text-muted-foreground text-center">
            No components found.
          </p>
        )}
        {filtered.map((category) => {
          const isSearching = query.length > 0;
          const isCollapsed = !isSearching && (collapsed[category.name] ?? true);

          return (
            <div key={category.name} className="mb-2">
              <button
                type="button"
                onClick={() => { toggleCategory(category.name); }}
                className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
                <svg
                  className={cn(
                    "h-3 w-3 transition-transform",
                    isCollapsed && "-rotate-90"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {category.items.map((item) => {
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
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
