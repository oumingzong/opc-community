import {
  getAIToolsPage,
  searchAITools,
  getAIToolsByCategory,
  type AITool,
  type AIToolListResponse,
  type AIToolQuery,
} from "@/app/data/ai-tools";

export type AIToolDataSource = "default" | "api" | "fallback";

export type AIToolListResult = AIToolListResponse & {
  dataSource: AIToolDataSource;
};

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_REVALIDATE_SECONDS = 1800;
const FALLBACK_ENABLED = process.env.AI_TOOLS_FALLBACK_ENABLED !== "false";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getConfig() {
  return {
    apiUrl: process.env.NEXT_PUBLIC_AI_TOOLS_API_URL?.trim() ?? "",
    timeoutMs: parsePositiveInt(process.env.AI_TOOLS_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    revalidateSeconds: parsePositiveInt(process.env.AI_TOOLS_REVALIDATE, DEFAULT_REVALIDATE_SECONDS),
  };
}

function withQuery(url: string, query: AIToolQuery): string {
  const target = new URL(url);
  if (query.page) {
    target.searchParams.set("page", String(query.page));
  }
  if (query.pageSize) {
    target.searchParams.set("pageSize", String(query.pageSize));
  }
  if (query.category) {
    target.searchParams.set("category", query.category);
  }
  if (query.pricing) {
    target.searchParams.set("pricing", query.pricing);
  }
  if (query.q) {
    target.searchParams.set("q", query.q);
  }
  return target.toString();
}

function isAIToolListResponse(value: unknown): value is AIToolListResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AIToolListResponse;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.total === "number" &&
    typeof candidate.page === "number" &&
    typeof candidate.pageSize === "number"
  );
}

function isAITool(value: unknown): value is AITool {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AITool;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.url === "string" &&
    typeof candidate.pricing === "string" &&
    typeof candidate.rating === "number" &&
    typeof candidate.usageCount === "number" &&
    Array.isArray(candidate.tags) &&
    Array.isArray(candidate.features)
  );
}

async function fetchFromApi(
  query: AIToolQuery,
  apiUrl: string,
  timeoutMs: number,
  revalidateSeconds: number
): Promise<AIToolListResult | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(withQuery(apiUrl, query), {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!isAIToolListResponse(data)) {
      return null;
    }

    return { ...data, dataSource: "api" };
  } catch (_error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function getAIToolsListWithFallback(query: AIToolQuery): Promise<AIToolListResult> {
  const { apiUrl, timeoutMs, revalidateSeconds } = getConfig();

  // Try API if configured
  if (apiUrl) {
    const result = await fetchFromApi(query, apiUrl, timeoutMs, revalidateSeconds);
    if (result) {
      return result;
    }
  }

  // Fallback to default data
  if (FALLBACK_ENABLED) {
    const data = getAIToolsPage(query);
    return { ...data, dataSource: "default" };
  }

  // No data available
  throw new Error("AI Tools data source unavailable");
}

/**
 * 获取 AI 工具列表
 * 支持分页、搜索、按分类和价格筛选
 *
 * @param query - 查询参数 (page, pageSize, category, pricing, q)
 * @returns AI 工具列表响应
 *
 * 示例:
 * ```
 * const tools = await getAIToolsList({ page: 1, pageSize: 12, category: "文本生成" });
 * ```
 */
export async function getAIToolsList(query: AIToolQuery = {}): Promise<AIToolListResult> {
  return getAIToolsListWithFallback(query);
}

/**
 * 搜索 AI 工具
 *
 * @param searchQuery - 搜索关键词
 * @returns 匹配的工具列表
 *
 * 示例:
 * ```
 * const results = await searchAIToolsByQuery("ChatGPT");
 * ```
 */
export async function searchAIToolsByQuery(searchQuery: string): Promise<AITool[]> {
  return searchAITools(searchQuery);
}

/**
 * 按分类获取 AI 工具
 *
 * @param category - 工具分类
 * @returns 该分类的所有工具
 *
 * 示例:
 * ```
 * const codeTools = await getAIToolsByCategory("代码助手");
 * ```
 */
export async function getToolsByCategory(category: string): Promise<AITool[]> {
  return getAIToolsByCategory(category);
}
