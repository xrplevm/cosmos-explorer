"use client";

import { useEffect, useState } from "react";
import { Badge } from "@cosmos-explorer/ui/badge";
import { Button } from "@cosmos-explorer/ui/button";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Input } from "@cosmos-explorer/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyEthereum,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { Timestamp } from "@/components/timestamp";
import { formatHash } from "@/lib/formatters";
import {
  ACCOUNT_ACTIVITY_PAGE_SIZE,
  type AccountActivityRow,
} from "@/components/account-activity";

interface AccountActivityListProps {
  rows: AccountActivityRow[];
  page: number;
  /** null when the total is unavailable (count query failed). */
  pageCount: number | null;
  pageParam: string;
  emptyLabel: string;
  paginationLabel: string;
}

export function AccountActivityList({
  rows,
  page,
  pageCount,
  pageParam,
  emptyLabel,
  paginationLabel,
}: AccountActivityListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jumpValue, setJumpValue] = useState("");

  const hrefForPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, String(nextPage));
    return `?${params.toString()}`;
  };

  // Correct an out-of-range page client-side — only possible once the total is
  // known, which streams in after the shell.
  useEffect(() => {
    if (pageCount !== null && page > pageCount) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(pageParam, String(pageCount));
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [page, pageCount, pageParam, router, searchParams]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || (pageCount !== null && nextPage > pageCount)) {
      return;
    }
    router.push(hrefForPage(nextPage), { scroll: false });
  };

  if (pageCount !== null && page > pageCount) {
    // Redirecting to the last page; avoid flashing the empty state.
    return null;
  }

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  const hasNextPage =
    pageCount === null
      ? rows.length === ACCOUNT_ACTIVITY_PAGE_SIZE
      : page < pageCount;
  const showPagination = pageCount === null ? page > 1 || hasNextPage : pageCount > 1;

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tx Hash</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Block</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/transactions/${row.hash}`}
                      className="font-mono text-sm text-primary-soft hover:text-primary transition-colors"
                    >
                      {formatHash(row.hash)}
                    </Link>
                    <CopyButton value={row.hash} label="tx hash" size="xs" />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {row.isEthereum && (
                      <IconCurrencyEthereum className="h-3.5 w-3.5" />
                    )}
                    {row.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.success ? "Success" : "Failed"} />
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <Link
                    href={`/blocks/${String(row.height)}`}
                    className="text-primary-soft hover:text-primary transition-colors"
                  >
                    {row.height.toLocaleString()}
                  </Link>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  <Timestamp value={row.timestamp} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <nav
          className="mt-4 flex items-center justify-end gap-2"
          aria-label={paginationLabel}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => { goToPage(page - 1); }}
            disabled={page <= 1}
          >
            <IconChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="px-1 text-sm text-muted-foreground">
            {pageCount === null
              ? `Page ${String(page)}`
              : `Page ${String(page)} of ${pageCount.toLocaleString()}`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { goToPage(page + 1); }}
            disabled={!hasNextPage}
          >
            Next
            <IconChevronRight className="h-4 w-4" />
          </Button>
          {pageCount !== null && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const target = Number(jumpValue);
                if (Number.isInteger(target) && target >= 1) {
                  goToPage(target);
                  setJumpValue("");
                }
              }}
              className="flex items-center gap-1"
            >
              <Input
                type="number"
                min={1}
                max={pageCount}
                inputMode="numeric"
                value={jumpValue}
                onChange={(event) => { setJumpValue(event.target.value); }}
                placeholder="Page #"
                aria-label="Jump to page"
                className="h-8 w-20 text-sm"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={jumpValue === ""}
              >
                Go
              </Button>
            </form>
          )}
        </nav>
      )}
    </>
  );
}

export function AccountActivitySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}
