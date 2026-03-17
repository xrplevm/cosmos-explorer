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
import Link from "next/link";

import { formatHash, formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";

export default async function BlocksPage() {
  const { blockService } = getServices();
  const blocks = await blockService.getBlocks({ limit: 50, offset: 0 });

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
              {blocks.map((block) => (
                <TableRow key={block.height}>
                  <TableCell className="font-mono text-sm">
                    <Link href={`/blocks/${block.height}`} className="text-primary hover:underline">
                      #{block.height.toLocaleString()}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatHash(block.hash)}
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell>
                    <Link href={`/validators/${block.proposer}`} className="hover:text-primary">
                      {block.proposer}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatTimestamp(block.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
