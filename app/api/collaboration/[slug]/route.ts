import { getCollaborationDetail } from "@/lib/collaboration-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await getCollaborationDetail(slug);

  if (!result) {
    return Response.json({ message: "Collaboration item not found" }, { status: 404 });
  }

  return Response.json(result.item);
}
