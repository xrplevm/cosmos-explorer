import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@cosmos-explorer/ui/avatar";
import { Separator } from "@cosmos-explorer/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { DetailBackButton } from "@/components/detail-back-button";
import { StatusBadge } from "@/components/status-badge";
import {
  formatHash,
  formatNumber,
  formatPercent,
  formatTimestamp,
} from "@/lib/formatters";
import { getServices } from "@/lib/services";
import Link from "next/link";
import { notFound } from "next/navigation";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-44 sm:shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

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

export default async function ValidatorDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const { validatorService } = getServices();
  const validator = await validatorService.getValidatorByAddress(address);

  if (validator == null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <DetailBackButton href="/validators" />
        <Avatar className="h-12 w-12">
          {validator.avatarUrl && (
            <AvatarImage src={validator.avatarUrl} alt={validator.moniker} />
          )}
          <AvatarFallback className="text-lg">
            {validator.moniker.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {validator.moniker}
            </h1>
            <StatusBadge status={toStatusLabel(validator.status)} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Voting Power</CardDescription>
            <CardTitle className="text-xl">
              {validator.votingPower.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {formatPercent(validator.votingPowerPercent)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Commission</CardDescription>
            <CardTitle className="text-xl">
              {formatPercent(
                validator.commission == null
                  ? null
                  : validator.commission * 100,
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Max rate:{" "}
              {formatPercent(
                validator.maxRate == null ? null : validator.maxRate * 100,
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Missed Blocks</CardDescription>
            <CardTitle className="text-xl">
              {formatNumber(validator.missedBlocksCounter)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tombstoned: {validator.tombstoned ? "Yes" : "No"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Latest Status Height</CardDescription>
            <CardTitle className="text-xl">
              {formatNumber(validator.latestStatusHeight)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Jailed: {validator.jailed ? "Yes" : "No"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="Operator Address">
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs break-all">
                {validator.address}
              </span>
              <CopyButton value={validator.address} label="operator address" size="xs" />
            </div>
          </Row>
          <Separator />
          <Row label="Self Delegate Address">
            {validator.selfDelegateAddress ? (
              <div className="flex items-center gap-1">
                <Link
                  href={`/account/${validator.selfDelegateAddress}`}
                  className="font-mono text-xs break-all text-foreground hover:underline"
                >
                  {validator.selfDelegateAddress}
                </Link>
                <CopyButton value={validator.selfDelegateAddress} label="self delegate address" size="xs" />
              </div>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </Row>
          <Separator />
          <Row label="Website">
            {validator.website ? (
              <a
                href={validator.website}
                target="_blank"
                rel="noreferrer"
                className="text-foreground hover:underline"
              >
                {validator.website}
              </a>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </Row>
          <Separator />
          <Row label="Description">
            <span className="text-muted-foreground">
              {validator.details ?? "No validator description available."}
            </span>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Proposed Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          {validator.recentBlocks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No recent proposed blocks.
            </p>
          ) : (
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
                  {validator.recentBlocks.map((block) => (
                    <TableRow key={block.hash}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/blocks/${block.height}`}
                            className="text-foreground hover:underline"
                          >
                            #{block.height.toLocaleString()}
                          </Link>
                          <CopyButton value={String(block.height)} label="block height" size="xs" />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-1">
                          {formatHash(block.hash)}
                          <CopyButton value={block.hash} label="block hash" size="xs" />
                        </div>
                      </TableCell>
                      <TableCell>{block.txs}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatTimestamp(block.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
