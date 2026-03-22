"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@cosmos-explorer/ui/avatar";
import { Input } from "@cosmos-explorer/ui/input";
import { IconSearch as Search, IconX as X } from "@tabler/icons-react";
import { StatusBadge } from "@/components/status-badge";
import { formatPercent } from "@/lib/formatters";
import Link from "next/link";
import type { Validator } from "@cosmos-explorer/core";

function toStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "jailed":
      return "Jailed";
    default:
      return "Unknown";
  }
}

export function ValidatorTable({ validators }: { validators: Validator[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length === 0) return validators;
    return validators.filter(
      (v) =>
        v.moniker.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q),
    );
  }, [search, validators]);

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or address..."
          className="pl-9 pr-8"
          value={search}
          onChange={(e) => { setSearch(e.target.value); }}
        />
        {search.length > 0 && (
          <button
            type="button"
            onClick={() => { setSearch(""); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No validators found matching your search.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Validator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Voting Power</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Missed Blocks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v, index) => (
                <TableRow key={v.address}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <Link href={`/validators/${v.address}`} className="flex items-center gap-3 hover:text-primary">
                      <Avatar className="h-7 w-7">
                        {v.avatarUrl && <AvatarImage src={v.avatarUrl} alt={v.moniker} />}
                        <AvatarFallback className="text-xs">{v.moniker.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{v.moniker}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={toStatusLabel(v.status)} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {v.votingPower.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercent(v.commission == null ? null : v.commission * 100)}
                  </TableCell>
                  <TableCell className="text-right">{v.missedBlocksCounter.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
