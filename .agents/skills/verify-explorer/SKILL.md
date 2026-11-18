---
name: verify-explorer
description: Prove the explorer works by running it as production does (the Next.js standalone build) against a real network's public data, driving its pages in a browser the way a person does, and keeping screenshots as evidence. Use it after any change to apps/explorer, packages/{core,adapters/callisto,ui,utils,config,price}, the Docker images or the Node version, before opening or updating a pull request, and whenever asked to run the explorer and show it working.
---

# Verify the explorer

The explorer is a read-only Next.js app: every page is served from a
network's public GraphQL endpoint (`governance.<network>.xrplevm.org`) and
its Cosmos RPC, named in `apps/explorer/src/config/chain.<network>.json`.
So it can be verified against real chain data without running Callisto,
Hasura or a database, and nothing it does can change the chain. This skill
does not cover the indexer (`apps/callisto`, `packages/juno`): a change
there is verified by its Go tests and a local Callisto run.

Everything below is a script in `scripts/`. Run each one from the repo root
as written.

## 1. Launch

```bash
.agents/skills/verify-explorer/scripts/launch.sh testnet
```

It builds the explorer for that network (`mainnet`, `testnet` or `devnet`)
with turbo, copies `static/` and `public/` into the standalone output as
`docker/explorer.Dockerfile` does, and starts `server.js` on port 3100
(`VERIFY_EXPLORER_PORT` to change it). The network is fixed at build time,
since pages are prerendered for it, so one build serves one network.
`--reuse` skips the build when the last one was for the same network; never
reuse after changing source. Ready means the overview renders its heading,
which on a cold start takes 10 to 20 seconds; the script waits up to two
minutes and prints the server log if it gives up.

One instance per checkout: two would share `.next/standalone`. Launch
refuses to start a second one, and refuses a port something else holds.

Test the network a change is aimed at. With no reason to prefer one, use
testnet: it has live traffic and is nobody's production.

## 2. Doctor

```bash
node .agents/skills/verify-explorer/scripts/doctor.mjs
```

A read-only check that the instance is worth driving: the recorded server
is alive, the build is for the network it serves, the overview renders,
the network's RPC reports the chain id its config expects, the newest block
the explorer lists is within 100 blocks of the chain head (a warning beyond
that means the indexer lags, not the explorer), the server has logged no
errors, and Playwright resolves. Run it before the first drive and again
after any failed drive. Exit 1 means do not drive; fix or relaunch.

## 3. Drive

```bash
node .agents/skills/verify-explorer/scripts/drive.mjs                 # every feature
node .agents/skills/verify-explorer/scripts/drive.mjs blocks search  # some
```

One journey per feature in `features/`. Each starts where a person lands,
moves by clicking links or using the header search, and checks what the
page then shows. Browser errors (`pageerror`) and new `⨯` lines in the
server log fail a journey even when the page looks right. It prints one
line per feature and exits 1 when any fails.

A change to one page drives that feature and `overview`; a change to a
shared package, the build or the runtime drives all of them. A new page
gets a feature file and a journey in the same change.

## 4. Evidence

Every drive writes `.verify-explorer/evidence/<time>-<network>/` (git-
ignored): a full-page screenshot per step at 1440px, a `failure`
screenshot for a journey that failed, and `report.json` with each
journey's status, final URL, duration and screenshots. Look at the
screenshots that matter for the change before calling it verified: a pass
proves the expected text appeared, not that the page looks right. Name
the evidence folder in the pull request, and attach the relevant pictures
for a visible change.

## 5. Cleanup

```bash
.agents/skills/verify-explorer/scripts/cleanup.sh
```

Stops the server by the pid launch recorded, never by process name (the
server renames itself `next-server`). Evidence is kept. Run it after the
last drive, and after a failed launch too.

## Reporting

Say which network, which features passed, which failed and why, the
evidence folder, and anything not driven. A failure is one of three
things, and the report says which:

- **The app is wrong**: a page errors, shows wrong data or misses a state.
  That is the finding; do not weaken the journey to pass.
- **This skill is wrong**: a journey or doc no longer matches an app that
  behaves correctly. Fix the skill in the same change, then drive again.
- **The environment is wrong**: no network to the endpoints, no browser.
  Say what was missing; it is not a pass.

## Requirements

Node 24 and pnpm as in the repo's `README.md`, network access to
`*.xrplevm.org`, and Playwright with Chromium. Playwright is not a repo
dependency; if `doctor.mjs` says it does not resolve, install it with
`npm i -g playwright && npx playwright install --with-deps chromium`, or
point `NODE_PATH` at an existing install.
