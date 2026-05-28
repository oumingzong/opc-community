import type { PublicListResponse } from "./types";

export const FALLBACK_LIST: PublicListResponse = {
  items: [
    {
      id: -1,
      slug: "fallback-sample",
      title: "服务暂不可用，展示备用内容",
      summary: "当前内容服务临时不可用，已切换到备用数据。",
      source_name: "opc-fallback",
      published_at: new Date().toISOString(),
      source_url: null,
    },
  ],
  page: 1,
  pageSize: 20,
  total: 1,
};
