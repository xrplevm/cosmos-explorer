import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { formatTimestamp } from "@/lib/formatters";
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

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const { transactionService } = getServices();
  const transaction = await transactionService.getTransactionByHash(hash);

  if (transaction == null) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transaction Details</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{hash}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="Tx Hash">
            <span className="font-mono text-xs break-all">{hash}</span>
          </Row>
          <Separator />
          <Row label="Status">
            <StatusBadge status={transaction.success ? "Success" : "Failed"} />
          </Row>
          <Separator />
          <Row label="Block">
            <Link href={`/blocks/${transaction.height}`} className="font-mono text-primary hover:underline">
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
            <span className="font-mono text-muted-foreground">
              {JSON.stringify(transaction.fee)}
            </span>
          </Row>
          <Separator />
          <Row label="Gas Used / Wanted">
            <span className="font-mono">
              {transaction.gasUsed.toLocaleString()} / {transaction.gasWanted.toLocaleString()}
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
            <pre className="max-w-full overflow-x-auto text-xs">
              {JSON.stringify(transaction.messages, null, 2)}
            </pre>
          </Row>
        </CardContent>
      </Card>
    </div>
  );
}
