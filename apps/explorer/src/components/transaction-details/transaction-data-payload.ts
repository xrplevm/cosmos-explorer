import type { TransactionDetail } from "@cosmos-explorer/core";
import type { TransactionDataTabsPayload } from "./types";

export function transactionDetailToDataPayload(
  transaction: TransactionDetail,
): TransactionDataTabsPayload {
  return {
    messages: transaction.messages,
    logs: transaction.logs,
    error: transaction.error,
  };
}
