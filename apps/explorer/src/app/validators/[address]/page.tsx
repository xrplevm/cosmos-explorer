import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Avatar, AvatarFallback } from "@cosmos-explorer/ui/avatar";
import { Separator } from "@cosmos-explorer/ui/separator";
import { Badge } from "@cosmos-explorer/ui/badge";
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

const delegators = [
  { address: "cosmos1a2b...x9y0", amount: "125,000.00 XRP", share: "2.95%" },
  { address: "cosmos1c4d...t5s4", amount: "98,500.00 XRP", share: "2.33%" },
  { address: "cosmos1e6f...p1o0", amount: "75,200.00 XRP", share: "1.78%" },
  { address: "cosmos1g8h...n9m8", amount: "50,000.00 XRP", share: "1.18%" },
  { address: "cosmos1i0j...l7k6", amount: "42,300.00 XRP", share: "1.00%" },
];

const recentBlocks = [
  { height: 482910, txs: 12, time: "6s ago" },
  { height: 482895, txs: 8, time: "1m 36s ago" },
  { height: 482880, txs: 15, time: "3m 12s ago" },
  { height: 482862, txs: 3, time: "5m 6s ago" },
  { height: 482841, txs: 21, time: "7m 18s ago" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3">
      <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export default async function ValidatorDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="text-lg">Co</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Cosmostation</h1>
            <StatusBadge status="Active" />
          </div>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">{address}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Voting Power</CardDescription>
            <CardTitle className="text-xl">4,230,000 XRP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">8.78% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Commission</CardDescription>
            <CardTitle className="text-xl">5.00%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Max: 20.00%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Uptime</CardDescription>
            <CardTitle className="text-xl">99.98%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 10,000 blocks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Delegators</CardDescription>
            <CardTitle className="text-xl">1,247</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="Operator Address">
            <span className="font-mono text-xs break-all">{address}</span>
          </Row>
          <Separator />
          <Row label="Self-Bonded">
            <span className="font-mono">250,000.00 XRP</span>
            <span className="ml-2 text-muted-foreground">(5.91%)</span>
          </Row>
          <Separator />
          <Row label="Commission Rate">
            <span>5.00%</span>
            <span className="ml-2 text-muted-foreground">(Max: 20.00%, Max Change: 1.00%/day)</span>
          </Row>
          <Separator />
          <Row label="Min Self Delegation">
            <span className="font-mono">1.00 XRP</span>
          </Row>
          <Separator />
          <Row label="Website">
            <span className="text-primary">https://cosmostation.io</span>
          </Row>
          <Separator />
          <Row label="Description">
            <span className="text-muted-foreground">
              Cosmostation is a leading validator and wallet provider in the Cosmos ecosystem.
            </span>
          </Row>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Delegators</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delegators.map((d) => (
                  <TableRow key={d.address}>
                    <TableCell className="font-mono text-xs">
                      <Link href={`/account/${d.address}`} className="text-primary hover:underline">
                        {d.address}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{d.amount}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{d.share}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposed Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Height</TableHead>
                  <TableHead>Txs</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBlocks.map((b) => (
                  <TableRow key={b.height}>
                    <TableCell className="font-mono text-sm">
                      <Link href={`/blocks/${b.height}`} className="text-primary hover:underline">
                        #{b.height.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell>{b.txs}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{b.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
