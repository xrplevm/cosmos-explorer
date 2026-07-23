import {
  type IValidatorService,
  type ValidatorCount,
  type ValidatorDetail,
  type ValidatorSet,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

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
import { withResolvedAvatars } from './avatars';

async function resolveSetAvatars(raw: RawValidatorSet): Promise<ValidatorSet> {
  return {
    ...raw,
    items: await withResolvedAvatars(raw.items),
  };
}

export class CallistoValidatorService implements IValidatorService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly stakingDenom = 'poa'
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

    const rawSet = mapValidatorSet(response, this.stakingDenom);
    return resolveSetAvatars(rawSet);
  }

  async getValidatorByAddress(address: string): Promise<ValidatorDetail | null> {
    const response = await this.fetcher.graphql<ValidatorsResponse>({
      query: VALIDATORS_QUERY,
      operationName: 'Validators',
    });

    const rawSet = mapValidatorSet(response, this.stakingDenom);

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

    const [detail] = await withResolvedAvatars([rawDetail]);
    return detail;
  }
}
