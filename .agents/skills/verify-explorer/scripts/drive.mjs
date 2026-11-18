#!/usr/bin/env node
// Drive the running explorer the way a person does and keep the proof.
//
//   node .agents/skills/verify-explorer/scripts/drive.mjs            # every feature
//   node .agents/skills/verify-explorer/scripts/drive.mjs blocks search
//
// Each journey starts from a page a person lands on, moves by clicking or
// searching (never by a URL it made up, except the not-found journey, which
// is about a made-up URL), and checks what the page then shows. Evidence goes
// to .verify-explorer/evidence/<run>/: a screenshot per step and report.json.
// Exits 1 when any journey fails. One feature here is one file in features/.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const { chromium } = createRequire(join(process.cwd(), "noop.js"))("playwright");

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  cwd: import.meta.dirname,
  encoding: "utf8",
}).trim();
const state = process.env.VERIFY_EXPLORER_DIR ?? join(root, ".verify-explorer");
const runDir = join(state, "run");
const port = readFileSync(join(runDir, "port"), "utf8").trim();
const network = readFileSync(join(runDir, "network"), "utf8").trim();
const base = `http://127.0.0.1:${port}`;
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const evidence = join(state, "evidence", `${stamp}-${network}`);
mkdirSync(evidence, { recursive: true });

const SEARCH = "Search block, tx, address...";
const serverLog = () => readFileSync(join(runDir, "server.log"), "utf8");
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

/** Click a link and wait for the client-side navigation it starts. */
async function follow(page, locator, urlGlob) {
  await Promise.all([page.waitForURL(urlGlob), locator.click()]);
}
async function search(page, query, urlGlob) {
  await page.goto(`${base}/`);
  const box = page.getByPlaceholder(SEARCH);
  await box.fill(query);
  await Promise.all([page.waitForURL(urlGlob), box.press("Enter")]);
}
const heading = (page, name) => page.getByRole("heading", { name }).first();
const text = (page, pattern) => page.getByText(pattern).first();

const journeys = {
  async overview(page, shot) {
    await page.goto(`${base}/`);
    await heading(page, "Overview").waitFor();
    await page.locator('a[href^="/blocks/"]').first().waitFor();
    await page.locator('a[href^="/transactions/"]').first().waitFor();
    await shot("overview");
  },

  async blocks(page, shot) {
    await page.goto(`${base}/`);
    await follow(page, page.locator('nav a[href="/blocks"], header a[href="/blocks"]').first(), "**/blocks");
    await heading(page, "Blocks").waitFor();
    await shot("list");
    const first = page.locator('a[href^="/blocks/"]').first();
    const height = (await first.getAttribute("href")).split("/").pop();
    await follow(page, first, `**/blocks/${height}`);
    await text(page, `#${Number(height).toLocaleString("en-US")}`).waitFor();
    await text(page, "Block Hash").waitFor();
    await shot("detail");
  },

  async transactions(page, shot) {
    await page.goto(`${base}/transactions`);
    await heading(page, "Transactions").waitFor();
    await shot("list");
    const first = page.locator('a[href^="/transactions/"]').first();
    const hash = (await first.getAttribute("href")).split("/").pop();
    await follow(page, first, `**/transactions/${hash}`);
    await heading(page, "Transaction Details").waitFor();
    await text(page, hash).waitFor();
    await text(page, /^Status$/).waitFor();
    await shot("detail");
  },

  async validators(page, shot) {
    await page.goto(`${base}/validators`);
    await heading(page, "Validators").waitFor();
    await shot("list");
    const first = page.locator('a[href^="/validators/"]').first();
    const operator = (await first.getAttribute("href")).split("/").pop();
    await follow(page, first, `**/validators/${operator}`);
    await text(page, "Operator Address").waitFor();
    await text(page, operator).waitFor();
    await shot("detail");
  },

  async accounts(page, shot) {
    // A person reaches an account from a validator's self-delegate address.
    await page.goto(`${base}/validators`);
    await follow(page, page.locator('a[href^="/validators/"]').first(), "**/validators/*");
    const link = page.locator('a[href^="/account/"]').first();
    const address = (await link.getAttribute("href")).split("/").pop();
    await follow(page, link, `**/account/${address}`);
    await text(page, "Balances").waitFor();
    await text(page, "Delegations").waitFor();
    assert(!(await page.getByText("Something went wrong").count()), "the account page shows the error boundary");
    await shot("detail");
  },

  async proposals(page, shot) {
    await page.goto(`${base}/proposals`);
    await heading(page, "Proposals").waitFor();
    await shot("list");
    const first = page.locator('a[href^="/proposals/"]').first();
    const id = (await first.getAttribute("href")).split("/").pop();
    await follow(page, first, `**/proposals/${id}`);
    await text(page, `#${id}`).waitFor();
    await text(page, "Vote Distribution").waitFor();
    await shot("detail");
  },

  async consensus(page, shot) {
    await page.goto(`${base}/consensus`);
    await heading(page, /consensus signing matrix/i).waitFor();
    await shot("matrix");
  },

  async search(page, shot) {
    await page.goto(`${base}/blocks`);
    const height = (await page.locator('a[href^="/blocks/"]').first().getAttribute("href")).split("/").pop();
    await search(page, height, `**/blocks/${height}`);
    await text(page, "Block Hash").waitFor();
    await shot("by-height");

    await page.goto(`${base}/transactions`);
    const hash = (await page.locator('a[href^="/transactions/"]').first().getAttribute("href")).split("/").pop();
    await search(page, hash, `**/transactions/${hash}`);
    await heading(page, "Transaction Details").waitFor();
    await shot("by-tx-hash");

    await page.goto(`${base}/validators`);
    await follow(page, page.locator('a[href^="/validators/"]').first(), "**/validators/*");
    const address = (await page.locator('a[href^="/account/"]').first().getAttribute("href")).split("/").pop();
    await search(page, address, `**/account/${address}`);
    await text(page, "Balances").waitFor();
    await shot("by-address");
  },

  async "not-found"(page, shot) {
    const res = await page.goto(`${base}/blocks/999999999999`);
    await text(page, "Block not found").waitFor();
    await text(page, "Back to Blocks").waitFor();
    await shot("missing-block");
    return { note: `a missing block answers HTTP ${res.status()}` };
  },
};

const wanted = process.argv.slice(2).filter((a) => a !== "all");
const unknown = wanted.filter((name) => !(name in journeys));
if (unknown.length) {
  console.error(`drive: unknown feature(s) ${unknown.join(", ")}; known: ${Object.keys(journeys).join(", ")}`);
  process.exit(2);
}
const names = wanted.length ? wanted : Object.keys(journeys);

const browser = await chromium.launch();
const results = [];
for (const name of names) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // A slow live network wants the 30s default; the evals' fixture server, less.
  page.setDefaultTimeout(Number(process.env.VERIFY_EXPLORER_TIMEOUT_MS ?? 30_000));
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const logBefore = serverLog().length;
  const shots = [];
  const shot = async (step) => {
    const file = join(evidence, `${name}-${step}.png`);
    await page.screenshot({ path: file, fullPage: true });
    shots.push(file);
  };
  const started = Date.now();
  let status = "pass";
  let detail;
  try {
    detail = (await journeys[name](page, shot))?.note;
    const serverErrors = serverLog().slice(logBefore).split("\n").filter((l) => l.startsWith("⨯"));
    assert(!pageErrors.length, `browser errors: ${pageErrors.join("; ").slice(0, 300)}`);
    assert(!serverErrors.length, `server errors: ${serverErrors.join("; ").slice(0, 300)}`);
  } catch (error) {
    status = "fail";
    detail = error.message.split("\n")[0];
    await shot("failure").catch(() => {});
  }
  results.push({ feature: name, status, ms: Date.now() - started, url: page.url(), detail, shots });
  console.log(`${status === "pass" ? "pass" : "FAIL"}  ${name.padEnd(13)} ${(Date.now() - started) / 1000}s  ${detail ?? ""}`);
  await page.close();
}
await browser.close();

writeFileSync(
  join(evidence, "report.json"),
  JSON.stringify({ network, base, at: new Date().toISOString(), results }, null, 2),
);
console.log(`\nevidence: ${evidence}`);
process.exit(results.some((r) => r.status === "fail") ? 1 : 0);
