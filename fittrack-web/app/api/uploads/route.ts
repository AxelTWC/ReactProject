import { NextRequest, NextResponse } from "next/server";
import { getRequestUserId } from "@/src/server/middleware/require-auth";
import { handleListUploads } from "@/src/server/uploads/upload.routes";

export async function GET(request: NextRequest) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handleListUploads(userId);
}
