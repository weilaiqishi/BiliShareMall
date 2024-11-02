package app

import (
	"fmt"
	"io"
	"net/http"
	"strings"
	"testing"
)

func Test_ScrapyOne(t *testing.T) {

	url := "https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list"
	method := "POST"

	payload := strings.NewReader(`{"categoryFilter":"2312","discountFilters":["50-100"],"nextId":null,"priceRange":["10000-20000"],"sortType":"TIME_DESC"}`)

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0")
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(body))

}
