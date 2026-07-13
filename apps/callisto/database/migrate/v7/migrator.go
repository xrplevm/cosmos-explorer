package v7

import (
	"github.com/jmoiron/sqlx"

	"github.com/forbole/juno/v6/database"
	"github.com/forbole/juno/v6/database/postgresql"
)

var _ database.Migrator = &Migrator{}

type Migrator struct {
	SQL *sqlx.DB
}

func NewMigrator(db *postgresql.Database) *Migrator {
	return &Migrator{
		SQL: db.SQL,
	}
}
