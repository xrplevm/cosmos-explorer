import { cache } from "react";
import { unstable_cache } from "next/cache";

import {
  CallistoAccountService,
  CallistoBlockService,
  CallistoChainStatsService,
  CallistoProposalService,
  CallistoTransactionService,
  CallistoValidatorService,
} from "@cosmos-explorer/callisto";
import type {
  IAccountService,
  IBlockService,
  IChainStatsService,
  GovParams,
  IProposalService,
  ITransactionService,
  IValidatorService,
} from "@cosmos-explorer/core";
import { createFetcher, createCosmosRpcClient } from "@cosmos-explorer/utils";

export interface Services {
  blockService: IBlockService;
  transactionService: ITransactionService;
  validatorService: IValidatorService;
  chainStatsService: IChainStatsService;
  proposalService: IProposalService;
  accountService: IAccountService;
}

import { getChainConfig } from "./config";

/**
 * Server-side service factory, deduped per request via React `cache()`.
 * Use this in server components instead of the client-side ServicesProvider.
 */
export const getServices = cache((): Services => {
  const config = getChainConfig();
  const fetcher = createFetcher({
    baseUrl: config.network.endpoints.graphqlHttp,
  });

  const cosmosRpc = config.network.endpoints.cosmosRpc
    ? createCosmosRpcClient({ baseUrl: config.network.endpoints.cosmosRpc })
    : undefined;

  const blockService = new CallistoBlockService(fetcher);
  const transactionService = new CallistoTransactionService(fetcher);
  const validatorService = new CallistoValidatorService(
    fetcher,
    config.network.primaryToken.denom
  );
  const proposalService = new CallistoProposalService(
    fetcher,
    config.network.primaryToken.denom,
    cosmosRpc,
  );
  const accountService = new CallistoAccountService(
    fetcher,
    config.network.primaryToken.denom,
    config.network.bech32Prefix,
  );
  const chainStatsService = new CallistoChainStatsService(
    fetcher,
    blockService,
    validatorService,
  );

  return {
    blockService,
    transactionService,
    validatorService,
    chainStatsService,
    proposalService,
    accountService,
  };
});

/**
 * Governance params cached across requests (revalidates every 60s).
 * Use this instead of `proposalService.getGovParams()` directly to avoid
 * blocking page renders with an RPC call on every request.
 */
export const getCachedGovParams = unstable_cache(
  async (): Promise<GovParams | null> => {
    const { proposalService } = getServices();
    return proposalService.getGovParams();
  },
  ["gov-params"],
  { revalidate: 60 },
);
