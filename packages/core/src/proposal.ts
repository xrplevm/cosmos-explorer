import type { TokenAmount } from './price';

export type VoteOption = 'yes' | 'no' | 'abstain' | 'noWithVeto' | 'unknown';

export interface ProposalVote {
  voterAddress: string;
  option: VoteOption;
  weight: string;
  height: number;
  timestamp: string | null;
}

export type ProposalStatus =
  | 'deposit'
  | 'voting'
  | 'passed'
  | 'rejected'
  | 'failed'
  | 'unknown';

export interface ProposalSummary {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  type: string;
  submitTime: string | null;
  votingEndTime: string | null;
}

export interface ProposalTally {
  yes: string;
  no: string;
  abstain: string;
  noWithVeto: string;
  bondedTokens: TokenAmount | null;
}

export type ProposalDetail = ProposalSummary & {
  metadata: string | null;
  content: unknown;
  depositEndTime: string | null;
  votingStartTime: string | null;
  tally: ProposalTally | null;
};

export interface IProposalService {
  getProposals(params?: { limit?: number; offset?: number }): Promise<ProposalSummary[]>;
  getProposalById(id: number): Promise<ProposalDetail | null>;
  getProposalVotes(
    proposalId: number,
    params?: { limit?: number; offset?: number; option?: VoteOption | null }
  ): Promise<{ votes: ProposalVote[]; total: number }>;
}
