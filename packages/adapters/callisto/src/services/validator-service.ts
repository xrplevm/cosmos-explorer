import {
  type IValidatorService,
  type ValidatorCount,
  type ValidatorDetail,
  type ValidatorSet,
} from '@cosmos-explorer/core';
import { type Fetcher, resolveKeybaseAvatars } from '@cosmos-explorer/utils';

import {
  mapValidatorCount,
  mapValidatorDetail,
  mapValidatorSet,
  type RawValidatorSet,
} from '../mappers';
import {
  VALIDATOR_COUNT_QUERY,
  VALIDATOR_DETAILS_QUERY,
  VALIDATORS_QUERY,
} from '../queries';
import type {
  ValidatorCountResponse,
  ValidatorDetailsResponse,
  ValidatorsResponse,
} from '../types';

async function resolveSetAvatars(raw: RawValidatorSet): Promise<ValidatorSet> {
  const identities = raw.items.map((v) => v._identity);
  const avatarMap = await resolveKeybaseAvatars(identities);

  return {
    ...raw,
    items: raw.items.map(({ _identity, ...v }) => ({
      ...v,
      avatarUrl: _identity ? avatarMap.get(_identity) ?? null : null,
    })),
  };
}

export class CallistoValidatorService implements IValidatorService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly primaryDenom = 'axrp'
  ) {}

  async getValidatorCount(): Promise<ValidatorCount> {
    const response = await this.fetcher.graphql<ValidatorCountResponse>({
      query: VALIDATOR_COUNT_QUERY,
      operationName: 'ValidatorCount',
    });

    return mapValidatorCount(response);
  }

  async getValidatorSet(): Promise<ValidatorSet> {
    const response = await this.fetcher.graphql<ValidatorsResponse>({
      query: VALIDATORS_QUERY,
      operationName: 'Validators',
    });

    const rawSet = mapValidatorSet(response, this.primaryDenom);
    return resolveSetAvatars(rawSet);
  }

  async getValidatorByAddress(address: string): Promise<ValidatorDetail | null> {
    const response = await this.fetcher.graphql<ValidatorsResponse>({
      query: VALIDATORS_QUERY,
      operationName: 'Validators',
    });

    const rawSet = mapValidatorSet(response, this.primaryDenom);

    const detailResponse = await this.fetcher.graphql<
      ValidatorDetailsResponse,
      { address: string; limit: number }
    >({
      query: VALIDATOR_DETAILS_QUERY,
      variables: { address, limit: 10 },
      operationName: 'ValidatorDetails',
    });

    const rawDetail = mapValidatorDetail(detailResponse, rawSet);
    if (!rawDetail) return null;

    const identities = [rawDetail._identity];
    const avatarMap = await resolveKeybaseAvatars(identities);
    const { _identity, ...detail } = rawDetail;

    return {
      ...detail,
      avatarUrl: _identity ? avatarMap.get(_identity) ?? null : null,
    };
  }
}
