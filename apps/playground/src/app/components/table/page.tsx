import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { Badge } from "@cosmos-explorer/ui/badge";
import { ComponentPreview } from "@/components/component-preview";

const transactions = [
  { hash: "0xA1B2...C3D4", type: "Transfer", status: "Success", amount: "1,250.00 XRP", time: "12s ago" },
  { hash: "0xE5F6...G7H8", type: "Delegate", status: "Success", amount: "500.00 XRP", time: "45s ago" },
  { hash: "0xI9J0...K1L2", type: "Swap", status: "Pending", amount: "89.50 XRP", time: "1m ago" },
  { hash: "0xM3N4...O5P6", type: "Transfer", status: "Failed", amount: "2,100.00 XRP", time: "2m ago" },
  { hash: "0xQ7R8...S9T0", type: "IBC Transfer", status: "Success", amount: "340.75 XRP", time: "5m ago" },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Success":
      return <Badge className="bg-green-500/15 text-green-400 border-green-500/20">{status}</Badge>;
    case "Pending":
      return <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20">{status}</Badge>;
    case "Failed":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function TablePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Table</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A responsive table component.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <ComponentPreview>
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
                  <TableCell className="font-mono text-xs">{tx.hash}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell><StatusBadge status={tx.status} /></TableCell>
                  <TableCell className="text-right font-mono">{tx.amount}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{tx.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ComponentPreview>
      </section>
    </div>
  );
}
