package app

import (
	"context"
	"fmt"
	"github.com/mikumifa/BiliShareMall/internal/dao"
	"github.com/mikumifa/BiliShareMall/internal/domain"
	"github.com/mikumifa/BiliShareMall/internal/http"
	"github.com/rs/zerolog/log"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"sync"
	"time"
)

// / 爬取函数返回爬虫情况：获取数目，重复获取数目，新增数目
type TaskRequest struct {
	taskId  int
	cookies string
	cancel  context.CancelFunc
}

var wg sync.WaitGroup
var nowRunTask TaskRequest

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

// 更具taskId一直执行
func (a *App) scrapyLoop(taskId int, ctx context.Context) {
	scrapyItem, err := a.d.ReadScrapyItem(taskId)
	if err != nil {
		//TODO: failed message
		runtime.EventsEmit(a.ctx, "scrapy_failed", scrapyItem.Id)
		return
	}
	for {
		select {
		case <-ctx.Done():
			log.Info().Any("scrapyItem", scrapyItem).Msg("scrapyRunTimeWork canceled")
			wg.Done()
			return
		default:
			nowRunTask.taskId = taskId
			err := a.scrapyTask(&scrapyItem)
			if err != nil {
				log.Error().Err(err).Msg("scrapyRunTimeWork failed")
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
}

func (a *App) StartTask(taskId int, cookies string) error {
	//cancel task before
	if nowRunTask.cancel != nil {
		log.Info().Any("nowRunTask", nowRunTask).Msg("scrapyRunTimeWork canceled")
		nowRunTask.cancel()
	}
	wg.Wait()
	//no race because scrapyLoop have down
	//continue next task
	ctx, cancel := context.WithCancel(context.Background())
	// cancel have ben executed
	nowRunTask = TaskRequest{taskId: taskId, cookies: cookies, cancel: cancel}
	wg.Add(1)
	go a.scrapyLoop(taskId, ctx)
	return nil
}

func (a *App) DoneTask(taskId int) error {
	if taskId != nowRunTask.taskId {
		log.Error().Int("nowRun", nowRunTask.taskId).Int("needStop", taskId).Msg("task not running")
		return fmt.Errorf("task not running")
	}
	nowRunTask.cancel()
	return nil
}
func (a *App) GetNowRunTaskId() int {
	return nowRunTask.taskId
}

// ScrapyTask 爬取一次，更新ScrapyItem的token，并更新数据库
func (a *App) scrapyTask(item *dao.ScrapyItem) error {
	client, err := http.NewBiliClient()
	if err != nil {
		return err
	}
	client.StoreHeader("cookie", nowRunTask.cookies)
	toRangeStrFunc := func(x, y float64) string {
		return fmt.Sprintf("%d-%d", int(x), int(y))
	}
	data := map[string]interface{}{"sortType": "TIME_DESC",
		"nextId":          item.NextToken,
		"priceFilters":    []string{toRangeStrFunc(item.PriceRange[0]*100, item.PriceRange[1]*100)},
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
	//发送当前更新信息的item
	runtime.EventsEmit(a.ctx, "updateScrapyItem", item)
	return nil
}
