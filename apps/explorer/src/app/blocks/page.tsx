import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@cosmos-explorer/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { Pagination } from "@cosmos-explorer/ui/pagination";
import { PAGE_SIZE_OPTIONS } from "@cosmos-explorer/ui/pagination-constants";
import Link from "next/link";

import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { formatHash } from "@/lib/formatters";
import { RelativeTime } from "@/components/relative-time";
import { BlockSearch } from "@/components/block-search";
import { getServices } from "@/lib/services";
import { buildPageMetadata } from "@/lib/metadata";
import type { Block } from "@cosmos-explorer/core";

export const metadata: Metadata = buildPageMetadata({
  title: "Blocks",
  description: "Browse the latest blocks on the XRPL EVM Sidechain.",
  path: "/blocks",
});

const DEFAULT_PAGE_SIZE = 25;

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const num = typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) && num >= 1 ? num : fallback;
}

function classifySearch(value: string | string[] | undefined): { type: "none" } | { type: "height"; height: number } | { type: "hash"; hash: string } {
  if (typeof value !== "string" || value.trim().length === 0) return { type: "none" };
  const trimmed = value.trim();

  const num = Number(trimmed);
  if (Number.isFinite(num) && num >= 0 && Number.isInteger(num)) {
    return { type: "height", height: num };
  }

  if (/^[a-fA-F0-9]+$/.test(trimmed)) {
    return { type: "hash", hash: trimmed.toUpperCase() };
  }

  return { type: "none" };
}

export default async function BlocksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = classifySearch(params.search);
  const isSearching = search.type !== "none";

  const currentPage = parsePositiveInt(params.page, 1);
  const rawSize = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE;
  const offset = (currentPage - 1) * pageSize;

  const { blockService } = getServices();

  let visibleBlocks: Block[] = [];
  let hasNextPage = false;

  switch (search.type) {
    case "height": {
      const blockDetail = await blockService.getBlockByHeight(search.height);
      visibleBlocks = blockDetail != null ? [blockDetail.overview] : [];
      break;
    }
    case "hash": {
      const block = await blockService.getBlockByHash(search.hash);
      visibleBlocks = block != null ? [block] : [];
      break;
    }
    default: {
      const blocks = await blockService.getBlocks({ limit: pageSize + 1, offset });
      hasNextPage = blocks.length > pageSize;
      visibleBlocks = hasNextPage ? blocks.slice(0, pageSize) : blocks;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blocks</h1>
        <BlockSearch />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isSearching ? "Search Results" : "Latest Blocks"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visibleBlocks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {isSearching ? "No blocks found matching your search." : "No blocks found."}
            </p>
          ) : (
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
                        <Link href={`/blocks/${String(block.height)}`} className="text-primary-soft hover:text-primary transition-colors">
                          #{block.height.toLocaleString()}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-primary-soft">
                        <div className="flex items-center gap-1">
                          {formatHash(block.hash)}
                          <CopyButton value={block.hash} label="block hash" size="xs" />
                        </div>
                      </TableCell>
                      <TableCell>{block.txs}</TableCell>
                      <TableCell>
                        <Link href={`/validators/${block.proposer}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
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
          )}
        </CardContent>
      </Card>

      {!isSearching && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          basePath="/blocks"
        />
      )}
    </div>
  );
}
