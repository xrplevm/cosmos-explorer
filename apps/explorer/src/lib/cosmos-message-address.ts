import type { Message } from "@cosmos-explorer/core";
import { parseJsonIfString } from "./parse-transaction-raw";

/** Common Cosmos SDK message keys that hold a signer / sender bech32 address. */
const SIGNER_KEYS = [
  "sender",
  "from",
  "from_address",
  "fromAddress",
  "delegator_address",
  "delegatorAddress",
  "granter",
  "voter",
  "proposer",
  "depositor",
  "authority",
  "signer",
] as const;

function readNonEmptyString(v: unknown): string | undefined {
  if (typeof v !== "string") {
    return undefined;
  }
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

/** Best-effort signer bech32 (or other address string) from a single message `value`. */
export function getCosmosSignerFromMessageValue(value: unknown): string | undefined {
  const parsed = parseJsonIfString(value);
  const root = asRecord(parsed);
  if (root == null) {
    return undefined;
  }
  const nested = asRecord(root.data);
  const candidates = [root, nested].filter(
    (o): o is Record<string, unknown> => o != null,
  );
  for (const obj of candidates) {
    for (const key of SIGNER_KEYS) {
      const s = readNonEmptyString(obj[key]);
      if (s != null) {
        return s;
      }
    }
  }
  return undefined;
}

export function getCosmosSignerFromMessage(
  message: Message | undefined,
): string | undefined {
  if (message == null) {
    return undefined;
  }
  return getCosmosSignerFromMessageValue(message.value);
}
