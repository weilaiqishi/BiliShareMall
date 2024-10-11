package app

import (
	"gioui.org/app"
	"gioui.org/op"
)

type UI struct {
	window *app.Window
}

// New creates a new UI using ............
func New(w *app.Window) (*UI, error) {
	u := &UI{
		window: w,
	}
	return u, u.load()
}

func (u *UI) load() error {
	//TODO
	return nil
}

func (u *UI) Run() error {
	var ops op.Ops
	for {
		switch e := u.window.Event().(type) {
		case app.FrameEvent:
			gtx := app.NewContext(&ops, e)
			e.Frame(gtx.Ops)
		case app.DestroyEvent:
			return e.Err
		}
	}
}
