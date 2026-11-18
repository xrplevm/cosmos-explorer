#!/usr/bin/env node
// Read-only answer to "is this instance worth driving?". Run it before the
// first drive and again after anything surprising.
//
//   node .agents/skills/verify-explorer/scripts/doctor.mjs
//
// Exits 1 when any check fails. It never starts, stops or changes anything.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  cwd: import.meta.dirname,
  encoding: "utf8",
}).trim();
const run = join(root, ".verify-explorer", "run");
const read = (name) =>
  existsSync(join(run, name)) ? readFileSync(join(run, name), "utf8").trim() : undefined;

let failed = false;
const ok = (msg) => console.log(`ok    ${msg}`);
const fail = (msg) => {
  failed = true;
  console.log(`FAIL  ${msg}`);
};
const warn = (msg) => console.log(`warn  ${msg}`);

// 1. An instance this skill started, still alive.
const pid = read("pid");
const network = read("network");
const port = read("port");
if (!pid || !network || !port) {
  fail("no instance recorded in .verify-explorer/run/; run scripts/launch.sh first");
  process.exit(1);
}
try {
  process.kill(Number(pid), 0);
  ok(`server pid ${pid} is alive (${network} on :${port})`);
} catch {
  fail(`server pid ${pid} is gone; see .verify-explorer/run/server.log`);
}

// 2. The build serves the network the run says it does.
const built = read("build-network");
if (built === network) ok(`the build is for ${network}`);
else fail(`the build is for ${built ?? "an unknown network"}, the server runs ${network}; relaunch`);

// 3. The overview renders, from this server.
const base = `http://127.0.0.1:${port}`;
try {
  const res = await fetch(`${base}/`, { signal: AbortSignal.timeout(20_000) });
  const html = await res.text();
  if (res.ok && html.includes(">Overview</h1>")) ok(`GET / renders the overview (${res.status})`);
  else fail(`GET / answered ${res.status} without the overview heading`);
} catch (error) {
  fail(`GET / failed: ${error.message}`);
}

// 4. The right chain, and fresh data: the newest block the explorer lists
//    is close to the chain head its own config's Cosmos RPC reports.
const config = JSON.parse(
  readFileSync(join(root, "apps/explorer/src/config", `chain.${network}.json`), "utf8"),
);
const expectedChainId = config.network.chainId;
const rpc = config.network.endpoints.cosmosRpc;
try {
  const status = await (await fetch(`${rpc}/status`, { signal: AbortSignal.timeout(15_000) })).json();
  const chainId = status.result.node_info.network;
  const head = Number(status.result.sync_info.latest_block_height);
  if (chainId === expectedChainId) ok(`the RPC reports ${chainId}, as chain.${network}.json expects`);
  else fail(`the RPC reports ${chainId}, chain.${network}.json expects ${expectedChainId}`);

  const html = await (await fetch(`${base}/blocks`, { signal: AbortSignal.timeout(20_000) })).text();
  const heights = [...html.matchAll(/href="\/blocks\/(\d+)"/g)].map((m) => Number(m[1]));
  const newest = Math.max(...heights);
  const lag = head - newest;
  if (!heights.length) fail("/blocks lists no blocks");
  else if (lag <= 100) ok(`/blocks lists height ${newest}, ${lag} behind the chain head ${head}`);
  else warn(`/blocks lists height ${newest}, ${lag} behind the chain head ${head}: the indexer is lagging`);
} catch (error) {
  fail(`could not compare against the chain head at ${rpc}: ${error.message}`);
}

// 5. Server-side errors since launch.
const log = read("server.log") ?? "";
const errors = log.split("\n").filter((line) => line.startsWith("⨯"));
if (errors.length) warn(`${errors.length} server error(s) in .verify-explorer/run/server.log; latest: ${errors.at(-1).slice(0, 160)}`);
else ok("no server errors logged since launch");

// 6. The driver's browser.
try {
  createRequire(join(process.cwd(), "noop.js")).resolve("playwright");
  ok("playwright resolves");
} catch {
  fail("playwright does not resolve: npm i -g playwright && npx playwright install --with-deps chromium (or set NODE_PATH to where it is installed)");
}

process.exit(failed ? 1 : 0);
