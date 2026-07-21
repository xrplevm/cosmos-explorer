import { PAGE_SIZE_OPTIONS } from "@cosmos-explorer/ui/pagination-constants";
import type { AccountMessage, TransactionSummary } from "@cosmos-explorer/core";

export type AccountActivityTab = "transactions" | "messages";

export const DEFAULT_ACTIVITY_PAGE_SIZE = 10;
// Caps the OFFSET the page can generate: deep offsets are O(offset) on the
// lookup table (page 100,000 of a hot address measured at ~2.3s).
export const MAX_ACTIVITY_PAGE = 1000;

/** One page of account activity for whichever tab is active. */
export interface AccountActivityData {
  tab: AccountActivityTab;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  transactions: TransactionSummary[];
  messages: AccountMessage[];
  error: boolean;
}

function parsePositiveInt(value: unknown, fallback: number): number {
  const num =
    typeof value === "string"
      ? Number(value)
      : typeof value === "number"
        ? value
        : NaN;
  return Number.isInteger(num) && num >= 1 ? num : fallback;
}

/**
 * Clamps raw tab/page/pageSize into the canonical, bounded shape used by both
 * the server render and the client fetch, so they can never diverge.
 */
export function normalizeActivityParams(raw: {
  tab?: unknown;
  page?: unknown;
  pageSize?: unknown;
}): {
  tab: AccountActivityTab;
  page: number;
  pageSize: number;
  offset: number;
} {
  const tab: AccountActivityTab =
    raw.tab === "messages" ? "messages" : "transactions";
  const page = Math.min(parsePositiveInt(raw.page, 1), MAX_ACTIVITY_PAGE);
  const rawSize = parsePositiveInt(raw.pageSize, DEFAULT_ACTIVITY_PAGE_SIZE);
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize)
    ? rawSize
    : DEFAULT_ACTIVITY_PAGE_SIZE;
  return { tab, page, pageSize, offset: (page - 1) * pageSize };
}
