export type CollaborationItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  organizer: string;
  location: string;
  sourceUrl: string;
  tags: string[];
  contact?: string;
};

export type CollaborationQuery = {
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
};

export type CollaborationListResponse = {
  items: CollaborationItem[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 30;

export const defaultCollaborations: CollaborationItem[] = [
  {
    id: "collab-2026-01-gzai-open-night",
    slug: "guangzhou-ai-open-night-jan",
    title: "广州 AI 开放协作夜：Agent 项目共创专场",
    summary: "面向开发者与产品经理的线下协作活动，围绕 Agent 工作流进行小组共创与 Demo 路演。",
    content:
      "本次活动采用 3 小时实战协作模式，参与者按产品、前端、后端、算法分组，围绕真实业务场景快速完成可演示原型。组织方提供题目库、评审模板和后续孵化对接。",
    publishedAt: "2026-01-14T19:00:00+08:00",
    organizer: "广州 AI 开发者社区 OPC",
    location: "天河区珠江新城·联合办公空间",
    sourceUrl: "https://www.meetup.com/",
    tags: ["共创", "AI Agent", "线下活动"],
    contact: "ops@opc-community.cn",
  },
  {
    id: "collab-2025-12-hackathon",
    slug: "guangzhou-ai-weekend-hackathon",
    title: "广州 AI 周末黑客松：多智能体应用挑战",
    summary: "48 小时团队协作黑客松，聚焦企业流程自动化、知识库问答与多代理编排。",
    content:
      "活动包含赛前技术工作坊、现场导师辅导和路演评审。参赛队伍可获得云资源券与项目展示机会，优秀项目将进入社区孵化清单。",
    publishedAt: "2025-12-08T10:00:00+08:00",
    organizer: "GDG Guangzhou × OPC 社区",
    location: "海珠区琶洲数字创新中心",
    sourceUrl: "https://gdg.community.dev/",
    tags: ["黑客松", "多智能体", "实践"],
    contact: "events@opc-community.cn",
  },
  {
    id: "collab-2025-11-reading-club",
    slug: "llm-engineering-reading-club",
    title: "LLM 工程化读书会：RAG 与评测体系",
    summary: "每月一次的开放读书会，围绕生产级 LLM 系统设计、评测与观测实践进行共学。",
    content:
      "采用主讲 + 圆桌讨论 + 案例拆解形式，鼓励参会者携带实际项目问题参与讨论。活动产出将整理为可复用的工程实践清单。",
    publishedAt: "2025-11-22T14:00:00+08:00",
    organizer: "广州人工智能产业发展促进会（会员协作组）",
    location: "越秀区东风中路·共享会议厅",
    sourceUrl: "https://www.gzaiia.org/",
    tags: ["读书会", "RAG", "工程化"],
    contact: "community@opc-community.cn",
  },
  {
    id: "collab-2025-10-startup-match",
    slug: "ai-startup-collaboration-day",
    title: "AI 创业协作日：技术团队与场景方对接",
    summary: "面向初创团队和行业场景方的对接活动，帮助技术方案快速匹配真实需求。",
    content:
      "现场设置需求发布、能力展示和一对一洽谈三个环节，重点覆盖制造、零售与内容行业。活动结束后提供 30 天线上跟进机制。",
    publishedAt: "2025-10-18T13:30:00+08:00",
    organizer: "广州科技企业孵化器联盟（合作活动）",
    location: "黄埔区科学城·创新路演中心",
    sourceUrl: "https://www.gz.gov.cn/",
    tags: ["创业", "资源对接", "产业协作"],
    contact: "biz@opc-community.cn",
  },
  {
    id: "collab-2025-09-university-link",
    slug: "university-industry-ai-linkup",
    title: "高校 × 企业 AI 联合实践开放日",
    summary: "促进高校实验室与企业技术团队建立长期协作机制，推动产学研课题落地。",
    content:
      "活动聚焦数据治理、模型落地和人才培养三大主题，包含联合课题路演与导师匹配环节，支持后续项目持续跟踪。",
    publishedAt: "2025-09-26T09:30:00+08:00",
    organizer: "广州高校人工智能联合体（协作倡议）",
    location: "大学城·创新实践基地",
    sourceUrl: "https://www.gz.gov.cn/",
    tags: ["产学研", "人才", "联合实践"],
    contact: "edu@opc-community.cn",
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

function sorted(items: CollaborationItem[]): CollaborationItem[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function queryDefaultCollaborations(query: CollaborationQuery = {}): CollaborationListResponse {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const tag = query.tag?.trim().toLowerCase();
  const keyword = query.q?.trim().toLowerCase();

  let filtered = sorted(defaultCollaborations);

  if (tag) {
    filtered = filtered.filter((item) => item.tags.some((itemTag) => itemTag.toLowerCase() === tag));
  }

  if (keyword) {
    filtered = filtered.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.organizer} ${item.location} ${item.tags.join(" ")}`.toLowerCase();
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

export function getDefaultCollaborationBySlug(slug: string): CollaborationItem | undefined {
  return defaultCollaborations.find((item) => item.slug === slug);
}
