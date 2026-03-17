import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

const proposals = [
  {
    id: 45,
    title: "Enable IBC Connections to Osmosis",
    status: "Voting",
    type: "SoftwareUpgrade",
    submitted: "Mar 15, 2026",
    votingEnd: "Mar 29, 2026",
    yes: "62.4%",
    no: "8.2%",
    abstain: "12.1%",
    veto: "0.3%",
    turnout: "83.0%",
  },
  {
    id: 44,
    title: "Community Pool Spend: Fund Developer Grants Program",
    status: "Voting",
    type: "CommunityPoolSpend",
    submitted: "Mar 12, 2026",
    votingEnd: "Mar 26, 2026",
    yes: "45.1%",
    no: "22.5%",
    abstain: "5.3%",
    veto: "1.2%",
    turnout: "74.1%",
  },
  {
    id: 43,
    title: "Increase Max Validator Set to 175",
    status: "Passed",
    type: "ParameterChange",
    submitted: "Feb 28, 2026",
    votingEnd: "Mar 14, 2026",
    yes: "89.2%",
    no: "3.1%",
    abstain: "6.5%",
    veto: "0.1%",
    turnout: "91.2%",
  },
  {
    id: 42,
    title: "Upgrade to SDK v0.50",
    status: "Passed",
    type: "SoftwareUpgrade",
    submitted: "Feb 15, 2026",
    votingEnd: "Mar 1, 2026",
    yes: "95.6%",
    no: "1.2%",
    abstain: "2.8%",
    veto: "0.0%",
    turnout: "88.5%",
  },
  {
    id: 41,
    title: "Reduce Unbonding Period to 14 Days",
    status: "Rejected",
    type: "ParameterChange",
    submitted: "Feb 1, 2026",
    votingEnd: "Feb 15, 2026",
    yes: "31.2%",
    no: "48.9%",
    abstain: "8.4%",
    veto: "5.1%",
    turnout: "93.6%",
  },
  {
    id: 40,
    title: "Signaling: Adopt MEV Protection Module",
    status: "Deposit",
    type: "Text",
    submitted: "Mar 16, 2026",
    votingEnd: "—",
    yes: "—",
    no: "—",
    abstain: "—",
    veto: "—",
    turnout: "—",
  },
];

function VoteBar({ yes, no, veto }: { yes: string; no: string; veto: string }) {
  const yesN = parseFloat(yes);
  const noN = parseFloat(no);
  const vetoN = parseFloat(veto);
  if (isNaN(yesN)) return null;

  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="bg-green-500" style={{ width: `${yesN}%` }} />
      <div className="bg-red-500" style={{ width: `${noN}%` }} />
      <div className="bg-yellow-500" style={{ width: `${vetoN}%` }} />
    </div>
  );
}

export default function ProposalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>

      <div className="space-y-4">
        {proposals.map((p) => (
          <Link key={p.id} href={`/proposals/${p.id}`}>
            <Card className="transition-colors hover:bg-accent/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">#{p.id}</span>
                    <CardTitle className="text-base">{p.title}</CardTitle>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <CardDescription className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1">
                  <span>{p.type}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>Submitted {p.submitted}</span>
                  {p.votingEnd !== "—" && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <span>Voting ends {p.votingEnd}</span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              {p.turnout !== "—" && (
                <CardContent className="pt-0">
                  <VoteBar yes={p.yes} no={p.no} veto={p.veto} />
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span className="text-green-400">Yes {p.yes}</span>
                    <span className="text-red-400">No {p.no}</span>
                    <span>Abstain {p.abstain}</span>
                    <span className="text-yellow-400">Veto {p.veto}</span>
                    <span className="ml-auto">Turnout: {p.turnout}</span>
                  </div>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
