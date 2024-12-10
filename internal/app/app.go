package app

import (
	"context"
	"fmt"
	"github.com/mikumifa/BiliShareMall/internal/dao"
	"github.com/mikumifa/BiliShareMall/internal/util"
	cache "github.com/patrickmn/go-cache"
	"github.com/rs/zerolog/log"
	"os"
	"time"
)

// App struct
type App struct {
	ctx context.Context
	d   *dao.Database
	c   *cache.Cache
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
	a.d, err = dao.NewDatabase(util.GetPath("bsm.db"))
	if err != nil {
		panic(err)
	}
	content, err := os.ReadFile(util.GetPath("dict/init.sql"))
	if err != nil {
		panic(err)
	}
	err = a.d.Init(string(content))
	if err != nil {
		log.Error().Err(err).Msg("NewApp Error")
		panic(err)
	}
	// 设置超时时间和清理时间
	a.c = cache.New(5*time.Minute, 10*time.Minute)
	go a.scrapyRunTimeWork()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
