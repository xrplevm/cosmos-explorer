package v7

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// EnsureLookupTable creates message_by_involved_address and its height index if
// absent. database.Builder runs it whenever the DB is opened, so the inline sync
// in Db.SaveMessage always has a target. Idempotent; backfilling existing
// messages is Migrate()'s job.
func EnsureLookupTable(db *sqlx.DB) error {
	for i, stmt := range []string{lookupTable, lookupHeightIndex} {
		if _, err := db.Exec(stmt); err != nil {
			return fmt.Errorf("error while ensuring message lookup table (statement %d): %s", i, err)
		}
	}
	return nil
}

// Migrate ensures the lookup table and backfills it from existing messages — the
// v6→v7 step for a database that predates the table. Run with the indexer
// stopped. Idempotent.
func (db *Migrator) Migrate() error {
	if err := EnsureLookupTable(db.SQL); err != nil {
		return err
	}

	statements := []string{
		backfillLookup,
		`REINDEX INDEX message_by_involved_address_pkey`,
		`ANALYZE message_by_involved_address`,
	}
	for i, stmt := range statements {
		if _, err := db.SQL.Exec(stmt); err != nil {
			return fmt.Errorf("error while running v7 migration (statement %d): %s", i, err)
		}
	}
	return nil
}

const lookupTable = `
CREATE TABLE IF NOT EXISTS message_by_involved_address
(
    address          TEXT   NOT NULL,
    height           BIGINT NOT NULL,
    transaction_hash TEXT   NOT NULL,
    index            BIGINT NOT NULL,
    PRIMARY KEY (address, transaction_hash, index)
)`

// lookupHeightIndex serves the height-ordered per-address scans (backward scan).
const lookupHeightIndex = `
CREATE INDEX IF NOT EXISTS message_by_involved_address_height_idx
    ON message_by_involved_address (address, height, transaction_hash, index)`

// backfillLookup aggregates to the latest height per key: cross-partition duplicate
// messages and repeated addresses would otherwise make DO UPDATE hit a key twice.
const backfillLookup = `
INSERT INTO message_by_involved_address (address, height, transaction_hash, index)
SELECT addr, max(m.height), m.transaction_hash, m.index
FROM message m, unnest(m.involved_accounts_addresses) AS addr
WHERE addr <> ''
GROUP BY addr, m.transaction_hash, m.index
ON CONFLICT (address, transaction_hash, index) DO UPDATE
    SET height = excluded.height
    WHERE message_by_involved_address.height IS DISTINCT FROM excluded.height`
