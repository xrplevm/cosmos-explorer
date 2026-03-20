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

interface CreateVestingAccountValue {
  from_address?: string;
  fromAddress?: string;
  to_address?: string;
  toAddress?: string;
  amount?: { denom?: string; amount?: string }[];
  end_time?: string | number;
  endTime?: string | number;
  delayed?: boolean;
  data?: {
    from_address?: string;
    fromAddress?: string;
    to_address?: string;
    toAddress?: string;
    amount?: { denom?: string; amount?: string }[];
    end_time?: string | number;
    endTime?: string | number;
    delayed?: boolean;
  };
}

export function CreateVestingAccountOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const parsed = parseJsonIfString(firstMessage?.value) as
    | CreateVestingAccountValue
    | null
    | undefined;
  const root = parsed ?? {};
  const data = root.data ?? {};

  const from = root.from_address ?? root.fromAddress ?? data.from_address ?? data.fromAddress;
  const to = root.to_address ?? root.toAddress ?? data.to_address ?? data.toAddress;
  const amounts = root.amount ?? data.amount;
  const endTime = root.end_time ?? root.endTime ?? data.end_time ?? data.endTime;
  const delayed = root.delayed ?? data.delayed;

  const endTimeDisplay = endTime != null
    ? formatTimestamp(typeof endTime === "number" ? new Date(endTime * 1000).toISOString() : String(endTime))
    : null;

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

        {from != null && from.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="From">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(from)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-primary hover:underline"
                >
                  {from}
                </Link>
                <CopyButton value={from} label="from address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {to != null && to.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="To">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(to)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-primary hover:underline"
                >
                  {to}
                </Link>
                <CopyButton value={to} label="to address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {Array.isArray(amounts) && amounts.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Amount">
              <div className="space-y-1">
                {amounts.map((coin, i) => (
                  <div key={i} className="font-mono text-xs">
                    {formatCoinDisplay(coin, token)}
                  </div>
                ))}
              </div>
            </DetailRow>
          </>
        ) : null}

        {endTimeDisplay != null ? (
          <>
            <Separator />
            <DetailRow label="End Time">
              <span>{endTimeDisplay}</span>
            </DetailRow>
          </>
        ) : null}

        {delayed != null ? (
          <>
            <Separator />
            <DetailRow label="Delayed">
              <span>{delayed ? "Yes" : "No"}</span>
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
