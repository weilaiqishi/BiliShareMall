# SQLite 数据库存储数据分析

根据 `internal/dao/scrapy.go` 和 `internal/dao/search.go` 文件中的代码，SQLite 数据库主要存储以下两种类型的数据：

## 1. `scrapy_items` 表

该表用于存储爬取到的商品信息。其结构和字段含义如下：

| 字段名           | 类型      | 描述                                   |
| :--------------- | :-------- | :------------------------------------- |
| `id`             | `INTEGER` | 主键，自增                               |
| `price_range`    | `TEXT`    | 价格范围，以 JSON 字符串形式存储 `[]float64` 数组 |
| `rate_range`     | `TEXT`    | 评分范围，以 JSON 字符串形式存储 `[]float64` 数组 |
| `product`        | `TEXT`    | 产品标识                               |
| `product_name`   | `TEXT`    | 产品名称                               |
| `nums`           | `INTEGER` | 数量                                   |
| `increase_number`| `INTEGER` | 增长数量                               |
| `next_token`     | `TEXT`    | 下一个 token，可能为 `NULL`            |
| `create_time`    | `DATETIME`| 创建时间                               |
| `order`          | `TEXT`    | 订单信息                               |

对应的 Go 结构体为 `ScrapyItem`：
```go
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
```

## 2. `c2c_items` 表

该表用于存储 C2C（Customer to Customer）商品信息，可能与邮件列表或用户发布的商品相关。其结构和字段含义如下：

| 字段名              | 类型      | 描述                                   |
| :------------------ | :-------- | :------------------------------------- |
| `c2c_items_id`      | `INTEGER` | C2C 商品 ID，作为主键，并设置 `IGNORE` 避免重复插入 |
| `type`              | `INTEGER` | 类型                                   |
| `c2c_items_name`    | `TEXT`    | C2C 商品名称                           |
| `total_items_count` | `INTEGER` | 总商品数量                             |
| `price`             | `INTEGER` | 价格（可能以分或厘为单位存储）         |
| `show_price`        | `TEXT`    | 显示价格                               |
| `show_market_price` | `TEXT`    | 显示市场价格                           |
| `uid`               | `TEXT`    | 用户 ID                                |
| `payment_time`      | `INTEGER` | 支付时间                               |
| `is_my_publish`     | `BOOLEAN` | 是否为我发布                           |
| `uface`             | `TEXT`    | 用户头像 URL                           |
| `uname`             | `TEXT`    | 用户名                                 |

对应的 Go 结构体为 `CSCItem`：
```go
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
```

## 3. `c2c_fts` 表

`search.go` 文件中提到了 `c2c_fts` 表，并与 `c2c_items` 表进行 `LEFT JOIN` 操作。这表明 `c2c_fts` 是一个全文搜索（Full-Text Search, FTS）表，用于对 `c2c_items` 表中的 `c2c_items_name` 字段进行高效的文本搜索。它使用了 `jieba_query` 函数，暗示可能集成了 Jieba 分词库进行中文分词。

**总结：**

SQLite 数据库主要存储了两种核心数据：`scrapy_items` 用于记录爬虫抓取到的商品详情，而 `c2c_items` 则用于存储 C2C 交易或用户发布的相关商品信息，并通过 `c2c_fts` 表支持全文搜索功能。