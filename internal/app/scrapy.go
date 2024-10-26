package app

import (
	"github.com/rs/zerolog/log"
)

/// 爬取函数返回爬虫情况：获取数目，重复获取数目，新增数目

type Control struct {
	start       chan struct{}
	pause       chan struct{}
	stop        chan struct{}
	requestBody chan map[string]any
}

func crawler(control Control) {
	for {
		select {
		case <-control.start:
			log.Info().Msg("crawler start")
			for {
				select {
				case body := <-control.requestBody:
					log.Info().Any("body", body).Msg("crawler set body")
				case <-control.pause:
					log.Info().Msg("crawler pause")
					<-control.start // wait until resumed
					log.Info().Msg("crawler resume")
				case <-control.stop:
					log.Info().Msg("crawler stop")
					return
				}
			}
		case <-control.stop:
			return
		}
	}
}
