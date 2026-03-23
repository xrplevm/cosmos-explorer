"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@cosmos-explorer/ui/input";
import { IconSearch as Search } from "@tabler/icons-react";

import { resolveHash } from "@/lib/actions";

interface GlobalSearchProps {
  bech32Prefix: string;
  evmSearch: boolean;
  accounts: boolean;
}

function classifyInput(
  value: string,
  bech32Prefix: string,
  evmSearch: boolean,
  accounts: boolean,
): { route: string; type: "direct" } | { hash: string; type: "hash" } | null {
  // Block height: non-negative integer
  if (/^\d+$/.test(value)) {
    return { route: `/blocks/${value}`, type: "direct" };
  }

  // Cosmos tx/block hash: 64-char hex (no 0x prefix)
  if (/^[a-fA-F0-9]{64}$/.test(value)) {
    return { hash: value, type: "hash" };
  }

  // EVM tx hash: 0x + 64 hex chars
  if (evmSearch && /^0x[a-fA-F0-9]{64}$/i.test(value)) {
    return { hash: value, type: "hash" };
  }

  // Bech32 address
  if (value.startsWith(bech32Prefix)) {
    return { route: `/account/${value}`, type: "direct" };
  }

  // EVM address: 0x + 40 hex chars
  if (accounts && /^0x[a-fA-F0-9]{40}$/i.test(value)) {
    return { route: `/account/${value}`, type: "direct" };
  }

  return null;
}

export function GlobalSearch({
  bech32Prefix,
  evmSearch,
  accounts,
}: GlobalSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (pathname !== "/") return null;

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    const result = classifyInput(trimmed, bech32Prefix, evmSearch, accounts);
    if (!result) {
      setError("No match found. Try a block height, tx hash, or address.");
      return;
    }

    if (result.type === "direct") {
      setError("");
      setValue("");
      router.push(result.route);
      return;
    }

    // Hash: resolve server-side (tx first, then block)
    setLoading(true);
    setError("");
    try {
      const route = await resolveHash(result.hash);
      if (route) {
        setValue("");
        router.push(route);
      } else {
        setError("No transaction or block found for this hash.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="relative w-full max-w-xs">
      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search block, tx, address..."
        className="h-8 pl-8 pr-3 text-sm"
        value={value}
        disabled={loading}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError("");
        }}
      />
      {error && (
        <p className="absolute left-0 top-full mt-1 whitespace-nowrap text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
