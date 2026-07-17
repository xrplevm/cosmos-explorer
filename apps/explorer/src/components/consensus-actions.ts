"use server";

import type { ConsensusBlock } from "@cosmos-explorer/core";
import { getServices } from "@/lib/services";

/** Polled from the client to update the block list in place, without a page refresh. */
export async function loadRecentConsensus(
  count: number,
): Promise<ConsensusBlock[]> {
  const { consensusService } = getServices();
  return consensusService.getRecentConsensus(count);
}
