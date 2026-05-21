export type AITool = {
  id: string;
  slug: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: "文本生成" | "代码助手" | "图像生成" | "数据分析" | "语音处理" | "本地部署" | "其他";
  url: string;
  pricing: "免费" | "付费" | "免费+付费";
  rating: number;
  usageCount: number;
  tags: string[];
  logo?: string;
  features: string[];
  publishedAt: string;
};

export type AIToolQuery = {
  page?: number;
  pageSize?: number;
  category?: string;
  pricing?: string;
  q?: string;
};

export type AIToolListResponse = {
  items: AITool[];
  total: number;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

export const defaultAITools: AITool[] = [
  {
    id: "ai-tool-001",
    slug: "chatgpt",
    title: "ChatGPT",
    description: "基于 GPT 模型的智能对话助手，可进行写作、编程、分析等多种任务。",
    detailedDescription:
      "ChatGPT 是 OpenAI 推出的大规模语言模型，能够理解自然语言并生成高质量的文本。支持多种应用场景，包括内容创作、代码生成、问题解答等。",
    category: "文本生成",
    url: "https://chat.openai.com",
    pricing: "免费+付费",
    rating: 4.8,
    usageCount: 10000000,
    tags: ["GPT", "文本生成", "对话AI"],
    features: [
      "自然语言理解与生成",
      "代码编写与调试",
      "文章创作与修改",
      "问题分析与解答",
      "支持插件扩展",
    ],
    publishedAt: "2024-01-15T10:00:00+08:00",
  },
  {
    id: "ai-tool-002",
    slug: "claude",
    title: "Claude",
    description: "Anthropic 推出的高效 AI 助手，以安全性和准确性著称。",
    detailedDescription:
      "Claude 是一个强大的 AI 助手，具有出色的逻辑推理和代码能力。支持超长上下文，适合处理大型文档和复杂任务。",
    category: "文本生成",
    url: "https://claude.ai",
    pricing: "免费+付费",
    rating: 4.7,
    usageCount: 8000000,
    tags: ["Claude", "文本生成", "逻辑推理"],
    features: [
      "100K token 上下文窗口",
      "代码生成与分析",
      "文档理解与总结",
      "数据分析能力",
      "API 接口支持",
    ],
    publishedAt: "2024-02-20T10:00:00+08:00",
  },
  {
    id: "ai-tool-003",
    slug: "github-copilot",
    title: "GitHub Copilot",
    description: "集成在 IDE 中的 AI 编程助手，能实时生成代码建议。",
    detailedDescription:
      "GitHub Copilot 由 GitHub、OpenAI 和 Microsoft 联合打造，是一个强大的 AI 代码生成工具。支持多种编程语言和 IDE。",
    category: "代码助手",
    url: "https://github.com/features/copilot",
    pricing: "付费",
    rating: 4.6,
    usageCount: 5000000,
    tags: ["代码生成", "IDE集成", "编程助手"],
    features: [
      "实时代码建议",
      "多语言支持",
      "测试生成",
      "代码优化",
      "IDE 深度集成",
    ],
    publishedAt: "2024-03-10T10:00:00+08:00",
  },
  {
    id: "ai-tool-004",
    slug: "midjourney",
    title: "Midjourney",
    description: "高质量 AI 图像生成工具，通过文字描述创建精美图像。",
    detailedDescription:
      "Midjourney 是一个基于 Discord 的 AI 图像生成平台。用户可以通过简单的文字描述获得高质量的图像，支持多种艺术风格。",
    category: "图像生成",
    url: "https://www.midjourney.com",
    pricing: "付费",
    rating: 4.7,
    usageCount: 3000000,
    tags: ["图像生成", "AIGC", "创意工具"],
    features: [
      "文本到图像生成",
      "多种艺术风格",
      "图像编辑与优化",
      "社区分享功能",
      "高质量输出",
    ],
    publishedAt: "2024-01-25T10:00:00+08:00",
  },
  {
    id: "ai-tool-005",
    slug: "stable-diffusion",
    title: "Stable Diffusion",
    description: "开源图像生成模型，可本地部署，具有高度自由度。",
    detailedDescription:
      "Stable Diffusion 是一个开源的图像生成模型，支持本地部署和自定义训练。相比商业工具，提供更多定制化选项。",
    category: "图像生成",
    url: "https://stablediffusionweb.com",
    pricing: "免费",
    rating: 4.5,
    usageCount: 2000000,
    tags: ["开源", "图像生成", "本地部署"],
    features: [
      "开源可扩展",
      "本地部署支持",
      "模型微调",
      "社区插件丰富",
      "无限制使用",
    ],
    publishedAt: "2024-02-05T10:00:00+08:00",
  },
  {
    id: "ai-tool-006",
    slug: "jupyter-ai",
    title: "Jupyter AI",
    description: "Jupyter 笔记本中的 AI 编程助手，增强数据分析能力。",
    detailedDescription:
      "Jupyter AI 是一个扩展，在 Jupyter 笔记本中集成 AI 助手，支持代码生成、数据分析和可视化建议。",
    category: "数据分析",
    url: "https://jupyter-ai.readthedocs.io",
    pricing: "免费",
    rating: 4.4,
    usageCount: 1000000,
    tags: ["数据分析", "Jupyter", "编程助手"],
    features: [
      "笔记本集成",
      "数据分析辅助",
      "代码补全",
      "可视化建议",
      "开源免费",
    ],
    publishedAt: "2024-03-01T10:00:00+08:00",
  },
  {
    id: "ai-tool-007",
    slug: "whisper",
    title: "Whisper",
    description: "OpenAI 的语音转文本模型，支持多语言和方言。",
    detailedDescription:
      "Whisper 是 OpenAI 开源的语音识别模型，能够准确识别多种语言和方言。可本地部署，支持离线使用。",
    category: "语音处理",
    url: "https://openai.com/research/whisper",
    pricing: "免费",
    rating: 4.6,
    usageCount: 800000,
    tags: ["语音识别", "开源", "多语言"],
    features: [
      "多语言支持",
      "高准确率",
      "方言识别",
      "开源模型",
      "本地部署",
    ],
    publishedAt: "2024-02-28T10:00:00+08:00",
  },
  {
    id: "ai-tool-008",
    slug: "gemini",
    title: "Google Gemini",
    description: "Google 的多模态 AI 模型，支持文本、图像、视频分析。",
    detailedDescription:
      "Gemini 是 Google 推出的先进多模态 AI 模型，支持文本、图像、音频和视频的理解与生成。具有强大的推理能力。",
    category: "文本生成",
    url: "https://gemini.google.com",
    pricing: "免费+付费",
    rating: 4.5,
    usageCount: 6000000,
    tags: ["多模态", "文本", "图像"],
    features: [
      "多模态理解",
      "代码生成",
      "高级推理",
      "图像分析",
      "长上下文支持",
    ],
    publishedAt: "2024-03-05T10:00:00+08:00",
  },
  {
    id: "ai-tool-009",
    slug: "cursor",
    title: "Cursor",
    description: "AI 驱动的代码编辑器，集成多个 AI 模型。",
    detailedDescription:
      "Cursor 是一个基于 VS Code 的 AI 代码编辑器，集成了 ChatGPT、Claude 等多个 AI 模型，提供强大的编程辅助。",
    category: "代码助手",
    url: "https://cursor.com",
    pricing: "免费+付费",
    rating: 4.7,
    usageCount: 2500000,
    tags: ["代码编辑", "AI助手", "编程工具"],
    features: [
      "多 AI 模型集成",
      "代码自动完成",
      "代码重构",
      "错误修复",
      "VS Code 兼容",
    ],
    publishedAt: "2024-02-15T10:00:00+08:00",
  },
  {
    id: "ai-tool-010",
    slug: "perplexity",
    title: "Perplexity AI",
    description: "支持实时网络搜索的 AI 问答引擎，提供准确的信息。",
    detailedDescription:
      "Perplexity AI 是一个融合搜索和 AI 的问答平台，能实时检索网络信息并生成准确的答案。支持多语言查询。",
    category: "文本生成",
    url: "https://www.perplexity.ai",
    pricing: "免费+付费",
    rating: 4.4,
    usageCount: 2000000,
    tags: ["问答", "搜索", "信息检索"],
    features: [
      "实时网络搜索",
      "源引用",
      "多语言支持",
      "对话历史保存",
      "高准确率",
    ],
    publishedAt: "2024-03-08T10:00:00+08:00",
  },
];

export function getAIToolsByCategory(category: string): AITool[] {
  return defaultAITools.filter((tool) => tool.category === category);
}

export function searchAITools(query: string): AITool[] {
  const q = query.toLowerCase();
  return defaultAITools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function getAIToolsPage(params: AIToolQuery): AIToolListResponse {
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.min(params.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  let items = [...defaultAITools];

  // 按分类过滤
  if (params.category) {
    items = items.filter((item) => item.category === params.category);
  }

  // 按价格过滤
  if (params.pricing) {
    items = items.filter((item) => item.pricing === params.pricing);
  }

  // 搜索
  if (params.q) {
    items = searchAITools(params.q);
  }

  // 按评分排序
  items.sort((a, b) => b.rating - a.rating);

  // 分页
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
    pageSize,
  };
}
