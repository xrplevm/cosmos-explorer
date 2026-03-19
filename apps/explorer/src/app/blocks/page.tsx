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

import { formatHash } from "@/lib/formatters";
import { RelativeTime } from "@/components/relative-time";
import { getServices } from "@/lib/services";

const DEFAULT_PAGE_SIZE = 25;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const num = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) && num >= 1 ? num : fallback;
}

export default async function BlocksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const currentPage = parsePositiveInt(params.page, 1);
  const rawSize = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const offset = (currentPage - 1) * pageSize;

  const { blockService } = getServices();
  const blocks = await blockService.getBlocks({ limit: pageSize + 1, offset });
  const hasNextPage = blocks.length > pageSize;
  const visibleBlocks = hasNextPage ? blocks.slice(0, pageSize) : blocks;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blocks</h1>
        <Input placeholder="Search by height..." className="w-full sm:w-72" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Height</TableHead>
                <TableHead>Block Hash</TableHead>
                <TableHead>Txs</TableHead>
                <TableHead>Proposer</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleBlocks.map((block) => (
                <TableRow key={block.height}>
                  <TableCell className="font-mono text-sm">
                    <Link href={`/blocks/${String(block.height)}`} className="text-primary hover:underline">
                      #{block.height.toLocaleString()}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatHash(block.hash)}
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell>
                    <Link href={`/validators/${block.proposer}`} className="flex items-center gap-2 hover:text-primary">
                      {block.proposerAvatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={block.proposerAvatarUrl}
                          alt={block.proposerMoniker ?? block.proposer}
                          className="h-6 w-6 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                          {(block.proposerMoniker ?? block.proposer).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="truncate max-w-[150px]">{block.proposerMoniker ?? block.proposer}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <RelativeTime timestamp={block.timestamp} />
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
        buildHref={(page, size) => `/blocks?page=${String(page)}&pageSize=${String(size)}`}
      />
    </div>
  );
}
