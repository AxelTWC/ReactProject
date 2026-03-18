import { NextRequest, NextResponse } from "next/server";
import { readAzureUploadedFile } from "@/src/server/uploads/storage.service";
import { getRequestUserId } from "@/src/server/middleware/require-auth";
import { prisma } from "@/src/server/db/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileKey: string }> },
) {
  const userId = await getRequestUserId(_request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileKey } = await params;
  const upload = await prisma.cSVUpload.findFirst({
    where: {
      userId,
      fileKey,
    },
  });

  if (!upload) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const data = await readAzureUploadedFile(fileKey);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "content-type": "text/csv",
        "content-disposition": `attachment; filename=\"${fileKey}\"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
