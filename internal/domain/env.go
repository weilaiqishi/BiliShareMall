package domain

import (
	"github.com/klauspost/cpuid/v2"
	sysruntime "runtime"
)

var Env = &EnvResult{
	BasePath:    "",
	AppName:     "",
	OS:          sysruntime.GOOS,
	ARCH:        sysruntime.GOARCH,
	X64Level:    cpuid.CPU.X64Level(),
	FromTaskSch: false,
}

type EnvResult struct {
	FromTaskSch bool   `json:"-"`
	AppName     string `json:"appName"`
	BasePath    string `json:"basePath"`
	OS          string `json:"os"`
	ARCH        string `json:"arch"`
	X64Level    int    `json:"x64Level"`
}
