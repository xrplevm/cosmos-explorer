package v6

import "fmt"

// Migrate adds the `removed` column to validator_status so PoA-removed
// validators can be tracked. Idempotent — safe to re-run.
func (db *Migrator) Migrate() error {
	stmt := `
ALTER TABLE validator_status
ADD COLUMN IF NOT EXISTS removed BOOLEAN NOT NULL DEFAULT false`

	if _, err := db.SQL.Exec(stmt); err != nil {
		return fmt.Errorf("error while adding removed column to validator_status: %s", err)
	}
	return nil
}
