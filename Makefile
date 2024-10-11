TAG_NAME?=$(shell git describe --tags)
APP_NAME="Chapar"


.PHONY: run
run:
	@echo "Running..."
	go run .

.PHONY: install_deps
install_deps:
	go install gioui.org/cmd/gogio@latest
