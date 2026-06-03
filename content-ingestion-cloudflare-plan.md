# 内容抓取与管理方案（Cloudflare 方案一）

## 目标

为 `opc-community` 增加一套独立、稳定、可扩展的内容抓取与管理能力，用于定期从互联网采集内容，清洗后入库，再供前台网站展示。

本方案采用“**独立抓取项目 + Cloudflare Worker + D1 + Cron Trigger**”的结构，适合当前已经部署到 Cloudflare Workers 的场景。

## 总体原则

1. 抓取与展示分离，前台站点只负责读取内容。
2. 抓取逻辑独立部署，避免影响主站稳定性。
3. 数据先入库，再由 API 提供给前台。
4. 先审核后发布，避免低质量内容直接上线。
5. 所有抓取任务都要有超时、重试、日志和去重。

## 推荐架构

### 1. 内容采集 Worker

负责：
- 按计划触发抓取
- 请求 RSS、官方 API、白名单站点
- 解析和清洗内容
- 去重
- 写入数据库
- 记录抓取日志

### 2. D1 数据库

负责：
- 保存来源配置
- 保存内容主表
- 保存抓取日志
- 保存审核状态

### 3. Cron Trigger

负责：
- 定时触发抓取 Worker
- 控制不同栏目不同频率

### 4. 前台展示站点

负责：
- 读取已发布内容
- 列表页与详情页渲染
- 保留 fallback 机制，避免内容服务异常影响访问

## Cloudflare 方案一的数据流

1. Cron Trigger 触发采集 Worker。
2. Worker 读取来源配置。
3. Worker 请求目标站点或 API。
4. Worker 解析内容并标准化字段。
5. Worker 计算唯一键并去重。
6. 新内容写入 D1。
7. 前台站点通过 API 读取已发布内容。

## 适合抓取的内容类型

建议优先抓取以下内容：

- AI 新闻资讯
- 官方博客更新
- 技术资源列表
- 活动公告
- 社区动态

不建议直接搬运的内容：

- 付费文章全文
- 无授权转载内容
- 版权不明确的长文本

## 内容状态设计

建议每条内容至少包含以下状态：

- `draft`：已抓取，待审核
- `published`：已发布，可展示
- `rejected`：已拒绝，不展示
- `archived`：已归档，仅历史保留

## 数据表建议

### sources

保存来源配置。

字段建议：
- `id`
- `name`
- `type`
- `url`
- `enabled`
- `interval_minutes`
- `last_fetched_at`
- `created_at`
- `updated_at`

### contents

保存抓取后的内容主表。

字段建议：
- `id`
- `source_id`
- `type`
- `slug`
- `title`
- `summary`
- `content`
- `source_url`
- `published_at`
- `status`
- `hash`
- `created_at`
- `updated_at`

### crawl_logs

保存每次抓取任务的日志。

字段建议：
- `id`
- `source_id`
- `success`
- `error_message`
- `fetched_count`
- `duration_ms`
- `created_at`

## 去重规则

建议按优先级使用以下规则：

1. `source_url` 唯一。
2. 如果 `source_url` 不稳定，则使用 `title + published_at + source_name` 生成 `hash`。
3. 同一来源的同一内容只允许入库一次。
4. 入库前先查重，避免重复写入。

## 抓取策略

### 高频内容

- 新闻类：每 30 分钟到 2 小时抓取一次

### 中低频内容

- 资源类：每天 1 到 2 次

### 抓取原则

- 每次只抓最近 N 条
- 不做全量扫描
- 每个来源都设置超时
- 抓取失败后重试，但限制次数
- 每个来源单独处理，避免单点失败拖垮整个任务

## 稳定性设计

1. 每个来源独立执行。
2. 单个请求设置超时。
3. 抓取结果先写日志，再写内容表。
4. 写入失败要有明确错误记录。
5. 连续失败时发送告警。
6. 默认采用 `draft` 状态，人工审核后再发布。

## Cloudflare 配置建议

### 需要的资源

- D1 数据库
- Cron Trigger
- Secrets
- 可选 Queue

### 建议保存的 Secrets

- `INGEST_TOKEN`
- `SOURCE_API_KEY`
- `USER_AGENT`
- `ADMIN_WEBHOOK_URL`

### 环境变量建议

- `CONTENT_REVALIDATE_SECONDS`
- `CRAWL_TIMEOUT_MS`
- `CRAWL_RETRY_LIMIT`

## 前台接入方式

前台站点继续保持现有页面结构，只是把数据源切到内容 API。

建议：

- 列表页读取内容 API
- 详情页读取内容 API
- 保留本地 fallback
- API 只返回 `published` 内容

## 推荐实施顺序

### 第一步

先打通 AI 新闻这一条内容线。

### 第二步

完成抓取、入库、列表、详情、审核状态。

### 第三步

复制到技术资源栏目。

### 第四步

扩展到活动、社区动态、协作内容等栏目。

## 管理后台建议

后续可增加一个简单管理后台，用于：

- 查看抓取日志
- 审核内容
- 手动重抓来源
- 编辑标题、摘要、标签
- 上线或下线内容

## 不建议的方式

不建议把抓取结果直接写进前台仓库文件，然后自动提交 Git。

原因：

- 历史噪音大
- 并发冲突多
- 回滚不方便
- 不适合长期维护

## 最终结论

最稳妥的方式是：

**独立内容采集项目 + Cloudflare Worker + D1 + Cron Trigger + 前台只负责展示**

这套方式最适合你当前已经部署到 Cloudflare Workers 的项目结构，也便于后续扩展内容管理能力。
