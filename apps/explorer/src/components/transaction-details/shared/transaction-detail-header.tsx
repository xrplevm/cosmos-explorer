import { DetailBackButton } from "@/components/detail-back-button";

export function TransactionDetailHeader({
  title = "Transaction Details",
}: {
  title?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <DetailBackButton href="/transactions" />
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-bold tracking-tight sm:text-2xl">{title}</h1>
      </div>
    </div>
  );
}
