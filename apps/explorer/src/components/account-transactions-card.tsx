import type { TransactionSummary } from "@cosmos-explorer/core";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { AccountTransactionsList } from "@/components/account-transactions-list";

export const ACCOUNT_TX_WINDOW = 100;
const ACCOUNT_TX_PAGE_SIZE = 10;

export async function AccountTransactionsCard({
  transactionsPromise,
}: {
  transactionsPromise: Promise<TransactionSummary[]>;
}) {
  let transactions;
  try {
    transactions = await transactionsPromise;
  } catch {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-destructive">
            Couldn&apos;t load transactions for this account. Please try again
            later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <AccountTransactionsList
          transactions={transactions}
          pageSize={ACCOUNT_TX_PAGE_SIZE}
        />
      </CardContent>
    </Card>
  );
}

export function AccountTransactionsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
