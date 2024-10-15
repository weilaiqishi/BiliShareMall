TAG_NAME?=$(shell git describe --tags)
APP_NAME="Chapar"


.PHONY: run,embed
run:
	@echo "Running..."
	wails dev

.PHONY: install_deps
embed:
	go:embed all:frontend/dist