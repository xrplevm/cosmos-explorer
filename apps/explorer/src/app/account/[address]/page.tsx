import {
  Card,
  CardContent,
  CardDescription,
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

const balances = [
  { denom: "XRP", amount: "12,450.50", usdValue: "$6,225.25" },
  { denom: "ATOM", amount: "340.00", usdValue: "$3,060.00" },
  { denom: "OSMO", amount: "1,200.00", usdValue: "$960.00" },
];

const delegations = [
  { validator: "Cosmostation", amount: "5,000.00 XRP", rewards: "12.35 XRP" },
  { validator: "Figment", amount: "2,500.00 XRP", rewards: "5.82 XRP" },
  { validator: "Chorus One", amount: "1,000.00 XRP", rewards: "2.14 XRP" },
];

const transactions = [
  { hash: "0xA1B2...C3D4", type: "Transfer", status: "Success", amount: "+1,250.00 XRP", time: "2h ago" },
  { hash: "0xB2C3...D4E5", type: "Delegate", status: "Success", amount: "-500.00 XRP", time: "1d ago" },
  { hash: "0xC3D4...E5F6", type: "Claim Rewards", status: "Success", amount: "+18.42 XRP", time: "2d ago" },
  { hash: "0xD4E5...F6G7", type: "Vote", status: "Success", amount: "—", time: "3d ago" },
  { hash: "0xE5F6...G7H8", type: "Transfer", status: "Success", amount: "-340.75 XRP", time: "5d ago" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground break-all">{address}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-2xl">$10,245.25</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across 3 tokens</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Staked</CardDescription>
            <CardTitle className="text-2xl">8,500.00 XRP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">3 validators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rewards</CardDescription>
            <CardTitle className="text-2xl">20.31 XRP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Unclaimed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">USD Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((b) => (
                <TableRow key={b.denom}>
                  <TableCell className="font-medium">{b.denom}</TableCell>
                  <TableCell className="text-right font-mono">{b.amount}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{b.usdValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delegations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Validator</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Pending Rewards</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delegations.map((d) => (
                <TableRow key={d.validator}>
                  <TableCell>
                    <Link href="/validators/cosmosvaloper1abc" className="text-primary hover:underline">
                      {d.validator}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-mono">{d.amount}</TableCell>
                  <TableCell className="text-right font-mono text-green-400">{d.rewards}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
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
                  <TableCell className={`text-right font-mono text-sm ${tx.amount.startsWith("+") ? "text-green-400" : tx.amount.startsWith("-") ? "text-red-400" : ""}`}>
                    {tx.amount}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{tx.time}</TableCell>
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
