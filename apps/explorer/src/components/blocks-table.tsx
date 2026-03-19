import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { DataTableSkeleton } from "@cosmos-explorer/ui/data-table";

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
            <BlocksTableBody blocks={blocks} />
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
  return <DataTableSkeleton title="Latest Blocks" />;
}
