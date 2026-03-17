import type { TokenAmount } from './price';

export type ValidatorCount = {
  active: number;
  total: number;
};

export type ValidatorStatus = 'active' | 'inactive' | 'jailed' | 'unknown';

export type Validator = {
  address: string;
  moniker: string;
  status: ValidatorStatus;
  jailed: boolean;
  tombstoned: boolean;
  votingPower: number;
  votingPowerPercent: number;
  commission: number | null;
  missedBlocksCounter: number;
};

export type ValidatorSet = {
  items: Validator[];
  count: ValidatorCount;
  bonded: TokenAmount | null;
  averageCommission: number | null;
};

export type ValidatorDetail = Validator & {
  selfDelegateAddress: string;
  maxRate: number | null;
  website: string | null;
  details: string | null;
  latestStatusHeight: number | null;
  recentBlocks: Array<{
    height: number;
    hash: string;
    txs: number;
    timestamp: string;
  }>;
};

export interface IValidatorService {
  getValidatorCount(): Promise<ValidatorCount>;
  getValidatorSet(): Promise<ValidatorSet>;
  getValidatorByAddress(address: string): Promise<ValidatorDetail | null>;
}
