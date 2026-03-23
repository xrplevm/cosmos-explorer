"use server";

import { getServices } from "./services";

/**
 * Resolves a 64-char hex hash: tries transaction first, then block.
 * Returns the route to navigate to, or null if neither is found.
 */
export async function resolveHash(hash: string): Promise<string | null> {
  const { transactionService, blockService } = getServices();

  const tx = await transactionService.getTransactionByHash(hash);
  if (tx) return `/transactions/${hash}`;

  const block = await blockService.getBlockByHash(hash);
  if (block) return `/blocks/${block.height}`;

  return null;
}
