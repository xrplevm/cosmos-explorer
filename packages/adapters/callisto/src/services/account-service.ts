import { type AccountOverview, type IAccountService } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

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
  ACCOUNT_MESSAGES_QUERY,
  ACCOUNT_REWARDS_QUERY,
  ACCOUNT_UNBONDING_BALANCE_QUERY,
  ACCOUNT_WITHDRAWAL_ADDRESS_QUERY,
} from '../queries';
import type {
  AccountCoinsResponse,
  AccountDelegationsResponse,
  AccountMessagesResponse,
  AccountRewardsResponse,
  AccountWithdrawalAddressResponse,
} from '../types';

export class CallistoAccountService implements IAccountService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly primaryDenom = 'axrp'
  ) {}

  async getAccountByAddress(address: string): Promise<AccountOverview> {
    const wrappedAddress = `{${address}}`;

    const [
      balancesResponse,
      delegationBalanceResponse,
      unbondingBalanceResponse,
      rewardsResponse,
      delegationsResponse,
      withdrawalAddressResponse,
      transactionsResponse,
    ] = await Promise.all([
      this.fetcher.graphql<AccountCoinsResponse, { address: string }>({
        query: ACCOUNT_BALANCES_QUERY,
        variables: { address },
        operationName: 'AccountBalances',
      }),
      this.fetcher.graphql<AccountCoinsResponse, { address: string }>({
        query: ACCOUNT_DELEGATION_BALANCE_QUERY,
        variables: { address },
        operationName: 'AccountDelegationBalance',
      }),
      this.fetcher.graphql<AccountCoinsResponse, { address: string }>({
        query: ACCOUNT_UNBONDING_BALANCE_QUERY,
        variables: { address },
        operationName: 'AccountUnbondingBalance',
      }),
      this.fetcher.graphql<AccountRewardsResponse, { address: string }>({
        query: ACCOUNT_REWARDS_QUERY,
        variables: { address },
        operationName: 'AccountDelegationRewards',
      }),
      this.fetcher.graphql<
        AccountDelegationsResponse,
        { address: string; limit: number; offset: number; pagination: boolean }
      >({
        query: ACCOUNT_DELEGATIONS_QUERY,
        variables: {
          address,
          limit: 10,
          offset: 0,
          pagination: true,
        },
        operationName: 'AccountDelegations',
      }),
      this.fetcher.graphql<AccountWithdrawalAddressResponse, { address: string }>({
        query: ACCOUNT_WITHDRAWAL_ADDRESS_QUERY,
        variables: { address },
        operationName: 'AccountWithdrawalAddress',
      }),
      this.fetcher.graphql<
        AccountMessagesResponse,
        { address: string; limit: number; offset: number; types: string }
      >({
        query: ACCOUNT_MESSAGES_QUERY,
        variables: {
          address: wrappedAddress,
          limit: 10,
          offset: 0,
          types: '{}',
        },
        operationName: 'AccountMessages',
      }),
    ]);

    return buildAccountOverview({
      address,
      balances: balancesResponse.accountBalances?.coins,
      delegationBalance: delegationBalanceResponse.delegationBalance?.coins,
      unbondingBalance: unbondingBalanceResponse.unbondingBalance?.coins,
      rewards: mapAccountRewards(rewardsResponse, this.primaryDenom),
      delegations: mapAccountDelegations(delegationsResponse, this.primaryDenom),
      withdrawalAddress: mapWithdrawalAddress(withdrawalAddressResponse),
      transactions: mapAccountTransactions(transactionsResponse),
      primaryDenom: this.primaryDenom,
    });
  }
}
