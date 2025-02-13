package dao

import (
	"context"
	"encoding/json"
	"github.com/mikumifa/BiliShareMall/internal/domain"
	"github.com/rs/zerolog/log"
	"time"
)

type ScrapyItem struct {
	Id             int64     `json:"id"`
	PriceRange     []float64 `json:"priceRange"`
	RateRange      []float64 `json:"rateRange"`
	Product        string    `json:"product"`
	ProductName    string    `json:"productName"`
	Nums           int       `json:"nums"`
	Order          string    `json:"order"`
	IncreaseNumber int       `json:"increaseNumber"`
	NextToken      *string   `json:"nextToken"`
	CreateTime     time.Time `json:"createTime"`
}

// CreateScrapyItem ScrapyItem
func (d *Database) CreateScrapyItem(item ScrapyItem) (int64, error) {

	priceRangeJSON, _ := json.Marshal(item.PriceRange)
	rateRangeJSON, _ := json.Marshal(item.RateRange)
	result, err := d.Db.ExecContext(context.Background(),
		"INSERT INTO scrapy_items (price_range, rate_range, product, product_name, nums, increase_number, next_token, create_time,`order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
		priceRangeJSON, rateRangeJSON, item.Product, item.ProductName, item.Nums, item.IncreaseNumber, item.NextToken, item.CreateTime, item.Order)
	if err != nil {
		return -1, err
	}
	return result.LastInsertId()
}
func (d *Database) UpdateScrapyItem(item *ScrapyItem) (int64, error) {

	priceRangeJSON, _ := json.Marshal(item.PriceRange)
	rateRangeJSON, _ := json.Marshal(item.RateRange)
	result, err := d.Db.ExecContext(context.Background(),
		"UPDATE scrapy_items SET price_range = ?, rate_range = ?, product = ?, product_name = ?, nums = ?, increase_number = ?, next_token = ?, create_time = ? WHERE id = ?",
		priceRangeJSON, rateRangeJSON, item.Product, item.ProductName, item.Nums, item.IncreaseNumber, item.NextToken, item.CreateTime, item.Id)
	if err != nil {
		return -1, err
	}
	return result.RowsAffected()
}

// ReadScrapyItem ScrapyItem
func (d *Database) ReadScrapyItem(id int) (ScrapyItem, error) {
	var item ScrapyItem
	var priceRangeJSON, rateRangeJSON string
	err := d.Db.QueryRowContext(context.Background(), "SELECT price_range, rate_range, product, product_name, nums, increase_number, next_token, create_time,`order` FROM scrapy_items WHERE id = ?", id).Scan(&priceRangeJSON, &rateRangeJSON, &item.Product, &item.ProductName, &item.Nums, &item.IncreaseNumber, &item.NextToken, &item.CreateTime, &item.Order)
	item.Id = int64(id)
	if err != nil {
		return item, err
	}
	// 解析 JSON
	err = json.Unmarshal([]byte(priceRangeJSON), &item.PriceRange)
	if err != nil {
		return ScrapyItem{}, err
	}
	err = json.Unmarshal([]byte(rateRangeJSON), &item.RateRange)
	if err != nil {
		return ScrapyItem{}, err
	}
	return item, nil
}

// DeleteScrapyItem ScrapyItem
func (d *Database) DeleteScrapyItem(id int) error {
	_, err := d.Db.ExecContext(context.Background(), "DELETE FROM scrapy_items WHERE id = ?", id)
	return err
}

// ReadAllScrapyItems 读取所有项
func (d *Database) ReadAllScrapyItems() ([]ScrapyItem, error) {
	rows, err := d.Db.QueryContext(context.Background(), "SELECT id, price_range, rate_range, product, product_name, nums, increase_number, next_token, create_time,`order` FROM scrapy_items")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items = make([]ScrapyItem, 0)
	for rows.Next() {
		var item ScrapyItem
		var priceRangeJSON, rateRangeJSON string
		if err := rows.Scan(&item.Id, &priceRangeJSON, &rateRangeJSON, &item.Product, &item.ProductName, &item.Nums, &item.IncreaseNumber, &item.NextToken, &item.CreateTime, &item.Order); err != nil {
			return nil, err
		}
		err := json.Unmarshal([]byte(priceRangeJSON), &item.PriceRange)
		if err != nil {
			return nil, err
		}
		err = json.Unmarshal([]byte(rateRangeJSON), &item.RateRange)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

type CSCItem struct {
	C2CItemsID      int64  `json:"c2cItemsId"`
	Type            int    `json:"type"`
	C2CItemsName    string `json:"c2cItemsName"`
	TotalItemsCount int    `json:"totalItemsCount"`
	Price           int    `json:"price"`
	ShowPrice       string `json:"showPrice"`
	ShowMarketPrice string `json:"showMarketPrice"`
	UID             string `json:"uid"`
	PaymentTime     int    `json:"paymentTime"`
	IsMyPublish     bool   `json:"isMyPublish"`
	Uface           string `json:"uface"`
	Uname           string `json:"uname"`
}

func (d *Database) CreateCSCItem(item *CSCItem) (int64, error) {
	result, err := d.Db.ExecContext(context.Background(),
		"INSERT or IGNORE  INTO c2c_items (c2c_items_id, type, c2c_items_name, total_items_count, price, show_price, show_market_price, uid, payment_time, is_my_publish, uface, uname) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		item.C2CItemsID, item.Type, item.C2CItemsName, item.TotalItemsCount, item.Price, item.ShowPrice, item.ShowMarketPrice, item.UID, item.PaymentTime, item.IsMyPublish, item.Uface, item.Uname)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func (d *Database) SaveMailListToDB(response *domain.MailListResponse) int64 {
	sum := int64(0)
	for _, item := range response.Data.Data {
		scrapyItem := CSCItem{
			C2CItemsID:      item.C2CItemsID,
			Type:            item.Type,
			C2CItemsName:    item.C2CItemsName,
			TotalItemsCount: item.TotalItemsCount,
			Price:           item.Price,
			ShowPrice:       item.ShowPrice,
			ShowMarketPrice: item.ShowMarketPrice,
			UID:             item.UID,
			PaymentTime:     item.PaymentTime,
			IsMyPublish:     item.IsMyPublish,
			Uface:           item.Uface,
			Uname:           item.Uname,
		}

		rows, err := d.CreateCSCItem(&scrapyItem)
		if err != nil {
			log.Error().Err(err).Msg("CreateCSCItem failed")
		}
		sum += rows
	}
	return sum
}
