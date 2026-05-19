export type AiNewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  author?: string;
  coverImage?: string;
  coverImageAlt?: string;
};

export type AiNewsQuery = {
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
};

export type AiNewsListResponse = {
  items: AiNewsItem[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 9;
const MAX_PAGE_SIZE = 30;

export const defaultAiNews: AiNewsItem[] = [
  {
    id: "ai-2024-07-llama31",
    slug: "llama-3-1-open-model-update",
    title: "Meta 发布 Llama 3.1 系列，开源模型能力再进一档",
    summary: "Llama 3.1 覆盖 8B、70B 到 405B 参数规模，进一步增强了开源社区在高性能模型上的可用选择。",
    content:
      "Meta 官方公布 Llama 3.1 后，企业与开发者在私有化部署、定制微调和推理成本控制上有了更多可落地路径。对于社区实践而言，重点是评估模型在中文任务、多轮对话稳定性以及工具调用链路中的表现。",
    publishedAt: "2024-07-23T10:00:00+08:00",
    sourceName: "Meta AI Blog",
    sourceUrl: "https://ai.meta.com/blog/meta-llama-3-1/",
    tags: ["开源模型", "Llama", "大模型"],
    author: "Meta AI Team",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "AI 机器人与神经网络视觉图",
  },
  {
    id: "ai-2024-06-claude35",
    slug: "claude-3-5-sonnet-release",
    title: "Anthropic 发布 Claude 3.5 Sonnet，编码与推理能力提升",
    summary: "Claude 3.5 Sonnet 在代码理解和复杂指令执行上有明显提升，成为企业应用的热门基座模型之一。",
    content:
      "从工程视角看，Claude 3.5 Sonnet 对工作流型任务更友好，适合文档处理、代码重构和客服辅助等场景。接入时可重点关注提示词模板治理、上下文窗口成本和输出可控性。",
    publishedAt: "2024-06-21T10:30:00+08:00",
    sourceName: "Anthropic News",
    sourceUrl: "https://www.anthropic.com/news/claude-3-5-sonnet",
    tags: ["Claude", "模型发布", "企业应用"],
    author: "Anthropic",
    coverImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "程序员在电脑前进行代码开发",
  },
  {
    id: "ai-2024-05-gemini15-pro",
    slug: "gemini-1-5-pro-long-context",
    title: "Google 推进 Gemini 1.5 Pro 长上下文能力，复杂任务处理更稳定",
    summary: "Gemini 1.5 Pro 强调长上下文处理与多模态输入，适合文档分析、代码仓库理解等任务。",
    content:
      "对开发团队而言，长上下文模型降低了分块处理的复杂度，但也带来 prompt 预算管理与检索策略重构。实践上建议结合 RAG 和缓存机制，平衡延迟与成本。",
    publishedAt: "2024-05-14T11:00:00+08:00",
    sourceName: "Google Developers Blog",
    sourceUrl: "https://developers.googleblog.com/en/new-features-for-the-gemini-api-and-google-ai-studio/",
    tags: ["Gemini", "多模态", "长上下文"],
    author: "Google AI",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "数据中心与服务器机柜场景",
  },
  {
    id: "ai-2024-03-blackwell",
    slug: "nvidia-blackwell-platform",
    title: "NVIDIA 发布 Blackwell 架构，AI 训练与推理平台升级",
    summary: "Blackwell 平台面向大规模模型训练与推理优化，强调性能与能效改进。",
    content:
      "基础设施升级往往直接影响企业模型迭代速度。Blackwell 发布后，围绕显存利用率、并行策略以及混合精度训练的工程实践会持续演进，社区可重点关注推理吞吐与成本变化。",
    publishedAt: "2024-03-19T09:30:00+08:00",
    sourceName: "NVIDIA Newsroom",
    sourceUrl: "https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing",
    tags: ["算力", "NVIDIA", "基础设施"],
    author: "NVIDIA",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "高性能芯片与电路板特写",
  },
  {
    id: "ai-2024-02-openai-sora",
    slug: "openai-sora-introduction",
    title: "OpenAI 发布 Sora，文生视频能力引发行业关注",
    summary: "Sora 展示了高质量文本生成视频能力，推动多模态内容生产工具快速迭代。",
    content:
      "从产品角度看，视频生成技术会首先在营销创意、教育内容制作和快速原型验证中落地。团队在引入此类能力时，需要同步建立版权审查和内容安全策略。",
    publishedAt: "2024-02-16T14:00:00+08:00",
    sourceName: "OpenAI",
    sourceUrl: "https://openai.com/index/sora/",
    tags: ["文生视频", "多模态", "内容生成"],
    author: "OpenAI",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "视频制作与剪辑工作台",
  },
  {
    id: "ai-2024-12-deepseek-r1",
    slug: "deepseek-r1-reasoning-model",
    title: "DeepSeek 发布 R1 推理模型，强化链式推理与开源生态讨论",
    summary: "R1 在推理任务上的表现引发广泛关注，推动高性价比推理模型方案继续升温。",
    content:
      "对开发者社区而言，推理模型的实战价值在于复杂问答、代码修复和业务流程决策辅助。建议评估推理质量、一致性与延迟，并结合具体业务指标做灰度上线。",
    publishedAt: "2025-01-20T10:00:00+08:00",
    sourceName: "DeepSeek",
    sourceUrl: "https://api-docs.deepseek.com/news/news250120",
    tags: ["推理模型", "开源生态", "DeepSeek"],
    author: "DeepSeek Team",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "抽象机器人头部与科技背景",
  },
  {
    id: "ai-2024-05-openai-model-spec",
    slug: "openai-model-spec-update",
    title: "OpenAI 更新 Model Spec，强调行为边界与安全治理",
    summary: "模型行为规范进一步公开化，有助于企业在落地时建立更可审计的 AI 使用标准。",
    content:
      "管理端接入内容更新时，可把模型规范相关资讯与内部合规策略联动，形成可追踪的知识库条目。这样在业务快速迭代时，团队仍能保持一致的风控基线。",
    publishedAt: "2024-05-08T09:20:00+08:00",
    sourceName: "OpenAI",
    sourceUrl: "https://openai.com/index/introducing-the-model-spec/",
    tags: ["模型治理", "安全", "合规"],
    author: "OpenAI",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "网络安全与数据保护概念图",
  },
  {
    id: "ai-2024-05-gpt4o",
    slug: "openai-gpt-4o-launch",
    title: "GPT-4o 发布，多模态实时交互体验进一步提升",
    summary: "GPT-4o 在语音、视觉和文本多模态统一方面带来更自然的交互能力。",
    content:
      "对于产品团队，实时交互能力意味着可以重构客服、培训和智能助手流程。接入策略上建议优先做小范围 A/B 实验，验证真实业务中的响应延迟和用户满意度。",
    publishedAt: "2024-05-14T08:30:00+08:00",
    sourceName: "OpenAI",
    sourceUrl: "https://openai.com/index/hello-gpt-4o/",
    tags: ["多模态", "实时交互", "GPT-4o"],
    author: "OpenAI",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "AI 助手与人机交互概念图",
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

function sorted(items: AiNewsItem[]): AiNewsItem[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function queryDefaultAiNews(query: AiNewsQuery = {}): AiNewsListResponse {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const tag = query.tag?.trim().toLowerCase();
  const keyword = query.q?.trim().toLowerCase();

  let filtered = sorted(defaultAiNews);

  if (tag) {
    filtered = filtered.filter((item) => item.tags.some((itemTag) => itemTag.toLowerCase() === tag));
  }

  if (keyword) {
    filtered = filtered.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.sourceName} ${item.tags.join(" ")}`.toLowerCase();
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

export function getDefaultAiNewsBySlug(slug: string): AiNewsItem | undefined {
  return defaultAiNews.find((item) => item.slug === slug);
}
