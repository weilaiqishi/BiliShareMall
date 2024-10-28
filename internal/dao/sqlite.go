package dao

import (
	"context"
	"database/sql"
	"github.com/mattn/go-sqlite3"
	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	db *sql.DB
}

func NewDatabase(dbPath string) (*Database, error) {
	sql.Register("sqlite3_simple",
		&sqlite3.SQLiteDriver{
			Extensions: []string{
				"lib/libsimple-windows-x64/simple",
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
