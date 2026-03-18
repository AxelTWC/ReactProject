import { NextRequest, NextResponse } from "next/server";
import { getRequestUserId } from "@/src/server/middleware/require-auth";
import { handleCreateWorkout, handleListWorkouts } from "@/src/server/workouts/workout.routes";

export async function GET(request: NextRequest) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("query") ?? undefined;
  const date = request.nextUrl.searchParams.get("date") ?? undefined;
  return handleListWorkouts(userId, query, date);
}

export async function POST(request: NextRequest) {
  const userId = getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  return handleCreateWorkout(userId, body);
}
