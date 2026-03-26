package evm

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/forbole/juno/v6/types/config"
	"gopkg.in/yaml.v3"
)

// Config holds EVM-specific configuration for the explorer.
type Config struct {
	ChainID uint64 `yaml:"chain_id"`
}

// DefaultConfig returns the default EVM configuration.
func DefaultConfig() Config {
	return Config{ChainID: 262144}
}

// ParseConfig parses the EVM configuration from the given YAML bytes.
// Returns an error if chain_id is explicitly set to 0 (invalid chain ID).
func ParseConfig(bz []byte) (Config, error) {
	type yamlConfig struct {
		EVM *Config `yaml:"evm"`
	}
	var cfg yamlConfig
	if err := yaml.Unmarshal(bz, &cfg); err != nil {
		return DefaultConfig(), nil
	}
	if cfg.EVM == nil {
		return DefaultConfig(), nil
	}
	if cfg.EVM.ChainID == 0 {
		return Config{}, fmt.Errorf("invalid chain_id: 0 is not a valid EVM chain ID")
	}
	return *cfg.EVM, nil
}

// Cfg is the global EVM configuration used during execution.
var Cfg = DefaultConfig()

// GetConfig returns the configuration reading it from the config.yaml file present inside the home directory
func GetConfig() (Config, error) {
	file := filepath.Join(config.HomePath, "config.yaml")

	// Make sure the path exists
	if _, err := os.Stat(file); err != nil {
		if os.IsNotExist(err) {
			return Config{}, fmt.Errorf("config file %q does not exist: %w", file, err)
		}
		return Config{}, fmt.Errorf("failed to stat config file %q: %w", file, err)
	}

	bz, err := os.ReadFile(file)
	if err != nil {
		return Config{}, fmt.Errorf("error while reading config file %q: %w", file, err)
	}

	cfg, err := ParseConfig(bz)
	if err != nil {
		return Config{}, fmt.Errorf("error parsing EVM config from %q: %w", file, err)
	}
	return cfg, nil
}

// ReadConfigFromFile reads the EVM configuration from the config.yaml file.
// Returns the default config if the file does not exist or cannot be parsed.
func ReadConfigFromFile() Config {
	cfg, err := GetConfig()
	if err != nil {
		return DefaultConfig()
	}
	return cfg
}
