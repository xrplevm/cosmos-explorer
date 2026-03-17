export type ValidatorCount = {
  active: number;
  total: number;
};

export interface IValidatorService {
  getValidatorCount(): Promise<ValidatorCount>;
}
