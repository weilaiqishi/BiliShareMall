package http

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/rs/zerolog/log"
	"io"
	"net/http"
	"net/http/cookiejar"
)

type BiliClient struct {
	httpClient *http.Client
	Jar        *cookiejar.Jar
	headers    map[string]string
}

const (
	POST = "POST"
	GET  = "GET"
)

func NewBiliClient() (*BiliClient, error) {
	jar, err := cookiejar.New(nil)
	if err != nil {
		return nil, err
	}
	headers := map[string]string{
		"Content-Type": "application/json",
	}
	transport := &HeaderTransport{
		headers: headers,
		rt:      http.DefaultTransport,
	}

	return &BiliClient{
		Jar:        jar,
		httpClient: &http.Client{Transport: transport},
		headers:    headers,
	}, nil
}

type HeaderTransport struct {
	headers map[string]string
	rt      http.RoundTripper
}

func (t *HeaderTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	for key, value := range t.headers {
		req.Header.Set(key, value)
	}
	return t.rt.RoundTrip(req)
}

// SendRequest body json
func (c *BiliClient) SendRequest(method, url string, data map[string]interface{}, respObj interface{}) error {
	dataStr, _ := json.Marshal(data)
	req, err := http.NewRequest(method, url, bytes.NewBuffer(dataStr))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	res, err := c.httpClient.Do(req)
	defer res.Body.Close()
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	resp, err := io.ReadAll(res.Body)
	err = json.Unmarshal(resp, &respObj)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}
	log.Info().Str("response", string(resp)).Msg("bili client send request successfully")
	return nil
}
func (c *BiliClient) StoreHeader(key, value string) {
	c.headers[key] = value
}
