import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { Separator } from "@cosmos-explorer/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cosmos-explorer/ui/table";
import { DetailBackButton } from "@/components/detail-back-button";
import {
  formatCoinTotal,
  formatTokenAmount,
} from "@/lib/formatters";
import { getChainConfig } from "@/lib/config";
import {
  getCachedAccountOverview,
  getServices,
} from "@/lib/services";
import { bech32 } from "bech32";
import { buildPageMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ACCOUNT_ACTIVITY_PAGE_SIZE } from "@/components/account-activity";
import { AccountActivitySkeleton } from "@/components/account-activity-list";
import { AccountMessagesCard } from "@/components/account-messages-card";
import { AccountTransactionsCard } from "@/components/account-transactions-card";
import {
  AccountActivityTabs,
  type AccountTab,
} from "@/components/account-activity-tabs";

// A sane upper bound; the count-based pager caps reachable pages well below it.
const MAX_PAGE = 100_000_000;

function parsePage(value: string | string[] | undefined): number {
  const page = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }
  return Math.min(page, MAX_PAGE);
}

function buildQuery(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string") {
      params.set(key, first);
    }
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}): Promise<Metadata> {
  const { address } = await params;
  const shortAddress = address.length > 20
    ? `${address.slice(0, 10)}...${address.slice(-8)}`
    : address;
  return buildPageMetadata({
    title: `Account ${shortAddress}`,
    description: `Account details and transaction history for ${address} on the XRPL EVM Sidechain.`,
    path: `/account/${address}`,
  });
}

function toAccountAddress(address: string, prefix: string): string {
  try {
    // Re-encoding also lowercases: bech32 accepts an all-uppercase address,
    // whose prefix decodes as lowercase and so already looks canonical.
    return bech32.encode(prefix, bech32.decode(address).words);
  } catch {
    // not a valid bech32 address, return as-is
  }
  return address;
}

export default async function AccountDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const config = getChainConfig();
  const { address: rawAddress } = await params;
  const address = toAccountAddress(rawAddress, config.network.bech32Prefix);
  const sp = await searchParams;

  if (address !== rawAddress) {
    redirect(`/account/${encodeURIComponent(address)}${buildQuery(sp)}`);
  }

  const activeTab: AccountTab =
    sp.tab === "transactions" ? "transactions" : "messages";
  const activePage = parsePage(
    activeTab === "messages" ? sp.msgPage : sp.txPage,
  );
  const offset = (activePage - 1) * ACCOUNT_ACTIVITY_PAGE_SIZE;

  const primaryToken = config.network.primaryToken;
  const stakingToken = config.network.stakingToken;
  const { accountService } = getServices();

  // Only the active tab is fetched, before the account await for concurrency;
  // the bounded count is fetched inline.
  const messagesPromise =
    activeTab === "messages"
      ? accountService.getAccountMessages(address, {
          limit: ACCOUNT_ACTIVITY_PAGE_SIZE,
          offset,
        })
      : undefined;
  const transactionsPromise =
    activeTab === "transactions"
      ? accountService.getAccountTransactions(address, {
          limit: ACCOUNT_ACTIVITY_PAGE_SIZE,
          offset,
        })
      : undefined;
  const countPromise =
    activeTab === "messages"
      ? accountService.getAccountMessageCount(address)
      : accountService.getAccountTransactionCount(address);
  // Prevents an unhandled-rejection warning if the account fetch below fails first.
  messagesPromise?.catch(() => undefined);
  transactionsPromise?.catch(() => undefined);
  countPromise.catch(() => undefined);
  const account = await getCachedAccountOverview(address);

  const rewardTotal = formatCoinTotal(
    account.rewards.map((reward) => reward.amount),
    primaryToken,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <DetailBackButton href="/" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-tight sm:text-2xl">Account</h1>
          <div className="mt-1 flex items-center gap-1">
            <p className="font-mono text-sm text-muted-foreground break-all">
              {account.address}
            </p>
            <CopyButton value={account.address} label="address" size="xs" />
          </div>
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
              {formatTokenAmount(account.delegationBalance, stakingToken)}
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
              {account.rewards.length === 0 ? "N/A" : rewardTotal}
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
            <div className="flex items-center gap-1 text-sm font-mono break-all">
              {account.withdrawalAddress ?? "N/A"}
              {account.withdrawalAddress && (
                <CopyButton value={account.withdrawalAddress} label="withdraw address" size="xs" />
              )}
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="sm:w-40 sm:shrink-0 text-sm text-muted-foreground">
              Unbonding
            </span>
            <div className="text-sm">
              {formatTokenAmount(account.unbondingBalance, stakingToken)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <AccountActivityTabs
            activeTab={activeTab}
            basePath={`/account/${encodeURIComponent(address)}`}
          />
        </CardHeader>
        <CardContent>
          {/* Keyed on tab+page so each navigation re-shows the skeleton. */}
          <Suspense
            key={`${activeTab}-${String(activePage)}`}
            fallback={<AccountActivitySkeleton />}
          >
            {messagesPromise ? (
              <AccountMessagesCard
                messagesPromise={messagesPromise}
                countPromise={countPromise}
                page={activePage}
              />
            ) : transactionsPromise ? (
              <AccountTransactionsCard
                transactionsPromise={transactionsPromise}
                countPromise={countPromise}
                page={activePage}
              />
            ) : null}
          </Suspense>
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
                        {balance.denom === primaryToken.denom
                          ? primaryToken.displayDenom
                          : balance.denom}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatTokenAmount(balance, primaryToken)}
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
                            className="text-primary-soft hover:text-primary transition-colors"
                          >
                            {delegation.validatorAddress}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatTokenAmount(delegation.amount, stakingToken)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-green-400">
                          {formatTokenAmount(reward?.amount, primaryToken)}
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

    </div>
  );
}
