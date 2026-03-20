import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { RevokeOverviewCard } from "./revoke-overview-card";

export function RevokeTransactionDetail(props: TransactionDetailViewProps) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <RevokeOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
