import { getEvmTxHashFromMessage } from "@/lib/ethereum-message-decode";
import type { TransactionDetailViewProps } from "../../types";
import { TransactionDataJsonTabs } from "../../transaction-data-json-tabs";
import { transactionDetailToDataPayload } from "../../transaction-data-payload";
import { TransactionDataSection } from "../../shared/transaction-data-section";

/** Ethereum composition: same tabs as default, plus optional EVM explorer action in the header. */
export function EthereumTransactionDataSection({
  transaction,
  chainConfig,
}: Pick<TransactionDetailViewProps, "transaction" | "chainConfig">) {
  const primary = transaction.messages[0];
  const evmTxHash = getEvmTxHashFromMessage(primary);
  const base = chainConfig.network.endpoints.evmExplorer?.replace(/\/$/, "");
  const evmHref =
    base != null &&
    base.length > 0 &&
    evmTxHash != null &&
    evmTxHash.length > 0
      ? `${base}/tx/${evmTxHash}`
      : null;

  return (
    <TransactionDataSection.Root>
      <TransactionDataSection.Header>
        <TransactionDataSection.Title />
        {evmHref != null ? (
          <TransactionDataSection.Actions>
            <a
              href={evmHref}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary-soft hover:text-primary transition-colors"
            >
              View on EVM explorer
            </a>
          </TransactionDataSection.Actions>
        ) : null}
      </TransactionDataSection.Header>
      <TransactionDataSection.Content>
        <TransactionDataJsonTabs
          payload={transactionDetailToDataPayload(transaction)}
        />
      </TransactionDataSection.Content>
    </TransactionDataSection.Root>
  );
}
