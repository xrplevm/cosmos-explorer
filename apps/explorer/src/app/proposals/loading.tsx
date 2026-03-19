import { Card, CardContent, CardHeader } from "@cosmos-explorer/ui/card";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";

export default function ProposalsLoading() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-36" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
