package app

import (
	"fmt"
	"github.com/mikumifa/BiliShareMall/internal/dao"
	"github.com/mikumifa/BiliShareMall/internal/domain"
	"github.com/mikumifa/BiliShareMall/internal/http"
	"github.com/rs/zerolog/log"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"time"
)

// / 爬取函数返回爬虫情况：获取数目，重复获取数目，新增数目
type TaskRequest struct {
	taskId  int
	cookies string
}

var taskIdChan = make(chan TaskRequest)
var doneChan = make(chan struct{})
var taskRequest TaskRequest

func (a *App) ReadAllScrapyItems() []dao.ScrapyItem {
	items, err := a.d.ReadAllScrapyItems()
	if err != nil {
		log.Error().Err(err).Msg("error reading scrapy items")
		return []dao.ScrapyItem{}
	}
	log.Info().Any("item", items).Msg("read scrapy item")
	return items
}

// DeleteScrapyItem 删除 ScrapyItem
func (a *App) DeleteScrapyItem(id int) error {
	err := a.d.DeleteScrapyItem(id)
	if err != nil {
		log.Error().Err(err).Msg("error deleting scrapy item")
		return err
	}
	return nil
}

// CreateScrapyItem return -1 if not found
func (a *App) CreateScrapyItem(item dao.ScrapyItem) int64 {
	item.CreateTime = time.Now()
	id, err := a.d.CreateScrapyItem(item)
	if err != nil {
		log.Error().Err(err).Msg("error deleting scrapy item")
		return id
	}
	log.Info().Any("item", item).Msg("create scrapy item")
	return id
}
func (a *App) StartTask(taskId int, cookies string) error {
	//预先检查，提前按报错
	taskIdChan <- TaskRequest{
		taskId:  taskId,
		cookies: cookies,
	}
	return nil
}

func (a *App) DoneTask(taskId int) error {
	if taskId != taskRequest.taskId {
		log.Error().Int("nowRun", taskRequest.taskId).Int("needStop", taskId).Msg("task not running")
		return fmt.Errorf("task not running")
	}
	doneChan <- struct{}{}
	return nil
}
func (a *App) GetNowRunTaskId() int {
	return taskRequest.taskId
}
func (a *App) scrapyRunTimeWork() {
	log.Info().Msg("scrapy runtime started")
	for {
		select {
		case <-doneChan:
			log.Info().Msg("scrapyRunTimeWork stopped")
			return
		case taskRequest = <-taskIdChan:
			scrapyItem, err := a.d.ReadScrapyItem(taskRequest.taskId)
			if err != nil {
				log.Error().Err(err).Msg("read scrapy item failed")
				continue
			}
			func() {
				for {
					select {
					case taskRequest = <-taskIdChan:
						scrapyItem, err = a.d.ReadScrapyItem(taskRequest.taskId)
						if err != nil {
							log.Error().Err(err).Msg("read scrapy item failed")
							runtime.EventsEmit(a.ctx, "scrapy_failed", scrapyItem.Id)
							return
						}
						continue //下一次id修改
					case <-doneChan:
						return
					default:
						err = a.scrapyTask(&scrapyItem, taskRequest.cookies)
						if err != nil {
							log.Error().Err(err).Msg("scrapyRunTimeWork failed")
							//runtime.EventsEmit(a.ctx, "scrapy_failed", scrapyItem.Id)
							time.Sleep(3 * time.Second)
							return
						}
						if scrapyItem.NextToken == nil {
							log.Info().Msg("scrapyRunTimeWork finished")
							runtime.EventsEmit(a.ctx, "scrapy_finished", scrapyItem.Id)
							return
						}
						time.Sleep(3 * time.Second)
					}
				}
			}()
		}
	}
}

// ScrapyTask 爬取一次，更新ScrapyItem的token，并更新数据库
func (a *App) scrapyTask(item *dao.ScrapyItem, cookiesStr string) error {
	client, err := http.NewBiliClient()
	if err != nil {
		return err
	}
	client.StoreHeader("cookie", cookiesStr)
	toRangeStrFunc := func(x, y float64) string {
		return fmt.Sprintf("%d-%d", int(x), int(y))
	}
	var nextId *string
	data := map[string]interface{}{"sortType": "TIME_DESC",
		"nextId":          nextId,
		"priceRange":      []string{toRangeStrFunc(item.PriceRange[0]*100, item.PriceRange[1]*100)},
		"discountFilters": []string{toRangeStrFunc(item.RateRange[0], item.RateRange[1])},
		"categoryFilter":  item.Product,
	}
	var resp domain.MailListResponse
	err = client.SendRequest(http.POST, "https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list", data, &resp)
	log.Info().Any("resp", resp).Msg("list")
	if err != nil {
		return err
	}
	//update nextToken and increaseNumber and  nums ,then save to DB
	item.NextToken = resp.Data.NextID
	increaseNumber := a.d.SaveMailListToDB(&resp)
	item.Nums++
	item.IncreaseNumber += int(increaseNumber)
	_, err = a.d.UpdateScrapyItem(item)
	if err != nil {
		return err
	}
	runtime.EventsEmit(a.ctx, "updateScrapyItem", item)
	return nil
}
