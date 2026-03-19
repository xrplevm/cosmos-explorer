"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { Badge } from "@cosmos-explorer/ui/badge";
import { ComponentPreview } from "@/components/component-preview";
import { DataTable, DataTableSkeleton } from "@/components/data-table";
import { AnimatedDataTable } from "@/components/animated-data-table";
import { useEffect, useRef, useState } from "react";
import { mockBlocks, formatHash } from "@/lib/mock-data";
import type { Column } from "@/components/data-table";

type Block = (typeof mockBlocks)[number];

interface TaggedBlock {
  uid: number;
  row: Block;
}

const transactions = [
  { hash: "0xA1B2...C3D4", type: "Transfer", status: "Success", amount: "1,250.00 XRP", time: "12s ago" },
  { hash: "0xE5F6...G7H8", type: "Delegate", status: "Success", amount: "500.00 XRP", time: "45s ago" },
  { hash: "0xI9J0...K1L2", type: "Swap", status: "Pending", amount: "89.50 XRP", time: "1m ago" },
  { hash: "0xM3N4...O5P6", type: "Transfer", status: "Failed", amount: "2,100.00 XRP", time: "2m ago" },
  { hash: "0xQ7R8...S9T0", type: "IBC Transfer", status: "Success", amount: "340.75 XRP", time: "5m ago" },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Success":
      return <Badge className="bg-green-500/15 text-green-400 border-green-500/20">{status}</Badge>;
    case "Pending":
      return <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20">{status}</Badge>;
    case "Failed":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

const blockColumns: Column<Block>[] = [
  {
    key: "height",
    header: "Height",
    render: (row) => (
      <span className="font-mono text-sm text-primary">
        {row.height.toLocaleString()}
      </span>
    ),
  },
  {
    key: "proposer",
    header: "Proposer",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {row.proposer.charAt(0)}
        </div>
        <span className="text-sm text-primary">{row.proposer}</span>
      </div>
    ),
  },
  {
    key: "hash",
    header: "Hash",
    render: (row) => (
      <span className="font-mono text-sm text-muted-foreground">
        {formatHash(row.hash)}
      </span>
    ),
  },
  {
    key: "txs",
    header: "Txs",
    render: (row) => row.txs,
  },
  {
    key: "time",
    header: "Time",
    className: "text-right",
    render: (row) => (
      <span className="text-muted-foreground">{row.time}</span>
    ),
  },
];

const taggedColumns: Column<TaggedBlock>[] = blockColumns.map((col) => ({
  ...col,
  render: (tagged: TaggedBlock) => col.render(tagged.row),
}));

function AnimatedDemo() {
  const counter = useRef(mockBlocks.length);
  const pointer = useRef(0);
  const [rows, setRows] = useState<TaggedBlock[]>(
    mockBlocks.slice(0, 4).map((row, i) => ({ uid: i, row })),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = pointer.current % mockBlocks.length;
      pointer.current += 1;
      const uid = counter.current;
      counter.current += 1;
      setRows((prev) => [{ uid, row: mockBlocks[idx] }, ...prev.slice(0, 5)]);
    }, 4000);
    return () => { clearInterval(interval); };
  }, []);

  return (
    <AnimatedDataTable
      title="Latest Blocks"
      columns={taggedColumns}
      data={rows}
      rowKey={(tagged) => tagged.uid}
    />
  );
}

export default function TablePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Table</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A responsive table component.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Base Table</h2>
        <ComponentPreview>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell className="font-mono text-xs">{tx.hash}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell><StatusBadge status={tx.status} /></TableCell>
                  <TableCell className="text-right font-mono">{tx.amount}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{tx.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">DataTable</h2>
        <p className="text-sm text-muted-foreground">
          Generic typed table wrapped in a Card with title and column definitions.
        </p>
        <ComponentPreview>
          <div className="w-full">
            <DataTable
              title="Latest Blocks"
              columns={blockColumns}
              data={mockBlocks}
              rowKey={(row) => row.height}
            />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">AnimatedDataTable</h2>
        <p className="text-sm text-muted-foreground">
          New rows appear at the top every 2 seconds with enter animations.
        </p>
        <ComponentPreview>
          <div className="w-full">
            <AnimatedDemo />
          </div>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">DataTableSkeleton</h2>
        <ComponentPreview>
          <div className="w-full">
            <DataTableSkeleton
              title="Latest Blocks"
              columns={[
                { key: "height", header: "Height", width: "w-16" },
                { key: "proposer", header: "Proposer", width: "w-32" },
                { key: "hash", header: "Hash", width: "w-28" },
                { key: "txs", header: "Txs", width: "w-8" },
                { key: "time", header: "Time", className: "text-right", width: "w-20" },
              ]}
            />
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
