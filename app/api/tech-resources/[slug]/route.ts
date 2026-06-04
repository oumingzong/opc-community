import { getTechResourceDetail } from "@/lib/tech-resource-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await getTechResourceDetail(slug);

  if (!result) {
    return Response.json({ message: "Tech resource item not found" }, { status: 404 });
  }

  return Response.json(result.item);
}
