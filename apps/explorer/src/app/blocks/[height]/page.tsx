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
import Link from "next/link";

const blockTxs = [
  { hash: "0xA1B2C3D4...O5P6", type: "Transfer", status: "Success", amount: "1,250.00 XRP" },
  { hash: "0xB2C3D4E5...P6Q7", type: "Delegate", status: "Success", amount: "500.00 XRP" },
  { hash: "0xC3D4E5F6...Q7R8", type: "Swap", status: "Success", amount: "89.50 XRP" },
  { hash: "0xD4E5F6G7...R8S9", type: "Transfer", status: "Failed", amount: "2,100.00 XRP" },
  { hash: "0xE5F6G7H8...S9T0", type: "IBC Transfer", status: "Success", amount: "340.75 XRP" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
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
            <span className="font-mono text-xs break-all">
              0xAB12CD34EF56GH78IJ90KL12MN34OP56QR78ST90UV12WX34
            </span>
          </Row>
          <Separator />
          <Row label="Timestamp">
            <span>Mar 17, 2026 14:23:39 UTC</span>
            <span className="ml-2 text-muted-foreground">(6s ago)</span>
          </Row>
          <Separator />
          <Row label="Proposer">
            <Link href="/validators/cosmosvaloper1abc" className="text-primary hover:underline">
              Validator A
            </Link>
          </Row>
          <Separator />
          <Row label="Transactions">
            <span>{blockTxs.length} transactions</span>
          </Row>
          <Separator />
          <Row label="Gas Used / Limit">
            <span className="font-mono">1,245,320 / 10,000,000</span>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockTxs.map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell className="font-mono text-xs">
                    <Link href={`/transactions/${tx.hash}`} className="text-primary hover:underline">
                      {tx.hash}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tx.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{tx.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
