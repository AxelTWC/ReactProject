import { NextRequest, NextResponse } from "next/server";
import { getRequestUserId } from "@/src/server/middleware/require-auth";
import { handleUploadCsv } from "@/src/server/uploads/upload.routes";

export async function POST(request: NextRequest) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "CSV file is required" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return NextResponse.json({ error: "Only CSV files are supported" }, { status: 400 });
  }

  return handleUploadCsv(userId, file);
}
