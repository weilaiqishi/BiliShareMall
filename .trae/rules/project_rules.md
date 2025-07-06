# BiliShareMall 项目 AI 规则 (project_rules.md)

本文件定义了 AI 在 BiliShareMall 项目中进行代码生成、修改和审查时应遵循的规范和最佳实践。

## 1. 通用规则

- **语言**: 所有代码、注释和文档应优先使用中文，除非是特定技术术语或库名称。
- **注释**:
  - 函数、类、接口和复杂逻辑块应包含清晰的 JSDoc 风格注释，说明其目的、参数、返回值和潜在副作用。
  - 对于非显而易见的逻辑，应添加行内注释。
- **命名**:
  - 变量、函数、类名应具有描述性，并遵循驼峰命名法 (camelCase)。
  - 常量应使用全大写和下划线 (SNAKE_CASE)。
  - 文件名应使用小写和连字符 (kebab-case)。
- **代码格式**: 遵循 Prettier 格式化规则，确保代码风格一致性。
- **错误处理**: 重要的异步操作和可能出错的逻辑应包含适当的错误捕获和处理机制。
- **日志**: 生产环境中应避免过多的 `console.log`，使用结构化日志或专门的日志库。

## 2. 前端 (Vue.js) 规则

- **框架**: 基于 Vue 3 和 Naive UI。
- **组件**:
  - 组件命名应遵循 PascalCase，并具有描述性。
  - 单文件组件 (SFC) 结构应遵循 `<script setup>`, `<template>`, `<style>` 的顺序。
  - 组件应尽可能保持小巧和单一职责。
  - Props 应明确定义类型和默认值。
- **状态管理**: 使用 Pinia 进行全局状态管理。
- **路由**: 使用 `vue-router`，路由定义应清晰，并考虑权限管理。
- **样式**:
  - 优先使用 UnoCSS/TailwindCSS 实用工具类进行样式编写。
  - 对于复杂或组件特有的样式，可以使用 `<style scoped>`。
  - 避免使用内联样式，除非是动态计算的少量样式。
- **API 请求**: 使用 `axios` 或 `ofetch` (根据 `frontend/packages` 中的实际使用情况) 进行 API 请求，并封装在 `service` 模块中。
- **国际化**: 使用 `vue-i18n` 或类似机制进行国际化处理，文本应从 `locales` 中获取。

## 3. 后端 (Express/TypeScript) 规则

- **框架**: 基于 Express.js 和 TypeScript。
- **文件结构**:
  - `controllers`: 包含路由处理函数，负责处理请求和响应。
  - `services`: 包含业务逻辑，与数据库交互或调用外部服务。
  - `routes`: 定义 API 路由。
  - `utils`: 通用工具函数。
- **API**:
  - API 路径应清晰、RESTful。
  - 请求和响应数据应进行严格的类型校验 (例如使用 Zod)。
  - 所有 API 接口应有明确的输入和输出类型定义。
- **数据库**: 使用 `better-sqlite3` 进行 SQLite 数据库操作，数据库交互逻辑应封装在 `services` 层。
- **模块化**: 逻辑应按功能模块划分，保持文件职责单一。
- **依赖管理**: 确保 `package.json` 中的依赖是最新的稳定版本。

## 4. 类型定义 (TypeScript) 规则

- **位置**: 所有共享的类型定义应放置在 `types` 根目录中。
- **命名**: 接口和类型别名应使用 PascalCase。
- **清晰性**: 类型定义应尽可能详细和准确，反映数据的真实结构。
- **复用**: 鼓励类型复用，避免重复定义相同的数据结构。

## 5. 项目特定上下文

- **爬虫迁移**: 正在进行爬虫管理功能从 Go 到 Node.js Express API 的迁移。AI 在处理相关代码时应注意这一背景，并优先考虑 Node.js/Express 的实现。
- **商品搜索**: 存在商品搜索 (`searchGoodsItems`) 功能，AI 在处理商品相关逻辑时应参考 `express-api/src/services/goods.ts` 中的实现。
- **登录**: 存在登录 (`getLoginQRCode`, `verifyLoginStatus`) 功能，AI 在处理用户认证相关逻辑时应参考 `express-api/src/services/login.ts` 中的实现。

请 AI 在生成或修改代码时，严格遵循上述规则，以确保项目代码质量和一致性。
