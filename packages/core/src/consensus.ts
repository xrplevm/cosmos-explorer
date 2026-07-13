export interface ConsensusValidatorVote {
  consensusAddress: string;
  operatorAddress: string;
  moniker: string | null;
  /** Keybase avatar for the validator, or `null` when unavailable. */
  avatarUrl: string | null;
  /**
   * Signing uptime over the chain's slashing window (`signed_blocks_window`,
   * ~1 week), as a percentage. `null` when signing info is unavailable.
   */
  uptimePercent: number | null;
  /** Precommit timestamp — when the validator voted. `null` for a missed vote. */
  votedAt: string | null;
}

export interface ConsensusTransactionType {
  /** Formatted message-type label, e.g. "EthereumTx". */
  type: string;
  count: number;
}

export interface ConsensusBlock {
  height: number;
  hash: string;
  timestamp: string;
  proposer: {
    consensusAddress: string;
    operatorAddress: string;
    moniker: string | null;
    avatarUrl: string | null;
  };
  totalGas: number;
  txCount: number;
  /** Per-type transaction breakdown, most frequent first. */
  txTypes: ConsensusTransactionType[];
  /** Validators that precommitted, ordered by vote time (earliest first). */
  votes: ConsensusValidatorVote[];
  /** Recently-active validators that did not precommit this block. */
  missed: ConsensusValidatorVote[];
}

export interface IConsensusService {
  getRecentConsensus(limit: number): Promise<ConsensusBlock[]>;
}
