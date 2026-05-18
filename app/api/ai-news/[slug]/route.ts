import { getDefaultAiNewsBySlug } from "@/app/data/ai-news";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const item = getDefaultAiNewsBySlug(slug);

  if (!item) {
    return Response.json({ message: "AI news item not found" }, { status: 404 });
  }

  return Response.json(item);
}
