# 爬虫运行机制分析

本项目中的爬虫功能主要由 Go 后端和 Vue 前端协同完成。Go 后端负责实际的爬取逻辑、数据存储和任务管理，而 Vue 前端则提供用户界面，用于配置和启动爬虫任务。

## 1. 前端部分 (`c:\frontend\BiliShareMall\frontend\src\views\scrapy\index.vue`)

前端页面是用户与爬虫功能交互的入口。它主要负责以下几个方面：

-   **任务配置**：用户可以在页面上设置爬取商品的类型（`seleteProduct`）、价格范围（`priceRange`）、折扣范围（`rateRange`）和排序方式（`seleteOrder`）。
-   **任务管理**：
    -   `addScrapy()`: 用于添加新的爬取任务。它会创建一个 `dao.ScrapyItem` 对象，包含用户配置的参数，并将其发送到后端进行持久化存储。
    -   `handleRun(idx: number)`: 启动指定索引的爬取任务。它会调用后端的 `StartTask` 方法，并传递任务 ID 和用户 token。
    -   `handldStop(idx: number)`: 停止当前正在运行的爬取任务。它会调用后端的 `DoneTask` 方法。
    -   `handleClose(idx: number)`: 删除指定的爬取任务。它会调用后端的 `DeleteScrapyItem` 方法。
-   **状态显示**：页面会显示当前正在运行的任务（`nowIdx`），以及已完成（`finishTimeHash`）和失败（`failedTimeHash`）任务的时间戳。
-   **事件监听**：前端通过 `EventsOn` 监听后端发出的事件，例如 `updateScrapyItem`（任务更新）、`scrapy_failed`（任务失败）、`scrapy_finished`（任务完成）和 `scrapy_wait`（遇到风控，等待）。

## 2. 后端 Go 部分

Go 后端是爬虫的核心，主要包含 `app` 和 `dao` 两个包。

### 2.1. `app` 包 (`c:\frontend\BiliShareMall\internal\app\scrapy.go`)

`app` 包负责处理爬虫的业务逻辑和任务调度：

-   **`ScrapyItem` 管理**：
    -   `ReadAllScrapyItems()`: 从数据库读取所有爬取任务。
    -   `DeleteScrapyItem(id int)`: 从数据库删除指定 ID 的爬取任务。
    -   `CreateScrapyItem(item dao.ScrapyItem)`: 在数据库中创建新的爬取任务。
-   **任务执行**：
    -   `scrapyLoop(taskId int, ctx context.Context)`: 这是爬虫任务的主循环。它在一个独立的 goroutine 中运行，持续执行 `scrapyTask` 直到任务完成或被取消。
    -   `StartTask(taskId int, cookies string)`: 启动一个爬取任务。它会取消之前正在运行的任务（如果存在），然后为新任务创建一个带有取消功能的上下文，并在新的 goroutine 中启动 `scrapyLoop`。
    -   `DoneTask(taskId int)`: 停止指定 ID 的爬取任务，通过调用 `cancel()` 来终止 `scrapyLoop`。
    -   `GetNowRunTaskId()`: 获取当前正在运行的任务 ID。
-   **实际爬取逻辑**：
    -   `scrapyTask(item *dao.ScrapyItem)`: 执行单次爬取操作。它会创建一个 `http.BiliClient`，设置 cookie，然后向 `https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list` 发送 POST 请求。请求参数包括 `sortType`、`nextId`（用于分页）、`priceFilters`、`discountFilters` 和 `categoryFilter`。它还会处理 Bilibili 商城的风控（HTTP 429 状态码），并在遇到时暂停一段时间。爬取成功后，它会更新 `ScrapyItem` 的 `NextToken`、`Nums` 和 `IncreaseNumber`，并将更新后的 `ScrapyItem` 保存到数据库。
-   **事件通知**：通过 `runtime.EventsEmit` 向前端发送事件，通知任务状态（成功、失败、完成、等待）。

### 2.2. `dao` 包 (`c:\frontend\BiliShareMall\internal\dao\scrapy.go`)

`dao` 包负责与数据库进行交互，实现 `ScrapyItem` 和 `CSCItem` 的持久化存储：

-   **`ScrapyItem` 结构体**：定义了爬取任务的数据结构，包括 `Id`、`PriceRange`、`RateRange`、`Product`、`Nums`、`Order`、`IncreaseNumber`、`NextToken` 和 `CreateTime`。
-   **数据库操作**：
    -   `CreateScrapyItem(item ScrapyItem)`: 将 `ScrapyItem` 插入到 `scrapy_items` 表中。
    -   `UpdateScrapyItem(item *ScrapyItem)`: 更新 `scrapy_items` 表中的 `ScrapyItem`。
    -   `ReadScrapyItem(id int)`: 从 `scrapy_items` 表中读取指定 ID 的 `ScrapyItem`。
    -   `DeleteScrapyItem(id int)`: 从 `scrapy_items` 表中删除指定 ID 的 `ScrapyItem`。
    -   `ReadAllScrapyItems()`: 从 `scrapy_items` 表中读取所有 `ScrapyItem`。
-   **`CSCItem` 结构体**：定义了从 Bilibili 商城爬取到的商品数据结构。
-   **商品数据存储**：
    -   `CreateCSCItem(item *CSCItem)`: 将爬取到的商品数据插入到 `c2c_items` 表中（如果不存在）。
    -   `SaveMailListToDB(response *domain.MailListResponse)`: 遍历 `MailListResponse` 中的商品数据，并调用 `CreateCSCItem` 将每个商品保存到数据库。

## 3. 爬虫运行流程总结

1.  **前端配置与创建任务**：用户在 Vue 页面上配置爬取参数，点击“添加”按钮，前端调用 Go 后端的 `CreateScrapyItem` 方法，将任务信息保存到 SQLite 数据库的 `scrapy_items` 表中。
2.  **前端启动任务**：用户点击“启动”按钮，前端调用 Go 后端的 `StartTask` 方法，并传递任务 ID 和用户 cookie。
3.  **后端任务调度**：`StartTask` 方法会启动一个独立的 Go goroutine，运行 `scrapyLoop` 函数。`scrapyLoop` 会持续从数据库中读取任务详情，并循环调用 `scrapyTask`。
4.  **后端执行爬取**：`scrapyTask` 函数负责实际的 HTTP 请求。它使用 `http.BiliClient` 向 Bilibili 商城发送 POST 请求，获取商品数据。请求中包含前端配置的筛选条件和排序方式，以及用于分页的 `nextId`。
5.  **后端数据处理与存储**：`scrapyTask` 接收到 Bilibili 商城的响应后，会解析响应数据，并将爬取到的商品信息（`CSCItem`）通过 `dao.SaveMailListToDB` 方法保存到 SQLite 数据库的 `c2c_items` 表中。同时，它会更新 `scrapy_items` 表中当前任务的 `NextToken`、`Nums` 和 `IncreaseNumber`。
6.  **后端事件通知**：在爬取过程中，Go 后端会通过 Wails 的 `runtime.EventsEmit` 机制向前端发送事件，通知前端任务的最新状态（例如，任务更新、完成、失败或遇到风控）。
7.  **前端状态更新**：前端 Vue 页面监听这些事件，并根据事件内容更新 UI，向用户展示任务的实时进度和状态。
8.  **任务停止**：用户可以点击“停止”按钮，前端调用 Go 后端的 `DoneTask` 方法，该方法会取消 `scrapyLoop` 的上下文，从而优雅地停止爬取任务。

整个流程形成了一个闭环，前端负责用户交互和任务触发，后端负责核心爬取逻辑、数据处理和持久化，并通过事件机制实现前后端通信，确保用户能够实时了解爬虫任务的进展。