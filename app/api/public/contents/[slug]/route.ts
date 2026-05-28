import { getDefaultAiNewsBySlug } from "@/app/data/ai-news";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Context) {
  const { slug } = await params;
  const item = getDefaultAiNewsBySlug(slug);

  if (!item) {
    return Response.json({ message: "Not Found" }, { status: 404 });
  }

  return Response.json({
    item: {
      id: Number.parseInt(item.id.replace(/\D/g, ""), 10) || 0,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      source_name: item.sourceName,
      published_at: item.publishedAt,
      source_url: item.sourceUrl,
    },
  });
}
