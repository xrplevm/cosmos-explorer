# Validators

The validator set and a validator's detail.

## Sub-features

- `/validators`: rank, Validator, Status, Voting Power, Commission, Missed
  Blocks.
- `/validators/[address]`: status, voting power, commission, missed blocks,
  tombstoned and jailed flags, operator and self-delegate addresses, and the
  blocks it proposed.

## How to get to it (user POV)

Click **Validators** in the sidebar, then a validator.

## Driving it with drive.mjs

`validators`: load `/validators`, wait for the heading, click the first
validator, and wait for `Operator Address` and the same operator address.

## Gotchas

- Operator addresses are `ethmvaloper1…`; the self-delegate address on the
  detail page is the account (`ethm1…`) the accounts journey follows.
