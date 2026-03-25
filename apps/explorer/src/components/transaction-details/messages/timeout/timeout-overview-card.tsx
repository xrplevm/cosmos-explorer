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
  formatTransactionFee,
} from "@/lib/formatters";
import { parseJsonIfString } from "@/lib/parse-transaction-raw";
import Link from "next/link";
import type { TransactionDetailViewProps } from "../../types";
import { DetailRow } from "../../shared/detail-row";
import { Timestamp } from "@/components/timestamp";

interface PacketShape {
  source_port?: string;
  sourcePort?: string;
  source_channel?: string;
  sourceChannel?: string;
  sequence?: string | number;
}

interface TimeoutValue {
  signer?: string;
  packet?: PacketShape;
  data?: { signer?: string; packet?: PacketShape };
}

export function TimeoutOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const parsed = parseJsonIfString(firstMessage?.value) as
    | TimeoutValue
    | null
    | undefined;
  const root = parsed ?? {};
  const data = root.data ?? {};

  const signer = root.signer ?? data.signer;
  const packet = root.packet ?? data.packet;
  const srcPort = packet?.source_port ?? packet?.sourcePort;
  const srcChannel = packet?.source_channel ?? packet?.sourceChannel;
  const sequence = packet?.sequence;

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

        {signer != null && signer.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Signer">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(signer)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-foreground hover:underline"
                >
                  {signer}
                </Link>
                <CopyButton value={signer} label="signer address" size="xs" />
              </div>
            </DetailRow>
          </>
        ) : null}

        {srcPort != null ? (
          <>
            <Separator />
            <DetailRow label="Source Port">
              <span className="font-mono text-xs">{srcPort}</span>
            </DetailRow>
          </>
        ) : null}

        {srcChannel != null ? (
          <>
            <Separator />
            <DetailRow label="Source Channel">
              <span className="font-mono text-xs">{srcChannel}</span>
            </DetailRow>
          </>
        ) : null}

        {sequence != null ? (
          <>
            <Separator />
            <DetailRow label="Sequence">
              <span className="font-mono text-xs">{String(sequence)}</span>
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
