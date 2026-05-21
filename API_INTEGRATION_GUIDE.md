# AI 工具库 API 文档

## 概述

AI 工具库是一个完整的 AI 工具管理系统，支持搜索、分类筛选、价格筛选等功能。该系统设计为易于扩展，可无缝接入后端数据源。

## 架构设计

### 分层结构

```
┌─────────────────────────────────────┐
│   Frontend (React Component)          │
│   /app/ai-tools/page.tsx             │
└─────────────┬───────────────────────┘
              │ HTTP Requests
┌─────────────▼───────────────────────┐
│   API Route Handler                   │
│   /api/ai-tools/route.ts             │
└─────────────┬───────────────────────┘
              │ Service Layer
┌─────────────▼───────────────────────┐
│   Service Layer                       │
│   /lib/ai-tools-service.ts           │
└─────────────┬───────────────────────┘
              │ Data Access
┌─────────────▼───────────────────────┐
│   Data Layer                          │
│   /app/data/ai-tools.ts              │
│   (Default Data / External API)      │
└─────────────────────────────────────┘
```

## API 端点

### 获取 AI 工具列表

**端点:** `GET /api/ai-tools`

**查询参数:**

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `page` | number | 否 | 分页页码，默认 1 |
| `pageSize` | number | 否 | 每页数量，默认 12，最大 50 |
| `category` | string | 否 | 工具分类（文本生成、代码助手、图像生成、数据分析、语音处理、本地部署、其他） |
| `pricing` | string | 否 | 价格类型（免费、付费、免费+付费） |
| `q` | string | 否 | 搜索关键词 |

**响应示例:**

```json
{
  "items": [
    {
      "id": "ai-tool-001",
      "slug": "chatgpt",
      "title": "ChatGPT",
      "description": "基于 GPT 模型的智能对话助手...",
      "detailedDescription": "ChatGPT 是 OpenAI 推出的...",
      "category": "文本生成",
      "url": "https://chat.openai.com",
      "pricing": "免费+付费",
      "rating": 4.8,
      "usageCount": 10000000,
      "tags": ["GPT", "文本生成", "对话AI"],
      "features": ["自然语言理解与生成", "代码编写与调试", ...],
      "publishedAt": "2024-01-15T10:00:00+08:00"
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 12
}
```

**示例请求:**

```bash
# 获取所有工具
curl "http://localhost:3000/api/ai-tools"

# 获取代码助手分类的工具
curl "http://localhost:3000/api/ai-tools?category=代码助手"

# 搜索 ChatGPT
curl "http://localhost:3000/api/ai-tools?q=ChatGPT"

# 获取免费工具，分页第2页
curl "http://localhost:3000/api/ai-tools?pricing=免费&page=2&pageSize=10"

# 组合查询：获取免费的代码助手，按关键词搜索
curl "http://localhost:3000/api/ai-tools?category=代码助手&pricing=免费&q=copilot"
```

## 数据模型

### AITool 类型

```typescript
export type AITool = {
  id: string;                    // 唯一标识符
  slug: string;                  // URL 友好的标识符
  title: string;                 // 工具名称
  description: string;           // 简短描述
  detailedDescription: string;   // 详细描述
  category: string;              // 分类
  url: string;                   // 工具链接
  pricing: string;               // 价格类型
  rating: number;                // 评分 (0-5)
  usageCount: number;            // 使用人数
  tags: string[];                // 标签
  logo?: string;                 // Logo 链接
  features: string[];            // 功能列表
  publishedAt: string;           // 发布时间 (ISO 8601)
};
```

### AIToolListResponse 类型

```typescript
export type AIToolListResponse = {
  items: AITool[];      // 工具列表
  total: number;        // 总数
  page: number;         // 当前页码
  pageSize: number;     // 每页数量
};
```

## 后端集成指南

### 环境变量配置

在 `.env.local` 中添加以下配置以接入自定义后端：

```env
# AI 工具 API 配置
NEXT_PUBLIC_AI_TOOLS_API_URL=https://your-backend.com/api/ai-tools
AI_TOOLS_TIMEOUT_MS=5000
AI_TOOLS_REVALIDATE=1800
AI_TOOLS_FALLBACK_ENABLED=true
```

### 后端实现要求

后端 API 需要实现以下接口：

**请求格式:**
```
GET /api/ai-tools?page=1&pageSize=12&category=文本生成&pricing=免费&q=ChatGPT
```

**响应格式:**
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "pageSize": 12
}
```

### 前端服务层使用

前端内置了服务层 `lib/ai-tools-service.ts`，可通过以下方式使用：

```typescript
import {
  getAIToolsList,
  searchAIToolsByQuery,
  getToolsByCategory,
} from "@/lib/ai-tools-service";

// 获取 AI 工具列表
const result = await getAIToolsList({
  page: 1,
  pageSize: 12,
  category: "代码助手",
  pricing: "免费",
});
console.log(result.items);      // 工具数组
console.log(result.dataSource); // "api" | "default" | "fallback"

// 搜索工具
const searchResults = await searchAIToolsByQuery("ChatGPT");

// 按分类获取
const codeTools = await getToolsByCategory("代码助手");
```

## 功能特性

### ✅ 已实现功能

- [x] 搜索功能（支持标题、描述、标签搜索）
- [x] 分类筛选（7个分类）
- [x] 价格筛选（3种价格类型）
- [x] 分页显示
- [x] 工具评分展示
- [x] 响应式设计
- [x] 加载状态显示
- [x] 错误处理
- [x] API 接口
- [x] 服务层封装

### 🔄 后端集成流程

1. **配置后端 URL**
   - 在 `.env.local` 中设置 `NEXT_PUBLIC_AI_TOOLS_API_URL`

2. **数据格式对齐**
   - 确保后端返回的数据格式与 `AIToolListResponse` 一致

3. **环境测试**
   - 前端会自动尝试从后端加载数据
   - 如果后端不可用，自动降级至本地默认数据

4. **性能优化**
   - 前端已实现防抖（300ms）
   - API 响应缓存（revalidate: 1800秒）
   - 支持自定义超时时间

## 缓存策略

前端采用了多层缓存策略：

1. **API 缓存** - 通过 revalidate 参数控制
   ```env
   AI_TOOLS_REVALIDATE=1800  # 30分钟缓存
   ```

2. **客户端防抖** - 避免频繁请求
   ```typescript
   const timer = setTimeout(() => {
     loadTools();
   }, 300);  // 300ms 防抖延迟
   ```

3. **降级策略** - 后端不可用时使用本地数据
   ```env
   AI_TOOLS_FALLBACK_ENABLED=true
   ```

## 监控和调试

### 浏览器开发者工具

1. **Network 标签页**
   - 查看 `/api/ai-tools` 请求和响应
   - 检查查询参数传递

2. **Console 标签页**
   - 查看加载错误日志
   - 检查数据源 (default/api/fallback)

### 获取数据源信息

API 响应中的 `dataSource` 字段表示数据来源：

```typescript
"dataSource": "api"       // 来自后端 API
"dataSource": "default"   // 使用本地默认数据
"dataSource": "fallback"  // 后端失败，降级到本地
```

## 扩展指南

### 添加新的工具

在 `app/data/ai-tools.ts` 中的 `defaultAITools` 数组添加新工具：

```typescript
{
  id: "ai-tool-011",
  slug: "new-tool",
  title: "New AI Tool",
  description: "Description...",
  category: "文本生成",
  url: "https://example.com",
  pricing: "免费",
  rating: 4.5,
  usageCount: 500000,
  tags: ["新", "AI"],
  features: ["feature1", "feature2"],
  publishedAt: "2024-05-21T10:00:00+08:00",
}
```

### 添加新的分类

1. 更新 `AITool` 类型定义：
   ```typescript
   category: "文本生成" | "代码助手" | ... | "新分类";
   ```

2. 更新页面分类列表：
   ```typescript
   const CATEGORIES = [
     "文本生成",
     ...
     "新分类",
   ];
   ```

## 故障排除

### 问题：API 响应为空
**解决方案:**
- 检查 `NEXT_PUBLIC_AI_TOOLS_API_URL` 是否正确配置
- 确认后端服务在运行
- 检查浏览器网络标签页的请求状态

### 问题：加载器一直显示
**解决方案:**
- 检查浏览器控制台是否有错误
- 确认 API 响应时间不超过 `AI_TOOLS_TIMEOUT_MS`
- 检查网络连接

### 问题：数据不更新
**解决方案:**
- 清除浏览器缓存
- 调整 `AI_TOOLS_REVALIDATE` 值
- 检查搜索/筛选条件是否正确

## 相关文件

- **页面组件**: `app/ai-tools/page.tsx`
- **API 路由**: `app/api/ai-tools/route.ts`
- **服务层**: `lib/ai-tools-service.ts`
- **数据定义**: `app/data/ai-tools.ts`

## 许可证

MIT
