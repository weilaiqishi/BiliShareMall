package dao

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/mattn/go-sqlite3"
	_ "github.com/mattn/go-sqlite3"
	"github.com/mikumifa/BiliShareMall/internal/util"
	"runtime"
)

type Database struct {
	db *sql.DB
}

func NewDatabase(dbPath string) (*Database, error) {

	var extension string
	switch runtime.GOOS {
	case "darwin": // macOS
		extension = util.GetPath("dict/libsimple-osx-x64/libsimple")
	case "windows": //windows
		extension = "dict/libsimple-windows-x64/simple"
	default:
		return nil, fmt.Errorf("unsupported platform: %s", runtime.GOOS)
	}
	sql.Register("sqlite3_simple",
		&sqlite3.SQLiteDriver{
			Extensions: []string{
				extension,
			},
		})

	db, err := sql.Open("sqlite3_simple", dbPath)
	if err != nil {
		return nil, err
	}
	return &Database{db: db}, nil
}

func (d *Database) Init(initSql string) error {
	_, err := d.db.ExecContext(context.Background(), initSql)
	return err
}

func (d *Database) Close() error {
	return d.db.Close()
}
