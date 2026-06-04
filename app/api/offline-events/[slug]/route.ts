import { getOfflineEventDetail } from "@/lib/offline-events-service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const result = await getOfflineEventDetail(slug);

  if (!result) {
    return Response.json({ message: "Offline event not found" }, { status: 404 });
  }

  return Response.json(result.item);
}
