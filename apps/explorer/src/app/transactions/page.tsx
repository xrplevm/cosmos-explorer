import { Badge } from "@cosmos-explorer/ui/badge";
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
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";

const transactions = [
  { hash: "0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6", type: "Transfer", status: "Success", from: "cosmos1a2b...x9y0", to: "cosmos1z8w...v7u6", amount: "1,250.00 XRP", fee: "0.005 XRP", height: 482910, time: "12s ago" },
  { hash: "0xB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7", type: "Delegate", status: "Success", from: "cosmos1c4d...t5s4", to: "cosmosvaloper1...r3q2", amount: "500.00 XRP", fee: "0.008 XRP", height: 482909, time: "45s ago" },
  { hash: "0xC3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8", type: "Swap", status: "Pending", from: "cosmos1e6f...p1o0", to: "cosmos1g8h...n9m8", amount: "89.50 XRP", fee: "0.012 XRP", height: 482908, time: "1m ago" },
  { hash: "0xD4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9", type: "Transfer", status: "Failed", from: "cosmos1i0j...l7k6", to: "cosmos1m2n...j5i4", amount: "2,100.00 XRP", fee: "0.005 XRP", height: 482907, time: "2m ago" },
  { hash: "0xE5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0", type: "IBC Transfer", status: "Success", from: "cosmos1o4p...h3g2", to: "osmo1q6r...f1e0", amount: "340.75 XRP", fee: "0.015 XRP", height: 482906, time: "5m ago" },
  { hash: "0xF6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1", type: "Transfer", status: "Success", from: "cosmos1s8t...d9c8", to: "cosmos1u0v...b7a6", amount: "750.00 XRP", fee: "0.005 XRP", height: 482905, time: "8m ago" },
  { hash: "0xG7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2", type: "Undelegate", status: "Success", from: "cosmos1w2x...z5y4", to: "cosmosvaloper1...x3w2", amount: "1,000.00 XRP", fee: "0.010 XRP", height: 482904, time: "12m ago" },
  { hash: "0xH8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3", type: "Vote", status: "Success", from: "cosmos1a4b...v1u0", to: "Proposal #42", amount: "—", fee: "0.003 XRP", height: 482903, time: "15m ago" },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Input placeholder="Search by hash..." className="w-72" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">Block</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.hash}>
                  <TableCell className="font-mono text-xs">
                    <Link href={`/transactions/${tx.hash}`} className="text-primary hover:underline">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-4)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tx.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <Link href={`/account/${tx.from}`} className="hover:text-foreground">
                      {tx.from}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {tx.to}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{tx.amount}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">{tx.fee}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    <Link href={`/blocks/${tx.height}`} className="text-primary hover:underline">
                      #{tx.height.toLocaleString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{tx.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
