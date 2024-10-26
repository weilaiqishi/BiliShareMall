package app

import (
	"github.com/mikumifa/BiliShareMall/internal/http"
)

type LoginInfo struct {
	Key      string `json:"key"`
	LoginUrl string `json:"login_url"`
}

func (a *App) GetLoginKeyAndUrl() LoginInfo {
	key, loginUrl := http.GetLoginKeyAndUrl()
	loginInfo := LoginInfo{
		Key:      key,
		LoginUrl: loginUrl,
	}
	return loginInfo
}

// VerifyLoginResponse 封装登录验证响应的结构体
type VerifyLoginResponse struct {
	CookieStr map[string]string `json:"cookies"`
}

func (a *App) VerifyLogin(loginKey string) VerifyLoginResponse {
	str := http.VerifyLogin(loginKey)
	ret := VerifyLoginResponse{
		CookieStr: str,
	}
	return ret
}
