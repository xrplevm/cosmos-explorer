package v7

import (
	"fmt"

	parse "github.com/forbole/juno/v6/cmd/parse/types"
	"github.com/forbole/juno/v6/database"
	"github.com/forbole/juno/v6/database/postgresql"
	"github.com/forbole/juno/v6/types/config"

	v7db "github.com/forbole/callisto/v4/database/migrate/v7"
)

// RunMigration runs the migrations to v7
func RunMigration(parseConfig *parse.Config) error {
	cfg, err := GetConfig()
	if err != nil {
		return fmt.Errorf("error while reading config: %s", err)
	}

	if err := migrateDb(cfg, parseConfig); err != nil {
		return fmt.Errorf("error while migrating database: %s", err)
	}

	return nil
}

func migrateDb(cfg config.Config, parseConfig *parse.Config) error {
	databaseCtx := database.NewContext(cfg.Database, parseConfig.GetLogger())
	db, err := postgresql.Builder(databaseCtx)
	if err != nil {
		return fmt.Errorf("error while building the db: %s", err)
	}

	migrator := v7db.NewMigrator(db.(*postgresql.Database))
	return migrator.Migrate()
}
