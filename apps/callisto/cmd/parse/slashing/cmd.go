package slashing

import (
	parsecmdtypes "github.com/forbole/juno/v6/cmd/parse/types"
	"github.com/spf13/cobra"
)

// NewSlashingCmd returns the Cobra command allowing to fix various things related to the x/slashing module
func NewSlashingCmd(parseConfig *parsecmdtypes.Config) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "slashing",
		Short: "Fix things related to the x/slashing module",
	}

	cmd.AddCommand(
		paramsCmd(parseConfig),
	)

	return cmd
} 