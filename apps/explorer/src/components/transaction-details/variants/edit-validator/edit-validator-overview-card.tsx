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

interface EditValidatorValue {
  validator_address?: string;
  validatorAddress?: string;
  description?: {
    moniker?: string;
    identity?: string;
    website?: string;
    details?: string;
  };
  commission_rate?: string;
  commissionRate?: string;
  min_self_delegation?: string;
  minSelfDelegation?: string;
  data?: {
    validator_address?: string;
    validatorAddress?: string;
    description?: {
      moniker?: string;
      identity?: string;
      website?: string;
      details?: string;
    };
    commission_rate?: string;
    commissionRate?: string;
    min_self_delegation?: string;
    minSelfDelegation?: string;
  };
}

export function EditValidatorOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const parsed = parseJsonIfString(firstMessage?.value) as
    | EditValidatorValue
    | null
    | undefined;
  const root = parsed ?? {};
  const data = root.data ?? {};

  const validator =
    root.validator_address ?? root.validatorAddress ??
    data.validator_address ?? data.validatorAddress;
  const description = root.description ?? data.description;
  const commissionRate =
    root.commission_rate ?? root.commissionRate ??
    data.commission_rate ?? data.commissionRate;
  const minSelfDelegation =
    root.min_self_delegation ?? root.minSelfDelegation ??
    data.min_self_delegation ?? data.minSelfDelegation;

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

        {description?.moniker != null && description.moniker.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Moniker">
              <span>{description.moniker}</span>
            </DetailRow>
          </>
        ) : null}

        {description?.website != null && description.website.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Website">
              <span className="break-all text-xs">{description.website}</span>
            </DetailRow>
          </>
        ) : null}

        {commissionRate != null ? (
          <>
            <Separator />
            <DetailRow label="Commission Rate">
              <span className="font-mono text-xs">{commissionRate}</span>
            </DetailRow>
          </>
        ) : null}

        {minSelfDelegation != null ? (
          <>
            <Separator />
            <DetailRow label="Min Self Delegation">
              <span className="font-mono text-xs">{minSelfDelegation}</span>
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
