package domain

// MailListResponse https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list

type MailListResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    struct {
		Data []struct {
			C2CItemsID    int64  `json:"c2cItemsId"`
			Type          int    `json:"type"`
			C2CItemsName  string `json:"c2cItemsName"`
			DetailDtoList []struct {
				BlindBoxID  int    `json:"blindBoxId"`
				ItemsID     int    `json:"itemsId"`
				SkuID       int    `json:"skuId"`
				Name        string `json:"name"`
				Img         string `json:"img"`
				MarketPrice int    `json:"marketPrice"`
				Type        int    `json:"type"`
				IsHidden    bool   `json:"isHidden"`
			} `json:"detailDtoList"`
			TotalItemsCount int    `json:"totalItemsCount"`
			Price           int    `json:"price"`
			ShowPrice       string `json:"showPrice"`
			ShowMarketPrice string `json:"showMarketPrice"`
			UID             string `json:"uid"`
			PaymentTime     int    `json:"paymentTime"`
			IsMyPublish     bool   `json:"isMyPublish"`
			UspaceJumpURL   any    `json:"uspaceJumpUrl"`
			Uface           string `json:"uface"`
			Uname           string `json:"uname"`
		} `json:"data"`
		NextID *string `json:"nextId"`
	} `json:"data"`
	Errtag int `json:"errtag"`
}

type CheckResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
