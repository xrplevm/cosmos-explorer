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
import { Avatar, AvatarFallback } from "@cosmos-explorer/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import {
  formatPercent,
  formatTokenAmount,
} from "@/lib/formatters";
import { getServices } from "@/lib/services";
import Link from "next/link";

function toStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "jailed":
      return "Jailed";
    default:
      return "Unknown";
  }
}

export default async function ValidatorsPage() {
  const { validatorService } = getServices();
  const validatorSet = await validatorService.getValidatorSet();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Validators</h1>
        <Input placeholder="Search validators..." className="w-full sm:w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{validatorSet.count.active.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bonded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatTokenAmount(validatorSet.bonded, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatPercent(
                validatorSet.averageCommission == null
                  ? null
                  : validatorSet.averageCommission * 100
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validator Set</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Validator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Voting Power</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Missed Blocks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validatorSet.items.map((v, index) => (
                <TableRow key={v.address}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <Link href={`/validators/${v.address}`} className="flex items-center gap-3 hover:text-primary">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{v.moniker.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{v.moniker}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={toStatusLabel(v.status)} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {v.votingPower.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercent(v.commission == null ? null : v.commission * 100)}
                  </TableCell>
                  <TableCell className="text-right">{v.missedBlocksCounter.toLocaleString()}</TableCell>
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
