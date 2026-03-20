import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Separator } from "@cosmos-explorer/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import {
  formatHashMiddle,
  formatTimestamp,
  formatTransactionFee,
} from "@/lib/formatters";
import { parseJsonIfString } from "@/lib/parse-transaction-raw";
import Link from "next/link";
import type { TransactionDetailViewProps } from "../../types";
import { DetailRow } from "../../shared/detail-row";

interface VoteValue {
  voter?: string;
  proposal_id?: string;
  proposalId?: string;
  option?: string | number;
  data?: {
    voter?: string;
    proposal_id?: string;
    proposalId?: string;
    option?: string | number;
  };
}

const VOTE_OPTIONS: Record<string, string> = {
  "1": "Yes",
  "2": "Abstain",
  "3": "No",
  "4": "No with Veto",
  VOTE_OPTION_YES: "Yes",
  VOTE_OPTION_ABSTAIN: "Abstain",
  VOTE_OPTION_NO: "No",
  VOTE_OPTION_NO_WITH_VETO: "No with Veto",
};

function humanVoteOption(option: string | number | undefined): string {
  if (option == null) return "Unknown";
  const key = String(option);
  return VOTE_OPTIONS[key] ?? key;
}

export function VoteOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const parsed = parseJsonIfString(firstMessage?.value) as
    | VoteValue
    | null
    | undefined;
  const root = parsed ?? {};
  const data = root.data ?? {};

  const voter = root.voter ?? data.voter;
  const proposalId = root.proposal_id ?? root.proposalId ?? data.proposal_id ?? data.proposalId;
  const option = root.option ?? data.option;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <DetailRow label="Cosmos hash">
          <div className="flex min-w-0 flex-nowrap items-center gap-2">
            <span className="min-w-0 flex-1 font-mono text-xs md:hidden">
              {formatHashMiddle(hash, 8, 8)}
            </span>
            <span className="hidden min-w-0 flex-1 break-all font-mono text-xs md:block">
              {hash}
            </span>
            <CopyButton value={hash} label="cosmos hash" size="xs" />
          </div>
        </DetailRow>
        <Separator />
        <DetailRow label="Status">
          <StatusBadge status={transaction.success ? "Success" : "Failed"} />
        </DetailRow>
        <Separator />
        <DetailRow label="Block">
          <Link
            href={`/blocks/${String(transaction.height)}`}
            className="font-mono text-primary hover:underline"
          >
            #{transaction.height.toLocaleString()}
          </Link>
        </DetailRow>
        <Separator />
        <DetailRow label="Timestamp">
          <span>{formatTimestamp(transaction.timestamp)}</span>
        </DetailRow>
        <Separator />
        <DetailRow label="Type">
          <span>{transaction.messages[0]?.type ?? "Unknown"}</span>
        </DetailRow>

        {voter != null && voter.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Voter">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(voter)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-primary hover:underline"
                >
                  {voter}
                </Link>
                <CopyButton value={voter} label="voter address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {proposalId != null ? (
          <>
            <Separator />
            <DetailRow label="Proposal">
              <Link
                href={`/proposals/${proposalId}`}
                className="font-mono text-primary hover:underline"
              >
                #{proposalId}
              </Link>
            </DetailRow>
          </>
        ) : null}

        <Separator />
        <DetailRow label="Vote Option">
          <span>{humanVoteOption(option)}</span>
        </DetailRow>

        <Separator />
        <DetailRow label="Fee">
          <span className="font-mono text-xs break-all">
            {formatTransactionFee(transaction.fee, token)}
          </span>
        </DetailRow>
        <Separator />
        <DetailRow label="Gas Used / Wanted">
          <span className="font-mono">
            {transaction.gasUsed.toLocaleString()} /{" "}
            {transaction.gasWanted.toLocaleString()}{" "}
            ({transaction.gasWanted > 0
              ? ((transaction.gasUsed / transaction.gasWanted) * 100).toFixed(2)
              : "0.00"}%)
          </span>
        </DetailRow>
        <Separator />
        <DetailRow label="Memo">
          <span className="text-muted-foreground italic">
            {transaction.memo || "No memo"}
          </span>
        </DetailRow>
      </CardContent>
    </Card>
  );
}
