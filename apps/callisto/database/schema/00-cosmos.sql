CREATE TABLE validator
(
    consensus_address TEXT NOT NULL PRIMARY KEY, /* Validator consensus address */
    consensus_pubkey  TEXT NOT NULL UNIQUE /* Validator consensus public key */
);

CREATE TABLE pre_commit
(
    validator_address TEXT                        NOT NULL REFERENCES validator (consensus_address),
    height            BIGINT                      NOT NULL,
    timestamp         TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    voting_power      BIGINT                      NOT NULL,
    proposer_priority BIGINT                      NOT NULL,
    UNIQUE (validator_address, timestamp)
);
CREATE INDEX pre_commit_validator_address_index ON pre_commit (validator_address);
CREATE INDEX pre_commit_height_index ON pre_commit (height);

CREATE TABLE block
(
    height           BIGINT  UNIQUE PRIMARY KEY,
    hash             TEXT    NOT NULL UNIQUE,
    num_txs          INTEGER DEFAULT 0,
    total_gas        BIGINT  DEFAULT 0,
    proposer_address TEXT REFERENCES validator (consensus_address),
    timestamp        TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
CREATE INDEX block_height_index ON block (height);
CREATE INDEX block_hash_index ON block (hash);
CREATE INDEX block_proposer_address_index ON block (proposer_address);
ALTER TABLE block
    SET (
        autovacuum_vacuum_scale_factor = 0,
        autovacuum_analyze_scale_factor = 0,
        autovacuum_vacuum_threshold = 10000,
        autovacuum_analyze_threshold = 10000
        );

CREATE TABLE transaction
(
    hash         TEXT    NOT NULL,
    height       BIGINT  NOT NULL REFERENCES block (height),
    success      BOOLEAN NOT NULL,

    /* Body */
    messages     JSON    NOT NULL DEFAULT '[]'::JSON,
    memo         TEXT,
    signatures   TEXT[]  NOT NULL,

    /* AuthInfo */
    signer_infos JSONB   NOT NULL DEFAULT '[]'::JSONB,
    fee          JSONB   NOT NULL DEFAULT '{}'::JSONB,

    /* Tx response */
    gas_wanted   BIGINT           DEFAULT 0,
    gas_used     BIGINT           DEFAULT 0,
    raw_log      TEXT,
    logs         JSONB,

    /* PSQL partition */
    partition_id BIGINT  NOT NULL DEFAULT 0,

    CONSTRAINT unique_tx UNIQUE (hash, partition_id)
)PARTITION BY LIST(partition_id);
CREATE INDEX transaction_hash_index ON transaction (hash);
CREATE INDEX transaction_height_index ON transaction (height);
CREATE INDEX transaction_partition_id_index ON transaction (partition_id);

CREATE TABLE message_type
(
    type      TEXT   NOT NULL UNIQUE,
    module    TEXT   NOT NULL,
    label     TEXT   NOT NULL,
    height    BIGINT NOT NULL
);
CREATE INDEX message_type_module_index ON message_type (module);
CREATE INDEX message_type_type_index ON message_type (type);

CREATE TABLE message
(
    transaction_hash            TEXT   NOT NULL,
    index                       BIGINT NOT NULL,
    type                        TEXT   NOT NULL REFERENCES message_type(type),
    value                       JSON   NOT NULL,
    involved_accounts_addresses TEXT[] NOT NULL,

    /* PSQL partition */
    partition_id                BIGINT NOT NULL DEFAULT 0,
    height                      BIGINT NOT NULL,
    FOREIGN KEY (transaction_hash, partition_id) REFERENCES transaction (hash, partition_id),
    CONSTRAINT unique_message_per_tx UNIQUE (transaction_hash, index, partition_id)
)PARTITION BY LIST(partition_id);
CREATE INDEX message_transaction_hash_index ON message (transaction_hash);
CREATE INDEX message_type_index ON message (type);
CREATE INDEX message_involved_accounts_index ON message USING GIN(involved_accounts_addresses);

/*
 * Per-address lookup tables (see migrate/v7): the GIN index on the
 * involved_accounts_addresses TEXT[] can't return rows in height order, so
 * these unroll it into btree-ordered rows per (address, message) and per
 * deduplicated (address, transaction), kept in sync by the trigger below.
 */
CREATE TABLE message_by_involved_address
(
    address          TEXT   NOT NULL,
    height           BIGINT NOT NULL,
    transaction_hash TEXT   NOT NULL,
    index            BIGINT NOT NULL,
    type             TEXT   NOT NULL,
    partition_id     BIGINT NOT NULL,
    PRIMARY KEY (address, height, transaction_hash, index)
);

CREATE TABLE transaction_by_involved_address
(
    address          TEXT   NOT NULL,
    height           BIGINT NOT NULL,
    transaction_hash TEXT   NOT NULL,
    partition_id     BIGINT NOT NULL,
    PRIMARY KEY (address, height, transaction_hash)
);

/* Single-column carrier type so Hasura can track the bounded count functions. */
CREATE TABLE address_query_count
(
    count BIGINT NOT NULL
);

CREATE FUNCTION sync_address_lookups() RETURNS trigger AS
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_address_lookup_sync
    AFTER INSERT OR UPDATE OR DELETE ON message
    FOR EACH ROW EXECUTE FUNCTION sync_address_lookups();

/* Messages involving addresses[1], newest first. Scalar equality (not = ANY)
 * keeps the scan index-ordered; callers pass a single-element array. */
CREATE FUNCTION messages_by_address(
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
$$ LANGUAGE sql STABLE;

/* Bounded count (caps at 1000001 -> UI shows "1,000,000+"); no sort. */
CREATE FUNCTION messages_by_address_count(
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
$$ LANGUAGE sql STABLE;

/* Distinct transactions involving the address, newest first. */
CREATE FUNCTION transactions_by_address(
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
$$ LANGUAGE sql STABLE;

/* Bounded count (caps at 1000001 -> UI shows "1,000,000+"); no sort. */
CREATE FUNCTION transactions_by_address_count(
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
$$ LANGUAGE sql STABLE;

CREATE FUNCTION messages_by_type(
  types text [],
  "limit" bigint DEFAULT 100,
  "offset" bigint DEFAULT 0) 
  RETURNS SETOF message AS 
$$ 
SELECT * FROM message
WHERE (cardinality(types) = 0 OR type = ANY (types))
ORDER BY height DESC LIMIT "limit" OFFSET "offset" 
$$ LANGUAGE sql STABLE;

CREATE TABLE pruning
(
    last_pruned_height BIGINT NOT NULL
);