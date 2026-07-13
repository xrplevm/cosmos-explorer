package v7

import (
	"fmt"
	"os"
	"path"

	"github.com/forbole/juno/v6/types/config"
	"gopkg.in/yaml.v3"
)

func GetConfig() (config.Config, error) {
	file := path.Join(config.HomePath, "config.yaml")

	if _, err := os.Stat(file); os.IsNotExist(err) {
		return config.Config{}, fmt.Errorf("config file does not exist")
	}

	bz, err := os.ReadFile(file)
	if err != nil {
		return config.Config{}, fmt.Errorf("error while reading config file: %s", err)
	}

	var cfg config.Config
	err = yaml.Unmarshal(bz, &cfg)
	return cfg, err
}
