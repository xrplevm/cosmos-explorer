import { type RpcClient, type RpcClientOptions, createRpcClient } from './rpc-client';

// ─── Cosmos REST response types ──────────────────────────────────────────────

export interface CosmosGovParams {
  params: {
    quorum: string;
    threshold: string;
    veto_threshold: string;
    expedited_threshold: string;
    expedited_voting_period: string;
    min_deposit: { denom: string; amount: string }[];
    max_deposit_period: string;
    voting_period: string;
  };
}

export interface CosmosGovVote {
  proposal_id: string;
  voter: string;
  options: { option: string; weight: string }[];
  metadata: string;
}

export interface CosmosGovVotesResponse {
  votes: CosmosGovVote[];
  pagination: {
    next_key: string | null;
    total: string;
  };
}

export interface CosmosStakingPool {
  pool: {
    bonded_tokens: string;
    not_bonded_tokens: string;
  };
}

export interface CosmosStakingParams {
  params: {
    unbonding_time: string;
    max_validators: number;
    max_entries: number;
    historical_entries: number;
    bond_denom: string;
    min_commission_rate: string;
  };
}

// ─── CosmosRpcClient ─────────────────────────────────────────────────────────

export class CosmosRpcClient {
  private readonly client: RpcClient;

  constructor(options: RpcClientOptions) {
    this.client = createRpcClient(options);
  }

  // ── Gov module ───────────────────────────────────────────────────────────

  async getGovParams(): Promise<CosmosGovParams> {
    return this.client.get<CosmosGovParams>('/cosmos/gov/v1/params/tallying');
  }

  async getProposalVotes(
    proposalId: number,
    params?: { paginationKey?: string; limit?: number; option?: string },
  ): Promise<CosmosGovVotesResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('pagination.limit', String(params.limit));
    if (params?.paginationKey) query.set('pagination.key', params.paginationKey);
    if (params?.option) query.set('option', params.option);
    query.set('pagination.count_total', 'true');
    const qs = query.toString();
    return this.client.get<CosmosGovVotesResponse>(
      `/cosmos/gov/v1/proposals/${proposalId}/votes${qs ? `?${qs}` : ''}`,
    );
  }

  /** Fetches all votes using cursor-based pagination (no offset penalty). */
  async getAllProposalVotes(
    proposalId: number,
    option?: string,
  ): Promise<{ votes: CosmosGovVote[]; total: number }> {
    const all: CosmosGovVote[] = [];
    let nextKey: string | null = null;
    let total = 0;

    do {
      const response = await this.getProposalVotes(proposalId, {
        limit: 500,
        paginationKey: nextKey ?? undefined,
        option,
      });
      all.push(...response.votes);
      nextKey = response.pagination.next_key;
      if (response.pagination.total !== '0') {
        total = parseInt(response.pagination.total, 10);
      }
    } while (nextKey);

    return { votes: all, total: total || all.length };
  }

  // ── Staking module ───────────────────────────────────────────────────────

  async getStakingPool(): Promise<CosmosStakingPool> {
    return this.client.get<CosmosStakingPool>('/cosmos/staking/v1beta1/pool');
  }

  async getStakingParams(): Promise<CosmosStakingParams> {
    return this.client.get<CosmosStakingParams>('/cosmos/staking/v1beta1/params');
  }

}

export function createCosmosRpcClient(options: RpcClientOptions): CosmosRpcClient {
  return new CosmosRpcClient(options);
}
