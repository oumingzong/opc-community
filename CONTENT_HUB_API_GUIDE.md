# OPC Content Hub API 文档

## 1. 概述

OPC Content Hub 是一个基于 Cloudflare Worker + D1 的内容采集与发布服务。它负责从公开数据源抓取内容、写入数据库、审核后发布，并向前台提供统一的公共内容接口。

本文档用于：

- 初始化 Cloudflare D1 数据库
- 配置 Worker 的环境变量与 Secret
- 对接前台内容列表页与详情页
- 明确公开接口、管理接口和返回格式
- 约定错误码、缓存策略和联调方式

## 2. 服务架构

### 2.1 组件

- Cloudflare Worker：提供 API、定时任务、抓取入口
- D1 数据库：保存来源、内容、抓取日志
- Cron Trigger：定时触发抓取任务
- 前台站点：只消费已发布内容

### 2.2 数据流

1. Cron Trigger 触发 Worker。
2. Worker 抓取来源内容。
3. Worker 清洗、去重并写入 D1。
4. 审核后内容状态变为 `published`。
5. 前台通过 `/api/public/*` 读取已发布内容。

## 3. 环境变量与 Secret

### 3.1 必需 Secret

```bash
wrangler secret put INGEST_TOKEN
```

用于保护内部抓取和审核接口。

### 3.2 推荐 Secret

```bash
wrangler secret put ADMIN_WEBHOOK_URL
```

用于连续抓取失败时发送告警。

### 3.3 可选环境变量

```env
USER_AGENT=opc-content-hub/0.1
CRAWL_TIMEOUT_MS=10000
CRAWL_RETRY_LIMIT=2
ALERT_FAILURE_THRESHOLD=3
```

### 3.4 D1 绑定

在 `wrangler.toml` 中绑定 D1：

```toml
[[d1_databases]]
binding = "DB"
database_name = "opc_content_hub"
database_id = "your-d1-database-id"
```

## 4. 数据表结构

### 4.1 sources

保存来源配置。

字段：

- `id`：来源 ID，主键
- `name`：来源名称
- `type`：来源类型，`api` 或 `rss`
- `url`：来源地址
- `enabled`：是否启用，`1/0`
- `interval_minutes`：抓取间隔（分钟）
- `last_fetched_at`：上次抓取时间
- `consecutive_failures`：连续失败次数
- `created_at`：创建时间
- `updated_at`：更新时间

### 4.2 contents

保存内容主表。

字段：

- `id`：内容 ID，主键
- `source_id`：来源 ID
- `type`：内容类型，如 `news`
- `slug`：内容 slug，唯一
- `title`：标题
- `summary`：摘要
- `content`：正文
- `source_url`：原文地址
- `published_at`：发布时间
- `status`：状态，`draft/published/rejected/archived`
- `hash`：去重哈希
- `created_at`：创建时间
- `updated_at`：更新时间

### 4.3 crawl_logs

保存抓取日志。

字段：

- `id`：日志 ID，主键
- `source_id`：来源 ID
- `success`：是否成功，`1/0`
- `error_message`：错误信息
- `fetched_count`：本次抓取入库数量
- `duration_ms`：耗时（毫秒）
- `created_at`：创建时间

## 5. 本地初始化

### 5.1 安装依赖

```bash
npm install
```

### 5.2 创建数据库

```bash
wrangler d1 create opc_content_hub
```

把返回的 `database_id` 填入 `wrangler.toml`。

### 5.3 执行迁移

```bash
npm run db:migrate:local
```

### 5.4 启动本地服务

```bash
npm run dev
```

## 6. 接口总览

### 6.1 健康检查

- `GET /health`

### 6.2 抓取入口

- `POST /internal/ingest`

### 6.3 内容查询

- `GET /api/contents`
- `GET /api/contents/:slug`

### 6.4 前台公共接口

- `GET /api/public/contents`
- `GET /api/public/contents/:slug`

### 6.5 审核与状态流转

- `GET /internal/review/contents`
- `POST /internal/contents/:id/publish`
- `POST /internal/contents/:id/reject`
- `POST /internal/contents/:id/archive`

## 7. 公共接口规范

前台应优先使用 `/api/public/*`。

### 7.1 公共列表接口

**请求**

```http
GET /api/public/contents?page=1&pageSize=20&sourceId=2&q=cloudflare
```

**查询参数**

| 参数 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `page` | number | 否 | 页码，默认 `1` |
| `pageSize` | number | 否 | 每页数量，默认 `20`，最大 `50` |
| `sourceId` | number | 否 | 按来源筛选 |
| `q` | string | 否 | 按标题/摘要关键字搜索 |

**响应示例**

```json
{
  "items": [
    {
      "id": 101,
      "source_id": 2,
      "source_name": "Cloudflare Blog RSS",
      "slug": "cloudflare-pages-launch",
      "title": "Cloudflare Pages 发布新功能",
      "summary": "...",
      "source_url": "https://blog.cloudflare.com/...",
      "published_at": "2026-05-28T10:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "sourceId": 2,
  "q": "cloudflare"
}
```

### 7.2 公共详情接口

**请求**

```http
GET /api/public/contents/cloudflare-pages-launch
```

**响应示例**

```json
{
  "item": {
    "id": 101,
    "source_id": 2,
    "source_name": "Cloudflare Blog RSS",
    "slug": "cloudflare-pages-launch",
    "title": "Cloudflare Pages 发布新功能",
    "summary": "...",
    "content": "...",
    "source_url": "https://blog.cloudflare.com/...",
    "published_at": "2026-05-28T10:00:00.000Z"
  }
}
```

### 7.3 公共接口约束

- 仅返回 `status = 'published'` 的内容
- 必须支持跨域访问
- 列表和详情建议带缓存头
- 前台不存在 slug 时应返回 `404`

## 8. 内部接口规范

内部接口默认需要鉴权，鉴权方式支持：

- `Authorization: Bearer <INGEST_TOKEN>`
- `X-Ingest-Token: <INGEST_TOKEN>`

### 8.1 手动触发抓取

**请求**

```http
POST /internal/ingest
Authorization: Bearer <INGEST_TOKEN>
```

**响应示例**

```json
{
  "ok": true,
  "processedCount": 3,
  "insertedTotal": 12,
  "skippedCount": 1,
  "details": []
}
```

### 8.2 审核列表

**请求**

```http
GET /internal/review/contents?status=draft&page=1&pageSize=20
Authorization: Bearer <INGEST_TOKEN>
```

**说明**

- 支持 `status/sourceId/from/to/page/pageSize`
- 主要用于后台审核或人工确认

### 8.3 状态流转

**发布**

```http
POST /internal/contents/123/publish
Authorization: Bearer <INGEST_TOKEN>
```

**拒绝**

```http
POST /internal/contents/123/reject
Authorization: Bearer <INGEST_TOKEN>
```

**归档**

```http
POST /internal/contents/123/archive
Authorization: Bearer <INGEST_TOKEN>
```

## 9. 错误码约定

### 9.1 通用错误格式

```json
{
  "error": "not_found"
}
```

### 9.2 常见错误

| 状态码 | error | 场景 |
| --- | --- | --- |
| `400` | `invalid_slug` | slug 非法 |
| `400` | `invalid_id` | 内容 ID 非法 |
| `401` | `unauthorized` | 未提供或 token 错误 |
| `404` | `not_found` | 内容不存在或未发布 |
| `500` | `internal_error` | 服务内部错误 |

## 10. 缓存与 CORS

### 10.1 缓存头

建议公共接口返回：

```http
cache-control: public, max-age=60, s-maxage=300, stale-while-revalidate=120
```

### 10.2 CORS 头

应至少包含：

```http
access-control-allow-origin: *
access-control-allow-methods: GET,POST,OPTIONS
access-control-allow-headers: Content-Type,Authorization,X-Ingest-Token
```

### 10.3 OPTIONS

`OPTIONS /api/public/contents` 应返回 2xx，用于浏览器预检。

## 11. 前台接入方式

前台推荐使用：

- `GET /api/public/contents`
- `GET /api/public/contents/:slug`

环境变量：

```env
NEXT_PUBLIC_CONTENT_API_BASE=https://your-worker.workers.dev
```

前台行为建议：

- 列表页：优先渲染列表数据，失败后显示 fallback
- 详情页：slug 不存在时显示 404
- 服务异常时：允许降级到本地备用内容

## 12. 联调与验收

### 12.1 公共接口冒烟

```bash
npm run smoke:public
```

### 12.2 本地联调冒烟

```bash
npm run smoke:public:local
```

### 12.3 验收标准

- `/api/public/contents` 返回 200，且包含 `items`
- `/api/public/contents/:slug` 存在时返回 200
- `/api/public/contents/:slug` 不存在时返回 404
- `/api/public/contents` 响应包含 `cache-control`
- `OPTIONS /api/public/contents` 返回 2xx 且包含 `access-control-allow-origin`

## 13. 推荐实施顺序

1. 初始化 D1 与迁移表结构
2. 配置 `INGEST_TOKEN` 和 `ADMIN_WEBHOOK_URL`
3. 跑通 `/api/public/contents`
4. 跑通 `/api/public/contents/:slug`
5. 接入前台列表和详情页
6. 再接内部审核和状态流转

## 14. 备注

- 默认抓取后写入 `draft`
- 公共接口只面向 `published`
- 连续失败后建议发送告警到 webhook
- 前台字段名推荐使用 `source_name`、`published_at`、`source_url`，和 API 保持一致
