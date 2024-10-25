package http

import (
	"fmt"
	"testing"
)

func TestLogin(t *testing.T) {

	loginKey, loginUrl := GetLoginKeyAndUrl()
	fmt.Println(loginUrl)
	login := VerifyLogin(loginKey)
	fmt.Printf("%s", login)
}
