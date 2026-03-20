import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { UpgradeClientOverviewCard } from "./upgrade-client-overview-card";

export function UpgradeClientTransactionDetail(
  props: TransactionDetailViewProps,
) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <UpgradeClientOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
