import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { DataTableSkeleton, type SkeletonColumn } from "@cosmos-explorer/ui/data-table";

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
            className="text-sm text-primary-soft hover:text-primary transition-colors"
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
            className="text-sm text-primary-soft hover:text-primary transition-colors"
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

const blockSkeletonColumns: SkeletonColumn[] = [
  { key: "height", header: "Height", width: "w-16" },
  { key: "proposer", header: "Proposer", className: "hidden md:table-cell", width: "w-32" },
  { key: "hash", header: "Hash", className: "hidden sm:table-cell", width: "w-28" },
  { key: "txs", header: "Txs", width: "w-8" },
  { key: "time", header: "Time", className: "text-right", width: "w-20" },
];

export function BlocksTableSkeleton() {
  return <DataTableSkeleton title="Latest Blocks" columns={blockSkeletonColumns} />;
}
