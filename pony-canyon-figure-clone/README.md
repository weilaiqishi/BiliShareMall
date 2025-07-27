# Pony Canyon Figure Clone

This project is a clone of the Pony Canyon Figure website, built with Next.js and shadcn/ui.

## 功能点

本项目主要包含以下三大页面，涵盖了从浏览到购买手办的完整流程：

1.  **首页 (`/`)**
    *   **核心展示**: 突出展示了网站的品牌形象和核心优势，包括“高品质”、“全球配送”和“专业服务”。
    *   **引导用户**: 通过显眼的“浏览产品”和“了解更多”按钮，引导用户进入产品列表页或了解更多关于公司的信息。
    *   **响应式设计**: 页面布局能够自适应不同尺寸的设备，在手机、平板和电脑上都有良好的浏览体验。

2.  **产品列表页 (`/products`)**
    *   **产品陈列**: 以网格布局清晰地展示所有在售和已售罄的手办，每个产品都包含图片、名称、价格和销售状态。
    *   **多维度筛选**: 提供按“类别”、“作品标题”进行筛选的功能，并支持通过关键词进行“搜索”，方便用户快速找到心仪的手办。
    *   **状态标识**: 对已售罄的商品进行明确的“售罄”标识，提升用户体验。

3.  **产品详情页 (`/products/[id]`)**
    *   **全方位展示**: 提供产品多角度的高清图片画廊，并支持点击缩略图切换主图。
    *   **详尽信息**: 详细列出产品的规格、价格、预售时间、发售日期、系列、制造商等信息。
    *   **特色介绍**: 通过图文并茂的方式，生动地介绍产品的设计亮点和特色。
    *   **视频演示**: 嵌入了产品相关的视频，让用户更直观地了解产品。
    *   **关联推荐**: 在页面底部推荐相关的产品，增加用户的浏览深度和购买机会。

## 响应式设计

本项目采用 **Tailwind CSS** 框架实现响应式设计，确保在不同尺寸的设备上都能提供最佳的浏览体验。

### 实现方式

*   **移动端优先 (Mobile-First)**: 默认样式为移动端设计，保证了在小屏幕上的核心功能和内容的可用性。
*   **断点前缀**: 通过使用 Tailwind CSS 的响应式断点前缀（如 `md:`, `lg:`, `xl:`），为不同屏幕尺寸（平板、桌面电脑）应用不同的样式。断点在 `tailwind.config.ts` 中定义，例如：
    *   `sm`: 640px
    *   `md`: 768px
    *   `lg`: 1024px
    *   `xl`: 1280px
*   **弹性布局 (Flexbox) 和网格布局 (Grid)**: 大量使用 `flex` 和 `grid` 布局，结合响应式前缀，实现组件的动态排列和伸缩。例如，在产品列表页，PC端显示为多列网格布局，而在移动端则自动切换为单列堆叠布局。
*   **动态调整**: 字体大小、间距、图片尺寸等元素也会根据屏幕尺寸进行相应的调整，以保证视觉效果的协调与信息的清晰传达。

这种方法使得项目能够优雅地从单列的移动端视图过渡到多列的桌面端视图，为所有用户提供一致且高质量的体验。

## 开发

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building

To build the application for production, run:

```bash
bun run build
```

## Linting and Formatting

To lint the code, run:

```bash
bun run lint
```

To format the code, run:

```bash
bun run format
```