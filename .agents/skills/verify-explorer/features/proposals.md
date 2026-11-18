# Proposals

Governance proposals and a proposal's detail, with its tally and votes.

## Sub-features

- `/proposals`: the list, with a search by title, ID or type.
- `/proposals/[id]`: status, title, type, quorum, vote distribution
  (Yes, No, Abstain, No with Veto), expected outcome, timeline and the
  voters, each linking to an account.

## How to get to it (user POV)

Click **Proposals** in the sidebar, then a proposal.

## Driving it with drive.mjs

`proposals`: load `/proposals`, wait for the heading, click the first
proposal, and wait for `#<id>` and `Vote Distribution`.

## Gotchas

- The detail page keeps the `Proposals` heading; prove the detail by its
  `#<id>` and tally, not by a heading.
- Votes are paged through in full (`fix(explorer): page through all
  proposal votes`); a change there needs a proposal with more voters than
  one page holds.
