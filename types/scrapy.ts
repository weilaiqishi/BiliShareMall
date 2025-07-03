import { SearchCategoryRequestBody } from "./search_category_request";

// 定义 ScrapyItem 接口，参照 Go 后端的 ScrapyItem 结构
export interface ScrapyItem {
    ID: number; // 爬虫任务的唯一标识符，自增int
    Name: string; // 爬虫任务的名称
    Cookie: string; // 用于爬取操作的 Cookie
    NextToken: number; // 用于分页或增量爬取的标识，创建时初始化为1，后续每次请求商品列表后数据库新增1
    Status: number; // 爬虫任务的状态 (0: 停止, 1: 运行中)
    CreateTime: number; // 爬虫任务创建时间戳
    UpdateTime: number; // 爬虫任务最后更新时间戳
    searchParams: SearchCategoryRequestBody; // 搜索商品的参数，创建爬虫时保存
}