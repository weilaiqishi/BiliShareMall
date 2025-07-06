# 爬虫管理功能从 Go 迁移到 Node.js Express API 计划

本项目中的爬虫功能将从当前的 Go 后端迁移到 Node.js Express API，并相应修改 Vue 前端以调用新的 Node.js API。本计划将详细说明后端和前端需要进行的修改。

## 1. 后端 (Node.js Express API) 修改

### 1.1. 文件结构调整

在 `express-api/src/services` 和 `express-api/src/routes` 目录下创建新的文件来处理爬虫相关的逻辑和路由。

- **`express-api/src/services/scrapyService.ts`**: 包含所有爬虫核心逻辑和数据库交互。
- **`express-api/src/routes/scrapyRoutes.ts`**: 定义爬虫相关的 API 路由。
- **`express-api/src/controllers/scrapyController.ts`**: 处理路由请求，调用 `scrapyService` 中的逻辑。

### 1.2. 数据库交互 (`scrapyService.ts`)

参照 Go 后端 `internal/dao/scrapy.go` 中的逻辑，实现对 `scrapy_items` 和 `c2c_items` 表的数据库操作。

- **`scrapy_items` 表的 CRUD 操作**:
  - `createScrapyItem(item: ScrapyItem)`: 插入新的爬虫任务。
  - `readAllScrapyItems(): ScrapyItem[]`: 读取所有爬虫任务。
  - `readScrapyItem(id: number): ScrapyItem | undefined`: 读取指定 ID 的爬虫任务。
  - `updateScrapyItem(item: ScrapyItem)`: 更新爬虫任务。
  - `deleteScrapyItem(id: number)`: 删除爬虫任务。
- **`c2c_items` 表的插入操作**:
  - `insertC2CItem(item: CSCItem)`: 插入爬取到的商品数据。

### 1.3. 爬虫核心逻辑 (`scrapyService.ts`)

参照 Go 后端 `internal/app/scrapy.go` 中的逻辑，实现 Node.js 版本的爬虫核心功能。

- **`scrapyLoop(taskId: number, cookie: string)`**: 模拟 Go 版本的 `scrapyLoop`，在一个独立的异步函数中运行，持续执行 `scrapyTask` 直到任务完成或被取消。
  - 需要实现任务的启动、暂停和停止机制，可能通过 `AbortController` 或自定义的事件系统来管理。
- **`scrapyTask(item: ScrapyItem, cookie: string)`**: 执行单次爬取操作。
  - 使用 `axios` 库进行 HTTP POST 请求，目标 URL 为 `https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/search`。
  - 请求参数包括 `cookieStr`、`keyword`、`filters`、`priceFlow`、`priceCeil`、`sortType`、`sortOrder`、`pageIndex`、`userId`、`state`、`scene`、`termQueries`（包含 `category`）、`rangeQueries` 和 `extra`。`nextId`（用于分页）和 `discountFilters` 可能在后端处理中存在。大部分参数在前端创建爬虫时存储，后续 Node.js 服务运行爬虫时处理分页参数。
  - 处理 Bilibili 商城的风控（HTTP 429 状态码），并在遇到时暂停一段时间（例如使用 `setTimeout`）。
  - 解析响应数据，并将爬取到的商品信息通过 `insertC2CItem` 保存到数据库。
  - 更新 `ScrapyItem` 的 `NextToken`、`Nums` 和 `IncreaseNumber`，并将更新后的 `ScrapyItem` 保存到数据库。

### 1.4. 任务管理 (`scrapyService.ts`)

- **`startTask(taskId: number, cookie: string)`**: 启动一个爬虫任务。
  - 需要管理当前正在运行的任务，确保只有一个任务在运行。
  - 为新任务创建一个上下文，并在新的异步函数中启动 `scrapyLoop`。
- **`stopTask(taskId: number)`**: 停止指定 ID 的爬虫任务。
  - 通过取消机制终止 `scrapyLoop`。
- **`getNowRunTaskId(): number | null`**: 获取当前正在运行的任务 ID。

### 1.5. 事件通知

Go 后端通过 Wails 的 `runtime.EventsEmit` 向前端发送事件。在 Node.js 中，可以考虑以下方式实现实时事件通知：

- **WebSocket (推荐)**: 使用 `ws` 或 `socket.io` 等库建立 WebSocket 连接，向前端发送任务状态更新。
- **Server-Sent Events (SSE)**: 如果只需要单向从服务器到客户端的事件流，SSE 也是一个不错的选择。

### 1.6. 依赖管理

确保 `express-api/package.json` 中包含所有必要的依赖：

- `axios`: 用于 HTTP 请求。
- `better-sqlite3`: 用于 SQLite 数据库操作。
- `ws` 或 `socket.io` (如果使用 WebSocket)。
- 其他可能需要的工具库，如 `es-toolkit`。

## 2. 前端 (Vue) 修改

### 2.1. API 调用替换

修改 `frontend/src/views/scrapy/index.vue`，将所有对 Go 后端爬虫相关 API 的调用替换为对新的 Node.js Express API 的调用。

- **`addScrapy()`**: 调用 Node.js 后端的 `POST /api/scrapy/items` (或类似) 接口。
- **`handleRun(idx: number)`**: 调用 Node.js 后端的 `POST /api/scrapy/start` (或类似) 接口。
- **`handldStop(idx: number)`**: 调用 Node.js 后端的 `POST /api/scrapy/stop` (或类似) 接口。
- **`handleClose(idx: number)`**: 调用 Node.js 后端的 `DELETE /api/scrapy/items/:id` (或类似) 接口。
- **`getAllItems()`**: 调用 Node.js 后端的 `GET /api/scrapy/items` (或类似) 接口。
- **`GetNowRunTaskId()`**: 调用 Node.js 后端的 `GET /api/scrapy/running-task` (或类似) 接口。

### 2.2. 事件监听更新

如果 Node.js 后端使用 WebSocket 或 SSE 进行事件通知，前端需要更新事件监听机制。

- 移除或注释掉 `EventsOn` 相关的代码。
- 根据选择的实时通信方式，实现 WebSocket 客户端或 SSE 客户端，监听后端发送的任务状态更新事件（`updateScrapyItem`, `scrapy_failed`, `scrapy_finished`, `scrapy_wait`）。

### 2.3. 数据模型一致性

确保前端使用的数据模型 (`dao.ScrapyItem`, `CSCItem` 等) 与 Node.js 后端返回的数据结构保持一致。如果 Node.js 后端的数据结构有所不同，需要更新前端的类型定义。

## 3. `scrapy.md` 文档更新

更新 `c:\frontend\BiliShareMall\scrapy.md` 文档，反映爬虫架构从 Go 到 Node.js 的变化，包括：

- 更新爬虫运行机制分析，详细说明 Node.js 后端和 Vue 前端的交互。
- 更新后端部分，描述 Node.js Express API 的文件结构、核心逻辑和任务管理。
- 更新前端部分，说明 Vue 组件如何与新的 Node.js API 交互。
- 移除或修改 Go 相关代码的引用。

这份计划将作为后续开发和修改的指导。
