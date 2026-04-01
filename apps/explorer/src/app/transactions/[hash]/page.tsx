import type { Metadata } from "next";
import { TransactionDetailRoot } from "@/components/transaction-details";
import { getChainConfig } from "@/lib/config";
import { getServices } from "@/lib/services";
import { buildPageMetadata, getBaseUrl } from "@/lib/metadata";
import { JsonLd } from "@/components/json-ld";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>;
}): Promise<Metadata> {
  const { hash } = await params;
  const shortHash = hash.length > 16 ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash;
  return buildPageMetadata({
    title: `Tx ${shortHash}`,
    description: `Transaction details for ${hash} on the XRPL EVM Sidechain.`,
    path: `/transactions/${hash}`,
  });
}

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
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: `Transaction ${hash}`,
          description: `Transaction ${hash} on the XRPL EVM Sidechain at block #${transaction.height}.`,
          url: `${getBaseUrl()}/transactions/${hash}`,
          dateCreated: transaction.timestamp,
        }}
      />
      <TransactionDetailRoot
        hash={hash}
        transaction={transaction}
        chainConfig={chainConfig}
      />
    </>
  );
}
