# XRPL EVM Callisto - Blockchain Indexer

Callisto is a blockchain indexer (formerly BDJuno) built on the Juno framework designed to index and parse Cosmos blockchain data. It stores blockchain data in PostgreSQL and provides GraphQL APIs through Hasura.

## Requirements

- Go 1.23.8
- PostgreSQL 13+
- Docker & Docker Compose
- Hasura 2.6.1+ (included in docker-compose)

## Quick Start

### 1. Install Go

Using GVM (Go Version Manager):

```bash
gvm install go1.23.8
gvm use go1.23.8
```

### 2. Build

```bash
make build
```

The binary will be created at `./build/callisto`. To install globally:

```bash
make install
```

### 3. Configuration

Running `callisto init` generates a default configuration file at `~/.callisto/config.yaml`:

```bash
./build/callisto init
```

Pre-configured network configs are provided in `configs/`:

- `configs/testnet-config.yaml` — XRPL EVM Sidechain testnet
- `configs/mainnet-config.yaml` — XRPL EVM Sidechain mainnet

Copy the desired config before starting:

```bash
mkdir -p ~/.callisto
cp configs/testnet-config.yaml ~/.callisto/config.yaml
```

### 4. Start Indexing

```bash
# 1. Start PostgreSQL and Hasura
docker compose up -d

# 2. Build and start the indexer
make build
./build/callisto start
```

### 5. Start with Make Targets

Alternatively, Make targets are available that automate the above steps (build, copy config, start services, and launch the indexer) in a single command:

```bash
# Testnet
make start-testnet

# Mainnet
make start-mainnet
```

For a clean start (drops and recreates the database schema):

```bash
make start-testnet-clean
make start-mainnet-clean
```

You can also pass a custom config:

```bash
make start CONFIG=path/to/config.yaml
```

### 6. Database Management

Commands to interact with the database without restarting Docker containers:

```bash
# Drop all tables and recreate empty schema
make db-schema-drop

# Apply all schema SQL files (database/schema/*.sql) in order
make db-schema-apply

# Full reset: drop + apply (wipes data, keeps containers running)
make db-schema-reset

# Open an interactive psql session
make db-shell

# List all tables
make db-tables

# Show size of each table
make db-size
```

Use `make db-schema-reset` when you need a fresh database without tearing down the Docker stack. The `start-*-clean` targets use this internally.

## Services

| Service | URL | Description |
|---------|-----|-------------|
| Hasura Console & GraphQL API | http://localhost:8080 | GraphQL management console and endpoint |
| Callisto Actions | http://localhost:3000 | HTTP server for Hasura actions |
| PostgreSQL | localhost:5432 | Database connection |

Default database credentials (from docker-compose.yml):
- User: `user`
- Password: `password`
- Database: `database`

## CLI Commands

| Command | Description |
|---------|-------------|
| `callisto init` | Generate default config at `~/.callisto/config.yaml` |
| `callisto start` | Start continuous block indexing |
| `callisto version` | Display version information |
| `callisto migrate` | Migrate database between versions |

## Database Schema

The database schema is located in `database/schema/` and consists of:

| File | Module | Purpose |
|------|--------|---------|
| 00-cosmos.sql | Core | Blocks, transactions, validators, messages |
| 01-auth.sql | x/auth | Vesting accounts and periods |
| 02-bank.sql | x/bank | Total supply tracking |
| 03-staking.sql | x/staking | Validators, delegations, staking pool |
| 04-consensus.sql | Consensus | Pre-commits and validator state |
| 05-mint.sql | x/mint | Inflation and minting parameters (excluded, not used in XRPL EVM Sidechain) |
| 06-distribution.sql | x/distribution | Community pool and distribution |
| 07-pricefeed.sql | x/pricefeed | Token prices and market data |
| 08-gov.sql | x/gov | Proposals, votes, deposits |
| 09-modules.sql | Modules | Module tracking |
| 10-slashing.sql | x/slashing | Slashing parameters and signing info |
| 11-feegrant.sql | x/feegrant | Fee grant allowances |
| 12-upgrade.sql | x/upgrade | Software upgrade plans |

## Development

### Run Tests

```bash
# Start test database
make start-docker-test

# Run unit tests
make test-unit

# Stop test database
make stop-docker-test
```

### Linting and Formatting

```bash
# Run linter
make lint

# Auto-fix lint issues
make lint-fix

# Format code
make format
```

### Clean Build

```bash
make clean
```

## Troubleshooting

### Block height not available

```
ERR re-enqueueing failed block err="failed to get block from node: error in json rpc client, with http response metadata: (Status: 200 OK, Protocol HTTP/1.1). RPC error -32603 - Internal error: height 4 is not available, lowest height is 4133001" height=5
```

This error means the node you are connected to has pruned blocks below its lowest available height. To fix it, either:

1. **Connect to an archive/full node** that has all block heights available by updating the RPC/gRPC endpoints in your config.
2. **Update `start_height`** in your config (`parsing.start_height`) to the lowest height available on the node (e.g. `4133001` in the example above).

### Hasura image platform mismatch

```
The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
```

This happens when the Hasura image in `docker-compose.yml` is set to the ARM variant. Update the image from:

```yaml
image: hasura/graphql-engine:v2.6.1.cli-migrations-v3.ubuntu.arm64
```

to:

```yaml
image: hasura/graphql-engine:v2.6.1.cli-migrations-v3
```

## References

- [Official Documentation](https://docs.bigdipper.live/cosmos-based/parser/overview/)
- [GitHub Repository](https://github.com/forbole/callisto)
