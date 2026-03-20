import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { UpdateParamsOverviewCard } from "./update-params-overview-card";

export function UpdateParamsTransactionDetail(props: TransactionDetailViewProps) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <UpdateParamsOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
