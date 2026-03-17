import {
  type IValidatorService,
  type ValidatorCount,
  type ValidatorDetail,
  type ValidatorSet,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapValidatorCount, mapValidatorDetail, mapValidatorSet } from '../mappers';
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

    return mapValidatorSet(response, this.primaryDenom);
  }

  async getValidatorByAddress(address: string): Promise<ValidatorDetail | null> {
    const [validatorSet, detailResponse] = await Promise.all([
      this.getValidatorSet(),
      this.fetcher.graphql<
        ValidatorDetailsResponse,
        { address: string; limit: number }
      >({
        query: VALIDATOR_DETAILS_QUERY,
        variables: {
          address,
          limit: 10,
        },
        operationName: 'ValidatorDetails',
      }),
    ]);

    return mapValidatorDetail(detailResponse, validatorSet);
  }
}
