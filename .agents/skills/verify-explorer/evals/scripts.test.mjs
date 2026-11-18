// Contract tests for verify-explorer's scripts. They prove that each script
// keeps the promises SKILL.md makes for it, and that each check the driver
// runs can fail: a journey is driven against a fixture server that breaks
// one thing, next to a control that does not.
//
//   node --test .agents/skills/verify-explorer/evals/scripts.test.mjs
//
// The fixtures need no build, network or chain. Playwright must resolve, as
// for the skill itself. VERIFY_EXPLORER_E2E=1 also runs the whole skill
// once against testnet (a build, about two minutes).
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync, appendFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, test } from "node:test";

const scripts = join(import.meta.dirname, "..", "scripts");

// Async on purpose: the fixture servers live in this process, and a
// spawnSync would block the event loop they answer from.
function run(script, args = [], env = {}) {
  const cmd = script.endsWith(".mjs") ? process.execPath : join(scripts, script);
  const argv = script.endsWith(".mjs") ? [join(scripts, script), ...args] : args;
  return new Promise((resolve) => {
    const child = spawn(cmd, argv, {
      env: { ...process.env, VERIFY_EXPLORER_TIMEOUT_MS: "4000", ...env },
    });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    const timer = setTimeout(() => child.kill(), 300_000);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, out });
    });
  });
}

/** A fresh state dir, as launch.sh leaves it, pointing at `port`. */
function stateFor(port, { pid = process.pid, network = "testnet" } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "verify-explorer-eval-"));
  mkdirSync(join(dir, "run"));
  writeFileSync(join(dir, "run", "pid"), String(pid));
  writeFileSync(join(dir, "run", "port"), String(port));
  writeFileSync(join(dir, "run", "network"), network);
  writeFileSync(join(dir, "run", "build-network"), network);
  writeFileSync(join(dir, "run", "server.log"), "✓ Ready\n");
  return dir;
}

const sleeper = () => spawn("sleep", ["60"], { stdio: "ignore" });
const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
const report = (dir) => {
  const [runDir] = readdirSync(join(dir, "evidence"));
  return { dir: join(dir, "evidence", runDir), ...JSON.parse(readFileSync(join(dir, "evidence", runDir, "report.json"), "utf8")) };
};

// --- A fixture explorer -----------------------------------------------------
// Just enough of each page for one journey, with a switch per breakage.
const page = (body) => `<!doctype html><html><body><nav><a href="/blocks">Blocks</a></nav><main>${body}</main></body></html>`;
const ACCOUNT_LOADED =
  "<h1>Account</h1><p>acc1</p><h2>Balances</h2><p>Unclaimed delegation rewards</p><h2>Delegations</h2>";
// What loading.tsx renders: the same headings over skeletons, no data.
const ACCOUNT_SKELETON =
  '<h1>Account</h1><div class="animate-pulse"></div><h2>Balances</h2><h2>Delegations</h2>';
function fixture({ overviewLinks = true, accountError = false, accountStuck = false, serverErrorOn, logFile } = {}) {
  const pages = {
    "/": page(`<h1>Overview</h1>${overviewLinks ? '<a href="/blocks/7">7</a><a href="/transactions/AB">AB</a>' : ""}`),
    "/validators": page('<h1>Validators</h1><a href="/validators/val1">val1</a>'),
    "/validators/val1": page('<p>Operator Address</p><p>val1</p><a href="/account/acc1">acc1</a>'),
    "/account/acc1": page(
      accountError
        ? "<h2>Balances</h2><h2>Delegations</h2><p>Something went wrong</p>"
        : accountStuck
          ? ACCOUNT_SKELETON
          : ACCOUNT_LOADED,
    ),
    "/consensus": page("<h1>XRPL EVM Sidechain consensus signing matrix</h1>"),
  };
  const server = createServer((req, res) => {
    if (req.url === serverErrorOn && logFile) appendFileSync(logFile, "⨯ Error: upstream failed\n");
    const html = pages[req.url];
    res.writeHead(html ? 200 : 404, { "content-type": "text/html" });
    res.end(html ?? page("<p>not here</p>"));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}
const servers = [];
async function serve(opts) {
  const server = await fixture(opts);
  servers.push(server);
  return server.address().port;
}
after(() => servers.forEach((s) => s.close()));

// --- Usage and refusals -----------------------------------------------------
describe("refusals", () => {
  test("drive names the known features when given an unknown one", async () => {
    const dir = stateFor(1);
    const { code, out } = await run("drive.mjs", ["no-such-feature"], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 2);
    assert.match(out, /unknown feature\(s\) no-such-feature; known: overview, blocks/);
  });

  test("launch refuses an unknown network", async () => {
    const { code, out } = await run("launch.sh", ["regtest"], { VERIFY_EXPLORER_DIR: mkdtempSync(join(tmpdir(), "ve-")) });
    assert.equal(code, 2);
    assert.match(out, /unknown network 'regtest'/);
  });

  test("launch refuses a port something else holds", async () => {
    const port = await serve();
    const { code, out } = await run("launch.sh", ["testnet"], {
      VERIFY_EXPLORER_DIR: mkdtempSync(join(tmpdir(), "ve-")),
      VERIFY_EXPLORER_PORT: String(port),
    });
    assert.equal(code, 1);
    assert.match(out, new RegExp(`something else already answers on :${port}`));
  });

  test("launch refuses to start a second instance", async () => {
    const child = sleeper();
    try {
      const dir = stateFor(3999, { pid: child.pid });
      const { code, out } = await run("launch.sh", ["testnet"], { VERIFY_EXPLORER_DIR: dir });
      assert.equal(code, 1);
      assert.match(out, /already running \(pid \d+, testnet on :3999\)/);
    } finally {
      child.kill();
    }
  });
});

// --- Doctor -----------------------------------------------------------------
describe("doctor", () => {
  test("says there is nothing to check when no instance is recorded", async () => {
    const { code, out } = await run("doctor.mjs", [], { VERIFY_EXPLORER_DIR: mkdtempSync(join(tmpdir(), "ve-")) });
    assert.equal(code, 1);
    assert.match(out, /FAIL {2}no instance recorded/);
  });

  test("fails when the recorded server is gone and the port is dead", async () => {
    const child = sleeper();
    const pid = child.pid;
    child.kill();
    await new Promise((r) => child.on("exit", r));
    const dir = stateFor(1, { pid });
    const { code, out } = await run("doctor.mjs", [], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 1);
    assert.match(out, new RegExp(`FAIL {2}server pid ${pid} is gone`));
    assert.match(out, /FAIL {2}GET \/ failed/);
  });

  test("fails when the build is for another network than the server runs", async () => {
    const port = await serve();
    const dir = stateFor(port);
    writeFileSync(join(dir, "run", "build-network"), "mainnet");
    const { code, out } = await run("doctor.mjs", [], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 1);
    assert.match(out, /FAIL {2}the build is for mainnet, the server runs testnet/);
  });
});

// --- Cleanup ----------------------------------------------------------------
describe("cleanup", () => {
  test("stops the recorded pid and keeps the evidence", async () => {
    const child = sleeper();
    const exited = new Promise((r) => child.on("exit", r));
    const dir = stateFor(1, { pid: child.pid });
    mkdirSync(join(dir, "evidence", "run-1"), { recursive: true });
    writeFileSync(join(dir, "evidence", "run-1", "report.json"), "{}");
    const { code, out } = await run("cleanup.sh", [], { VERIFY_EXPLORER_DIR: dir });
    await exited;
    assert.equal(code, 0);
    assert.match(out, new RegExp(`stopped pid ${child.pid}`));
    assert.equal(alive(child.pid), false);
    assert.equal(existsSync(join(dir, "run", "pid")), false);
    assert.equal(existsSync(join(dir, "evidence", "run-1", "report.json")), true);
  });

  test("is a no-op when the recorded pid already exited", async () => {
    const child = sleeper();
    const pid = child.pid;
    child.kill();
    await new Promise((r) => child.on("exit", r));
    const { code, out } = await run("cleanup.sh", [], { VERIFY_EXPLORER_DIR: stateFor(1, { pid }) });
    assert.equal(code, 0);
    assert.match(out, new RegExp(`pid ${pid} had already exited`));
  });
});

// --- The driver's checks can fail, for the right reason --------------------
describe("drive", () => {
  test("control: journeys pass against a fixture that renders them", async () => {
    const port = await serve();
    const dir = stateFor(port);
    const { code, out } = await run("drive.mjs", ["overview", "accounts", "consensus"], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 0, out);
    const r = report(dir);
    assert.deepEqual(r.results.map((x) => [x.feature, x.status]), [
      ["overview", "pass"],
      ["accounts", "pass"],
      ["consensus", "pass"],
    ]);
    for (const shot of r.results.flatMap((x) => x.shots)) assert.ok(existsSync(shot), shot);
  });

  test("overview fails when the page renders its heading but no live data", async () => {
    const port = await serve({ overviewLinks: false });
    const dir = stateFor(port);
    const { code, out } = await run("drive.mjs", ["overview"], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 1);
    assert.match(out, /FAIL {2}overview/);
    const [result] = report(dir).results;
    assert.equal(result.status, "fail");
    assert.ok(result.shots.some((s) => s.endsWith("overview-failure.png") && existsSync(s)));
  });

  test("accounts fails when the page shows the error boundary", async () => {
    const port = await serve({ accountError: true });
    const dir = stateFor(port);
    const { code, out } = await run("drive.mjs", ["accounts"], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 1);
    assert.match(out, /FAIL {2}accounts .*error boundary/);
  });

  test("accounts fails when the page never leaves its loading skeleton", async () => {
    const port = await serve({ accountStuck: true });
    const dir = stateFor(port);
    const { code, out } = await run("drive.mjs", ["accounts"], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 1);
    assert.match(out, /FAIL {2}accounts .*Timeout/);
  });

  test("a journey fails on a server error even when the page looks right", async () => {
    const dir = stateFor(0);
    const port = await serve({ serverErrorOn: "/consensus", logFile: join(dir, "run", "server.log") });
    writeFileSync(join(dir, "run", "port"), String(port));
    const { code, out } = await run("drive.mjs", ["consensus"], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 1);
    assert.match(out, /FAIL {2}consensus .*server errors: ⨯ Error: upstream failed/);
  });

  test("a journey fails when the server is not there", async () => {
    // A port that was just free (not port 1: Chromium refuses it as unsafe
    // before connecting, which would test the wrong thing).
    const probe = createServer();
    await new Promise((r) => probe.listen(0, "127.0.0.1", r));
    const port = probe.address().port;
    await new Promise((r) => probe.close(r));
    const dir = stateFor(port);
    const { code, out } = await run("drive.mjs", ["overview"], { VERIFY_EXPLORER_DIR: dir });
    assert.equal(code, 1);
    assert.match(out, /FAIL {2}overview .*ERR_CONNECTION_REFUSED/);
  });
});

// --- The whole skill, once, against a real network (opt in) ---------------
describe("end to end", { skip: process.env.VERIFY_EXPLORER_E2E !== "1" && "set VERIFY_EXPLORER_E2E=1" }, () => {
  test("launch, doctor, drive, cleanup on testnet; the evidence survives", async () => {
    const dir = mkdtempSync(join(tmpdir(), "verify-explorer-e2e-"));
    const env = { VERIFY_EXPLORER_DIR: dir, VERIFY_EXPLORER_TIMEOUT_MS: "30000", VERIFY_EXPLORER_PORT: "3190" };
    try {
      let r = await run("launch.sh", ["testnet"], env);
      assert.equal(r.code, 0, r.out);
      r = await run("doctor.mjs", [], env);
      assert.equal(r.code, 0, r.out);
      r = await run("drive.mjs", ["overview", "blocks"], env);
      assert.equal(r.code, 0, r.out);
    } finally {
      await run("cleanup.sh", [], env);
    }
    const r = report(dir);
    assert.deepEqual(r.results.map((x) => x.status), ["pass", "pass"]);
    for (const shot of r.results.flatMap((x) => x.shots)) assert.ok(existsSync(shot), shot);
  });
});
