import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Separator } from "@cosmos-explorer/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { Badge } from "@cosmos-explorer/ui/badge";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import { DetailBackButton } from "@/components/detail-back-button";
import { StatusBadge } from "@/components/status-badge";
import {
  formatHash,
  formatTokenAmount,
  formatTimestamp,
} from "@/lib/formatters";
import { getServices } from "@/lib/services";
import Link from "next/link";

function sumPrimaryAmounts(values: (string | null | undefined)[]): string {
  const total = values.reduce((sum, value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? sum + parsed : sum;
  }, 0);

  return total.toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const { accountService } = getServices();
  const account = await accountService.getAccountByAddress(address);
  const rewardTotal = sumPrimaryAmounts(
    account.rewards.map((reward) => reward.amount?.amount),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <DetailBackButton href="/" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground break-all">
            {account.address}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balances</CardDescription>
            <CardTitle className="text-2xl">
              {account.balances.length.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tracked token balances
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Delegated</CardDescription>
            <CardTitle className="text-2xl">
              {formatTokenAmount(account.delegationBalance, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {account.delegations.length.toLocaleString()} validator entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rewards</CardDescription>
            <CardTitle className="text-2xl">
              {account.rewards.length === 0
                ? "N/A"
                : `${rewardTotal} ${account.rewards[0]?.amount?.denom ?? ""}`.trim()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Unclaimed delegation rewards
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
              Withdraw Address
            </span>
            <div className="text-sm font-mono break-all">
              {account.withdrawalAddress ?? "N/A"}
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
              Unbonding
            </span>
            <div className="text-sm">
              {formatTokenAmount(account.unbondingBalance, 0)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          {account.balances.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No balances found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.balances.map((balance) => (
                    <TableRow key={`${balance.denom}-${balance.amount}`}>
                      <TableCell className="font-medium">
                        {balance.denom}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatTokenAmount(balance, 6)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delegations</CardTitle>
        </CardHeader>
        <CardContent>
          {account.delegations.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No delegations found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Validator</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">
                      Pending Rewards
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.delegations.map((delegation) => {
                    const reward = account.rewards.find(
                      (item) =>
                        item.validatorAddress === delegation.validatorAddress,
                    );

                    return (
                      <TableRow key={delegation.validatorAddress}>
                        <TableCell>
                          <Link
                            href={`/validators/${delegation.validatorAddress}`}
                            className="text-foreground hover:underline"
                          >
                            {delegation.validatorAddress}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatTokenAmount(delegation.amount, 0)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-green-400">
                          {formatTokenAmount(reward?.amount, 6)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {account.transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No transactions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Height</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account.transactions.map((transaction) => (
                    <TableRow key={transaction.hash}>
                      <TableCell className="font-mono text-xs">
                        <Link
                          href={`/transactions/${transaction.hash}`}
                          className="text-foreground hover:underline"
                        >
                          {formatHash(transaction.hash)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.type === "EthereumTx" && (
                            <IconCurrencyEthereum className="h-3.5 w-3.5" />
                          )}
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={transaction.success ? "Success" : "Failed"}
                        />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {transaction.height.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatTimestamp(transaction.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
