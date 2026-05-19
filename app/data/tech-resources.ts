export type TechResourceItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  provider: string;
  format: string;
  level: "入门" | "进阶" | "实战";
  sourceUrl: string;
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
};

export type TechResourceQuery = {
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
};

export type TechResourceListResponse = {
  items: TechResourceItem[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 30;

export const defaultTechResources: TechResourceItem[] = [
  {
    id: "tech-2025-12-llmops",
    slug: "llmops-practical-handbook",
    title: "LLMOps 实战手册：从实验到生产",
    summary: "覆盖评测、监控、灰度发布与成本治理，适合准备落地企业级 LLM 应用的团队。",
    content:
      "该手册以生产环境为背景，梳理了模型版本管理、推理性能观测和异常回滚流程。对于中小团队而言，可优先落地观测与评测闭环，再逐步引入自动化发布策略。",
    publishedAt: "2025-12-20T10:00:00+08:00",
    provider: "Google Cloud Architecture Center",
    format: "技术指南",
    level: "实战",
    sourceUrl: "https://cloud.google.com/architecture",
    tags: ["LLMOps", "上线实践", "监控"],
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "工程团队在代码与监控大屏前协作",
  },
  {
    id: "tech-2025-11-rag",
    slug: "rag-patterns-playbook",
    title: "RAG 架构模式手册：检索质量与延迟平衡",
    summary: "整理主流 RAG 模式与工程取舍，帮助团队建立稳定的知识问答系统。",
    content:
      "文档重点讲解索引策略、检索重排与上下文压缩，并提供常见故障定位思路。建议结合业务数据质量治理，建立评测集和回归测试流程。",
    publishedAt: "2025-11-15T15:20:00+08:00",
    provider: "Microsoft Learn",
    format: "架构文档",
    level: "进阶",
    sourceUrl: "https://learn.microsoft.com/",
    tags: ["RAG", "检索", "架构"],
    coverImage: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "知识检索与系统架构图示场景",
  },
  {
    id: "tech-2025-10-agent",
    slug: "agent-workflow-building-guide",
    title: "Agent 工作流搭建指南：工具调用到多代理编排",
    summary: "从单代理任务拆解到多代理协同，附带流程设计模板与风险控制建议。",
    content:
      "指南强调任务边界定义、状态可追踪和失败兜底机制。对于业务场景，建议先从单代理闭环验证，再扩展到多代理并行与协作。",
    publishedAt: "2025-10-30T11:40:00+08:00",
    provider: "LangChain Docs",
    format: "开发指南",
    level: "进阶",
    sourceUrl: "https://docs.langchain.com/",
    tags: ["AI Agent", "工作流", "工程化"],
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "开发者进行 Agent 工作流编排",
  },
  {
    id: "tech-2025-09-eval",
    slug: "ai-evaluation-framework-intro",
    title: "AI 应用评测体系入门：从离线到在线",
    summary: "建立可复用评测框架，支持 Prompt、模型和知识库版本迭代。",
    content:
      "内容包括评测指标设计、人工标注流程和线上反馈闭环。建议将评测与发布流程打通，做到每次更新都有明确质量依据。",
    publishedAt: "2025-09-18T09:10:00+08:00",
    provider: "OpenAI Cookbook",
    format: "实践教程",
    level: "入门",
    sourceUrl: "https://cookbook.openai.com/",
    tags: ["评测", "Prompt", "质量保障"],
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "评测指标讨论与文档评审会议",
  },
  {
    id: "tech-2025-08-vector-db",
    slug: "vector-database-selection-guide",
    title: "向量数据库选型与调优指南",
    summary: "对比主流向量库特性、查询性能与成本，提供选型与压测建议。",
    content:
      "资源从数据规模、索引类型和查询场景出发，给出多种落地方案。实践中应结合数据更新频率和业务 SLA 进行方案裁剪。",
    publishedAt: "2025-08-22T14:30:00+08:00",
    provider: "Pinecone Learn",
    format: "选型指南",
    level: "进阶",
    sourceUrl: "https://www.pinecone.io/learn/",
    tags: ["向量数据库", "选型", "性能"],
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "数据库与系统性能优化开发场景",
  },
];

function normalizePage(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return DEFAULT_PAGE;
  }
  return Math.floor(value);
}

function normalizePageSize(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(Math.floor(value), MAX_PAGE_SIZE);
}

function sorted(items: TechResourceItem[]): TechResourceItem[] {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function queryDefaultTechResources(query: TechResourceQuery = {}): TechResourceListResponse {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const tag = query.tag?.trim().toLowerCase();
  const keyword = query.q?.trim().toLowerCase();

  let filtered = sorted(defaultTechResources);

  if (tag) {
    filtered = filtered.filter((item) => item.tags.some((itemTag) => itemTag.toLowerCase() === tag));
  }

  if (keyword) {
    filtered = filtered.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.provider} ${item.tags.join(" ")}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total: filtered.length,
    page,
    pageSize,
  };
}

export function getDefaultTechResourceBySlug(slug: string): TechResourceItem | undefined {
  return defaultTechResources.find((item) => item.slug === slug);
}
