import { type IValidatorService, type ValidatorCount } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapValidatorCount } from '../home-mappers';
import { VALIDATOR_COUNT_QUERY } from '../home-queries';
import type { ValidatorCountResponse } from '../home-types';

export class CallistoValidatorService implements IValidatorService {
  constructor(private readonly fetcher: Fetcher) {}

  async getValidatorCount(): Promise<ValidatorCount> {
    const response = await this.fetcher.graphql<ValidatorCountResponse>({
      query: VALIDATOR_COUNT_QUERY,
      operationName: 'ValidatorCount',
    });

    return mapValidatorCount(response);
  }
}
