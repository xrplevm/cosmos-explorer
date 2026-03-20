import type { ChainConfig } from "@cosmos-explorer/config";
import type { Message, TransactionDetail } from "@cosmos-explorer/core";

/** Wire payload for the transaction JSON / raw tabs. */
export interface TransactionDataTabsPayload {
  messages: Message[];
  logs: unknown;
  error: string;
}

export interface TransactionDetailViewProps {
  hash: string;
  transaction: TransactionDetail;
  chainConfig: ChainConfig;
}

/** Primary message `type` used to pick a detail variant (short name from adapter). */
export function getPrimaryMessageType(
  transaction: TransactionDetail,
): string {
  return transaction.messages[0]?.type ?? "";
}
