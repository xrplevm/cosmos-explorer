import type { Message } from "@cosmos-explorer/core";
import { ethers } from "ethers";
import { parseJsonIfString } from "@/lib/parse-transaction-raw";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readString(
  obj: Record<string, unknown> | null,
  key: string,
): string | undefined {
  if (obj == null) {
    return undefined;
  }
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}

function evmPayload(value: unknown): Record<string, unknown> | null {
  const root = asRecord(value);
  if (root == null) {
    return null;
  }
  const nested = asRecord(root.data);
  return nested ?? root;
}

export function findRawHex(value: unknown): string | null {
  const root = asRecord(value);
  if (root == null) {
    return null;
  }
  const nested = asRecord(root.data);
  const candidates = [root, nested].filter(
    (o): o is Record<string, unknown> => o != null,
  );
  for (const obj of candidates) {
    for (const key of ["raw", "raw_tx", "rawTx", "RawTx"]) {
      const s = readString(obj, key);
      if (s != null && s.startsWith("0x") && s.length > 4) {
        return s;
      }
    }
  }
  return null;
}

export interface DecodeEthereumMessageContext {
  primaryTokenExponent: number;
  primaryTokenDisplayDenom: string;
}

/** Decoded fields for Ethereum / `MsgEthereumTx` UI (overview + parsers). */
export interface DecodedEthereumMessage {
  body: Record<string, unknown> | null;
  ethersTx: ethers.Transaction | null;
  /** Sender (checksummed when from ethers). */
  from: string | undefined;
  /**
   * Recipient hex, or `null` when contract creation (ethers), or `undefined` if unknown.
   */
  to: string | null | undefined;
  /** Human-readable native transfer amount. */
  amountDisplay: string | undefined;
  /** Execution tx hash from signed EVM tx or message body. */
  evmTxHash: string | undefined;
  calldataPreview: string | undefined;
}

function truncateHexData(data: string, max = 140): string {
  if (data.length <= max) {
    return data;
  }
  return `${data.slice(0, max)}… (${String(data.length)} chars)`;
}

/**
 * Decode the first (or only) Ethereum message body for display.
 * Safe to call for non-Ethereum messages — returns mostly empty fields.
 */
export function decodeEthereumMessage(
  message: Message,
  ctx: DecodeEthereumMessageContext,
): DecodedEthereumMessage {
  const body = evmPayload(message.value);
  const raw = findRawHex(message.value);
  let ethersTx: ethers.Transaction | null = null;

  if (raw != null) {
    try {
      ethersTx = ethers.Transaction.from(raw);
    } catch {
      ethersTx = null;
    }
  }

  if (ethersTx != null) {
    const data = ethersTx.data;
    const calldataPreview =
      data.length > 2 ? truncateHexData(data) : undefined;
    return {
      body,
      ethersTx,
      from: ethersTx.from ?? undefined,
      to: ethersTx.to,
      amountDisplay: `${ethers.formatUnits(ethersTx.value, ctx.primaryTokenExponent)} ${ctx.primaryTokenDisplayDenom}`,
      evmTxHash: ethersTx.hash ?? readString(body, "hash"),
      calldataPreview,
    };
  }

  if (body != null) {
    const input = readString(body, "input") ?? readString(body, "data");
    const calldataPreview =
      input != null && input.length > 0 ? truncateHexData(input) : undefined;
    const toStr = readString(body, "to");
    return {
      body,
      ethersTx: null,
      from: readString(body, "from"),
      to: toStr,
      amountDisplay: readString(body, "value"),
      evmTxHash: readString(body, "hash"),
      calldataPreview,
    };
  }

  return {
    body: null,
    ethersTx: null,
    from: undefined,
    to: undefined,
    amountDisplay: undefined,
    evmTxHash: undefined,
    calldataPreview: undefined,
  };
}

/** EVM execution hash (`0x…`) for external explorer links, when derivable from the message. */
export function getEvmTxHashFromMessage(message: Message): string | undefined {
  const body = evmPayload(message.value);
  const raw = findRawHex(message.value);
  if (raw != null) {
    try {
      const tx = ethers.Transaction.from(raw);
      if (tx.hash != null) {
        return tx.hash;
      }
    } catch {
      /* fall through */
    }
  }
  return readString(body, "hash");
}

function evmTxToDecodedJson(tx: ethers.Transaction): Record<string, unknown> {
  const data = tx.data;
  const dataSummary =
    data.length <= 2
      ? data
      : {
          byteLength: (data.length - 2) / 2,
          prefix: `${data.slice(0, 66)}${data.length > 66 ? "…" : ""}`,
        };

  const sig = tx.signature;
  return {
    hash: tx.hash,
    type: tx.type,
    chainId: tx.chainId.toString(),
    nonce: tx.nonce,
    from: tx.from,
    to: tx.to,
    value: tx.value.toString(),
    gasLimit: tx.gasLimit.toString(),
    gasPrice: tx.gasPrice != null ? tx.gasPrice.toString() : null,
    maxFeePerGas: tx.maxFeePerGas != null ? tx.maxFeePerGas.toString() : null,
    maxPriorityFeePerGas:
      tx.maxPriorityFeePerGas != null
        ? tx.maxPriorityFeePerGas.toString()
        : null,
    data: dataSummary,
    accessList: tx.accessList,
    signature:
      sig != null
        ? { v: sig.v, r: sig.r, s: sig.s, yParity: sig.yParity }
        : null,
  };
}

/**
 * For JSON viewers: if `value` carries an EVM `raw` RLP hex, replace the opaque string
 * with `{ rlpHexPrefix, rlpHexByteLength, decoded }` (or `decodeError`).
 */
export function enrichMessageValueForTransactionViewer(
  value: unknown,
): unknown {
  const parsed = parseJsonIfString(value);
  if (parsed == null || typeof parsed !== "object") {
    return parsed;
  }
  const root = asRecord(parsed);
  if (root == null) {
    return parsed;
  }
  const raw = findRawHex(parsed);
  if (raw == null) {
    return parsed;
  }
  const prefix = `${raw.slice(0, 42)}${raw.length > 42 ? "…" : ""}`;
  const rlpHexByteLength = (raw.length - 2) / 2;
  try {
    const tx = ethers.Transaction.from(raw);
    return {
      ...root,
      raw: {
        rlpHexByteLength,
        rlpHexPrefix: prefix,
        decoded: evmTxToDecodedJson(tx),
      },
    };
  } catch {
    return {
      ...root,
      raw: {
        rlpHexByteLength,
        rlpHexPrefix: prefix,
        decodeError: "Invalid or unsupported RLP (ethers.Transaction.from)",
      },
    };
  }
}
