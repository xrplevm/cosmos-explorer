import { TransactionDetailRoot } from "@/components/transaction-details";
import { getChainConfig } from "@/lib/config";
import { getServices } from "@/lib/services";
import { notFound } from "next/navigation";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const chainConfig = getChainConfig();
  const { transactionService } = getServices();
  const transaction = await transactionService.getTransactionByHash(hash);

  if (transaction == null) {
    notFound();
  }

  return (
    <TransactionDetailRoot
      hash={hash}
      transaction={transaction}
      chainConfig={chainConfig}
    />
  );
}
