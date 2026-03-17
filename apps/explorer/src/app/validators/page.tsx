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
import { Avatar, AvatarFallback } from "@cosmos-explorer/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

const validators = [
  { rank: 1, moniker: "Cosmostation", address: "cosmosvaloper1clp", votingPower: "4,230,000 XRP", commission: "5.00%", uptime: "99.98%", status: "Active" },
  { rank: 2, moniker: "Figment", address: "cosmosvaloper1fg2", votingPower: "3,890,000 XRP", commission: "8.00%", uptime: "99.95%", status: "Active" },
  { rank: 3, moniker: "Chorus One", address: "cosmosvaloper1ch3", votingPower: "3,450,000 XRP", commission: "7.50%", uptime: "99.92%", status: "Active" },
  { rank: 4, moniker: "Binance Staking", address: "cosmosvaloper1bn4", votingPower: "3,210,000 XRP", commission: "10.00%", uptime: "99.99%", status: "Active" },
  { rank: 5, moniker: "Kraken", address: "cosmosvaloper1kr5", votingPower: "2,980,000 XRP", commission: "10.00%", uptime: "99.97%", status: "Active" },
  { rank: 6, moniker: "Everstake", address: "cosmosvaloper1ev6", votingPower: "2,750,000 XRP", commission: "5.00%", uptime: "99.90%", status: "Active" },
  { rank: 7, moniker: "Polychain Labs", address: "cosmosvaloper1pl7", votingPower: "2,340,000 XRP", commission: "0.00%", uptime: "99.88%", status: "Active" },
  { rank: 8, moniker: "Staked", address: "cosmosvaloper1st8", votingPower: "2,120,000 XRP", commission: "10.00%", uptime: "99.85%", status: "Active" },
  { rank: 9, moniker: "P2P Validator", address: "cosmosvaloper1p29", votingPower: "1,890,000 XRP", commission: "8.00%", uptime: "98.50%", status: "Active" },
  { rank: 10, moniker: "Retired Node", address: "cosmosvaloper1rt0", votingPower: "150,000 XRP", commission: "100%", uptime: "0.00%", status: "Jailed" },
];

export default function ValidatorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Validators</h1>
        <Input placeholder="Search validators..." className="w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">150</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bonded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">48.2M XRP</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7.3%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validator Set</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Validator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Voting Power</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validators.map((v) => (
                <TableRow key={v.address}>
                  <TableCell className="text-muted-foreground">{v.rank}</TableCell>
                  <TableCell>
                    <Link href={`/validators/${v.address}`} className="flex items-center gap-3 hover:text-primary">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{v.moniker.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{v.moniker}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={v.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{v.votingPower}</TableCell>
                  <TableCell className="text-right">{v.commission}</TableCell>
                  <TableCell className="text-right">{v.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
