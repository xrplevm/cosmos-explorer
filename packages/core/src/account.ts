import type { TokenAmount } from './price';
import type { TransactionSummary } from './transaction';

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

export interface AccountMessage {
  type: string;
  transactionHash: string;
  height: number;
  success: boolean;
  timestamp: string;
}

export interface IAccountService {
  getAccountByAddress(address: string): Promise<AccountOverview>;
  getAccountTransactions(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<TransactionSummary[]>;
  getAccountMessages(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<AccountMessage[]>;
}
