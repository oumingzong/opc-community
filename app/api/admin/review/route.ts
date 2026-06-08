import { type NextRequest } from "next/server";

const CONTENT_HUB_BASE =
  process.env.NEXT_PUBLIC_CONTENT_API_BASE?.replace(/\/+$/, "") ??
  "http://127.0.0.1:8787";

const ADMIN_TOKEN = process.env.CONTENT_HUB_ADMIN_TOKEN ?? "";

function forwardHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (ADMIN_TOKEN) {
    headers["Authorization"] = `Bearer ${ADMIN_TOKEN}`;
  }
  return headers;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") ?? "draft";
  const type = searchParams.get("type") ?? "";
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "20";

  const query = new URLSearchParams({ status, page, pageSize });
  if (type) query.set("type", type);

  const url = `${CONTENT_HUB_BASE}/internal/review/contents?${query.toString()}`;

  try {
    const resp = await fetch(url, { headers: forwardHeaders() });
    const data = await resp.json();
    return Response.json(data, { status: resp.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");
  const contentId = searchParams.get("id");

  if (!contentId || !action) {
    return Response.json({ error: "Missing id or action" }, { status: 400 });
  }

  const allowedActions = ["publish", "reject", "archive"];
  if (!allowedActions.includes(action)) {
    return Response.json(
      { error: `Invalid action. Must be one of: ${allowedActions.join(", ")}` },
      { status: 400 }
    );
  }

  const url = `${CONTENT_HUB_BASE}/internal/contents/${contentId}/${action}`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: forwardHeaders(),
    });
    const data = await resp.json();
    return Response.json(data, { status: resp.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
