import type { ChainConfig } from "@cosmos-explorer/config";

function parseFeePayload(
  fee: unknown,
): { amount?: unknown[]; gas_limit?: unknown } | null {
  if (fee == null) {
    return null;
  }

  if (typeof fee === "string") {
    try {
      const parsed: unknown = JSON.parse(fee);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as { amount?: unknown[]; gas_limit?: unknown };
      }
      return null;
    } catch {
      return null;
    }
  }

  if (typeof fee === "object") {
    return fee as { amount?: unknown[]; gas_limit?: unknown };
  }

  return null;
}

function normalizeFeeCoin(
  coin: unknown,
): { denom: string; amount: string } | null {
  if (coin == null || typeof coin !== "object") {
    return null;
  }

  const c = coin as { denom?: unknown; amount?: unknown };

  if (typeof c.denom !== "string" || c.denom.length === 0) {
    return null;
  }

  if (typeof c.amount === "string") {
    return { denom: c.denom, amount: c.amount };
  }

  if (typeof c.amount === "number" && Number.isFinite(c.amount)) {
    return { denom: c.denom, amount: String(Math.trunc(c.amount)) };
  }

  return null;
}

/**
 * Formats Cosmos SDK `StdFee` JSON (including EVM / MsgEthereumTx txs) for display.
 * Primary chain token amounts are shown in display units (e.g. XRP) using `exponent`.
 */
export function formatTransactionFee(
  fee: unknown,
  primaryToken: ChainConfig["network"]["primaryToken"],
): string {
  const payload = parseFeePayload(fee);
  if (payload == null) {
    return "N/A";
  }

  const amounts = Array.isArray(payload.amount) ? payload.amount : [];
  const parts = amounts
    .map((coin) => normalizeFeeCoin(coin))
    .filter((c): c is { denom: string; amount: string } => c != null)
    .map(({ denom, amount }) => formatTokenAmount({ denom, amount }, primaryToken, 8));

  return parts.length > 0 ? parts.join(", ") : "N/A";
}

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
  return value == null
    ? "N/A"
    : "$" +
        value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        });
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

/**
 * Formats a token amount for display.
 * When `primaryToken` is provided and the denom matches, converts from base units
 * (e.g. axrp) to display units (e.g. XRP) using the configured exponent.
 */
export function formatTokenAmount(
  value: { denom?: string; amount?: string | null } | null | undefined,
  primaryToken?: { denom: string; displayDenom: string; exponent: number },
  fractionDigits = 6,
): string {
  if (value == null) {
    return "N/A";
  }

  const denom = value.denom ?? "";
  const raw = value.amount ?? "";
  const amount = Number(raw);

  if (!Number.isFinite(amount)) {
    return `${raw} ${denom}`.trim();
  }

  if (primaryToken != null && denom === primaryToken.denom) {
    const human = amount / 10 ** primaryToken.exponent;
    return `${human.toLocaleString(undefined, {
      maximumFractionDigits: fractionDigits,
    })} ${primaryToken.displayDenom}`;
  }

  return `${amount.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  })} ${denom}`.trim();
}

/**
 * Sums an array of coins sharing the same denom and formats the total.
 * Returns "N/A" when the array is empty.
 */
export function formatCoinTotal(
  coins: ({ denom?: string; amount?: string | null } | null | undefined)[],
  primaryToken: { denom: string; displayDenom: string; exponent: number },
  fractionDigits = 6,
): string {
  const nonEmpty = coins.filter((c): c is NonNullable<typeof c> => c != null);
  if (nonEmpty.length === 0) return "N/A";

  const denom = nonEmpty[0]?.denom ?? primaryToken.denom;
  const total = nonEmpty.reduce((sum, coin) => {
    const n = Number(coin.amount);
    return Number.isFinite(n) ? sum + n : sum;
  }, 0);

  return formatTokenAmount({ denom, amount: String(total) }, primaryToken, fractionDigits);
}

/** @deprecated Use `formatTokenAmount(coin, primaryToken)` instead. */
export function formatCoinDisplay(
  coin: { denom?: string; amount?: string } | null | undefined,
  primaryToken: { denom: string; displayDenom: string; exponent: number },
): string {
  return formatTokenAmount(coin, primaryToken, 8);
}

/**
 * Shortens a long hash with an ellipsis in the middle (e.g. `ABCD1234...WXYZ`).
 * If the string fits without omitting characters, it is returned unchanged.
 */
export function formatHashMiddle(
  hash: string,
  leading = 6,
  trailing = 5,
): string {
  if (hash.length <= leading + trailing + 3) {
    return hash;
  }

  return `${hash.slice(0, leading)}...${hash.slice(-trailing)}`;
}

/** Compact hash for tables and lists (6 + … + 5). */
export function formatHash(hash: string): string {
  return formatHashMiddle(hash, 6, 5);
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
