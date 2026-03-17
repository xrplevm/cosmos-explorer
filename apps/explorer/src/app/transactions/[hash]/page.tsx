import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

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
            <StatusBadge status="Success" />
          </Row>
          <Separator />
          <Row label="Block">
            <Link href="/blocks/482910" className="font-mono text-primary hover:underline">
              #482,910
            </Link>
          </Row>
          <Separator />
          <Row label="Timestamp">
            <span>Mar 17, 2026 14:23:45 UTC</span>
            <span className="ml-2 text-muted-foreground">(12s ago)</span>
          </Row>
          <Separator />
          <Row label="Type">
            <span>Transfer</span>
          </Row>
          <Separator />
          <Row label="From">
            <Link href="/account/cosmos1a2b3c4d5e6f7g8h9i0j" className="font-mono text-xs text-primary hover:underline">
              cosmos1a2b3c4d5e6f7g8h9i0jk1l2m3n4o5p6q7r8s9t0
            </Link>
          </Row>
          <Separator />
          <Row label="To">
            <Link href="/account/cosmos1z8w7v6u5t4s3r2q1p0o" className="font-mono text-xs text-primary hover:underline">
              cosmos1z8w7v6u5t4s3r2q1p0on9m8l7k6j5i4h3g2f1e0
            </Link>
          </Row>
          <Separator />
          <Row label="Amount">
            <span className="font-mono">1,250.00 XRP</span>
          </Row>
          <Separator />
          <Row label="Fee">
            <span className="font-mono text-muted-foreground">0.005 XRP</span>
          </Row>
          <Separator />
          <Row label="Gas Used / Wanted">
            <span className="font-mono">78,432 / 100,000</span>
          </Row>
          <Separator />
          <Row label="Memo">
            <span className="text-muted-foreground italic">Payment for services</span>
          </Row>
        </CardContent>
      </Card>
    </div>
  );
}
