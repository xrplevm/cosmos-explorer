import type { TokenAmount } from './price';
import type { TransactionSummary } from './transaction';

export type AccountBalance = TokenAmount;

/** The count functions cap at this value; the UI renders it as "1,000,000+".
 *  Exact for any realistic account (counting is a cheap index scan); the cap
 *  only bounds a pathological multi-million-row account. */
export const ACCOUNT_ACTIVITY_COUNT_CAP = 1_000_000;

/** One message involving the account; `hash` is that of its transaction. */
export interface AccountMessageSummary {
  hash: string;
  index: number;
  height: number;
  type: string;
  success: boolean;
  timestamp: string;
}

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
  getAccountMessages(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<AccountMessageSummary[]>;
  getAccountMessageCount(address: string): Promise<number>;
  getAccountTransactions(
    address: string,
    params?: { limit?: number; offset?: number },
  ): Promise<TransactionSummary[]>;
  getAccountTransactionCount(address: string): Promise<number>;
}
