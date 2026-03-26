package evm

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/forbole/juno/v6/types/config"
	"github.com/stretchr/testify/require"
)

func TestDefaultConfig(t *testing.T) {
	cfg := DefaultConfig()
	require.Equal(t, uint64(262144), cfg.ChainID)
}

func TestParseConfig(t *testing.T) {
	validYaml := []byte(`
evm:
  chain_id: 12345
`)
	invalidYaml := []byte(`invalid`)

	t.Run("Valid YAML", func(t *testing.T) {
		cfg, err := ParseConfig(validYaml)
		require.NoError(t, err)
		require.Equal(t, uint64(12345), cfg.ChainID)
	})

	t.Run("Invalid YAML", func(t *testing.T) {
		cfg, err := ParseConfig(invalidYaml)
		require.NoError(t, err)
		require.Equal(t, DefaultConfig(), cfg)
	})

	t.Run("Missing EVM Config", func(t *testing.T) {
		missingEvmYaml := []byte(`other: value`)
		cfg, err := ParseConfig(missingEvmYaml)
		require.NoError(t, err)
		require.Equal(t, DefaultConfig(), cfg)
	})

	t.Run("Missing chain_id", func(t *testing.T) {
		missingChainIdYaml := []byte(`
evm:
`)
		cfg, err := ParseConfig(missingChainIdYaml)
		require.NoError(t, err)
		require.Equal(t, DefaultConfig(), cfg)
	})

	t.Run("Zero chain_id", func(t *testing.T) {
		zeroChainIdYaml := []byte(`
evm:
  chain_id: 0
`)
		cfg, err := ParseConfig(zeroChainIdYaml)
		require.Error(t, err)
		require.Contains(t, err.Error(), "invalid chain_id: 0 is not a valid EVM chain ID")
		require.Equal(t, Config{}, cfg)
	})
}

func TestGetConfig(t *testing.T) {
	t.Run("Valid Config File", func(t *testing.T) {
		tempDir, err := os.MkdirTemp("", "callisto-test-*")
		require.NoError(t, err)
		defer os.RemoveAll(tempDir)

		validYaml := []byte(`
evm:
  chain_id: 67890
`)
		err = os.WriteFile(filepath.Join(tempDir, "config.yaml"), validYaml, 0644)
		require.NoError(t, err)

		originalHomePath := config.HomePath
		config.HomePath = tempDir
		defer func() { config.HomePath = originalHomePath }()

		cfg, err := GetConfig()
		require.NoError(t, err)
		require.Equal(t, uint64(67890), cfg.ChainID)
	})

	t.Run("Missing Config File", func(t *testing.T) {
		tempDir, err := os.MkdirTemp("", "callisto-test-*")
		require.NoError(t, err)
		defer os.RemoveAll(tempDir)

		originalHomePath := config.HomePath
		config.HomePath = tempDir
		defer func() { config.HomePath = originalHomePath }()

		cfg := ReadConfigFromFile()
		require.Equal(t, DefaultConfig(), cfg)
	})
}
