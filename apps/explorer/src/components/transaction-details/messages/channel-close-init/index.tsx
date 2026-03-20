import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { DefaultTransactionDataSection } from "../../shared/default-transaction-data-section";
import { ChannelCloseInitOverviewCard } from "./channel-close-init-overview-card";

export function ChannelCloseInitTransactionDetail(props: TransactionDetailViewProps) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <ChannelCloseInitOverviewCard {...props} />
      <DefaultTransactionDataSection transaction={props.transaction} />
    </div>
  );
}
