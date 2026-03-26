VERSION := $(shell echo $(shell git describe --tags) | sed 's/^v//')
COMMIT  := $(shell git log -1 --format='%H')

export GO111MODULE = on
export CGO_ENABLED = 1

###############################################################################
###                                   All                                   ###
###############################################################################

all: lint build test-unit

###############################################################################
###                                Build flags                              ###
###############################################################################

LD_FLAGS = -X github.com/forbole/juno/v6/cmd.Version=$(VERSION) \
	-X github.com/forbole/juno/v6/cmd.Commit=$(COMMIT)
BUILD_FLAGS :=  -ldflags '$(LD_FLAGS)'

ifeq ($(LINK_STATICALLY),true)
  LD_FLAGS += -linkmode=external -extldflags "-Wl,-z,muldefs -static"
endif

build_tags += $(BUILD_TAGS)
build_tags := $(strip $(build_tags))

BUILD_FLAGS :=  -ldflags '$(LD_FLAGS)' -tags "$(build_tags)"

###############################################################################
###                                  Build                                  ###
###############################################################################

build: go.sum
ifeq ($(OS),Windows_NT)
	@echo "building callisto binary..."
	@go build -mod=readonly $(BUILD_FLAGS) -o build/callisto.exe ./cmd/callisto
else
	@echo "building callisto binary..."
	@go build -mod=readonly $(BUILD_FLAGS) -o build/callisto ./cmd/callisto
endif
.PHONY: build

###############################################################################
###                                 Install                                 ###
###############################################################################

install: go.sum
	@echo "installing callisto binary..."
	@go install -mod=readonly $(BUILD_FLAGS) ./cmd/callisto
.PHONY: install

###############################################################################
###                           Tests & Simulation                            ###
###############################################################################

stop-docker-test:
	@echo "Stopping Docker container..."
	@docker stop callisto-test-db || true && docker rm callisto-test-db || true
.PHONY: stop-docker-test

start-docker-test: stop-docker-test
	@echo "Starting Docker container..."
	@docker run --name callisto-test-db -e POSTGRES_USER=callisto -e POSTGRES_PASSWORD=password -e POSTGRES_DB=callisto -d -p 6433:5432 -v ./database/schema:/docker-entrypoint-initdb.d postgres
.PHONY: start-docker-test

test-unit: start-docker-test
	@echo "Executing unit tests..."
	@go test -mod=readonly -v -coverprofile coverage.txt ./...
.PHONY: test-unit

###############################################################################
###                                Linting                                  ###
###############################################################################
golangci_lint_cmd=github.com/golangci/golangci-lint/cmd/golangci-lint

lint:
	@echo "--> Running linter"
	@go run $(golangci_lint_cmd) run --timeout=10m

lint-fix:
	@echo "--> Running linter"
	@go run $(golangci_lint_cmd) run --fix --out-format=tab --issues-exit-code=0

.PHONY: lint lint-fix

format:
	find . -name '*.go' -type f -not -path "*.git*" -not -name '*.pb.go' -not -name '*_mocks.go' | xargs gofmt -w -s
	find . -name '*.go' -type f -not -path "*.git*" -not -name '*.pb.go' -not -name '*_mocks.go' | xargs misspell -w
	find . -name '*.go' -type f -not -path "*.git*" -not -name '*.pb.go' -not -name '*_mocks.go' | xargs goimports -w -local github.com/forbole/callisto
.PHONY: format

clean:
	rm -f tools-stamp ./build/**
.PHONY: clean

###############################################################################
###                                 Config                                  ###
###############################################################################

update-config:
	@if [ -z "$(CONFIG)" ]; then \
		echo "Error: CONFIG variable is not set."; \
		echo "Please specify a config file using CONFIG=<path> or use one of:"; \
		echo "  make start-testnet        (uses configs/testnet-config.yaml)"; \
		echo "  make start-mainnet        (uses configs/mainnet-config.yaml)"; \
		echo "  make start CONFIG=<path>  (uses your custom config)"; \
		exit 1; \
	fi
	@if [ ! -f "$(CONFIG)" ]; then \
		echo "Error: Config file '$(CONFIG)' does not exist."; \
		exit 1; \
	fi
	@echo "Copying $(CONFIG) to ~/.callisto/config.yaml..."
	@mkdir -p ~/.callisto
	@cp $(CONFIG) ~/.callisto/config.yaml
	@echo "Config updated successfully"
.PHONY: update-config

init-config:
	@echo "Initializing callisto config..."
	@./build/callisto init
.PHONY: init-config

###############################################################################
###                                Database                                ###
###############################################################################

DB_EXEC := docker compose exec -T database psql -U user -d database

db-schema-drop:
	@echo "Dropping all tables..."
	@$(DB_EXEC) -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	@echo "All tables dropped"
.PHONY: db-schema-drop

db-schema-apply:
	@echo "Applying schema files..."
	@for f in $(sort $(wildcard database/schema/*.sql)); do \
		echo "  Applying $$f..."; \
		$(DB_EXEC) < $$f; \
	done
	@echo "Schema applied successfully"
.PHONY: db-schema-apply

db-schema-reset: db-schema-drop db-schema-apply
	@echo "Schema reset complete"
.PHONY: db-schema-reset

db-shell:
	@docker compose exec database psql -U user -d database
.PHONY: db-shell

db-tables:
	@$(DB_EXEC) -c "\dt"
.PHONY: db-tables

db-size:
	@$(DB_EXEC) -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;"
.PHONY: db-size

###############################################################################
###                              Local development                          ###
###############################################################################

setup-env:
	@ARCH=$$(uname -m); \
	if [ "$$ARCH" = "arm64" ] || [ "$$ARCH" = "aarch64" ]; then \
		echo "HASURA_IMAGE_SUFFIX=.ubuntu.arm64" > .env; \
		echo "Detected ARM architecture"; \
	else \
		echo "HASURA_IMAGE_SUFFIX=" > .env; \
		echo "Detected x86 architecture"; \
	fi
.PHONY: setup-env

start: setup-env update-config build
	@echo "Starting database services..."
	@docker compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 3
	@echo "Starting callisto..."
	@./build/callisto start
.PHONY: start

start-clean: setup-env update-config build
	@echo "Starting database services..."
	@docker compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 3
	@$(MAKE) db-schema-reset
	@echo "Starting callisto..."
	@./build/callisto start
.PHONY: start-clean

start-testnet: CONFIG=configs/testnet-config.yaml
start-testnet: start
.PHONY: start-testnet

start-testnet-clean: CONFIG=configs/testnet-config.yaml
start-testnet-clean: start-clean
.PHONY: start-testnet-clean

start-mainnet: CONFIG=configs/mainnet-config.yaml
start-mainnet: start
.PHONY: start-mainnet

start-mainnet-clean: CONFIG=configs/mainnet-config.yaml
start-mainnet-clean: start-clean
.PHONY: start-mainnet-clean
