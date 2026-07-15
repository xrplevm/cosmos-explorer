import { ACCOUNT_ACTIVITY_COUNT_CAP } from "@cosmos-explorer/core";

// Plain constants/helpers shared by the server cards/page and the client list.
// Kept out of the "use client" list module: a Server Component importing a
// value from a client module gets undefined.
export const ACCOUNT_ACTIVITY_PAGE_SIZE = 10;

export function activityPageCount(count: number): number {
  return Math.max(1, Math.ceil(count / ACCOUNT_ACTIVITY_PAGE_SIZE));
}

/** Renders the count line; a capped count (1000001) shows as "1,000,000+". */
export function formatActivityCount(count: number, singular: string): string {
  if (count > ACCOUNT_ACTIVITY_COUNT_CAP) {
    return `${ACCOUNT_ACTIVITY_COUNT_CAP.toLocaleString()}+ ${singular}s`;
  }
  return `${count.toLocaleString()} ${count === 1 ? singular : `${singular}s`}`;
}

export interface AccountActivityRow {
  key: string;
  hash: string;
  type: string;
  isEthereum: boolean;
  success: boolean;
  height: number;
  timestamp: string;
}
