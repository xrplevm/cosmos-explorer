import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Badge } from "@cosmos-explorer/ui/badge";
import { Separator } from "@cosmos-explorer/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { formatHash, formatTimestamp } from "@/lib/formatters";
import { getServices } from "@/lib/services";
import Link from "next/link";
import { notFound } from "next/navigation";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">{label}</span>
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Block #{Number(height).toLocaleString()}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Block details and transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="Block Height">
            <span className="font-mono">#{Number(height).toLocaleString()}</span>
          </Row>
          <Separator />
          <Row label="Block Hash">
            <span className="font-mono text-xs break-all">{detail.overview.hash}</span>
          </Row>
          <Separator />
          <Row label="Timestamp">
            <span>{formatTimestamp(detail.overview.timestamp)}</span>
          </Row>
          <Separator />
          <Row label="Proposer">
            <Link href={`/validators/${detail.overview.proposer}`} className="text-primary hover:underline">
              {detail.overview.proposer}
            </Link>
          </Row>
          <Separator />
          <Row label="Transactions">
            <span>{detail.transactions.length} transactions</span>
          </Row>
          <Separator />
          <Row label="Pre-commits">
            <span className="font-mono">{detail.signatures.length.toLocaleString()}</span>
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
                      <TableCell className="font-mono text-xs">
                        <Link href={`/transactions/${tx.hash}`} className="text-primary hover:underline">
                          {formatHash(tx.hash)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.success ? "Success" : "Failed"} />
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
