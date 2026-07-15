package v7

import "fmt"

// Migrate replaces the per-address query path with btree-indexed lookup tables
// that unroll message.involved_accounts_addresses (a TEXT[] served only by GIN,
// which cannot be scanned in height order) into message_by_involved_address /
// transaction_by_involved_address, kept in sync by a trigger, so the read
// functions become index range scans instead of full sorts.
//
// Idempotent (IF NOT EXISTS / OR REPLACE / ON CONFLICT DO NOTHING). Run with the
// indexer stopped: the backfill can otherwise race a concurrent prune.
func (db *Migrator) Migrate() error {
	statements := []string{
		messageLookupTable,
		transactionLookupTable,
		countCarrierTable,
		syncTriggerFunction,
		dropSyncTrigger,
		createSyncTrigger,
		backfillMessageLookup,
		backfillTransactionLookup,
		`ANALYZE message_by_involved_address`,
		`ANALYZE transaction_by_involved_address`,
		messagesByAddressFunction,
		messagesByAddressCountFunction,
		transactionsByAddressFunction,
		transactionsByAddressCountFunction,
	}

	for i, stmt := range statements {
		if _, err := db.SQL.Exec(stmt); err != nil {
			return fmt.Errorf("error while running v7 migration (statement %d): %s", i, err)
		}
	}
	return nil
}

const messageLookupTable = `
CREATE TABLE IF NOT EXISTS message_by_involved_address
(
    address          TEXT   NOT NULL,
    height           BIGINT NOT NULL,
    transaction_hash TEXT   NOT NULL,
    index            BIGINT NOT NULL,
    type             TEXT   NOT NULL,
    partition_id     BIGINT NOT NULL,
    PRIMARY KEY (address, height, transaction_hash, index)
)`

const transactionLookupTable = `
CREATE TABLE IF NOT EXISTS transaction_by_involved_address
(
    address          TEXT   NOT NULL,
    height           BIGINT NOT NULL,
    transaction_hash TEXT   NOT NULL,
    partition_id     BIGINT NOT NULL,
    PRIMARY KEY (address, height, transaction_hash)
)`

const countCarrierTable = `
CREATE TABLE IF NOT EXISTS address_query_count
(
    count BIGINT NOT NULL
)`

const syncTriggerFunction = `
CREATE OR REPLACE FUNCTION sync_address_lookups() RETURNS trigger AS
$$
BEGIN
    IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') THEN
        DELETE FROM message_by_involved_address
        WHERE address = ANY (OLD.involved_accounts_addresses)
          AND height = OLD.height
          AND transaction_hash = OLD.transaction_hash
          AND index = OLD.index;

        -- Drop the (address, tx) row only when no surviving message of the tx
        -- still involves the address (AFTER the write, so NOT EXISTS sees
        -- only survivors).
        DELETE FROM transaction_by_involved_address t
        WHERE t.address = ANY (OLD.involved_accounts_addresses)
          AND t.height = OLD.height
          AND t.transaction_hash = OLD.transaction_hash
          AND t.partition_id = OLD.partition_id
          AND NOT EXISTS (
              SELECT 1 FROM message m
              WHERE m.transaction_hash = OLD.transaction_hash
                AND m.partition_id = OLD.partition_id
                AND t.address = ANY (m.involved_accounts_addresses)
          );
    END IF;

    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        INSERT INTO message_by_involved_address (address, height, transaction_hash, index, type, partition_id)
        SELECT addr, NEW.height, NEW.transaction_hash, NEW.index, NEW.type, NEW.partition_id
        FROM unnest(NEW.involved_accounts_addresses) AS addr
        ON CONFLICT DO NOTHING;

        INSERT INTO transaction_by_involved_address (address, height, transaction_hash, partition_id)
        SELECT DISTINCT addr, NEW.height, NEW.transaction_hash, NEW.partition_id
        FROM unnest(NEW.involved_accounts_addresses) AS addr
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql`

const dropSyncTrigger = `DROP TRIGGER IF EXISTS message_address_lookup_sync ON message`

const createSyncTrigger = `
CREATE TRIGGER message_address_lookup_sync
    AFTER INSERT OR UPDATE OR DELETE ON message
    FOR EACH ROW EXECUTE FUNCTION sync_address_lookups()`

const backfillMessageLookup = `
INSERT INTO message_by_involved_address (address, height, transaction_hash, index, type, partition_id)
SELECT addr, m.height, m.transaction_hash, m.index, m.type, m.partition_id
FROM message m, unnest(m.involved_accounts_addresses) AS addr
ON CONFLICT DO NOTHING`

const backfillTransactionLookup = `
INSERT INTO transaction_by_involved_address (address, height, transaction_hash, partition_id)
SELECT DISTINCT addr, m.height, m.transaction_hash, m.partition_id
FROM message m, unnest(m.involved_accounts_addresses) AS addr
ON CONFLICT DO NOTHING`

const messagesByAddressFunction = `
CREATE OR REPLACE FUNCTION messages_by_address(
    addresses TEXT[],
    types TEXT[],
    "limit" BIGINT = 100,
    "offset" BIGINT = 0)
    RETURNS SETOF message AS
$$
-- Slice the lookup first (backward PK scan, no sort), then join only the page,
-- so a deep OFFSET walks the index without joining every skipped row.
SELECT m.*
FROM (
    SELECT transaction_hash, index, partition_id, height
    FROM message_by_involved_address a
    WHERE a.address = addresses[1]
      AND (cardinality(types) = 0 OR a.type = ANY (types))
    ORDER BY a.height DESC, a.transaction_hash DESC, a.index DESC
    LIMIT "limit" OFFSET "offset"
) a
JOIN message m
  ON m.transaction_hash = a.transaction_hash
 AND m.index = a.index
 AND m.partition_id = a.partition_id
ORDER BY a.height DESC, a.transaction_hash DESC, a.index DESC
$$ LANGUAGE sql STABLE`

const messagesByAddressCountFunction = `
CREATE OR REPLACE FUNCTION messages_by_address_count(
    addresses TEXT[],
    types TEXT[])
    RETURNS SETOF address_query_count AS
$$
SELECT count(*)::BIGINT
FROM (
    SELECT 1
    FROM message_by_involved_address a
    WHERE a.address = addresses[1]
      AND (cardinality(types) = 0 OR a.type = ANY (types))
    LIMIT 1000001
) t
$$ LANGUAGE sql STABLE`

const transactionsByAddressFunction = `
CREATE OR REPLACE FUNCTION transactions_by_address(
    addresses TEXT[],
    "limit" BIGINT = 100,
    "offset" BIGINT = 0)
    RETURNS SETOF transaction AS
$$
SELECT tx.*
FROM (
    SELECT transaction_hash, partition_id, height
    FROM transaction_by_involved_address a
    WHERE a.address = addresses[1]
    ORDER BY a.height DESC, a.transaction_hash DESC
    LIMIT "limit" OFFSET "offset"
) a
JOIN transaction tx
  ON tx.hash = a.transaction_hash
 AND tx.partition_id = a.partition_id
ORDER BY a.height DESC, a.transaction_hash DESC
$$ LANGUAGE sql STABLE`

const transactionsByAddressCountFunction = `
CREATE OR REPLACE FUNCTION transactions_by_address_count(
    addresses TEXT[])
    RETURNS SETOF address_query_count AS
$$
SELECT count(*)::BIGINT
FROM (
    SELECT 1
    FROM transaction_by_involved_address a
    WHERE a.address = addresses[1]
    LIMIT 1000001
) t
$$ LANGUAGE sql STABLE`
