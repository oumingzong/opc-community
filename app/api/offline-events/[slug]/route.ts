import { getDefaultOfflineEventBySlug } from "@/app/data/offline-events";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const item = getDefaultOfflineEventBySlug(slug);

  if (!item) {
    return Response.json({ message: "Offline event not found" }, { status: 404 });
  }

  return Response.json(item);
}
