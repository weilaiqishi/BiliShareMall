package main

import (
	"flag"
	"gioui.org/app"
	"gioui.org/unit"
	mainApp "github.com/mikumifa/BiliShareMail/ui/app"
	log "github.com/rs/zerolog/log"
	_ "net/http/pprof"
	"os"
)

func main() {
	flag.Parse()

	go func() {
		var w app.Window
		w.Option(app.Title("BiliShareMail"), app.Size(unit.Dp(1200), unit.Dp(800)))

		mainUI, err := mainApp.New(&w)
		if err != nil {
			log.Fatal().AnErr("Failed to Create", err)
		}
		if err := mainUI.Run(); err != nil {
			log.Fatal().AnErr("Failed to Run", err)
		}
		os.Exit(0)
	}()

	app.Main()
}
