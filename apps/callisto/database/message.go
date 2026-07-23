package database

import (
	juno "github.com/forbole/juno/v6/types"
	"github.com/forbole/juno/v6/types/config"
	"github.com/lib/pq"
)

// SaveMessage overrides juno's implementation so that the same statement also
// unrolls involved_accounts_addresses into the message_by_involved_address
// lookup table. SELECT DISTINCT keeps DO UPDATE from hitting a key twice and
// ORDER BY gives a deterministic lock order.
func (db *Db) SaveMessage(height int64, txHash string, msg juno.Message, addresses []string) error {
	var partitionID int64
	if partitionSize := config.Cfg.Database.PartitionSize; partitionSize > 0 {
		partitionID = height / partitionSize
		if err := db.CreatePartitionIfNotExists("message", partitionID); err != nil {
			return err
		}
	}

	stmt := `
WITH m AS (
	INSERT INTO message(transaction_hash, index, type, value, involved_accounts_addresses, height, partition_id)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	ON CONFLICT (transaction_hash, index, partition_id) DO UPDATE
		SET height = excluded.height,
			type = excluded.type,
			value = excluded.value,
			involved_accounts_addresses = excluded.involved_accounts_addresses
	RETURNING height, transaction_hash, index, involved_accounts_addresses
)
INSERT INTO message_by_involved_address (address, height, transaction_hash, index)
SELECT DISTINCT addr, m.height, m.transaction_hash, m.index
FROM m, unnest(m.involved_accounts_addresses) AS addr
WHERE addr <> ''
ORDER BY addr
ON CONFLICT (address, transaction_hash, index) DO UPDATE
	SET height = excluded.height
	WHERE message_by_involved_address.height IS DISTINCT FROM excluded.height`

	_, err := db.SQL.Exec(stmt, txHash, msg.GetIndex(), msg.GetType(), msg.GetBytes(), pq.Array(addresses), height, partitionID)
	return err
}
