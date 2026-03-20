import type { TransactionDetailViewProps } from "../types";
import { TransactionDataJsonTabs } from "../transaction-data-json-tabs";
import { transactionDetailToDataPayload } from "../transaction-data-payload";
import { TransactionDataSection } from "./transaction-data-section";

/** Default composition: card + title + standard JSON/raw tabs. */
export function DefaultTransactionDataSection({
  transaction,
}: Pick<TransactionDetailViewProps, "transaction">) {
  return (
    <TransactionDataSection.Root>
      <TransactionDataSection.Header>
        <TransactionDataSection.Title />
      </TransactionDataSection.Header>
      <TransactionDataSection.Content>
        <TransactionDataJsonTabs
          payload={transactionDetailToDataPayload(transaction)}
        />
      </TransactionDataSection.Content>
    </TransactionDataSection.Root>
  );
}
