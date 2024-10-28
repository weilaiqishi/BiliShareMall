package app

import (
	"context"
	"fmt"
	"github.com/mikumifa/BiliShareMall/internal/dao"
	"github.com/rs/zerolog/log"
	"os"
)

const (
	DBPATH   = "bsm.db"
	INIT_SQL = "init.sql"
)

// App struct
type App struct {
	ctx context.Context
	d   *dao.Database
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// Startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	var err error
	a.d, err = dao.NewDatabase(DBPATH)
	if err != nil {
		panic(err)
	}
	content, err := os.ReadFile(INIT_SQL)
	if err != nil {
		panic(err)
	}
	err = a.d.Init(string(content))
	if err != nil {
		log.Error().Err(err).Msg("NewApp Error")
		panic(err)
	}
	go a.scrapyRunTimeWork()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
