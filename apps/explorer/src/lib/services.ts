import { cache } from "react";

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
  IProposalService,
  ITransactionService,
  IValidatorService,
} from "@cosmos-explorer/core";
import { createFetcher } from "@cosmos-explorer/utils";

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

  const blockService = new CallistoBlockService(fetcher);
  const transactionService = new CallistoTransactionService(fetcher);
  const validatorService = new CallistoValidatorService(
    fetcher,
    config.network.primaryToken.denom
  );
  const proposalService = new CallistoProposalService(
    fetcher,
    config.network.primaryToken.denom
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
