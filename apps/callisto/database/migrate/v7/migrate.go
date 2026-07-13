package v7

import "fmt"

// Migrate materializes messages_by_address's address filter so the planner
// uses the GIN index instead of scanning message in height order, which timed
// out (60s+) for low-activity addresses. Idempotent — safe to re-run.
func (db *Migrator) Migrate() error {
	stmt := `
CREATE OR REPLACE FUNCTION messages_by_address(
    addresses TEXT[],
    types TEXT[],
    "limit" BIGINT = 100,
    "offset" BIGINT = 0)
    RETURNS SETOF message AS
$$
-- Materialized so the GIN index is used instead of a full scan (see migrate/v7).
WITH matched AS MATERIALIZED (
    SELECT * FROM message
    WHERE (cardinality(types) = 0 OR type = ANY (types))
      AND addresses && involved_accounts_addresses
)
SELECT * FROM matched
ORDER BY height DESC, transaction_hash, index LIMIT "limit" OFFSET "offset"
$$ LANGUAGE sql STABLE`

	if _, err := db.SQL.Exec(stmt); err != nil {
		return fmt.Errorf("error while replacing messages_by_address function: %s", err)
	}
	return nil
}
