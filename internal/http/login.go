package http

import (
	"github.com/rs/zerolog/log"
	gjson "github.com/tidwall/gjson"
	"io"
	"net/http"
	"strings"
)

const user_agent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69`

func GetLoginKeyAndUrl() (loginKey string, loginUrl string) {
	url := "https://passport.bilibili.com/x/passport-login/web/qrcode/generate"
	client := http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", user_agent)
	resp, err := client.Do(req)
	if err != nil {
		return "", ""
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	data := gjson.ParseBytes(body)
	loginKey = data.Get("data.qrcode_key").String()
	loginUrl = data.Get("data.url").String()
	log.Info().Str("loginKey", loginKey).Str("loginUrl", loginUrl)
	return
}

func VerifyLogin(loginKey string) map[string]string {
	url := "https://passport.bilibili.com/x/passport-login/web/qrcode/poll"
	client := http.Client{}
	url += "?" + "qrcode_key=" + loginKey
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", user_agent)
	resp, err := client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	data := gjson.ParseBytes(body)
	log.Info().Msg("check login")
	if data.Get("data.url").String() != "" {
		cookie := make(map[string]string)
		for _, v := range resp.Header["Set-Cookie"] {
			kv := strings.Split(v, ";")[0]
			kvArr := strings.Split(kv, "=")
			cookie[kvArr[0]] = kvArr[1]
		}
		return cookie

	}
	return nil
}
