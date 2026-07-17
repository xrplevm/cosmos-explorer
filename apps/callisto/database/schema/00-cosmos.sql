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
 * Per-address activity lookup (see migrate/v7): the GIN index on the
 * involved_accounts_addresses TEXT[] cannot return rows in height order, so
 * this unrolls it into btree-ordered rows per (address, message), kept in sync
 * by the INSERT-only trigger below. Message UPDATE (re-parse) and DELETE (prune)
 * are not reflected here — safe under forward-only indexing with pruning disabled.
 * One table serves both views: messages directly, transactions via
 * DISTINCT ON (height, transaction_hash).
 */
CREATE TABLE message_by_involved_address
(
    address          TEXT   NOT NULL,
    height           BIGINT NOT NULL,
    transaction_hash TEXT   NOT NULL,
    index            BIGINT NOT NULL,
    partition_id     BIGINT NOT NULL,
    PRIMARY KEY (address, height, transaction_hash, index)
);

CREATE FUNCTION sync_message_by_involved_address() RETURNS trigger AS
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_address_lookup_sync
    AFTER INSERT ON message
    FOR EACH ROW EXECUTE FUNCTION sync_message_by_involved_address();

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