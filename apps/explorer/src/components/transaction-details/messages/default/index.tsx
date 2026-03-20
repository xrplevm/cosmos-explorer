import type { TransactionDetailViewProps } from "../../types";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { TransactionOverviewCard } from "../../shared/transaction-overview-card";

/** Fallback layout for any transaction type without a dedicated variant. */
export function DefaultTransactionDetail(props: TransactionDetailViewProps) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <TransactionOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
