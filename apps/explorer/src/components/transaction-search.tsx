"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "@cosmos-explorer/ui/input";
import { IconSearch as Search, IconX as X } from "@tabler/icons-react";

export function TransactionSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initial);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        if (searchParams.has("search")) {
          router.push("/transactions");
        }
      } else {
        router.push(`/transactions?search=${encodeURIComponent(trimmed)}`);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, router, searchParams]);

  function handleClear() {
    setValue("");
    router.push("/transactions");
  }

  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by tx hash..."
        className="pl-9 pr-8"
        value={value}
        onChange={(e) => { setValue(e.target.value); }}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
