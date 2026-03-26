import {
  type IProposalService,
  type ProposalDetail,
  type ProposalSummary,
  type ProposalVote,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapProposalDetail, mapProposals, mapProposalVotes } from '../mappers';
import { PROPOSAL_DETAILS_QUERY, PROPOSALS_QUERY, PROPOSAL_VOTES_QUERY, PROPOSAL_VOTES_FILTERED_QUERY } from '../queries';
import type { ProposalDetailsResponse, ProposalVotesResponse, ProposalsResponse } from '../types';

export class CallistoProposalService implements IProposalService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly primaryDenom = 'axrp'
  ) {}

  async getProposals(params?: {
    limit?: number;
    offset?: number;
  }): Promise<ProposalSummary[]> {
    const response = await this.fetcher.graphql<
      ProposalsResponse,
      { limit: number; offset: number }
    >({
      query: PROPOSALS_QUERY,
      variables: {
        limit: params?.limit ?? 20,
        offset: params?.offset ?? 0,
      },
      operationName: 'Proposals',
    });

    return mapProposals(response);
  }

  async getProposalById(id: number): Promise<ProposalDetail | null> {
    const response = await this.fetcher.graphql<
      ProposalDetailsResponse,
      { proposalId: number }
    >({
      query: PROPOSAL_DETAILS_QUERY,
      variables: { proposalId: id },
      operationName: 'ProposalDetails',
    });

    return mapProposalDetail(response, this.primaryDenom);
  }

  async getProposalVotes(
    proposalId: number,
    params?: { limit?: number; offset?: number; option?: string | null }
  ): Promise<{ votes: ProposalVote[]; total: number }> {
    const optionMap: Record<string, string> = {
      yes: 'VOTE_OPTION_YES',
      no: 'VOTE_OPTION_NO',
      abstain: 'VOTE_OPTION_ABSTAIN',
      noWithVeto: 'VOTE_OPTION_NO_WITH_VETO',
    };

    const hasuraOption = params?.option ? (optionMap[params.option] ?? null) : null;

    if (hasuraOption) {
      const response = await this.fetcher.graphql<
        ProposalVotesResponse,
        { proposalId: number; limit: number; offset: number; option: string }
      >({
        query: PROPOSAL_VOTES_FILTERED_QUERY,
        variables: {
          proposalId,
          limit: params?.limit ?? 25,
          offset: params?.offset ?? 0,
          option: hasuraOption,
        },
        operationName: 'ProposalVotesFiltered',
      });
      return mapProposalVotes(response);
    }

    const response = await this.fetcher.graphql<
      ProposalVotesResponse,
      { proposalId: number; limit: number; offset: number }
    >({
      query: PROPOSAL_VOTES_QUERY,
      variables: {
        proposalId,
        limit: params?.limit ?? 25,
        offset: params?.offset ?? 0,
      },
      operationName: 'ProposalVotes',
    });

    return mapProposalVotes(response);
  }
}
