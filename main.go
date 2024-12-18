package main

import (
	"embed"
	"fmt"
	app "github.com/mikumifa/BiliShareMall/internal/app"
	. "github.com/mikumifa/BiliShareMall/internal/domain"
	. "github.com/mikumifa/BiliShareMall/internal/util"
	"github.com/rs/zerolog/log"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"os"
	"os/user"
	"path/filepath"
	"strings"
)

//go:embed all:frontend/dist
var assets embed.FS

func InitEnv() {

	exePath, err := os.Executable()
	if err != nil {
		log.Error().Err(err).Msg("Init")
		return
	}

	for _, v := range os.Args {
		if v == "tasksch" {
			Env.FromTaskSch = true
			break
		}
	}

	Env.BasePath = filepath.Dir(exePath)
	Env.AppName = strings.TrimSuffix(filepath.Base(exePath), filepath.Ext(exePath))

	// step2: Create a persistent data symlink
	if Env.OS == "darwin" {
		user, _ := user.Current()
		linkPath := Env.BasePath + "/data"
		appPath := "/Users/" + user.Username + "/Library/Application Support/" + Env.AppName
		os.MkdirAll(appPath, os.ModePerm)
		os.Symlink(appPath, linkPath)
	} else if Env.OS == "windows" {
		user, _ := user.Current()
		appPath := fmt.Sprintf("%s\\AppData\\Local\\%s", user.HomeDir, Env.AppName)
		linkPath := Env.BasePath + "\\data"
		os.MkdirAll(appPath, os.ModePerm)
		os.Symlink(appPath, linkPath)

	} else {
		log.Panic().Err(err).Msg("System not support")
		panic("System not support")
	}

}

func main() {
	// Create an instance of the newApp structure
	InitEnv()
	newApp := app.NewApp()
	log.Info().Msg("Creating newApp")
	err := FileLogger()
	if err != nil {
		log.Panic()
	}
	err = wails.Run(&options.App{
		Title:  "BiliShareMall",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        newApp.Startup,
		Bind: []interface{}{
			newApp,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
