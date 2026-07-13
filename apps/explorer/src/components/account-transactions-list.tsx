"use client";

import { useState } from "react";
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
import type { TransactionSummary } from "@cosmos-explorer/core";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Timestamp } from "@/components/timestamp";
import { formatHash } from "@/lib/formatters";

interface AccountTransactionsListProps {
  transactions: TransactionSummary[];
  pageSize: number;
}

export function AccountTransactionsList({
  transactions,
  pageSize,
}: AccountTransactionsListProps) {
  const [page, setPage] = useState(1);
  const [jumpValue, setJumpValue] = useState("");

  const pageCount = Math.max(1, Math.ceil(transactions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const pageTransactions = transactions.slice(start, start + pageSize);
  const hasNextPage = currentPage < pageCount;

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount) {
      return;
    }
    setPage(nextPage);
  };

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No transactions found.
      </p>
    );
  }

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
            {pageTransactions.map((tx) => (
              <TableRow key={tx.hash}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/transactions/${tx.hash}`}
                      className="font-mono text-sm text-primary-soft hover:text-primary transition-colors"
                    >
                      {formatHash(tx.hash)}
                    </Link>
                    <CopyButton value={tx.hash} label="tx hash" size="xs" />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {tx.type === "EthereumTx" && (
                      <IconCurrencyEthereum className="h-3.5 w-3.5" />
                    )}
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={tx.success ? "Success" : "Failed"} />
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <Link
                    href={`/blocks/${String(tx.height)}`}
                    className="text-primary-soft hover:text-primary transition-colors"
                  >
                    {tx.height.toLocaleString()}
                  </Link>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  <Timestamp value={tx.timestamp} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pageCount > 1 && (
        <nav
          className="mt-4 flex items-center justify-end gap-2"
          aria-label="Transactions pagination"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => { goToPage(currentPage - 1); }}
            disabled={currentPage <= 1}
          >
            <IconChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="px-1 text-sm text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { goToPage(currentPage + 1); }}
            disabled={!hasNextPage}
          >
            Next
            <IconChevronRight className="h-4 w-4" />
          </Button>
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
        </nav>
      )}
    </>
  );
}
