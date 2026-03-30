import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Skeleton } from "@cosmos-explorer/ui/skeleton";
import { getServices } from "@/lib/services";
import { getChainConfig } from "@/lib/config";
import { formatTokenAmount, formatTimestamp } from "@/lib/formatters";

interface ProposalDepositsCardProps {
  proposalId: number;
}

export function ProposalDepositsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Depositor</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3">
                    <Skeleton className="h-3.5 w-64" />
                  </td>
                  <td className="py-3">
                    <Skeleton className="h-3.5 w-24" />
                  </td>
                  <td className="py-3 flex justify-end">
                    <Skeleton className="h-3.5 w-28" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export async function ProposalDepositsCard({ proposalId }: ProposalDepositsCardProps) {
  const { proposalService } = getServices();
  const { network: { primaryToken } } = getChainConfig();

  const deposits = await proposalService.getProposalDeposits(proposalId);

  if (deposits.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Depositor</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/account/${encodeURIComponent(deposit.depositorAddress)}`}
                        className="break-all font-mono text-xs text-primary-soft hover:text-primary transition-colors"
                      >
                        {deposit.depositorAddress}
                      </Link>
                      <CopyButton value={deposit.depositorAddress} label="depositor address" size="xs" />
                    </div>
                  </td>
                  <td className="py-3 font-mono text-xs">
                    {deposit.amount.map((coin) => formatTokenAmount(coin, primaryToken)).join(", ") || "—"}
                  </td>
                  <td className="py-3 text-right text-xs text-muted-foreground">
                    {formatTimestamp(deposit.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
