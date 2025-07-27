# 待办事项：将 SQLite 数据集成到产品页面

本文档概述了将 `pony-canyon-figure-clone` 项目产品页面中的模拟数据替换为 SQLite 数据库中真实数据的步骤。

## 1. 在 Next.js 中创建新的 API 路由

- [ ] 创建一个新文件 `C:\frontend\BiliShareMall\pony-canyon-figure-clone\src\app\api\products\route.ts`。
- [ ] 在这个新文件中，从 `C:\frontend\BiliShareMall\express-api\src\services\goods.ts` 导入 `searchGoodsItems` 函数。
- [ ] 在新路由中创建一个 `GET` 请求处理程序，该处理程序调用 `searchGoodsItems` 并以 JSON 响应的形式返回数据。
- [ ] 该处理程序应接受用于分页（`page`、`pageSize`）和筛选（`name`、`priceFlow`、`priceCeil`）的查询参数。

## 2. 修改产品页面

- [ ] 打开文件 `C:\frontend\BiliShareMall\pony-canyon-figure-clone\src\app\products\page.tsx`。
- [ ] 删除模拟的 `products` 数组。
- [ ] 使用 `useState` 和 `useEffect` 钩子从新的 API 路由（`/api/products`）获取数据。
- [ ] 为以下内容实现状态管理：
    - `products`：用于存储获取的产品数据。
    - `page`：用于跟踪当前页面。
    - `pageSize`：用于控制每页的项目数。
    - `total`：用于存储产品总数。
    - `filters`：用于管理筛选器值。
- [ ] 更新 `ProductCard` 组件以处理来自数据库的新数据结构。
- [ ] 在 UI 中添加分页控件，包括“上一页”和“下一页”按钮。
- [ ] 将筛选器 UI 元素连接到 `filters` 状态，并在筛选器更改时重新获取数据。

## 3. 重构和测试

- [ ] 确保 `searchGoodsItems` 函数正确处理所有筛选器参数。
- [ ] 测试 API 路由，确保其返回正确的数据并正常处理错误。
- [ ] 测试产品页面，确保数据显示正确，分页功能正常，筛选器应用正确。
- [ ] 验证应用程序是否完全响应式，并且在桌面和移动设备上都能正常工作。
