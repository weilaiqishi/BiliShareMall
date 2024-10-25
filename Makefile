TAG_NAME?=$(shell git describe --tags)
APP_NAME="Chapar"


.PHONY: run,embed
run:
	@echo "Running..."
	wails dev -loglevel Info

.PHONY: install_deps
embed:
	go:embed all:frontend/dist

.PHONY: tidy
tidy:
	go mod tidy

.PHONY: build
build:
	 wails build
.PHONY: autotag
autotag:
	@bash -c "bin/autotag"

.PHONY: release
release:
	@bash -c "bin/release.sh"