import { type AccountMessageSummary, type AccountOverview, type IAccountService, type TransactionSummary } from '@cosmos-explorer/core';
import { type Fetcher, evmToCosmosAddress } from '@cosmos-explorer/utils';

import {
  buildAccountOverview,
  mapAccountDelegations,
  mapAccountMessages,
  mapAccountRewards,
  mapTransactions,
  mapWithdrawalAddress,
} from '../mappers';
import {
  ACCOUNT_BALANCES_QUERY,
  ACCOUNT_DELEGATION_BALANCE_QUERY,
  ACCOUNT_DELEGATIONS_QUERY,
  ACCOUNT_MESSAGES_COUNT_QUERY,
  ACCOUNT_MESSAGES_QUERY,
  ACCOUNT_REWARDS_QUERY,
  ACCOUNT_TRANSACTIONS_COUNT_QUERY,
  ACCOUNT_TRANSACTIONS_QUERY,
  ACCOUNT_UNBONDING_BALANCE_QUERY,
  ACCOUNT_WITHDRAWAL_ADDRESS_QUERY,
} from '../queries';
import type {
  AccountCoinsResponse,
  AccountDelegationsResponse,
  AccountMessagesCountResponse,
  AccountMessagesResponse,
  AccountRewardsResponse,
  AccountTransactionsCountResponse,
  AccountWithdrawalAddressResponse,
  LatestTransactionsResponse,
} from '../types';

export class CallistoAccountService implements IAccountService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly primaryDenom = 'axrp',
    private readonly bech32Prefix = 'ethm',
    private readonly stakingDenom = 'poa',
  ) {}

  async getAccountByAddress(address: string): Promise<AccountOverview> {
    const cosmosAddress = evmToCosmosAddress(address, this.bech32Prefix);

    const [
      balancesResponse,
      delegationBalanceResponse,
      unbondingBalanceResponse,
      rewardsResponse,
      delegationsResponse,
      withdrawalAddressResponse,
    ] = await Promise.all([
      this.fetcher.graphql<AccountCoinsResponse, { address: string }>({
        query: ACCOUNT_BALANCES_QUERY,
        variables: { address: cosmosAddress },
        operationName: 'AccountBalances',
      }),
      this.fetcher.graphql<AccountCoinsResponse, { address: string }>({
        query: ACCOUNT_DELEGATION_BALANCE_QUERY,
        variables: { address: cosmosAddress },
        operationName: 'AccountDelegationBalance',
      }),
      this.fetcher.graphql<AccountCoinsResponse, { address: string }>({
        query: ACCOUNT_UNBONDING_BALANCE_QUERY,
        variables: { address: cosmosAddress },
        operationName: 'AccountUnbondingBalance',
      }),
      this.fetcher.graphql<AccountRewardsResponse, { address: string }>({
        query: ACCOUNT_REWARDS_QUERY,
        variables: { address: cosmosAddress },
        operationName: 'AccountDelegationRewards',
      }),
      this.fetcher.graphql<
        AccountDelegationsResponse,
        { address: string; limit: number; offset: number; pagination: boolean }
      >({
        query: ACCOUNT_DELEGATIONS_QUERY,
        variables: {
          address: cosmosAddress,
          limit: 10,
          offset: 0,
          pagination: true,
        },
        operationName: 'AccountDelegations',
      }),
      this.fetcher.graphql<AccountWithdrawalAddressResponse, { address: string }>({
        query: ACCOUNT_WITHDRAWAL_ADDRESS_QUERY,
        variables: { address: cosmosAddress },
        operationName: 'AccountWithdrawalAddress',
      }),
    ]);

    return buildAccountOverview({
      address,
      balances: balancesResponse.accountBalances?.coins,
      delegationBalance: delegationBalanceResponse.delegationBalance?.coins,
      unbondingBalance: unbondingBalanceResponse.unbondingBalance?.coins,
      rewards: mapAccountRewards(rewardsResponse, this.primaryDenom),
      delegations: mapAccountDelegations(delegationsResponse, this.stakingDenom),
      withdrawalAddress: mapWithdrawalAddress(withdrawalAddressResponse),
      stakingDenom: this.stakingDenom,
    });
  }

  async getAccountMessages(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<AccountMessageSummary[]> {
    const cosmosAddress = evmToCosmosAddress(address, this.bech32Prefix);

    const response = await this.fetcher.graphql<
      AccountMessagesResponse,
      { address: string; types: string; limit: number; offset: number }
    >({
      query: ACCOUNT_MESSAGES_QUERY,
      variables: {
        address: `{${cosmosAddress}}`,
        types: '{}',
        limit: params?.limit ?? 10,
        offset: params?.offset ?? 0,
      },
      operationName: 'AccountMessages',
    });

    return mapAccountMessages(response);
  }

  async getAccountMessageCount(address: string): Promise<number> {
    const cosmosAddress = evmToCosmosAddress(address, this.bech32Prefix);

    const response = await this.fetcher.graphql<
      AccountMessagesCountResponse,
      { address: string; types: string }
    >({
      query: ACCOUNT_MESSAGES_COUNT_QUERY,
      variables: { address: `{${cosmosAddress}}`, types: '{}' },
      operationName: 'AccountMessagesCount',
    });

    // Coerce: Hasura may serialize the bigint count as a string (as with height).
    return Number(response.messages_by_address_count[0]?.count ?? 0);
  }

  async getAccountTransactions(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<TransactionSummary[]> {
    const cosmosAddress = evmToCosmosAddress(address, this.bech32Prefix);

    const response = await this.fetcher.graphql<
      LatestTransactionsResponse,
      { address: string; limit: number; offset: number }
    >({
      query: ACCOUNT_TRANSACTIONS_QUERY,
      variables: {
        address: `{${cosmosAddress}}`,
        limit: params?.limit ?? 10,
        offset: params?.offset ?? 0,
      },
      operationName: 'AccountTransactions',
    });

    return mapTransactions(response);
  }

  async getAccountTransactionCount(address: string): Promise<number> {
    const cosmosAddress = evmToCosmosAddress(address, this.bech32Prefix);

    const response = await this.fetcher.graphql<
      AccountTransactionsCountResponse,
      { address: string }
    >({
      query: ACCOUNT_TRANSACTIONS_COUNT_QUERY,
      variables: { address: `{${cosmosAddress}}` },
      operationName: 'AccountTransactionsCount',
    });

    return Number(response.transactions_by_address_count[0]?.count ?? 0);
  }
}
