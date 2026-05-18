import { getDefaultTechResourceBySlug } from "@/app/data/tech-resources";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const item = getDefaultTechResourceBySlug(slug);

  if (!item) {
    return Response.json({ message: "Tech resource item not found" }, { status: 404 });
  }

  return Response.json(item);
}
