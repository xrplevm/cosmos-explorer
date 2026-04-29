# Callisto Production Upgrade Guide

This guide describes the production rollout sequence for upgrading Callisto when a release introduces schema changes. Migrations are Go packages under `cmd/migrate/v<N>/` invoked via the `callisto migrate` CLI; running the new indexer image against a database that hasn't been migrated will fail with `column ... does not exist` errors.

## Rollout sequence

Order matters. The new Callisto image must be available **before** running migrations (the migration logic ships inside the binary), the indexer must finish migrating and re-parsing missed entries **before** Hasura reloads metadata, and Hasura must serve the new schema **before** the UI is pointed at it.

### 1. Update the Callisto image

Push the new tag and update the deployment manifest so the next pod start picks up the new binary. Do **not** restart the running indexer pod yet — just update the spec.

```bash
kubectl set image deployment/callisto callisto=<registry>/callisto:<new-tag> -n <namespace>
# or update via your manifests / Helm values and apply
```

### 2. Run the v6 migration

Exec into a pod running the new image (or a one-shot job) and apply the migration against the production DB. The migration is idempotent (`ADD COLUMN IF NOT EXISTS`), so re-running is safe.

```bash
kubectl exec -n <namespace> <callisto-pod> -- \
  callisto migrate v6 --home /root/.callisto
```

Verify:

```bash
kubectl exec -n <namespace> <postgres-pod> -- \
  psql -U <user> -d <db> -c "\d validator_status" | grep removed
```

If you are skipping multiple versions, run each migration in order (`v5`, then `v6`, …).

### 3. Start Callisto

Restart the indexer pod so it boots on the new image against the now-migrated schema:

```bash
kubectl rollout restart deployment/callisto -n <namespace>
kubectl rollout status deployment/callisto -n <namespace>
```

Tail the logs and confirm there are no `column ... does not exist` errors and the indexer is processing blocks.

### 4. Re-index proposals/blocks the old binary couldn't parse

If the release adds support for message types or modules the previous binary didn't know about (e.g. this release adds IBC codec registration to fix indexing of proposal 30 / `MsgRecoverClient`), the indexer skipped those entries on the first pass. The new binary won't backfill them automatically — running blocks are processed forward only. Re-parse them manually:

```bash
# Re-parse a specific governance proposal
kubectl exec -n <namespace> <callisto-pod> -- \
  callisto parse gov proposal <id> --home /root/.callisto

# Or re-parse a specific block range
kubectl exec -n <namespace> <callisto-pod> -- \
  callisto parse blocks --start <height> --end <height> --home /root/.callisto
```

For this release specifically, run:

```bash
kubectl exec -n <namespace> <callisto-pod> -- \
  callisto parse gov proposal 30 --home /root/.callisto
```

Verify the proposal landed:

```bash
kubectl exec -n <namespace> <postgres-pod> -- \
  psql -U <user> -d <db> -c "SELECT id, title FROM proposal WHERE id = 30;"
```

### 5. Reload Hasura metadata (only if metadata changed)

If the release introduces new tables, columns, or relationships that the explorer queries (e.g. `validator_statuses`, `validator_status.removed`), Hasura must pick up the updated metadata. The `cli-migrations-v3` image runs `hasura metadata apply` on every container startup and reconciles the bundled YAML in `/hasura-metadata` with `hdb_catalog`, so a plain restart is enough:

```bash
kubectl rollout restart deployment/hasura -n <namespace>
kubectl rollout status deployment/hasura -n <namespace>
```

Verify the new fields/relationships resolve:

```bash
curl -s -X POST http://<hasura-host>/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ validator(limit:1) { validator_statuses(limit:1) { status removed } } }"}'
```

You only need this step when `apps/callisto/hasura/metadata/` changed in the release. No `DROP SCHEMA hdb_catalog` is required in production — that's only for local dev when a Postgres backup gets restored on top of a running Hasura (see "Local restore notes" below).

### 6. Restart the UI with the new image

Once the indexer is healthy and Hasura is serving the new schema, roll the explorer:

```bash
kubectl set image deployment/explorer explorer=<registry>/explorer:<new-tag> -n <namespace>
kubectl rollout status deployment/explorer -n <namespace>
```

## Local restore notes

When restoring `callisto.backup` into a fresh local DB, the dump carries Hasura's `hdb_catalog` along with it. That overwrites Hasura's metadata with whatever was current at the time of the dump and leaves the running Hasura container in an inconsistent state. Fix:

```bash
docker exec callisto-database-1 psql -U user -d database \
  -c "DROP SCHEMA IF EXISTS hdb_catalog CASCADE;"
docker compose -f apps/callisto/docker-compose.yml restart hasura
```

This forces `cli-migrations-v3` to re-bootstrap from the YAML in `/hasura-metadata`. **This is a local-only step** — production never restores a backup on top of a live DB, so the simple restart in step 4 is sufficient.

## Migration log

| Version | Date | Commit | Description |
|---------|------|--------|-------------|
| v6 | 2026-04-29 | c2f4565 | Add `removed` column to `validator_status` for PoA-removed validators |

## Adding a new migration

When a PR introduces a schema change in `database/schema/*.sql`:

1. Create `cmd/migrate/v<N>/` and `database/migrate/v<N>/` packages following the v6 pattern (`migrate.go`, `migrator.go`, optional `utils.go`/`types.go`).
2. Register the new version in `cmd/migrate/cmd.go` `migrations` map.
3. Make the DDL idempotent (`ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, etc.) so re-runs are safe.
4. Add a row to the migration log above with the version, date, and commit hash.

## Rollback

If step 3 fails after migrating, the old indexer image cannot read the new column but it doesn't write to it either — so rolling back the deployment to the previous image is safe. The added column stays in place (idempotent rollback would only matter if you also need to drop it; in practice keep it).

```bash
kubectl rollout undo deployment/callisto -n <namespace>
```
