import { type NextRequest } from "next/server";
import { fetchDashboardStats } from "@/lib/admin-api";

export const revalidate = 300;

export async function GET(_request: NextRequest) {
  try {
    const stats = await fetchDashboardStats();
    return Response.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}