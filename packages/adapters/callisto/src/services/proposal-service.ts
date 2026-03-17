import {
  type IProposalService,
  type ProposalDetail,
  type ProposalSummary,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapProposalDetail, mapProposals } from '../mappers';
import { PROPOSAL_DETAILS_QUERY, PROPOSALS_QUERY } from '../queries';
import type { ProposalDetailsResponse, ProposalsResponse } from '../types';

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
}
