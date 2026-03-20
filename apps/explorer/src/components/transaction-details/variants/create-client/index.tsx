import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { CreateClientOverviewCard } from "./create-client-overview-card";

export function CreateClientTransactionDetail(
  props: TransactionDetailViewProps,
) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <CreateClientOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
