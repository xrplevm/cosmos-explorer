import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function VoteBar({ yes, no, abstain, veto }: { yes: number; no: number; abstain: number; veto: number }) {
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
      <div className="bg-green-500" style={{ width: `${yes}%` }} />
      <div className="bg-red-500" style={{ width: `${no}%` }} />
      <div className="bg-zinc-400" style={{ width: `${abstain}%` }} />
      <div className="bg-yellow-500" style={{ width: `${veto}%` }} />
    </div>
  );
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">#{id}</span>
          <StatusBadge status="Voting" />
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Enable IBC Connections to Osmosis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Software Upgrade Proposal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <Row label="Status">
            <StatusBadge status="Voting" />
          </Row>
          <Separator />
          <Row label="Type">SoftwareUpgrade</Row>
          <Separator />
          <Row label="Submit Time">Mar 15, 2026 10:00:00 UTC</Row>
          <Separator />
          <Row label="Deposit End">Mar 17, 2026 10:00:00 UTC</Row>
          <Separator />
          <Row label="Voting Start">Mar 17, 2026 10:00:00 UTC</Row>
          <Separator />
          <Row label="Voting End">Mar 29, 2026 10:00:00 UTC</Row>
          <Separator />
          <Row label="Total Deposit">
            <span className="font-mono">500.00 XRP</span>
            <span className="ml-2 text-muted-foreground">(Min: 500.00 XRP)</span>
          </Row>
          <Separator />
          <Row label="Proposer">
            <span className="font-mono text-xs">cosmos1a2b3c4d5e6f7g8h9i0j</span>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voting</CardTitle>
          <CardDescription>Current tally — 83.0% turnout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <VoteBar yes={62.4} no={8.2} abstain={12.1} veto={0.3} />

          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Yes</p>
              <p className="mt-1 text-xl font-bold text-green-400">62.4%</p>
              <p className="mt-0.5 text-xs text-muted-foreground">30,098,400 XRP</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">No</p>
              <p className="mt-1 text-xl font-bold text-red-400">8.2%</p>
              <p className="mt-0.5 text-xs text-muted-foreground">3,956,400 XRP</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Abstain</p>
              <p className="mt-1 text-xl font-bold">12.1%</p>
              <p className="mt-0.5 text-xs text-muted-foreground">5,836,200 XRP</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">No with Veto</p>
              <p className="mt-1 text-xl font-bold text-yellow-400">0.3%</p>
              <p className="mt-0.5 text-xs text-muted-foreground">144,720 XRP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed text-muted-foreground">
            <p>
              This proposal seeks to enable IBC (Inter-Blockchain Communication) connections
              between our chain and Osmosis, the largest decentralized exchange in the Cosmos
              ecosystem.
            </p>
            <p className="mt-3">
              Enabling IBC will allow seamless transfer of tokens between chains, improving
              liquidity and enabling cross-chain DeFi applications. The connection will use
              the standard IBC-Go v7 implementation with the following parameters:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Connection: connection-0</li>
              <li>Channel: channel-0 (transfer)</li>
              <li>Client: 07-tendermint-0</li>
              <li>Trusting period: 14 days</li>
            </ul>
            <p className="mt-3">
              The upgrade is planned for block height 490,000 (estimated March 30, 2026).
              All validators must upgrade their nodes before this block height.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
