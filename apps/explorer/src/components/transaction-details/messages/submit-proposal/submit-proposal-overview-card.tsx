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
  formatCoinDisplay,
  formatHashMiddle,
  formatTimestamp,
  formatTransactionFee,
} from "@/lib/formatters";
import { parseJsonIfString } from "@/lib/parse-transaction-raw";
import Link from "next/link";
import type { TransactionDetailViewProps } from "../../types";
import { DetailRow } from "../../shared/detail-row";

interface SubmitProposalValue {
  proposer?: string;
  content?: {
    "@type"?: string;
    type?: string;
    title?: string;
  };
  initial_deposit?: { denom?: string; amount?: string }[];
  initialDeposit?: { denom?: string; amount?: string }[];
  title?: string;
  messages?: unknown[];
  data?: {
    proposer?: string;
    content?: {
      "@type"?: string;
      type?: string;
      title?: string;
    };
    initial_deposit?: { denom?: string; amount?: string }[];
    initialDeposit?: { denom?: string; amount?: string }[];
    title?: string;
    messages?: unknown[];
  };
}

function extractProposalType(value: SubmitProposalValue): string | undefined {
  const content = value.content ?? value.data?.content;
  if (content != null) {
    const typeUrl = content["@type"] ?? content.type;
    if (typeof typeUrl === "string" && typeUrl.length > 0) {
      // Extract last segment from type URL like "/cosmos.gov.v1beta1.TextProposal"
      const parts = typeUrl.split(".");
      return parts[parts.length - 1];
    }
  }
  return undefined;
}

function extractTitle(value: SubmitProposalValue): string | undefined {
  // v1beta1: content.title, v1: top-level title
  const content = value.content ?? value.data?.content;
  return value.title ?? value.data?.title ?? content?.title;
}

export function SubmitProposalOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const parsed = parseJsonIfString(firstMessage?.value) as
    | SubmitProposalValue
    | null
    | undefined;
  const root = parsed ?? {};
  const data = root.data ?? {};

  const proposer = root.proposer ?? data.proposer;
  const proposalType = extractProposalType(root);
  const title = extractTitle(root);
  const initialDeposit =
    root.initial_deposit ?? root.initialDeposit ??
    data.initial_deposit ?? data.initialDeposit;

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
            className="font-mono text-foreground hover:underline"
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

        {proposer != null && proposer.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Proposer">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(proposer)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-foreground hover:underline"
                >
                  {proposer}
                </Link>
                <CopyButton value={proposer} label="proposer address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {proposalType != null ? (
          <>
            <Separator />
            <DetailRow label="Proposal Type">
              <span>{proposalType}</span>
            </DetailRow>
          </>
        ) : null}

        {title != null && title.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Title">
              <span>{title}</span>
            </DetailRow>
          </>
        ) : null}

        {Array.isArray(initialDeposit) && initialDeposit.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Initial Deposit">
              <div className="space-y-1">
                {initialDeposit.map((coin, i) => (
                  <div key={i} className="font-mono text-xs">
                    {formatCoinDisplay(coin, token)}
                  </div>
                ))}
              </div>
            </DetailRow>
          </>
        ) : null}

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
