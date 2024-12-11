package app

import (
	"fmt"
	"github.com/mikumifa/BiliShareMall/internal/domain"
	"github.com/mikumifa/BiliShareMall/internal/http"
	"github.com/mikumifa/BiliShareMall/internal/util"
	"github.com/patrickmn/go-cache"
	"github.com/rs/zerolog/log"
	"time"
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

func (a *App) ListC2CItem(page, pageSize int, filterName string, sortOption int, startTime, endTime int64, fromPrice, toPrice int, used bool, cookieStr string) (C2CItemListVO, error) {
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
		log.Error().Err(err).Msg("Failed to list items")
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
	if used {
		if a.RemoveErrorItem(result, cookieStr) {
			return a.ListC2CItem(page, pageSize, filterName, sortOption, startTime, endTime, fromPrice, toPrice, used, cookieStr)
		}
	}
	return C2CItemListVO{
		Items:       result,
		Total:       total,
		TotalPages:  total/pageSize + 1,
		CurrentPage: page,
	}, nil
}
func (a *App) RemoveErrorItem(items []C2CItemVO, cookieStr string) bool {
	remove := false
	for _, item := range items {
		canBuy, err := a.checkItemStatus(item.C2CItemsID, cookieStr)
		if err != nil {
			log.Printf("Failed to check item %d: %v", item.C2CItemsID, err)
			continue
		}
		if !canBuy {
			err = a.d.DeleteCSCItem(item.C2CItemsID)
			if err != nil {
				log.Printf("Failed to delete item %d: %v", item.C2CItemsID, err)
				continue
			}
			remove = true
		} else {
		}
	}

	return remove
}

func (a *App) checkItemStatus(id int64, cookiesStr string) (bool, error) {
	if result, found := a.c.Get(fmt.Sprintf("check:%d", id)); found {
		return result.(bool), nil
	}
	client, err := http.NewBiliClient()
	if err != nil {
		return false, err
	}
	client.StoreHeader("cookie", cookiesStr)
	data := map[string]interface{}{"items": map[string]any{
		"c2cItemsId": id, "price": 0,
	}}
	var resp domain.CheckResponse
	err = client.SendRequest(http.POST, "https://mall.bilibili.com/magic-c/c2c/order/info?platform=h5", data, &resp)
	a.c.Set(fmt.Sprintf("check:%d", id), resp.Code != 60000002, cache.DefaultExpiration)
	time.Sleep(1 * time.Second)
	return resp.Code != 60000002, nil
}
