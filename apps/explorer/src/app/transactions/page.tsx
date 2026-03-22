import { Badge } from "@cosmos-explorer/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@cosmos-explorer/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { Pagination, PAGE_SIZE_OPTIONS } from "@cosmos-explorer/ui/pagination";
import Link from "next/link";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { StatusBadge } from "@/components/status-badge";
import { TransactionSearch } from "@/components/transaction-search";
import { formatHash, formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";
import type { TransactionSummary } from "@cosmos-explorer/core";

const DEFAULT_PAGE_SIZE = 25;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const num = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) && num >= 1 ? num : fallback;
}

function parseSearch(value: string | string[] | undefined): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  return value.trim();
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const searchHash = parseSearch(params.search);
  const isSearching = searchHash != null;

  const currentPage = parsePositiveInt(params.page, 1);
  const rawSize = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const offset = (currentPage - 1) * pageSize;

  const { transactionService } = getServices();

  let transactions: TransactionSummary[] = [];
  let hasNextPage = false;

  if (isSearching) {
    const detail = await transactionService.getTransactionByHash(searchHash);
    if (detail != null) {
      const firstType = detail.messages[0]?.type ?? "Unknown";
      const type = detail.messages.length > 1 ? "Multiple" : firstType;
      transactions = [{
        hash: detail.hash,
        height: detail.height,
        type,
        success: detail.success,
        timestamp: detail.timestamp,
        messageCount: detail.messages.length,
      }];
    }
  } else {
    const allTransactions = await transactionService.getTransactions({
      limit: pageSize + 1,
      offset,
    });
    hasNextPage = allTransactions.length > pageSize;
    transactions = hasNextPage ? allTransactions.slice(0, pageSize) : allTransactions;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <TransactionSearch />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isSearching ? "Search Results" : "All Transactions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {isSearching ? "No transaction found matching your search." : "No transactions found."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Messages</TableHead>
                    <TableHead className="text-right">Block</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/transactions/${tx.hash}`}
                            className="font-mono text-sm text-primary hover:underline"
                          >
                            {formatHash(tx.hash)}
                          </Link>
                          <CopyButton value={tx.hash} label="tx hash" size="xs" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.success ? "Success" : "Failed"} />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">{tx.messageCount}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/blocks/${String(tx.height)}`} className="text-primary hover:underline">
                            #{tx.height.toLocaleString()}
                          </Link>
                          <CopyButton value={String(tx.height)} label="block height" size="xs" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatTimestamp(tx.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isSearching && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          buildHref={(page, size) => `/transactions?page=${String(page)}&pageSize=${String(size)}`}
        />
      )}
    </div>
  );
}
