import { NextResponse } from "next/server";
import { createWorkoutSession, listWorkoutSessions } from "@/src/server/workouts/workout.service";
import { workoutPayloadSchema } from "@/src/server/validators/workout.validator";

export async function handleCreateWorkout(userId: string, body: unknown) {
	const parsed = workoutPayloadSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid workout" }, { status: 400 });
	}

	const session = await createWorkoutSession(userId, parsed.data);
	return NextResponse.json({ session }, { status: 201 });
}

export async function handleListWorkouts(userId: string, query?: string, date?: string) {
	const sessions = await listWorkoutSessions(userId, { query, date });
	return NextResponse.json(
		{ sessions },
		{
			headers: {
				"cache-control": "no-store, max-age=0",
			},
		},
	);
}