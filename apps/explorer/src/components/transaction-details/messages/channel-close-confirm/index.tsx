import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { ChannelCloseConfirmOverviewCard } from "./channel-close-confirm-overview-card";

export function ChannelCloseConfirmTransactionDetail(props: TransactionDetailViewProps) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <ChannelCloseConfirmOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
