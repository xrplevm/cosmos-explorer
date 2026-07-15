import type { TransactionSummary } from "@cosmos-explorer/core";
import { AccountActivityList } from "@/components/account-activity-list";
import {
  activityPageCount,
  formatActivityCount,
} from "@/components/account-activity";

export async function AccountTransactionsCard({
  transactionsPromise,
  countPromise,
  page,
}: {
  transactionsPromise: Promise<TransactionSummary[]>;
  countPromise: Promise<number>;
  page: number;
}) {
  const [transactions, count] = await Promise.all([
    transactionsPromise.catch(() => null),
    countPromise.catch(() => null),
  ]);

  if (!transactions) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Couldn&apos;t load transactions for this account. Please try again later.
      </p>
    );
  }

  const rows = transactions.map((tx) => ({
    key: tx.hash,
    hash: tx.hash,
    type: tx.type,
    isEthereum: tx.type === "EthereumTx",
    success: tx.success,
    height: tx.height,
    timestamp: tx.timestamp,
  }));

  return (
    <>
      {count !== null && (
        <p className="mb-3 text-sm text-muted-foreground">
          {formatActivityCount(count, "transaction")}
        </p>
      )}
      <AccountActivityList
        rows={rows}
        page={page}
        pageCount={count === null ? null : activityPageCount(count)}
        pageParam="txPage"
        emptyLabel="No transactions found."
        paginationLabel="Transactions pagination"
      />
    </>
  );
}
