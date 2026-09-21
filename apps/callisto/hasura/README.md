# Hasura metadata

Hasura GraphQL Engine metadata for the Callisto-backed Postgres database. This
is the deploy artifact that defines tracked tables, relationships, anonymous
role permissions, and the GraphQL schema the explorer consumes.

## Layout

- `config.yaml` — Hasura CLI config. `endpoint` is the local default; override
  with `--endpoint` when applying against a remote environment.
- `metadata/` — versioned metadata tree. Source name is `bdjuno`.

## Apply

Install the Hasura CLI (`curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash`).

```bash
cd apps/callisto/hasura

# local
hasura metadata apply

# remote
hasura metadata apply \
  --endpoint https://governance.xrplevm.org \
  --admin-secret "$HASURA_ADMIN_SECRET"
```

After applying, reload to pick up new columns from a migration:

```bash
hasura metadata reload --endpoint <url> --admin-secret <secret>
```

## Anonymous role

The explorer queries Hasura without an admin secret using the `anonymous` role.
Each table whitelists the columns the role may select. When a migration adds a
new column that the explorer needs to read, add it to the corresponding table
yaml under `select_permissions[].permission.columns` and re-apply.

`explorer-anonymous-access.json` records the reviewed tables, columns,
relationships, aggregations, and actions required by the explorer. Its source
hashes cover the adapter queries and browser subscription, so
`pnpm security-check` requires an explicit permission re-audit whenever either
query source changes.

The anonymous table permissions currently cap results at 100 rows. Existing
paginated explorer lists request at most 50 rows, but unpaginated or nested
collections larger than 100 rows can be truncated. Do not remove this public
response limit without an abuse-resistance review; update those consumers to
paginate if the chain can exceed the cap.
