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
