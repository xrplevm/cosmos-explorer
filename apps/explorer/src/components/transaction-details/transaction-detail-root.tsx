import type { TransactionDetailViewProps } from "./types";
import { getPrimaryMessageType } from "./types";
import { DefaultTransactionDetail } from "./variants/default";
import { EthereumTransactionDetail } from "./variants/ethereum";

/**
 * Dispatches to a type-specific detail view. Add a `case` and import from `./variants/<type>`.
 */
export function TransactionDetailRoot(props: TransactionDetailViewProps) {
  const type = getPrimaryMessageType(props.transaction);

  switch (type) {
    case "EthereumTx":
      return <EthereumTransactionDetail {...props} />;
    default:
      return <DefaultTransactionDetail {...props} />;
  }
}
