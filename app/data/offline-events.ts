export type OfflineEventItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  startAt: string;
  endAt?: string;
  organizer: string;
  venue: string;
  sourceUrl: string;
  tags: string[];
  capacity?: number;
  coverImage?: string;
  coverImageAlt?: string;
};

export type OfflineEventQuery = {
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
};

export type OfflineEventListResponse = {
  items: OfflineEventItem[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 30;

export const defaultOfflineEvents: OfflineEventItem[] = [
  {
    id: "event-2026-03-agent-salon",
    slug: "guangzhou-agent-engineering-salon",
    title: "广州 AI Agent 工程化线下沙龙",
    summary: "围绕 Agent 架构设计、可观测性与稳定性治理的实战分享与案例讨论。",
    content:
      "本期沙龙将覆盖 Agent 编排、工具调用、安全边界和灰度发布策略。活动包含主题演讲、圆桌问答与小组复盘，帮助团队把原型能力推进到生产可用。",
    startAt: "2026-03-22T14:00:00+08:00",
    endAt: "2026-03-22T17:30:00+08:00",
    organizer: "OPC 社区 × 广州开发者联盟",
    venue: "天河区·珠江新城创新空间",
    sourceUrl: "https://www.meetup.com/",
    tags: ["AI Agent", "工程化", "线下沙龙"],
    capacity: 120,
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "技术沙龙现场与演讲屏幕",
  },
  {
    id: "event-2026-02-rag-practice",
    slug: "rag-production-practice-salon",
    title: "RAG 生产落地沙龙：从检索到评测",
    summary: "聚焦知识库检索增强生成在企业场景中的落地难点与优化路径。",
    content:
      "分享内容包括检索链路设计、向量索引策略、重排方案和评测体系搭建。现场将给出可复用的评测模板与性能压测思路。",
    startAt: "2026-02-16T19:00:00+08:00",
    endAt: "2026-02-16T21:30:00+08:00",
    organizer: "OPC 社区技术委员会",
    venue: "海珠区·琶洲数字产业园",
    sourceUrl: "https://www.gz.gov.cn/",
    tags: ["RAG", "评测", "知识库"],
    capacity: 90,
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "团队围绕知识库架构展开讨论",
  },
  {
    id: "event-2026-01-multimodal-ui",
    slug: "multimodal-product-design-salon",
    title: "多模态产品设计沙龙：语音、视觉与交互融合",
    summary: "探讨多模态 AI 在产品体验中的设计方法与工程挑战。",
    content:
      "沙龙将从用户旅程出发，拆解语音与视觉能力在客服、教育和内容生产中的融合方式，并讨论端云协同与实时延迟优化策略。",
    startAt: "2026-01-12T14:30:00+08:00",
    endAt: "2026-01-12T17:00:00+08:00",
    organizer: "广州 AI 产品经理社群（联合活动）",
    venue: "越秀区·中山一路共享会议中心",
    sourceUrl: "https://www.eventbrite.com/",
    tags: ["多模态", "产品设计", "交互体验"],
    capacity: 100,
    coverImage: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "多模态交互与产品设计工作坊",
  },
  {
    id: "event-2025-12-model-governance",
    slug: "model-governance-and-compliance-salon",
    title: "模型治理与合规沙龙：企业落地风险控制",
    summary: "分享模型治理、数据来源审查与合规落地的实操经验。",
    content:
      "本场活动重点介绍模型审计、内容安全策略和风险分级流程，帮助团队建立可追踪、可复盘的治理机制。",
    startAt: "2025-12-20T13:30:00+08:00",
    endAt: "2025-12-20T16:30:00+08:00",
    organizer: "广州人工智能产业促进组织（协作活动）",
    venue: "黄埔区·科学城路演厅",
    sourceUrl: "https://www.gz.gov.cn/",
    tags: ["合规", "治理", "风险控制"],
    capacity: 80,
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "合规治理与网络安全主题画面",
  },
  {
    id: "event-2025-11-open-source-night",
    slug: "open-source-ai-night",
    title: "开源 AI 夜谈：模型、工具链与社区协作",
    summary: "围绕开源模型生态、工具链选择和协作模式展开分享与讨论。",
    content:
      "活动设置 lightning talk 环节，邀请不同团队分享真实项目经验。参与者可在现场进行资源互换与联合开发意向对接。",
    startAt: "2025-11-08T19:30:00+08:00",
    endAt: "2025-11-08T22:00:00+08:00",
    organizer: "OPC 社区开源小组",
    venue: "番禺区·大学城创客空间",
    sourceUrl: "https://github.com/",
    tags: ["开源", "社区协作", "工具链"],
    capacity: 70,
    coverImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "开源社区开发者线下交流",
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

function sorted(items: OfflineEventItem[]): OfflineEventItem[] {
  return [...items].sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
}

export function queryDefaultOfflineEvents(query: OfflineEventQuery = {}): OfflineEventListResponse {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const tag = query.tag?.trim().toLowerCase();
  const keyword = query.q?.trim().toLowerCase();

  let filtered = sorted(defaultOfflineEvents);

  if (tag) {
    filtered = filtered.filter((item) => item.tags.some((itemTag) => itemTag.toLowerCase() === tag));
  }

  if (keyword) {
    filtered = filtered.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.organizer} ${item.venue} ${item.tags.join(" ")}`.toLowerCase();
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

export function getDefaultOfflineEventBySlug(slug: string): OfflineEventItem | undefined {
  return defaultOfflineEvents.find((item) => item.slug === slug);
}
