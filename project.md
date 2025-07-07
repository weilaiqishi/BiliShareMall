# BiliShareMall 项目文档

## 项目概述

BiliShareMall 是一个专注于Bilibili会员购、魔力赏和市集板块的电商数据采集与搜索平台。项目采用三层架构设计，包含前端展示层、后端业务逻辑层和数据持久层。

## 系统架构

### 核心组件

1. **爬虫管理系统**：Vue.js + TypeScript
2. **商品搜索界面**：Vue.js + Naive UI
3. **后端API服务**：Express.js + TypeScript
4. **数据持久层**：SQLite + 全文搜索

### 技术栈

- **前端**：Vue 3, TypeScript, Naive UI, VueUse, Pinia, Vite
- **后端**：Node.js, Express.js, TypeScript, SQLite
- **工具链**：cross-env, @agentdeskai/browser-tools-server

## 数据流程

1. **自动化采集流程**：
   - 用户通过前端配置爬取任务
   - 后端服务定期轮询Bilibili商城API
   - 数据持久化到SQLite表

2. **交互式搜索流程**：
   - 用户通过搜索界面查询
   - 后端使用SQLite全文搜索功能检索
   - 返回相关商品信息

## 系统能力

- 可配置的自动化数据采集
- 实时任务状态监控
- 支持中文分词的全文搜索
- 跨平台支持(Windows/macOS/Linux)
- 浏览器自动化集成

## 项目结构

```
BiliShareMall/
├── dict/                # NLP字典文件
├── express-api/         # 后端API服务
├── frontend/            # 前端应用
├── types/               # 共享类型定义
└── project.md           # 本项目文档
```

## 开发规范

- 代码风格遵循Prettier配置
- 组件采用PascalCase命名
- API路径遵循RESTful规范
- 类型定义使用TypeScript严格模式
