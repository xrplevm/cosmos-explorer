import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";

import { formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";

export async function BlocksTable() {
  const { blockService } = getServices();
  const blocks = await blockService.getLatestBlocks(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Blocks</CardTitle>
        <CardDescription>Most recently indexed blocks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Height</TableHead>
                <TableHead>Txs</TableHead>
                <TableHead>Proposer</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.hash}>
                  <TableCell className="font-mono text-sm">
                    #{block.height.toLocaleString()}
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {block.proposer}
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
  );
}

export function BlocksTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
