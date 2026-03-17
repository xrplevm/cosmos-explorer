# Governance Explorer Proposal Data Flow

This document explains how the existing `../governance-explorer` project retrieves and shapes proposal/governance data, so we can reuse the same backend behavior later in this repo.

## Scope

The current implementation is proposal-focused:

- proposal list
- proposal detail overview
- proposal tally
- proposal deposits
- proposal votes
- validator snapshot data used to compute "did not vote"
- governance params used to compute quorum

The old project is not calling chain RPC directly from the frontend. The flow is:

1. Chain data is parsed by BDJuno/Callisto modules.
2. Parsed data is stored in Postgres tables.
3. Hasura exposes those tables as GraphQL.
4. The frontend runs GraphQL queries and formats the results in hooks.

## Main Backend Tables

The governance schema lives in `../governance-explorer/callisto2/database/schema/08-gov.sql`.

Relevant tables:

- `gov_params`
  - stores the latest governance params as JSONB
  - used by the frontend to read quorum
- `proposal`
  - core proposal row
  - fields include `id`, `title`, `description`, `metadata`, `content`, `submit_time`, `deposit_end_time`, `voting_start_time`, `voting_end_time`, `proposer_address`, `status`
- `proposal_deposit`
  - deposits per proposal
  - includes `amount`, `depositor_address`, `timestamp`, `transaction_hash`, `height`
- `proposal_vote`
  - votes per proposal
  - includes `voter_address`, `option`, `weight`, `timestamp`, `height`
- `proposal_tally_result`
  - current tally totals per proposal
  - includes `yes`, `abstain`, `no`, `no_with_veto`, `height`
- `proposal_staking_pool_snapshot`
  - snapshot of bonded/not-bonded staking pool for a proposal
  - used for tally/quorum display
- `proposal_validator_status_snapshot`
  - snapshot of validator status and voting power for a proposal
  - used to derive validators that did not vote

## How The Backend Populates Proposal Data

### Proposal rows

`../governance-explorer/callisto2/database/gov.go`

- `SaveProposals(...)` inserts or updates the `proposal` table.
- Proposal messages are serialized into the `content` JSONB column.
- Proposal metadata is stored too.

### Deposits

`SaveDeposits(...)` writes to `proposal_deposit`.

### Votes

`SaveVote(...)` writes to `proposal_vote`.

### Tally result

`SaveTallyResults(...)` writes to `proposal_tally_result`.

The tally is refreshed by:

- `../governance-explorer/callisto2/modules/gov/utils_proposal.go`
- `UpdateProposalTallyResult(proposalID, height)`

This reads the tally from the governance source and persists it.

### Proposal status

`UpdateProposalStatus(height, id)` refreshes the latest proposal state from chain data and updates:

- `status`
- `voting_start_time`
- `voting_end_time`

If the proposal has been removed from chain state, the code marks it as invalid.

### Staking pool snapshot

`UpdateProposalStakingPoolSnapshot(height, proposalID)` stores a snapshot in `proposal_staking_pool_snapshot`.

This is important because the UI does not compute quorum against live staking pool data. It uses the proposal-specific snapshot table.

### Validator snapshot

`../governance-explorer/callisto2/modules/staking/utils_validators.go`

- `UpdateValidatorStatuses()` gets the latest validators
- for each open proposal, it calls `updateProposalValidatorStatusSnapshot(...)`
- snapshots are stored through `SaveProposalValidatorsStatusesSnapshots(...)`

This is what powers the "validators who did not vote" logic in the UI.

### Manual refresh command

`../governance-explorer/callisto2/cmd/parse/gov/proposal.go`

There is a repair/refetch command for a specific proposal:

- refresh proposal details
- refresh deposits
- refresh votes
- update latest status
- update tally
- update staking pool snapshot

That command is useful because it shows the full backend contract the frontend depends on.

## How Hasura Exposes The Data

Hasura metadata is under:

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/`

Relevant table configs:

- `public_proposal.yaml`
- `public_proposal_deposit.yaml`
- `public_proposal_vote.yaml`
- `public_proposal_tally_result.yaml`
- `public_proposal_staking_pool_snapshot.yaml`
- `public_proposal_validator_status_snapshot.yaml`
- `public_gov_params.yaml`

Important relationships exposed by Hasura:

- `proposal -> proposal_deposits`
- `proposal -> proposal_votes`
- `proposal -> proposal_tally_result`
- `proposal -> staking_pool_snapshot`
- `proposal -> validator_status_snapshots`
- `proposal_deposit -> block`
- `proposal_vote -> block`
- `proposal_validator_status_snapshot -> validator`

The frontend mostly queries the raw tables directly instead of navigating through deep nested relationships.

## Frontend Query Layer

The shared GraphQL queries live in:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/proposals.graphql`
- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/proposal_details.graphql`

The XRP EVM app overrides the detail query here:

- `../governance-explorer/big-dipper-2.0-cosmos/apps/web-xrplevm/src/graphql/general/proposal_details.graphql`

### Proposal list query

`Proposals($limit, $offset)` reads:

- `proposal.id`
- `proposal.title`
- `proposal.status`
- `proposal.description`
- `proposal_aggregate.aggregate.count`

The list is ordered by `id desc`.

### Proposal overview query

`ProposalDetails($proposalId)` reads:

- `proposer_address`
- `title`
- `description`
- `status`
- `content`
- `id`
- `submit_time`
- `deposit_end_time`
- `voting_start_time`
- `voting_end_time`

XRP EVM also requests:

- `metadata`

The shared query also references `proposalType` in hook code, but the generic GraphQL query shown in `packages/ui` does not fetch it. The XRP EVM version does not fetch `proposalType` either.

### Proposal tally query

`ProposalDetailsTally($proposalId)` reads:

- `proposal_tally_result`
- `proposal_staking_pool_snapshot`
- latest `gov_params`

Used for:

- yes/no/abstain/veto totals
- bonded voting power snapshot
- quorum percent

### Proposal deposits query

`ProposalDetailsDeposits($proposalId)` reads:

- `proposal_deposit.amount`
- `proposal_deposit.depositor_address`
- related `block.timestamp`

### Proposal votes query

`ProposalDetailsVotes($proposalId)` reads:

- `proposal_vote.option`
- `proposal_vote.voter_address`
- `proposal_validator_status_snapshot` filtered to `status = 3`
- nested `validator.validator_info.self_delegate_address`

That validator data is not for rendering the validator list directly. It is used to figure out which active validators did not vote.

## Frontend Hooks And Formatting

### Proposal list

`../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/proposals/hooks.ts`

Behavior:

- fetches `50` proposals at a time
- uses `fetchMore` for pagination
- merges pages with `R.uniq(...)`
- sanitizes proposal descriptions with `xss`
- converts newlines to `<br/>`

Returned item shape:

- `id`
- `title`
- `status`
- `description`

### Shared proposal detail overview

`../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/proposal_details/hooks.ts`

Behavior:

- reads `router.query.id`
- converts it with `parseFloat(...)`
- fetches one proposal
- maps the first row to an `overview` object
- treats `0001-01-01T00:00:00` as an empty timestamp

Returned fields:

- `proposer`
- `content`
- `title`
- `id`
- `description`
- `status`
- `submitTime`
- `proposalType`
- `depositEndTime`
- `votingStartTime`
- `votingEndTime`

Note: the hook expects `proposalType`, but the generic query shown beside it does not fetch that field.

### XRP EVM proposal detail overview

`../governance-explorer/big-dipper-2.0-cosmos/apps/web-xrplevm/src/screens/proposal_details/hooks.ts`

Differences from the shared version:

- also reads `metadata`
- converts `content` messages through `convertMsgsToModels(...)`
- supports raw/formatted message display
- supports client-side message category filtering

This means the old XRP-specific frontend does not treat proposal `content` as raw JSON only. It converts it into message view models for rendering.

### Deposits

`../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/proposal_details/components/deposits/hooks.ts`

Behavior:

- fetches deposits for the current proposal ID
- formats amounts with `formatToken(...)`
- uses the first coin entry in `amount[0]`
- falls back to the chain `primaryTokenUnit`

Returned fields:

- `amount`
- `user`
- `timestamp`

Important limitation:

- deposits support multiple coins at the database level (`COIN[]`)
- this UI only renders the first coin

### Votes

`../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/proposal_details/components/votes/hooks.ts`

Behavior:

- counts `YES`, `NO`, `ABSTAIN`, `NO_WITH_VETO`
- builds a dictionary of active validators from `proposal_validator_status_snapshot`
- matches validator `self_delegate_address` against `proposal_vote.voter_address`
- validators that are active but missing in vote data are labeled `NOT_VOTED`
- converts those self-delegate addresses to validator addresses with `toValidatorAddress(...)`

Returned fields:

- `data` for actual recorded votes
- `validatorsNotVoted`
- `voteCount`

Important detail:

- the "did not vote" set is derived in the frontend
- it depends on the validator snapshot table being populated correctly for the proposal

### Votes graph / quorum

`../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/proposal_details/components/votes_graph/hooks.ts`

Behavior:

- formats tally amounts with `formatToken(...)`
- uses `votingPowerTokenUnit`
- reads `quorum` from latest `gov_params`
- multiplies quorum by 100 using `Big.js`

Returned fields:

- `votes.yes`
- `votes.no`
- `votes.abstain`
- `votes.veto`
- `bonded`
- `quorum`

Important detail:

- quorum comes from the latest stored gov params
- bonded voting power comes from `proposal_staking_pool_snapshot`
- they are not pulled from a single unified "proposal summary" query

## Routing / Page Structure In The Old App

For XRP EVM:

- `../governance-explorer/big-dipper-2.0-cosmos/apps/web-xrplevm/src/pages/proposals/index.tsx`
- `../governance-explorer/big-dipper-2.0-cosmos/apps/web-xrplevm/src/pages/proposals/[id].tsx`

These pages are thin wrappers. The actual logic sits in the hooks and generated GraphQL hooks.

## What We Need To Reproduce Later

For the new explorer, the old app implies we need adapter methods for at least:

- paginated proposal list
- proposal by ID
- proposal tally result
- proposal deposits
- proposal votes
- proposal validator snapshot or equivalent "did not vote" source
- governance params quorum
- proposal staking pool snapshot

If we keep the same backend, the natural source is still Hasura over the same tables.

## Important Implementation Quirks To Remember

- Proposal details are split across multiple GraphQL queries, not one consolidated query.
- The frontend parses route params with `parseFloat(...)`.
- Empty voting timestamps are encoded as `0001-01-01T00:00:00` and then normalized to empty strings.
- Proposal descriptions are XSS-sanitized before rendering.
- Deposit rendering only uses the first coin in the amount array.
- "Did not vote" is computed in the frontend by diffing votes against validator snapshots.
- XRP EVM detail pages use `metadata` and convert proposal messages into UI models.
- The frontend depends on backend-maintained proposal snapshots, not only live chain state.

## Suggested Next Step Later

When we implement this in `cosmos-explorer`, the clean adapter boundary should likely expose:

- `getProposals(...)`
- `getProposalById(...)`
- `getProposalTallyById(...)`
- `getProposalDepositsById(...)`
- `getProposalVotesById(...)`

Or, if we want to keep the core interface smaller, `getProposalById(...)` can return an expanded object that already includes:

- overview
- tally
- deposits
- votes
- validators-not-voted inputs

The old project currently models those as separate frontend fetches.
