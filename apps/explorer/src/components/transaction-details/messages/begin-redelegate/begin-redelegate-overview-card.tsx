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

interface BeginRedelegateValue {
  delegator_address?: string;
  delegatorAddress?: string;
  validator_src_address?: string;
  validatorSrcAddress?: string;
  validator_dst_address?: string;
  validatorDstAddress?: string;
  amount?: { denom?: string; amount?: string };
  data?: {
    delegator_address?: string;
    delegatorAddress?: string;
    validator_src_address?: string;
    validatorSrcAddress?: string;
    validator_dst_address?: string;
    validatorDstAddress?: string;
    amount?: { denom?: string; amount?: string };
  };
}

export function BeginRedelegateOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const parsed = parseJsonIfString(firstMessage?.value) as
    | BeginRedelegateValue
    | null
    | undefined;
  const root = parsed ?? {};
  const data = root.data ?? {};

  const delegator =
    root.delegator_address ?? root.delegatorAddress ??
    data.delegator_address ?? data.delegatorAddress;
  const srcValidator =
    root.validator_src_address ?? root.validatorSrcAddress ??
    data.validator_src_address ?? data.validatorSrcAddress;
  const dstValidator =
    root.validator_dst_address ?? root.validatorDstAddress ??
    data.validator_dst_address ?? data.validatorDstAddress;
  const amount = root.amount ?? data.amount;

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

        {delegator != null && delegator.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Delegator">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(delegator)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-primary hover:underline"
                >
                  {delegator}
                </Link>
                <CopyButton value={delegator} label="delegator address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {srcValidator != null && srcValidator.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Source Validator">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <span className="min-w-0 flex-1 break-all font-mono text-xs">
                  {srcValidator}
                </span>
                <CopyButton value={srcValidator} label="source validator" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {dstValidator != null && dstValidator.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Dest Validator">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <span className="min-w-0 flex-1 break-all font-mono text-xs">
                  {dstValidator}
                </span>
                <CopyButton value={dstValidator} label="dest validator" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {amount != null ? (
          <>
            <Separator />
            <DetailRow label="Amount">
              <span className="font-mono text-xs">
                {formatCoinDisplay(amount, token)}
              </span>
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
