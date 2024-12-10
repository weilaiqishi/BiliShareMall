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
	 wails build  -nsis -m -s -trimpath -skipbindings -devtools -tags  fts5

.PHONY: build-macos
build:
	 wails build -m -s -trimpath -skipbindings -devtools -tags  fts5  -windowsconsole -debug
.PHONY: debug
debug:
	wails build  -m -s -trimpath -skipbindings -devtools -tags  fts5  -windowsconsole -debug

.PHONY: autotag
autotag:
	@bash -c "bin/autotag"

.PHONY: dict
dict:
	go-bindata -o internal/domain/dict.go ./dict