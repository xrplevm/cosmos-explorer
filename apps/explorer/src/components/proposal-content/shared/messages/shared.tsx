import Link from "next/link";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { getTypeColor } from "../message-helpers";

export function MessageBadge({ typeName }: { typeName: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        getTypeColor(typeName),
      )}
    >
      {typeName}
    </span>
  );
}

export function MessageRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function AddressValue({ address, link }: { address: string; link?: boolean }) {
  const truncated = `${address.slice(0, 14)}…${address.slice(-8)}`;
  if (link) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Link
          href={`/account/${encodeURIComponent(address)}`}
          className="font-mono text-primary-soft hover:text-primary transition-colors"
        >
          {truncated}
        </Link>
        <CopyButton value={address} label="address" size="xs" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-mono text-muted-foreground">{truncated}</span>
      <CopyButton value={address} label="address" size="xs" />
    </span>
  );
}

export function ValidatorChip({ moniker, colorClass }: { moniker: string; colorClass: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${colorClass}`}
      >
        {moniker.slice(0, 2).toUpperCase()}
      </span>
      <span className="font-medium text-sm">{moniker}</span>
    </span>
  );
}

export function CoinValue({ coins }: { coins: { denom?: string; amount?: string }[] }) {
  return (
    <span className="font-mono">
      {coins.map((c, i) => (
        <span key={i}>
          {i > 0 && ", "}
          {c.amount ?? "0"} {c.denom ?? ""}
        </span>
      ))}
    </span>
  );
}
