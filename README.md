This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI 前沿资讯（Resources）

`/resources` 页面已实现“默认数据 + 后端接口预留”的结构，后续接后端时无需改页面渲染逻辑。

### 本地默认模式

- 页面默认读取内置资讯数据。
- 同域接口 `GET /api/ai-news` 也会返回同一份结构化数据，可先用于联调。

支持查询参数：

- `page`：页码（从 1 开始）
- `pageSize`：每页条数
- `tag`：按标签过滤
- `q`：关键字搜索（标题/摘要/来源/标签）

返回结构：

```json
{
	"items": [
		{
			"id": "ai-2026-05-18-npu",
			"title": "...",
			"summary": "...",
			"publishedAt": "2026-05-18T09:00:00+08:00",
			"sourceName": "...",
			"sourceUrl": "https://...",
			"tags": ["..."]
		}
	],
	"total": 8,
	"page": 1,
	"pageSize": 9
}
```

### 后端对接模式

通过环境变量切换数据源：

- `AI_NEWS_API_URL`：后端资讯接口地址（示例：`https://api.example.com/ai-news`）
- `AI_NEWS_TIMEOUT_MS`：请求超时（毫秒，默认 `5000`）
- `AI_NEWS_REVALIDATE`：Next 服务端缓存再验证秒数（默认 `1800`）
- `AI_NEWS_FALLBACK_ENABLED`：后端失败时是否回退默认数据（默认 `true`，设置为 `false` 则直接抛错）

当 `AI_NEWS_API_URL` 已配置时，页面优先拉取后端数据；失败时按 `AI_NEWS_FALLBACK_ENABLED` 决定是否自动回退到默认数据。

## 第一阶段实施（已开始）

第一阶段目标：把同域 API 路由统一切到 Service 层，确保读取链路一致，并通过 `dataSource` 观测数据来源（`default/api/fallback`）。

### 已提供工具

- 环境变量模板：`.env.example`
- 一键冒烟脚本：`scripts/smoke-phase1.ps1`
- npm 命令：`npm run smoke:phase1`

### 使用步骤

1. 复制 `.env.example` 为 `.env.local` 并填写对应后端地址。
2. 启动前端：`npm run dev`
3. 运行冒烟：`npm run smoke:phase1`

脚本会验证四类资源的：

- 列表接口可用
- `dataSource` 值合法
- 详情接口可返回对应 slug

### 契约注意事项

- `resources/hub` 模块使用 `NEXT_PUBLIC_CONTENT_API_BASE`，可直接对接 `opc-content-hub` 的 `/api/public/*`。
- `AI_NEWS_API_URL`、`COLLAB_API_URL`、`OFFLINE_EVENT_API_URL`、`TECH_RESOURCE_API_URL` 这四个 Service 变量要求的是各自模块的专用返回结构，不建议直接指向通用 `/api/public/contents`，否则会触发类型校验并回退。
