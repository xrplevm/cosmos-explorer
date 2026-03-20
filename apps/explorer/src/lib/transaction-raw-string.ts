import type { Message } from "@cosmos-explorer/core";
import { findRawHex } from "./ethereum-message-decode";
import { parseJsonIfString } from "./parse-transaction-raw";

/**
 * Single opaque wire string for the Raw tab (not JSON):
 * EVM-style `raw` hex on a message → string `logs` → `error` (e.g. ABCI raw_log).
 */
export function transactionRawWireString(input: {
  messages: Message[];
  logs: unknown;
  error: string;
}): string {
  for (const m of input.messages) {
    const raw = findRawHex(parseJsonIfString(m.value));
    if (raw != null) {
      return raw;
    }
  }
  if (typeof input.logs === "string" && input.logs.trim().length > 0) {
    return input.logs;
  }
  if (input.error.trim().length > 0) {
    return input.error;
  }
  return "";
}
