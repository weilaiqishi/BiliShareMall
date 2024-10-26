package dao

import (
	"context"
	"database/sql"
	_ "modernc.org/sqlite"
)

const (
	DBPATH = "bsm.db"
)

type Database struct {
	db *sql.DB
}

func NewDatabase(dbPath string) (*Database, error) {
	db, err := sql.Open("sqlite", dbPath)
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
