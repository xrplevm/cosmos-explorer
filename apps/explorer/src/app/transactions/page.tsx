import { Badge } from "@cosmos-explorer/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@cosmos-explorer/ui/card";
import { Input } from "@cosmos-explorer/ui/input";
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
import { StatusBadge } from "@/components/status-badge";
import { formatHash, formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";

const DEFAULT_PAGE_SIZE = 25;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const num = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) && num >= 1 ? num : fallback;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const currentPage = parsePositiveInt(params.page, 1);
  const rawSize = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const offset = (currentPage - 1) * pageSize;

  const { transactionService } = getServices();
  const allTransactions = await transactionService.getTransactions({
    limit: pageSize + 1,
    offset,
  });
  const hasNextPage = allTransactions.length > pageSize;
  const transactions = hasNextPage ? allTransactions.slice(0, pageSize) : allTransactions;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Input placeholder="Search by hash..." className="w-full sm:w-72" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <Link
                      href={`/transactions/${tx.hash}`}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {formatHash(tx.hash)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tx.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.success ? "Success" : "Failed"} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{tx.messageCount}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    <Link href={`/blocks/${String(tx.height)}`} className="text-primary hover:underline">
                      #{tx.height.toLocaleString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatTimestamp(tx.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        buildHref={(page, size) => `/transactions?page=${String(page)}&pageSize=${String(size)}`}
      />
    </div>
  );
}
