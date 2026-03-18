"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createWorkoutSession } from "@/src/server/workouts/workout.service";
import { workoutPayloadSchema } from "@/src/server/validators/workout.validator";
import { getHeadersUserId } from "@/src/server/middleware/require-auth";

type CreateWorkoutActionInput = {
  date: string;
  notes?: string;
  sets: Array<{
    exercise: string;
    reps: number;
    weight: number;
    setNumber: number;
  }>;
};

type CreateWorkoutActionResult =
  | { ok: true; sessionId: string }
  | { ok: false; error: string };

export async function createWorkoutAction(
  input: CreateWorkoutActionInput,
): Promise<CreateWorkoutActionResult> {
  const userId = await getHeadersUserId(await headers());
  if (!userId) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = workoutPayloadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid workout" };
  }

  const session = await createWorkoutSession(userId, parsed.data);
  revalidatePath("/workouts/history");
  revalidatePath("/dashboard");

  return { ok: true, sessionId: session.id };
}
