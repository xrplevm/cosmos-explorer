package slashing

import (
	"github.com/spf13/cobra"

	parsecmdtypes "github.com/forbole/juno/v6/cmd/parse/types"
	"github.com/forbole/juno/v6/types/config"

	"github.com/forbole/callisto/v4/database"
	"github.com/forbole/callisto/v4/modules/slashing"
	modulestypes "github.com/forbole/callisto/v4/modules/types"
	"github.com/forbole/callisto/v4/utils"
)

func paramsCmd(parseConfig *parsecmdtypes.Config) *cobra.Command {
	return &cobra.Command{
		Use:   "params",
		Short: "Get the current parameters of the slashing module",
		RunE: func(cmd *cobra.Command, args []string) error {
			parseCtx, err := parsecmdtypes.GetParserContext(config.Cfg, parseConfig)
			if err != nil {
				return err
			}

			cdc := utils.GetCodec()
			sources, err := modulestypes.BuildSources(config.Cfg.Node, cdc)
			if err != nil {
				return err
			}

			// Get the database
			db := database.Cast(parseCtx.Database)

			// Build the slashing module
			slashingModule := slashing.NewModule(sources.SlashingSource, cdc, db)

			height, err := parseCtx.Node.LatestHeight()
			if err != nil {
				return err
			}

			return slashingModule.UpdateParams(height)
		},
	}
} 