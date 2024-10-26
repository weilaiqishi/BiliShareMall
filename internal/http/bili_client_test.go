package http

import (
	"github.com/mikumifa/BiliShareMall/internal/domain"
	"github.com/mikumifa/BiliShareMall/internal/util"
	"testing"
)

func TestBiliClient_SendRequest(t *testing.T) {
	util.PrettyLogger()
	client, _ := NewBiliClient()
	client.StoreHeader("cookie", "header_theme_version=CLOSE; buvid_fp_plain=undefined; buvid4=A0A7440E-2AA5-8D2B-D72C-CB72AF0DC2CC11332-023090300-7XDfT9HnZ75yaO3oFsWpq6ujjb5F3FpVPkhHSJ%2F5BHw%3D; CURRENT_BLACKGAP=0; enable_web_push=DISABLE; _xid=9hB8xd6NRT4oDjMS1lUoxOw8t2ZnxVCGPKJO2tEUD6Lc4nyCi%5CxNryqhdJzMt3AeQfS1pB2XUON4P8bImqwE90ItWMz1te3H75DHCeBOh7C1E631WOo8gKHG8IhGxdQ0; c=j6obFUMa-1699024596240-8ffe4a955f3b51953567856; _fmdata=A6MVZQzTMnkbS46Itfb1wpQIgWiLWll6qjjbtwZGbHDSjdphqe0qohZPez2N%5CVk3up1dn2ItUF4XbNBNIUlAOLaMe33bSBOe4aTVVjwI8s4WrUadG8JDH6wk7wU5D4bB; 1735D64331DF397E=A6MVZQzTMnkbS46Itfb1wpQIgWiLWll6qjjbtwZGbHDSjdphqe0qohZPez2N%5CVk3up1dn2ItUF4XbNBNIUlAOLaMe33bSBOe4aTVVjwI8s4WrUadG8JDH6wk7wU5D4bB; 9AD585D8A7CB034A=j6obFUMa-1699024596240-8ffe4a955f3b51953567856; FEED_LIVE_VERSION=V_HEADER_LIVE_NEW_POP; is-2022-channel=1; buvid3=2A5053BC-FEF0-515C-AA08-94652304B97485100infoc; b_nut=1725280585; _uuid=510648197-9A5C-4B109-165D-1A9101D91CF8B77963infoc; hit-dyn-v2=1; DedeUserID=209403799; DedeUserID__ckMd5=de5314c2c0a5ee19; CURRENT_FNVAL=4048; fingerprint=b2137b34cf9f3332e99ce4099fdfa41e; CURRENT_QUALITY=112; rpdid=|(~)Ym)~RY)0J'u~k)J|k~k|; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjg4MjE0OTgsImlhdCI6MTcyODU2MjIzOCwicGx0IjotMX0.-3Miv-HCHBlAs364qF550eTCFzbRX43s7vr36RtWpIw; bili_ticket_expires=1728821438; SESSDATA=2e6b014d%2C1744116646%2Cb8df6%2Aa2CjC-8Ih2iFpHAxYERVIdxrWKYaWZ45V2-JhJLaE-IM3aXaGcqIBuxJEy0mmvmQUwn8kSVjNTT05CM1dVbWhmdTNnVE42UzN0NnAxMTEyWmlXcHRzdUhoV1BLbVlwalZhOUFCWmtuSGpSQmR0eDZwSFEtX3dPWTkwc1BpcWdadkdjVnRXNXBZOU5RIIEC; bili_jct=2014dee83466f43afb27b72ee4f59080; LIVE_BUVID=AUTO4417285646592974; home_feed_column=5; PVID=2; b_lsid=E26E1233_1927C0B0D4B; browser_resolution=1431-702; bp_t_offset_209403799=987067623030128640; sid=4vbk0glf; buvid_fp=b2137b34cf9f3332e99ce4099fdfa41e")
	data := map[string]interface{}{"sortType": "TIME_DESC", "nextId": nil}
	resp := domain.MailListResponse{}
	_ = client.SendRequest(POST, "https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list", data, resp)

}
