import {
  type IProposalService,
  type ProposalDetail,
  type ProposalSummary,
  type ProposalVote,
  type ProposalDeposit,
  type GovParams,
} from '@cosmos-explorer/core';
import { type Fetcher, type CosmosRpcClient } from '@cosmos-explorer/utils';

import { mapProposalDetail, mapActiveProposals, mapProposals, mapProposalVotes } from '../mappers';
import { ACTIVE_PROPOSALS_QUERY, ACTIVE_PROPOSALS_DATA_QUERY, PROPOSAL_DETAILS_QUERY, PROPOSAL_DEPOSITS_QUERY, PROPOSALS_QUERY, PROPOSAL_VOTES_QUERY, PROPOSAL_VOTES_FILTERED_QUERY } from '../queries';
import type { ActiveProposalsResponse, ActiveProposalsDataResponse, ProposalDetailsResponse, ProposalDepositsResponse, ProposalVotesResponse, ProposalsResponse } from '../types';

const FALLBACK_GOV_PARAMS: GovParams = {
  quorum: 66.7,
  threshold: 66.7,
  vetoThreshold: 33.4,
  expeditedThreshold: 80,
  expeditedVotingPeriodSeconds: 86400,
};

export class CallistoProposalService implements IProposalService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly primaryDenom = 'axrp',
    private readonly cosmosRpc?: CosmosRpcClient,
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

  async getActiveProposals(limit = 5): Promise<ProposalDetail[]> {
    const response = await this.fetcher.graphql<
      ActiveProposalsResponse,
      { limit: number }
    >({
      query: ACTIVE_PROPOSALS_QUERY,
      variables: { limit },
      operationName: 'ActiveProposals',
    });

    const proposalIds = response.proposal.map((p) => p.proposalId);
    if (proposalIds.length === 0) return [];

    const dataResponse = await this.fetcher.graphql<
      ActiveProposalsDataResponse,
      { proposalIds: number[] }
    >({
      query: ACTIVE_PROPOSALS_DATA_QUERY,
      variables: { proposalIds },
      operationName: 'ActiveProposalsData',
    });

    const tallyByProposalId = new Map(
      dataResponse.proposal_tally_result.map((t) => [
        t.proposalId,
        {
          yes: String(t.yes ?? "0"),
          no: String(t.no ?? "0"),
          abstain: String(t.abstain ?? "0"),
          noWithVeto: String(t.noWithVeto ?? "0"),
        },
      ])
    );

    const bondedByProposalId = new Map<number, string>(
      dataResponse.proposal_staking_pool_snapshot.map((s) => [
        s.proposalId,
        String(s.bondedTokens ?? "0"),
      ])
    );

    return mapActiveProposals(response, this.primaryDenom, tallyByProposalId, bondedByProposalId);
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

  async getProposalDeposits(proposalId: number): Promise<ProposalDeposit[]> {
    const response = await this.fetcher.graphql<
      ProposalDepositsResponse,
      { proposalId: number }
    >({
      query: PROPOSAL_DEPOSITS_QUERY,
      variables: { proposalId },
      operationName: 'ProposalDeposits',
    });

    return response.proposal_deposit.map((d) => ({
      depositorAddress: d.depositor_address,
      amount: d.amount ?? [],
      timestamp: d.timestamp ?? null,
    }));
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

  async getGovParams(): Promise<GovParams | null> {
    if (!this.cosmosRpc) return null;

    try {
      const data = await this.cosmosRpc.getGovParams();

      const params = data?.params;
      if (!params) return FALLBACK_GOV_PARAMS;

      const expeditedSeconds = params.expedited_voting_period
        ? parseFloat(params.expedited_voting_period.replace('s', ''))
        : FALLBACK_GOV_PARAMS.expeditedVotingPeriodSeconds;

      return {
        quorum: parseFloat(params.quorum ?? '0') * 100,
        threshold: parseFloat(params.threshold ?? '0') * 100,
        vetoThreshold: parseFloat(params.veto_threshold ?? '0') * 100,
        expeditedThreshold: parseFloat(params.expedited_threshold ?? '0') * 100,
        expeditedVotingPeriodSeconds: expeditedSeconds,
      };
    } catch {
      return FALLBACK_GOV_PARAMS;
    }
  }
}
