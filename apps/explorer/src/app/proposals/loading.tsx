import { Card, CardHeader } from "@cosmos-explorer/ui/card";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";

export default function ProposalsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
        <Skeleton className="h-9 w-full sm:w-72 rounded-md" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Skeleton className="h-4 w-8 shrink-0" />
                  <Skeleton className="h-5 w-48 sm:w-72" />
                </div>
                <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-36" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Pagination skeleton */}
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-4 w-14 mx-2" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </nav>
    </div>
  );
}
