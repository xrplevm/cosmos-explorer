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

const blocks = [
  { height: 482910, hash: "0xAB12...EF56", txs: 12, proposer: "Validator A", gasUsed: "1,245,320", time: "6s ago" },
  { height: 482909, hash: "0xCD34...GH78", txs: 8, proposer: "Validator B", gasUsed: "892,100", time: "12s ago" },
  { height: 482908, hash: "0xEF56...IJ90", txs: 15, proposer: "Validator C", gasUsed: "2,103,450", time: "18s ago" },
  { height: 482907, hash: "0xGH78...KL12", txs: 3, proposer: "Validator A", gasUsed: "345,200", time: "24s ago" },
  { height: 482906, hash: "0xIJ90...MN34", txs: 21, proposer: "Validator D", gasUsed: "3,012,800", time: "30s ago" },
  { height: 482905, hash: "0xKL12...OP56", txs: 7, proposer: "Validator E", gasUsed: "765,430", time: "36s ago" },
  { height: 482904, hash: "0xMN34...QR78", txs: 19, proposer: "Validator B", gasUsed: "2,567,890", time: "42s ago" },
  { height: 482903, hash: "0xOP56...ST90", txs: 5, proposer: "Validator F", gasUsed: "523,100", time: "48s ago" },
  { height: 482902, hash: "0xQR78...UV12", txs: 11, proposer: "Validator A", gasUsed: "1,432,500", time: "54s ago" },
  { height: 482901, hash: "0xST90...WX34", txs: 16, proposer: "Validator C", gasUsed: "2,198,700", time: "1m ago" },
];

export default function BlocksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Blocks</h1>
        <Input placeholder="Search by height..." className="w-72" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Height</TableHead>
                <TableHead>Block Hash</TableHead>
                <TableHead>Txs</TableHead>
                <TableHead>Proposer</TableHead>
                <TableHead className="text-right">Gas Used</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.height}>
                  <TableCell className="font-mono text-sm">
                    <Link href={`/blocks/${block.height}`} className="text-primary hover:underline">
                      #{block.height.toLocaleString()}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {block.hash}
                  </TableCell>
                  <TableCell>{block.txs}</TableCell>
                  <TableCell>
                    <Link href="/validators/cosmosvaloper1abc" className="hover:text-primary">
                      {block.proposer}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {block.gasUsed}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {block.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
