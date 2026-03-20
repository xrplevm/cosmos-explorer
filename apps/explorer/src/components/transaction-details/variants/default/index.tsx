import type { TransactionDetailViewProps } from "../../types";
import { TransactionDetailShell } from "../../shared/transaction-detail-shell";

/** Fallback layout for any transaction type without a dedicated variant. */
export function DefaultTransactionDetail(props: TransactionDetailViewProps) {
  return <TransactionDetailShell {...props} />;
}
