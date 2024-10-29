package app

import (
	"github.com/mikumifa/BiliShareMall/internal/util"
	"github.com/rs/zerolog/log"
)

type C2CItemListVO struct {
	Items       []C2CItemVO `json:"items"`
	Total       int         `json:"total"`
	TotalPages  int         `json:"totalPages"`
	CurrentPage int         `json:"currentPage"`
}

type C2CItemVO struct {
	C2CItemsID      int64   `json:"c2cItemsId"`
	C2CItemsName    string  `json:"c2cItemsName"`
	TotalItemsCount int     `json:"totalItemsCount"`
	Price           float64 `json:"price"`
	ShowPrice       string  `json:"showPrice"`
}

func (a *App) ListC2CItem(page, pageSize int, filterName string, sortOption int, startTime, endTime int64, fromPrice, toPrice int) (C2CItemListVO, error) {
	log.Info().
		Int("page", page).
		Int("pageSize", pageSize).
		Str("filterName", filterName).
		Int("sortOption", sortOption).
		Int64("startTime", startTime).
		Int64("endTime", endTime).
		Int("fromPrice", fromPrice).
		Int("toPrice", toPrice).
		Msg("Listing C2C items with parameters")
	items, total, err := a.d.ReadCSCItems(page, pageSize, filterName, sortOption, util.TimestampToTime(startTime), util.TimestampToTime(endTime), fromPrice, toPrice)
	if err != nil {
		return C2CItemListVO{}, err
	}
	result := make([]C2CItemVO, 0)
	for _, item := range items {
		vo := C2CItemVO{
			C2CItemsID:      item.C2CItemsID,
			C2CItemsName:    item.C2CItemsName,
			TotalItemsCount: item.TotalItemsCount,
			Price:           float64(item.Price) / 100,
			ShowPrice:       item.ShowPrice,
		}
		result = append(result, vo)
	}
	return C2CItemListVO{
		Items:       result,
		Total:       total,
		TotalPages:  total/pageSize + 1,
		CurrentPage: page,
	}, nil
}
