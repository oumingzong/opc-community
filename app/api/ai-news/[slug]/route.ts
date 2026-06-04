import { getAiNewsDetail } from "@/lib/ai-news-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await getAiNewsDetail(slug);

  if (!result) {
    return Response.json({ message: "AI news item not found" }, { status: 404 });
  }

  return Response.json(result.item);
}
