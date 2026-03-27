import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Badge } from "@cosmos-explorer/ui/badge";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import { Separator } from "@cosmos-explorer/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { DetailBackButton } from "@/components/detail-back-button";
import { StatusBadge } from "@/components/status-badge";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { formatHash, formatHashMiddle } from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";
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
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export default async function BlockDetailPage({
  params,
}: {
  params: Promise<{ height: string }>;
}) {
  const { height } = await params;
  const { blockService } = getServices();
  const detail = await blockService.getBlockByHeight(Number(height));

  if (detail == null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <DetailBackButton href="/blocks" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
            Block #{Number(height).toLocaleString()}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Block details and transactions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="Block Height">
            <span className="font-mono">
              #{Number(height).toLocaleString()}
            </span>
          </Row>
          <Separator />
          <Row label="Block Hash">
            <div className="flex min-w-0 flex-nowrap items-center gap-2">
              <span className="min-w-0 flex-1 font-mono text-xs md:hidden">
                {formatHashMiddle(detail.overview.hash, 8, 8)}
              </span>
              <span className="hidden min-w-0 flex-1 break-all font-mono text-xs md:block">
                {detail.overview.hash}
              </span>
              <CopyButton
                value={detail.overview.hash}
                label="block hash"
                size="xs"
              />
            </div>
          </Row>
          <Separator />
          <Row label="Timestamp">
            <Timestamp value={detail.overview.timestamp} />
          </Row>
          <Separator />
          <Row label="Proposer">
            <div className="flex items-center gap-2">
              {detail.overview.proposerAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Keybase avatar URL from chain indexer
                <img
                  src={detail.overview.proposerAvatarUrl}
                  alt={
                    detail.overview.proposerMoniker ?? detail.overview.proposer
                  }
                  className="h-6 w-6 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                  {(detail.overview.proposerMoniker ?? detail.overview.proposer)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <Link
                href={`/validators/${detail.overview.proposer}`}
                className="text-sm text-primary-soft hover:text-primary transition-colors"
              >
                {detail.overview.proposerMoniker ?? detail.overview.proposer}
              </Link>
            </div>
          </Row>
          <Separator />
          <Row label="Transactions">
            <span>{detail.transactions.length} transactions</span>
          </Row>
          <Separator />
          <Row label="Pre-commits">
            <span className="font-mono">
              {detail.signatures.length.toLocaleString()}
            </span>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {detail.transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No transactions in this block.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Messages</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.transactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell>
                        <Link
                          href={`/transactions/${tx.hash}`}
                          className="font-mono text-sm text-primary-soft hover:text-primary transition-colors"
                        >
                          {formatHash(tx.hash)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {tx.type === "EthereumTx" && (
                            <IconCurrencyEthereum className="h-3.5 w-3.5" />
                          )}
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={tx.success ? "Success" : "Failed"}
                        />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {tx.messageCount}
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
