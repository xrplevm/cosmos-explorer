import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Separator } from "@cosmos-explorer/ui/separator";
import { Badge } from "@cosmos-explorer/ui/badge";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import { StatusBadge } from "@/components/status-badge";
import { decodeEthereumMessage } from "@/lib/ethereum-message-decode";
import {
  formatHashMiddle,
  formatTimestamp,
  formatTransactionFee,
} from "@/lib/formatters";
import Link from "next/link";
import type { TransactionDetailViewProps } from "../../types";
import { DetailRow } from "../../shared/detail-row";

export function EthereumOverviewCard({
  hash,
  transaction,
  chainConfig,
}: TransactionDetailViewProps) {
  const token = chainConfig.network.primaryToken;
  const firstMessage = transaction.messages.at(0);
  const decoded =
    firstMessage === undefined
      ? null
      : decodeEthereumMessage(firstMessage, {
          primaryTokenExponent: token.exponent,
          primaryTokenDisplayDenom: token.displayDenom,
        });

  const evmExplorerBase = chainConfig.network.endpoints.evmExplorer?.replace(
    /\/$/,
    "",
  );
  const evmExplorerTxHref =
    evmExplorerBase != null &&
    evmExplorerBase.length > 0 &&
    decoded?.evmTxHash != null &&
    decoded.evmTxHash.length > 0
      ? `${evmExplorerBase}/tx/${decoded.evmTxHash}`
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>EVM overview</CardTitle>
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

        {decoded?.evmTxHash != null && decoded.evmTxHash.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Tx hash">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 break-all font-mono text-xs">
                  {decoded.evmTxHash}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <CopyButton
                    value={decoded.evmTxHash}
                    label="EVM tx hash"
                    size="xs"
                  />
                  {evmExplorerTxHref != null ? (
                    <a
                      href={evmExplorerTxHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground hover:underline"
                    >
                      View on EVM explorer
                    </a>
                  ) : null}
                </div>
              </div>
            </DetailRow>
          </>
        ) : null}

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
          <Badge variant="outline">
            <IconCurrencyEthereum className="h-3.5 w-3.5" />
            EthereumTx
          </Badge>
        </DetailRow>

        {decoded?.from != null && decoded.from.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="From">
              <div className="flex min-w-0 flex-nowrap items-center gap-2">
                <Link
                  href={`/account/${encodeURIComponent(decoded.from)}`}
                  className="min-w-0 flex-1 break-all font-mono text-xs text-foreground hover:underline"
                >
                  {decoded.from}
                </Link>
                <CopyButton
                  value={decoded.from}
                  label="from address"
                  size="xs"
                />
              </div>
            </DetailRow>
          </>
        ) : null}

        {decoded != null ? (
          <>
            <Separator />
            <DetailRow label="To">
              {decoded.to === null ? (
                <span className="text-muted-foreground">Contract creation</span>
              ) : decoded.to != null && decoded.to.length > 0 ? (
                <div className="flex min-w-0 flex-nowrap items-center gap-2">
                  <Link
                    href={`/account/${encodeURIComponent(decoded.to)}`}
                    className="min-w-0 flex-1 break-all font-mono text-xs text-foreground hover:underline"
                  >
                    {decoded.to}
                  </Link>
                  <CopyButton
                    value={decoded.to}
                    label="to address"
                    size="xs"
                  />
                </div>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </DetailRow>
          </>
        ) : null}

        {decoded?.amountDisplay != null && decoded.amountDisplay.length > 0 ? (
          <>
            <Separator />
            <DetailRow label="Amount">
              <span className="font-mono text-xs">{decoded.amountDisplay}</span>
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
        <DetailRow label="Gas used / wanted">
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
