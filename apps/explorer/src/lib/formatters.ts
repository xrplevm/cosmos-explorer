import type { TokenAmount } from "@cosmos-explorer/core";

export function formatTimestamp(value: string | null | undefined): string {
  if (value == null || value.length === 0) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export function formatBlockTime(value: number | null): string {
  return value == null ? "N/A" : `${value.toFixed(2)}s`;
}

export function formatPrice(value: number | null | undefined): string {
  return value == null ? "N/A" : `$${value.toFixed(4)}`;
}

export function formatNumber(value: number | null | undefined): string {
  return value == null ? "N/A" : value.toLocaleString();
}

export function formatPercent(
  value: number | null | undefined,
  fractionDigits = 2
): string {
  return value == null ? "N/A" : `${value.toFixed(fractionDigits)}%`;
}

export function formatTokenAmount(
  value: TokenAmount | null | undefined,
  fractionDigits = 2
): string {
  if (value == null) {
    return "N/A";
  }

  const amount = Number(value.amount);

  if (!Number.isFinite(amount)) {
    return `${value.amount} ${value.denom}`;
  }

  return `${amount.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  })} ${value.denom}`;
}

export function formatHash(hash: string): string {
  if (hash.length <= 14) {
    return hash;
  }

  return `${hash.slice(0, 6)}...${hash.slice(-5)}`;
}

export function formatRelativeTime(value: string | null | undefined): string {
  if (value == null || value.length === 0) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
