import { type NextRequest } from "next/server";

import { getAIToolsPage } from "@/app/data/ai-tools";

export const revalidate = 1800;

function parsePositiveInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parsePositiveInt(searchParams.get("page"));
  const pageSize = parsePositiveInt(searchParams.get("pageSize"));
  const category = searchParams.get("category") ?? undefined;
  const pricing = searchParams.get("pricing") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const data = getAIToolsPage({ page, pageSize, category, pricing, q });

  return Response.json(data);
}
