import type { TransactionDetailViewProps } from "../types";
import { DefaultTransactionDataSection } from "./default-transaction-data-section";
import { TransactionDetailHeader } from "./transaction-detail-header";
import { TransactionOverviewCard } from "./transaction-overview-card";

/** Shared header + overview + JSON viewer; override in type-specific components when needed. */
export function TransactionDetailShell(props: TransactionDetailViewProps) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <TransactionOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
