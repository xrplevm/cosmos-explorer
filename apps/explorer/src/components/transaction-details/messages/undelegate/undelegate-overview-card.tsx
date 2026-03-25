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
  formatTokenAmount,
  formatHashMiddle,
  formatTransactionFee,
} from "@/lib/formatters";
import { Timestamp } from "@/components/timestamp";
import { parseJsonIfString } from "@/lib/parse-transaction-raw";
import Link from "next/link";
import type { TransactionDetailViewProps } from "../../types";
import { DetailRow } from "../../shared/detail-row";

interface UndelegateValue {
  delegator_address?: string;
  delegatorAddress?: string;
  validator_address?: string;
  validatorAddress?: string;
  amount?: { denom?: string; amount?: string };
  data?: {
    delegator_address?: string;
    delegatorAddress?: string;
    validator_address?: string;
    validatorAddress?: string;
    amount?: { denom?: string; amount?: string };
  };
}

export function UndelegateOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const parsed = parseJsonIfString(firstMessage?.value) as
    | UndelegateValue
    | null
    | undefined;
  const root = parsed ?? {};
  const data = root.data ?? {};

  const delegator =
    root.delegator_address ?? root.delegatorAddress ??
    data.delegator_address ?? data.delegatorAddress;
  const validator =
    root.validator_address ?? root.validatorAddress ??
    data.validator_address ?? data.validatorAddress;
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
            className="font-mono text-foreground hover:underline"
          >
            #{transaction.height.toLocaleString()}
          </Link>
        </DetailRow>
        <Separator />
        <DetailRow label="Timestamp">
          <Timestamp value={transaction.timestamp} />
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
                  className="min-w-0 flex-1 break-all font-mono text-xs text-foreground hover:underline"
                >
                  {delegator}
                </Link>
                <CopyButton value={delegator} label="delegator address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {validator != null && validator.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Validator">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <span className="min-w-0 flex-1 break-all font-mono text-xs">
                  {validator}
                </span>
                <CopyButton value={validator} label="validator address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {amount != null ? (
          <>
            <Separator />
            <DetailRow label="Amount">
              <span className="font-mono text-xs">
                {formatTokenAmount(amount, token)}
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
