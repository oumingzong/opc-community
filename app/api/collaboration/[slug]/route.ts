import { getDefaultCollaborationBySlug } from "@/app/data/collaboration";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const item = getDefaultCollaborationBySlug(slug);

  if (!item) {
    return Response.json({ message: "Collaboration item not found" }, { status: 404 });
  }

  return Response.json(item);
}
