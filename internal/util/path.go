package util

import (
	"github.com/mikumifa/BiliShareMall/internal/domain"
	"path/filepath"
)

func GetPath(path string) string {
	if filepath.IsAbs(path) {
		return path
	}
	path = filepath.Join(domain.Env.BasePath, path)
	path = filepath.Clean(path)
	return path
}
