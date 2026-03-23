import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";

function RowSkeleton({
  label,
  width = "w-40",
}: {
  label: string;
  width?: string;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-44 sm:shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <Skeleton className={`h-4 ${width}`} />
    </div>
  );
}

export default function ValidatorDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          "Voting Power",
          "Commission",
          "Missed Blocks",
          "Latest Status Height",
        ].map((label) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardDescription>{label}</CardDescription>
              <Skeleton className="h-7 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSkeleton label="Operator Address" width="w-80" />
          <Separator />
          <RowSkeleton label="Self Delegate Address" width="w-80" />
          <Separator />
          <RowSkeleton label="Website" width="w-48" />
          <Separator />
          <RowSkeleton label="Description" width="w-64" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Proposed Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Height</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Txs</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-6" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
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
