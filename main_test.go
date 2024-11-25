package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/mattn/go-sqlite3"
	"github.com/mikumifa/BiliShareMall/internal/dao"
	"github.com/mikumifa/BiliShareMall/internal/domain"
	"github.com/mikumifa/BiliShareMall/internal/util"
	"github.com/rs/zerolog/log"
	"os"
	"strconv"
	"testing"
)

// MailListResponse https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list

func TestMailListResponse(t *testing.T) {

	rawJson := `
{
    "code": 0,
    "message": "success",
    "data": {
        "data": [
            {
                "c2cItemsId": 111898714181,
                "type": 1,
                "c2cItemsName": "bilibiliGoods 赛罗奥特曼 真无线蓝牙耳机 耳机",
                "detailDtoList": [
                    {
                        "blindBoxId": 198141758,
                        "itemsId": 10183307,
                        "skuId": 1000414629,
                        "name": "bilibiliGoods 赛罗奥特曼 真无线蓝牙耳机 耳机",
                        "img": "//i0.hdslb.com/bfs/mall/mall/36/68/366881f5b60517cada675f1a39c92eca.png",
                        "marketPrice": 21900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 13000,
                "showPrice": "130",
                "showMarketPrice": "219",
                "uid": "55***7",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i2.hdslb.com/bfs/face/3f5dc2e5386beb527028d092f1852da8d41fb299.jpg",
                "uname": "s***"
            },
            {
                "c2cItemsId": 111903008260,
                "type": 1,
                "c2cItemsName": "sanag塞那 Z36SPro 粉色 气传导耳机",
                "detailDtoList": [
                    {
                        "blindBoxId": 195654449,
                        "itemsId": 10364185,
                        "skuId": 1000770556,
                        "name": "sanag塞那 Z36SPro 粉色 气传导耳机",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/0a/56/0a56d7a1807bae7b72667252853cde65.png",
                        "marketPrice": 16900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 7500,
                "showPrice": "75",
                "showMarketPrice": "169",
                "uid": "19***5",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i0.hdslb.com/bfs/face/9a906b83011b4d77772f3e9d00d26af7359d44ce.jpg",
                "uname": "b***"
            },
            {
                "c2cItemsId": 111902142893,
                "type": 1,
                "c2cItemsName": "影驰 影驰RTX4070二十周年  电脑配件",
                "detailDtoList": [
                    {
                        "blindBoxId": 196778712,
                        "itemsId": 10478759,
                        "skuId": 1001199494,
                        "name": "影驰 影驰RTX4070二十周年  电脑配件",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/90/f7/90f716b232c6727d57014dfc7043bbc5.png",
                        "marketPrice": 529900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 402400,
                "showPrice": "4024",
                "showMarketPrice": "5299",
                "uid": "34***3",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i2.hdslb.com/bfs/face/daf8c803e054135e0d3593b61324aa1b413fb59b.jpg",
                "uname": "l***"
            },
            {
                "c2cItemsId": 111899523912,
                "type": 1,
                "c2cItemsName": "微星 RTX 4080 SUPER 超龙16G 电脑配件",
                "detailDtoList": [
                    {
                        "blindBoxId": 197618990,
                        "itemsId": 10556439,
                        "skuId": 1001427951,
                        "name": "微星 RTX 4080 SUPER 超龙16G 电脑配件",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/7a/13/7a13d5bdd798ca5618af865e58e73d97.png",
                        "marketPrice": 1029900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 860000,
                "showPrice": "8600",
                "showMarketPrice": "10299",
                "uid": "34***3",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i2.hdslb.com/bfs/face/daf8c803e054135e0d3593b61324aa1b413fb59b.jpg",
                "uname": "l***"
            },
            {
                "c2cItemsId": 111894935044,
                "type": 1,
                "c2cItemsName": "sanag塞那 G30S 武士黑 气传导耳机",
                "detailDtoList": [
                    {
                        "blindBoxId": 194518259,
                        "itemsId": 10660775,
                        "skuId": 1001849981,
                        "name": "sanag塞那 G30S 武士黑 气传导耳机",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/27/ca/27ca74a1884be0b11e463939375d1402.png",
                        "marketPrice": 24900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 19519,
                "showPrice": "195.19",
                "showMarketPrice": "249",
                "uid": "24***7",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i2.hdslb.com/bfs/face/48b7ffb88fe273ddf8bca3f9ef0ed33d6a9547dd.jpg",
                "uname": "无***"
            },
            {
                "c2cItemsId": 111902134241,
                "type": 1,
                "c2cItemsName": "sanag塞那 G30S 空灵白 气传导耳机",
                "detailDtoList": [
                    {
                        "blindBoxId": 194509431,
                        "itemsId": 10660775,
                        "skuId": 1001849982,
                        "name": "sanag塞那 G30S 空灵白 气传导耳机",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/18/10/181037ce6f2a7c9afb277769f339ec5c.jpg",
                        "marketPrice": 24900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 19519,
                "showPrice": "195.19",
                "showMarketPrice": "249",
                "uid": "24***7",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i2.hdslb.com/bfs/face/48b7ffb88fe273ddf8bca3f9ef0ed33d6a9547dd.jpg",
                "uname": "无***"
            },
            {
                "c2cItemsId": 111902130073,
                "type": 1,
                "c2cItemsName": "黑爵 AKS068 PRO 海盐轴灰米橘 键盘",
                "detailDtoList": [
                    {
                        "blindBoxId": 182606286,
                        "itemsId": 10218768,
                        "skuId": 1000499367,
                        "name": "黑爵 AKS068 PRO 海盐轴灰米橘 键盘",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/ba/6e/ba6e6c9551f954bc2fc84cbc4787bd6b.png",
                        "marketPrice": 29900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 16900,
                "showPrice": "169",
                "showMarketPrice": "299",
                "uid": "35***8",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i0.hdslb.com/bfs/face/member/noface.jpg",
                "uname": "b***"
            },
            {
                "c2cItemsId": 111902129931,
                "type": 1,
                "c2cItemsName": "哔哩哔哩 BW 2021限定游戏手柄",
                "detailDtoList": [
                    {
                        "blindBoxId": 193611230,
                        "itemsId": 10041308,
                        "skuId": 1000098727,
                        "name": "哔哩哔哩 BW 2021限定游戏手柄",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/cd/6c/cd6c0ac3169ab16d7164b887c351b923.png",
                        "marketPrice": 23300,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 13800,
                "showPrice": "138",
                "showMarketPrice": "233",
                "uid": "39***4",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i1.hdslb.com/bfs/face/e013362cffc80f13cccefcbc2b0ca1b1ae1af9e8.jpg",
                "uname": "b***"
            },
            {
                "c2cItemsId": 111900462887,
                "type": 1,
                "c2cItemsName": "罗马仕 WMO10 奶油黄 10000mAh 数码配件",
                "detailDtoList": [
                    {
                        "blindBoxId": 197910179,
                        "itemsId": 10592741,
                        "skuId": 1001637611,
                        "name": "罗马仕 WMO10 奶油黄 10000mAh 数码配件",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/36/d5/36d589537934a8cd4e83e946a4cb903b.png",
                        "marketPrice": 20900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 8900,
                "showPrice": "89",
                "showMarketPrice": "209",
                "uid": "10***7",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i0.hdslb.com/bfs/face/604eda1c768ce315c91c823359d6887131fed0d7.jpg",
                "uname": "b***"
            },
            {
                "c2cItemsId": 111897655071,
                "type": 1,
                "c2cItemsName": "罗马仕 PSL20 标准款 20000mAh 数码配件",
                "detailDtoList": [
                    {
                        "blindBoxId": 193779426,
                        "itemsId": 10592603,
                        "skuId": 1001637264,
                        "name": "罗马仕 PSL20 标准款 20000mAh 数码配件",
                        "img": "//i0.hdslb.com/bfs/mall/vendor/96/01/9601caf576d57d123f7efabb0f1dfef4.png",
                        "marketPrice": 12900,
                        "type": 0,
                        "isHidden": false
                    }
                ],
                "totalItemsCount": 1,
                "price": 6000,
                "showPrice": "60",
                "showMarketPrice": "129",
                "uid": "41***9",
                "paymentTime": 0,
                "isMyPublish": false,
                "uspaceJumpUrl": null,
                "uface": "https://i0.hdslb.com/bfs/face/948935a8554058e025216fbe8a9d2526ea7af20d.webp",
                "uname": "转***"
            }
        ],
        "nextId": "EwE8WteY9O6zbVe+2IlN40zpVKI+ixW9lgiy6ynSOxk="
    },
    "errtag": 0
}`
	util.PrettyLogger()
	var response domain.MailListResponse
	_ = json.Unmarshal([]byte(rawJson), &response)
	log.Info().Any("MailListResponse", response)

	d, _ := dao.NewDatabase("bsm.db")
	content, err := os.ReadFile("init.sql")
	if err != nil {
		panic(err)
	}
	err = d.Init(string(content))
	if err != nil {
		log.Error().Err(err)
	}
	num := d.SaveMailListToDB(&response)
	fmt.Printf("%d", num)

}

func Test_list(t *testing.T) {
	util.PrettyLogger()
	d, _ := dao.NewDatabase("bsm.db")
	content, err := os.ReadFile("dict/init.sql")
	if err != nil {
		panic(err)
	}
	err = d.Init(string(content))
	if err != nil {
		log.Error().Err(err).Msg("Init")
		return
	}
	items, total, err := d.ReadCSCItems(1, 10, "", 1, nil, nil, 800, 900)
	if err != nil {
		log.Error().Err(err).Msg("ReadCSCItems")
	}
	println(total)
	for idx, item := range items {
		log.Info().Any(strconv.Itoa(idx), item).Msg("list")
	}

}

func Test_simple_list(t *testing.T) {
	util.PrettyLogger()
	sql.Register("sqlite3_simple",
		&sqlite3.SQLiteDriver{
			Extensions: []string{
				"dict/libsimple-windows-x64/simple",
			},
		})

	db, err := sql.Open("sqlite3_simple", ":memory:")
	if err != nil {
		log.Error().Err(err).Msg("Open")
	}
	defer db.Close()

	// db.Exec("create virtual table repo using github(id, full_name, description, html_url)")
	rows, err := db.Query(`select simple_query('pinyin')`)
	if err != nil {
		log.Error().Err(err).Msg("Query")
	}
	defer rows.Close()
	for rows.Next() {
		var query string
		rows.Scan(&query)
		fmt.Printf("%s\n", query)
	}
}
