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

export default function ProposalDetailLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-8 w-72" />
        <Skeleton className="mt-1 h-4 w-32" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSkeleton label="Status" width="w-16" />
          <Separator />
          <RowSkeleton label="Type" width="w-32" />
          <Separator />
          <RowSkeleton label="Proposer" width="w-80" />
          <Separator />
          <RowSkeleton label="Submit Time" width="w-48" />
          <Separator />
          <RowSkeleton label="Deposit End" width="w-48" />
          <Separator />
          <RowSkeleton label="Voting Start" width="w-48" />
          <Separator />
          <RowSkeleton label="Voting End" width="w-48" />
          <Separator />
          <RowSkeleton label="Bonded Snapshot" width="w-32" />
          <Separator />
          <RowSkeleton label="Metadata" width="w-64" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["Yes", "No", "Abstain", "No with Veto"].map((label) => (
              <div key={label} className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Skeleton className="mt-1 h-7 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-4 h-32 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}
