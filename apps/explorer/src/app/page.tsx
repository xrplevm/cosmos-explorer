import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { StatusBadge } from "@/components/status-badge";

const stats = [
  { label: "Block Height", value: "482,910", detail: "~6.2s avg block time" },
  { label: "Transactions", value: "1,284,032", detail: "+2,341 today" },
  { label: "Validators", value: "150", detail: "98.7% uptime" },
  { label: "Bonded Tokens", value: "48.2M XRP", detail: "67.3% bonded ratio" },
];

const recentBlocks = [
  { height: 482910, txs: 12, proposer: "Validator A", time: "6s ago" },
  { height: 482909, txs: 8, proposer: "Validator B", time: "12s ago" },
  { height: 482908, txs: 15, proposer: "Validator C", time: "18s ago" },
  { height: 482907, txs: 3, proposer: "Validator A", time: "24s ago" },
  { height: 482906, txs: 21, proposer: "Validator D", time: "30s ago" },
];

const recentTxs = [
  { hash: "0xA1B2...C3D4", type: "Transfer", status: "Success", amount: "1,250.00 XRP", time: "12s ago" },
  { hash: "0xE5F6...G7H8", type: "Delegate", status: "Success", amount: "500.00 XRP", time: "45s ago" },
  { hash: "0xI9J0...K1L2", type: "Swap", status: "Pending", amount: "89.50 XRP", time: "1m ago" },
  { hash: "0xM3N4...O5P6", type: "Transfer", status: "Failed", amount: "2,100.00 XRP", time: "2m ago" },
  { hash: "0xQ7R8...S9T0", type: "IBC Transfer", status: "Success", amount: "340.75 XRP", time: "5m ago" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
            <CardDescription>Latest blocks on the network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Height</TableHead>
                  <TableHead>Txs</TableHead>
                  <TableHead>Proposer</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBlocks.map((block) => (
                  <TableRow key={block.height}>
                    <TableCell className="font-mono text-sm">
                      #{block.height.toLocaleString()}
                    </TableCell>
                    <TableCell>{block.txs}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {block.proposer}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {block.time}
                    </TableCell>
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
            <CardDescription>Latest transactions on the network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTxs.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell className="font-mono text-xs">{tx.hash}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {tx.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
