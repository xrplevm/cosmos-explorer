package database

import (
	"fmt"

	codec "github.com/cosmos/cosmos-sdk/codec"
	db "github.com/forbole/juno/v6/database"
	"github.com/forbole/juno/v6/database/postgresql"
	"github.com/jmoiron/sqlx"

	v7 "github.com/forbole/callisto/v4/database/migrate/v7"
)

var _ db.Database = &Db{}

// Db represents a PostgreSQL database with expanded features.
// so that it can properly store custom BigDipper-related data.
type Db struct {
	*postgresql.Database
	Sqlx *sqlx.DB
	cdc  codec.Codec
}

// Builder allows to create a new Db instance implementing the db.Builder type
func Builder(cdc codec.Codec) db.Builder {
	return func(ctx *db.Context) (db.Database, error) {
		database, err := postgresql.Builder(ctx)
		if err != nil {
			return nil, err
		}

		psqlDb, ok := (database).(*postgresql.Database)
		if !ok {
			return nil, fmt.Errorf("invalid configuration database, must be PostgreSQL")
		}

		// Guarantee the per-address lookup table for every command that opens the
		// DB (start, all parse subcommands) — independent of the modules config
		// and the optional v7 backfill — so SaveMessage's inline sync has a target.
		if err := v7.EnsureLookupTable(psqlDb.SQL); err != nil {
			return nil, err
		}

		return &Db{
			Database: psqlDb,
			Sqlx:     sqlx.NewDb(psqlDb.SQL.DB, "postgresql"),
			cdc:      cdc,
		}, nil
	}
}

// Cast allows to cast the given db to a Db instance
func Cast(db db.Database) *Db {
	bdDatabase, ok := db.(*Db)
	if !ok {
		panic(fmt.Errorf("given database instance is not a Db"))
	}
	return bdDatabase
}
