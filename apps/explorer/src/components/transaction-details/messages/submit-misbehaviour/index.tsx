import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { SubmitMisbehaviourOverviewCard } from "./submit-misbehaviour-overview-card";

export function SubmitMisbehaviourTransactionDetail(
  props: TransactionDetailViewProps,
) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <SubmitMisbehaviourOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
