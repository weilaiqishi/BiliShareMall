TAG_NAME?=$(shell git describe --tags)
APP_NAME="Chapar"


.PHONY: run,embed
run:
	@echo "Running..."
	wails dev -loglevel Info -tags fts5

.PHONY: install_deps
embed:
	go:embed all:frontend/dist

.PHONY: tidy
tidy:
	go mod tidy

.PHONY: build
build:
	 wails build  -nsis -tags fts5

.PHONY: build-skip
build:
	 wails build  -nsis -tags fts5 -s
.PHONY: debug
debug:
	wails build  -nsis -tags fts5 -windowsconsole -debug

.PHONY: autotag
autotag:
	@bash -c "bin/autotag"