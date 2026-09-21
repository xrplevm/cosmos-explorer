import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const callistoDirectory = path.resolve(scriptDirectory, "..");
const repositoryDirectory = path.resolve(callistoDirectory, "../..");
const metadataDirectory = path.join(callistoDirectory, "hasura", "metadata");

function read(relativePath) {
  return readFileSync(path.join(callistoDirectory, relativePath), "utf8");
}

const compose = read("docker-compose.yml");

assert.match(
  compose,
  /HASURA_GRAPHQL_ADMIN_SECRET: \$\{HASURA_GRAPHQL_ADMIN_SECRET:\?[^}]+\}/,
  "Hasura must fail closed when its admin secret is missing",
);
assert.match(
  compose,
  /HASURA_GRAPHQL_UNAUTHORIZED_ROLE: anonymous/,
  "Unauthenticated explorer requests must use the anonymous role",
);
assert.match(
  compose,
  /HASURA_GRAPHQL_ENABLE_CONSOLE: \$\{HASURA_GRAPHQL_ENABLE_CONSOLE:-false\}/,
  "The Hasura console must be disabled by default",
);
assert.match(
  compose,
  /HASURA_GRAPHQL_DEV_MODE: \$\{HASURA_GRAPHQL_DEV_MODE:-false\}/,
  "Hasura development mode must be disabled by default",
);
assert.match(
  compose,
  /127\.0\.0\.1:\$\{HASURA_PORT:-8080\}:8080/,
  "Hasura must bind to loopback locally",
);
assert.match(
  compose,
  /127\.0\.0\.1:\$\{POSTGRES_PORT:-5432\}:5432/,
  "PostgreSQL must bind to loopback locally",
);

const tableIndex = read("hasura/metadata/databases/bdjuno/tables/tables.yaml");
const tableFiles = [...tableIndex.matchAll(/!include ([^"\s]+)/g)].map((match) => match[1]);

assert.ok(tableFiles.length > 0, "Hasura metadata must include tracked tables");

const writePermissionKeys = [
  "insert_permissions:",
  "update_permissions:",
  "delete_permissions:",
];

const tablePermissions = new Map();

for (const tableFile of tableFiles) {
  const relativePath = path.join(
    "hasura",
    "metadata",
    "databases",
    "bdjuno",
    "tables",
    tableFile,
  );
  const metadata = readFileSync(path.join(callistoDirectory, relativePath), "utf8");

  assert.match(metadata, /select_permissions:/, `${tableFile} must define select permissions`);
  assert.match(metadata, /role: anonymous/, `${tableFile} must define the anonymous role`);

  for (const key of writePermissionKeys) {
    assert.ok(!metadata.includes(key), `${tableFile} must not define ${key}`);
  }

  const tableName = metadata.match(/^  name: ([^\s]+)$/m)?.[1];
  assert.ok(tableName, `${tableFile} must declare its table name`);

  const selectPermissions = metadata.slice(metadata.indexOf("select_permissions:"));
  const columns = [...selectPermissions.matchAll(/^    - ([^\s]+)$/gm)].map((match) => match[1]);
  const relationships = [...metadata.matchAll(/^- name: ([^\s]+)$/gm)].map((match) => match[1]);

  tablePermissions.set(tableName, {
    aggregations: /^    allow_aggregations: true$/m.test(selectPermissions),
    columns: new Set(columns),
    relationships: new Set(relationships),
  });
}

const actions = readFileSync(path.join(metadataDirectory, "actions.yaml"), "utf8");
assert.ok(!/^\s*type:\s*mutation\s*$/m.test(actions), "Anonymous actions must not include mutations");

const accessManifest = JSON.parse(read("hasura/explorer-anonymous-access.json"));

for (const [sourceFile, expectedHash] of Object.entries(accessManifest.sourceFiles)) {
  const contents = readFileSync(path.join(repositoryDirectory, sourceFile));
  const actualHash = createHash("sha256").update(contents).digest("hex");
  assert.equal(
    actualHash,
    expectedHash,
    `${sourceFile} changed; re-audit explorer anonymous permissions and update the manifest hash`,
  );
}

for (const [tableName, requirements] of Object.entries(accessManifest.tables)) {
  const permission = tablePermissions.get(tableName);
  assert.ok(permission, `Explorer table ${tableName} must have anonymous select permissions`);

  for (const column of requirements.columns ?? []) {
    assert.ok(
      permission.columns.has(column),
      `Explorer requires anonymous access to ${tableName}.${column}`,
    );
  }

  for (const relationship of requirements.relationships ?? []) {
    assert.ok(
      permission.relationships.has(relationship),
      `Explorer requires anonymous access to ${tableName}.${relationship}`,
    );
  }

  if (requirements.aggregations) {
    assert.ok(permission.aggregations, `Explorer requires anonymous aggregates on ${tableName}`);
  }
}

for (const actionName of accessManifest.actions) {
  const actionStart = actions.indexOf(`- name: ${actionName}\n`);
  assert.notEqual(actionStart, -1, `Explorer action ${actionName} must exist`);

  const nextAction = actions.indexOf("\n- name: ", actionStart + 1);
  const actionDefinition = actions.slice(
    actionStart,
    nextAction === -1 ? actions.length : nextAction,
  );

  assert.match(actionDefinition, /^    type: query$/m, `${actionName} must remain a query action`);
  assert.match(
    actionDefinition,
    /^  - role: anonymous\s*$/m,
    `Explorer requires anonymous access to ${actionName}`,
  );
}

console.log(
  `Hasura security configuration is valid (${tableFiles.length} tables checked; ` +
    `${Object.keys(accessManifest.tables).length} explorer table contracts audited).`,
);
