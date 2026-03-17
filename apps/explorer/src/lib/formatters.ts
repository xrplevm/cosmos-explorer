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

export function formatHash(hash: string): string {
  if (hash.length <= 14) {
    return hash;
  }

  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}
