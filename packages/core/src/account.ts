import type { TokenAmount } from './price';

export type AccountBalance = TokenAmount;

export interface AccountDelegation {
  validatorAddress: string;
  amount: TokenAmount | null;
}

export interface AccountReward {
  validatorAddress: string;
  amount: TokenAmount | null;
}

export interface AccountOverview {
  address: string;
  balances: AccountBalance[];
  delegationBalance: TokenAmount | null;
  unbondingBalance: TokenAmount | null;
  rewards: AccountReward[];
  delegations: AccountDelegation[];
  withdrawalAddress: string | null;
}

export interface IAccountService {
  getAccountByAddress(address: string): Promise<AccountOverview>;
}
