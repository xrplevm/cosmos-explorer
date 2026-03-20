import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { UpdateClientOverviewCard } from "./update-client-overview-card";

export function UpdateClientTransactionDetail(
  props: TransactionDetailViewProps,
) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <UpdateClientOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
