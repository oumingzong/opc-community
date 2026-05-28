import { type NextRequest } from "next/server";

import { queryDefaultAiNews } from "@/app/data/ai-news";

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("pageSize"), 20);
  const q = searchParams.get("q") ?? undefined;

  const data = queryDefaultAiNews({ page, pageSize, q });

  return Response.json({
    items: data.items.map((item) => ({
      id: Number.parseInt(item.id.replace(/\D/g, ""), 10) || 0,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      source_name: item.sourceName,
      published_at: item.publishedAt,
      source_url: item.sourceUrl,
    })),
    page: data.page,
    pageSize: data.pageSize,
    total: data.total,
  });
}
