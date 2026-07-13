import { type AccountOverview, type IAccountService, type TransactionSummary } from '@cosmos-explorer/core';
import { type Fetcher, evmToCosmosAddress } from '@cosmos-explorer/utils';

import {
  buildAccountOverview,
  mapAccountDelegations,
  mapAccountRewards,
  mapAccountTransactions,
  mapWithdrawalAddress,
} from '../mappers';
import {
  ACCOUNT_BALANCES_QUERY,
  ACCOUNT_DELEGATION_BALANCE_QUERY,
  ACCOUNT_DELEGATIONS_QUERY,
  ACCOUNT_REWARDS_QUERY,
  ACCOUNT_TRANSACTIONS_QUERY,
  ACCOUNT_UNBONDING_BALANCE_QUERY,
  ACCOUNT_WITHDRAWAL_ADDRESS_QUERY,
} from '../queries';
import type {
  AccountCoinsResponse,
  AccountDelegationsResponse,
  AccountRewardsResponse,
  AccountTransactionsResponse,
  AccountWithdrawalAddressResponse,
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

  async getAccountTransactions(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<TransactionSummary[]> {
    const cosmosAddress = evmToCosmosAddress(address, this.bech32Prefix);

    const response = await this.fetcher.graphql<
      AccountTransactionsResponse,
      { address: string; types: string; limit: number; offset: number }
    >({
      query: ACCOUNT_TRANSACTIONS_QUERY,
      variables: {
        address: `{${cosmosAddress}}`,
        types: '{}',
        limit: params?.limit ?? 10,
        offset: params?.offset ?? 0,
      },
      operationName: 'AccountTransactions',
    });

    return mapAccountTransactions(response);
  }
}
