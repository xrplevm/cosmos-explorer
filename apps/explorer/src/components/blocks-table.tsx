import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";

import { BlocksTableBody } from "@/components/blocks-table-body";
import { getServices } from "@/lib/services";

export async function BlocksTable() {
  try {
    const { blockService } = getServices();
    const blocks = await blockService.getLatestBlocks(7);

    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest Blocks</CardTitle>
          <Link
            href="/blocks"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See More
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Height</TableHead>
                  <TableHead>Proposer</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Txs</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <BlocksTableBody blocks={blocks} />
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  } catch {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest Blocks</CardTitle>
          <Link
            href="/blocks"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See More
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Blocks are temporarily unavailable.</p>
        </CardContent>
      </Card>
    );
  }
}

export function BlocksTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-16" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
