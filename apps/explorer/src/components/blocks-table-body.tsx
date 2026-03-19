"use client";

import Link from "next/link";
import type { Block } from "@cosmos-explorer/core";
import type { Column } from "@cosmos-explorer/ui/data-table";
import { AnimatedTableBody } from "@cosmos-explorer/ui/animated-table-body";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";

import { formatHash } from "@/lib/formatters";
import { RelativeTime } from "@/components/relative-time";

const columns: Column<Block>[] = [
  {
    key: "height",
    header: "Height",
    render: (block) => (
      <Link
        href={`/blocks/${String(block.height)}`}
        className="font-mono text-sm text-primary hover:underline"
      >
        {block.height.toLocaleString()}
      </Link>
    ),
  },
  {
    key: "proposer",
    header: "Proposer",
    render: (block) => (
      <div className="flex items-center gap-2">
        {block.proposerAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={block.proposerAvatarUrl}
            alt={block.proposerMoniker ?? block.proposer}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {(block.proposerMoniker ?? block.proposer).charAt(0).toUpperCase()}
          </div>
        )}
        <Link
          href={`/validators/${block.proposer}`}
          className="text-sm text-primary hover:underline truncate max-w-[120px]"
        >
          {block.proposerMoniker ?? block.proposer}
        </Link>
      </div>
    ),
  },
  {
    key: "hash",
    header: "Hash",
    render: (block) => (
      <span className="font-mono text-sm text-muted-foreground">
        {formatHash(block.hash)}
      </span>
    ),
  },
  {
    key: "txs",
    header: "Txs",
    render: (block) => block.txs,
  },
  {
    key: "time",
    header: "Time",
    className: "text-right",
    render: (block) => (
      <span className="text-muted-foreground">
        <RelativeTime timestamp={block.timestamp} />
      </span>
    ),
  },
];

export function BlocksTableBody({ blocks }: { blocks: Block[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <AnimatedTableBody
        columns={columns}
        data={blocks}
        rowKey={(block) => block.hash}
      />
    </Table>
  );
}
