package domain

// MailListResponse https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list
type MailListResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Data []struct {
			C2CItemsId    int64  `json:"c2cItemsId"`
			Type          int    `json:"type"`
			C2CItemsName  string `json:"c2cItemsName"`
			DetailDtoList []struct {
				BlindBoxId  int    `json:"blindBoxId"`
				ItemsId     int    `json:"itemsId"`
				SkuId       int    `json:"skuId"`
				Name        string `json:"name"`
				Img         string `json:"img"`
				MarketPrice int    `json:"marketPrice"`
				Type        int    `json:"type"`
				IsHidden    bool   `json:"isHidden"`
			} `json:"detailDtoList"`
			TotalItemsCount int         `json:"totalItemsCount"`
			Price           int         `json:"price"`
			ShowPrice       string      `json:"showPrice"`
			ShowMarketPrice string      `json:"showMarketPrice"`
			Uid             string      `json:"uid"`
			PaymentTime     int         `json:"paymentTime"`
			IsMyPublish     bool        `json:"isMyPublish"`
			UspaceJumpUrl   interface{} `json:"uspaceJumpUrl"`
			Uface           string      `json:"uface"`
			Uname           string      `json:"uname"`
		} `json:"data"`
		NextId string `json:"nextId"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}
