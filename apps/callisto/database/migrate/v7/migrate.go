package v7

import "fmt"

// Migrate unrolls message.involved_accounts_addresses (a TEXT[] served only by
// GIN, which cannot be scanned in height order) into the btree-indexed
// message_by_involved_address lookup table. Per-address pages become index
// range scans; the transactions view dedups multi-message rows via
// DISTINCT ON (height, transaction_hash).
//
// The trigger is INSERT-only: it does not reflect message UPDATE (re-parse with
// a changed address set) or DELETE (prune) — safe because this deployment indexes
// forward-only with pruning disabled. It is created before the backfill so rows
// written mid-backfill are still captured (deduped by ON CONFLICT). Idempotent.
func (db *Migrator) Migrate() error {
	statements := []string{
		lookupTable,
		syncTriggerFunction,
		dropSyncTrigger,
		createSyncTrigger,
		backfillLookup,
		// Backfill inserts in height order, not PK order, so rebuild the index
		// to reclaim page-split slack.
		`REINDEX INDEX message_by_involved_address_pkey`,
		`ANALYZE message_by_involved_address`,
		// Drop the superseded per-address function: the account tabs now read
		// message_by_involved_address directly instead of messages_by_address.
		`DROP FUNCTION IF EXISTS messages_by_address(TEXT[], TEXT[], BIGINT, BIGINT)`,
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
    partition_id     BIGINT NOT NULL,
    PRIMARY KEY (address, height, transaction_hash, index)
)`

const syncTriggerFunction = `
CREATE OR REPLACE FUNCTION sync_message_by_involved_address() RETURNS trigger AS
$$
BEGIN
    -- ON CONFLICT collapses duplicate addresses within a message; empty-string
    -- artifacts are never queried, so they are skipped.
    INSERT INTO message_by_involved_address (address, height, transaction_hash, index, partition_id)
    SELECT addr, NEW.height, NEW.transaction_hash, NEW.index, NEW.partition_id
    FROM unnest(NEW.involved_accounts_addresses) AS addr
    WHERE addr <> ''
    ON CONFLICT DO NOTHING;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql`

const dropSyncTrigger = `DROP TRIGGER IF EXISTS message_address_lookup_sync ON message`

const createSyncTrigger = `
CREATE TRIGGER message_address_lookup_sync
    AFTER INSERT ON message
    FOR EACH ROW EXECUTE FUNCTION sync_message_by_involved_address()`

const backfillLookup = `
INSERT INTO message_by_involved_address (address, height, transaction_hash, index, partition_id)
SELECT addr, m.height, m.transaction_hash, m.index, m.partition_id
FROM message m, unnest(m.involved_accounts_addresses) AS addr
WHERE addr <> ''
ON CONFLICT DO NOTHING`
