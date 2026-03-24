# Validators Domain Plan

> **Historical document** — This was the initial planning doc for the validators domain. The implementation is complete. See `packages/core/src/` for domain types, `packages/adapters/callisto/src/` for the adapter, and `apps/explorer/src/app/validators/` for the pages.

This file covers the home-page requirements for the validators domain.

## Home Responsibilities

Validators power:

- active validators top card

## Required Data

Minimum:

- active validator count

Optional:

- total validator count

## Proposed Domain Types

```ts
export type Validator = {
  address: string;
  moniker: string;
  status: ValidatorStatus;
  votingPower: string;
  commission: number | null;
};

export type ValidatorDetail = Validator & {
  selfDelegateAddress?: string;
  jailed?: boolean;
};

export type ValidatorCount = {
  active: number;
  total: number;
};
```

## Proposed Adapter Methods

For the home page, validator counts can be exposed through either:

```ts
getValidatorCount(): Promise<ValidatorCount>
```

or:

```ts
getChainStats(): Promise<ChainStats>
```

## Legacy Source Mapping

From `../governance-explorer`:

- active validator count comes from validator aggregate queries on the home screen

## Hasura Structure And Types

For validators, Hasura exposes tracked table data plus aggregate queries.

### Main tracked tables

- `validator`
- `validator_info`
- `validator_description`
- `validator_status`
- `validator_voting_power`
- `validator_commission`

### Relevant metadata files

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_validator.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_validator_info.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_validator_status.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_validator_voting_power.yaml`

### Generated frontend transport types

The frontend codegen produces types such as:

- `ValidatorsQuery`
- `ActiveValidatorCountQuery`

These include both row data and aggregate data.

### Important type quirks

- status, commission, and voting power often arrive through nested arrays
- active and total counts come from aggregate objects, not a clean `ValidatorCount` model
- nested relationships are nullable and need normalization

So the adapter should convert Hasura validator data into:

- `Validator`
- `ValidatorDetail`
- `ValidatorCount`

## Home Implementation Tasks (completed)

1. ~~define the validator count shape in `packages/core`~~
2. ~~decide whether counts belong in `ChainStats` or a dedicated method~~
3. ~~add Callisto adapter query for active and total validators~~
4. ~~expose the count through the server-side service layer~~
5. ~~implement the active validators card~~

## Notes

- for the home page, counts matter more than full validator rows
- keeping validator counts inside `ChainStats` is likely the simplest first implementation
