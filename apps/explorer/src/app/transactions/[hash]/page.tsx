import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Separator } from "@cosmos-explorer/ui/separator";
import { DetailBackButton } from "@/components/detail-back-button";
import { StatusBadge } from "@/components/status-badge";
import { getChainConfig } from "@/lib/config";
import {
  formatHashMiddle,
  formatTimestamp,
  formatTransactionFee,
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
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <div className="min-w-0 text-sm">{children}</div>
    </div>
  );
}

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const config = getChainConfig();
  const { transactionService } = getServices();
  const transaction = await transactionService.getTransactionByHash(hash);

  if (transaction == null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <DetailBackButton href="/transactions" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Transaction Details
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="Tx Hash">
            <div className="flex min-w-0 flex-nowrap items-center gap-2">
              <span className="min-w-0 flex-1 font-mono text-xs md:hidden">
                {formatHashMiddle(hash, 8, 8)}
              </span>
              <span className="hidden min-w-0 flex-1 break-all font-mono text-xs md:block">
                {hash}
              </span>
              <CopyButton
                value={hash}
                label="transaction hash"
                size="xs"
              />
            </div>
          </Row>
          <Separator />
          <Row label="Status">
            <StatusBadge status={transaction.success ? "Success" : "Failed"} />
          </Row>
          <Separator />
          <Row label="Block">
            <Link
              href={`/blocks/${String(transaction.height)}`}
              className="font-mono text-primary hover:underline"
            >
              #{transaction.height.toLocaleString()}
            </Link>
          </Row>
          <Separator />
          <Row label="Timestamp">
            <span>{formatTimestamp(transaction.timestamp)}</span>
          </Row>
          <Separator />
          <Row label="Type">
            <span>{transaction.messages[0]?.type ?? "Unknown"}</span>
          </Row>
          <Separator />
          <Row label="Fee">
            <span className="font-mono text-xs break-all">
              {formatTransactionFee(
                transaction.fee,
                config.network.primaryToken,
              )}
            </span>
          </Row>
          <Separator />
          <Row label="Gas Used / Wanted">
            <span className="font-mono">
              {transaction.gasUsed.toLocaleString()} /{" "}
              {transaction.gasWanted.toLocaleString()}
            </span>
          </Row>
          <Separator />
          <Row label="Memo">
            <span className="text-muted-foreground italic">
              {transaction.memo || "No memo"}
            </span>
          </Row>
          <Separator />
          <Row label="Messages">
            <pre className="max-w-full overflow-x-auto rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(transaction.messages, null, 2)}
            </pre>
          </Row>
        </CardContent>
      </Card>
    </div>
  );
}
