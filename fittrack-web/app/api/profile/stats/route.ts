import { NextRequest, NextResponse } from "next/server";
import { getRequestUserId } from "@/src/server/middleware/require-auth";
import { prisma } from "@/src/server/db/prisma";

export async function GET(request: NextRequest) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const lastSession = await prisma.session.findFirst({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const totalWorkouts = await prisma.workoutSession.count({
    where: { userId },
  });

  return NextResponse.json({
    memberSince: user.createdAt,
    lastLoggedIn: lastSession?.createdAt ?? user.createdAt,
    totalWorkouts,
  });
}
