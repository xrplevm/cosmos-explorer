"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Box,
  ShieldCheck,
  Vote,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { Button } from "@cosmos-explorer/ui/button";

const nav = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Blocks", href: "/blocks", icon: Box },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Validators", href: "/validators", icon: ShieldCheck },
  { name: "Proposals", href: "/proposals", icon: Vote },
];

export function Sidebar({ title, chainEnv }: { title: string; chainEnv: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => { setOpen(true); }}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => { setOpen(false); }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-border bg-background transition-transform duration-200",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary" />
            <span className="text-sm font-semibold tracking-tight">
              {title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:hidden"
            onClick={() => { setOpen(false); }}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground capitalize">{chainEnv}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
