import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailHeader } from "../../shared/transaction-detail-header";
import { EthereumOverviewCard } from "./ethereum-overview-card";
import { EthereumTransactionDataSection } from "./ethereum-transaction-data-section";

export function EthereumTransactionDetail(props: TransactionDetailViewProps) {
  return (
    <div className="space-y-6">
      <TransactionDetailHeader />
      <EthereumOverviewCard {...props} />
      <EthereumTransactionDataSection
        transaction={props.transaction}
        chainConfig={props.chainConfig}
      />
    </div>
  );
}
