import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";

function RowSkeleton({
  label,
  width = "w-40",
}: {
  label: string;
  width?: string;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <Skeleton className={`h-4 ${width}`} />
    </div>
  );
}

export default function TransactionDetailLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Transaction Details
        </h1>
        <Skeleton className="mt-1 h-4 w-full max-w-lg" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSkeleton label="Tx Hash" width="w-80" />
          <Separator />
          <RowSkeleton label="Status" width="w-16" />
          <Separator />
          <RowSkeleton label="Block" width="w-24" />
          <Separator />
          <RowSkeleton label="Timestamp" width="w-48" />
          <Separator />
          <RowSkeleton label="Type" width="w-32" />
          <Separator />
          <RowSkeleton label="Fee" width="w-40" />
          <Separator />
          <RowSkeleton label="Gas Used / Wanted" width="w-36" />
          <Separator />
          <RowSkeleton label="Memo" width="w-24" />
          <Separator />
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
              Messages
            </span>
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
