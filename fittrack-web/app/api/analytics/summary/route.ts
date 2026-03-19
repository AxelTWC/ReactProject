import { NextRequest, NextResponse } from "next/server";
import { getRequestUserId } from "@/src/server/middleware/require-auth";
import { handleAnalyticsSummary } from "@/src/server/analytics/analytics.routes";

export async function GET(request: NextRequest) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "cache-control": "no-store, max-age=0" } });
  }

  const from = request.nextUrl.searchParams.get("from") ?? undefined;
  const to = request.nextUrl.searchParams.get("to") ?? undefined;

  const result = await handleAnalyticsSummary(userId, from, to);
  result.headers.set("cache-control", "no-store, max-age=0");
  return result;
}
