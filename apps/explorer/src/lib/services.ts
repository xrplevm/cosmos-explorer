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
  IPriceService,
  IProposalService,
  ITransactionService,
  IValidatorService,
} from "@cosmos-explorer/core";
import { PriceService } from "@cosmos-explorer/price";
import { createFetcher } from "@cosmos-explorer/utils";

export type Services = {
  blockService: IBlockService;
  transactionService: ITransactionService;
  priceService: IPriceService;
  validatorService: IValidatorService;
  chainStatsService: IChainStatsService;
  proposalService: IProposalService;
  accountService: IAccountService;
};

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
  const priceService = new PriceService(fetcher);
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
    config.network.primaryToken.denom
  );
  const chainStatsService = new CallistoChainStatsService(
    fetcher,
    blockService,
    priceService,
    validatorService,
  );

  return {
    blockService,
    transactionService,
    priceService,
    validatorService,
    chainStatsService,
    proposalService,
    accountService,
  };
});
