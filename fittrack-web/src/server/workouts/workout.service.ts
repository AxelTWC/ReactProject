import { prisma } from "@/src/server/db/prisma";
import { WorkoutPayload } from "@/src/server/validators/workout.validator";

const muscleGroupMap: Record<string, string> = {
	bench: "Chest",
	"bench press": "Chest",
	squat: "Legs",
	"back squat": "Legs",
	deadlift: "Back",
	row: "Back",
	"barbell row": "Back",
	overhead: "Shoulders",
	"overhead press": "Shoulders",
};

function inferMuscleGroup(exerciseName: string, explicit?: string): string {
	if (explicit && explicit.trim().length > 0) {
		return explicit.trim();
	}

	const key = exerciseName.trim().toLowerCase();
	return muscleGroupMap[key] ?? "Other";
}

function toDate(input: string): Date {
	if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
		return new Date(`${input}T00:00:00.000Z`);
	}
	return new Date(input);
}

export async function createWorkoutSession(userId: string, payload: WorkoutPayload) {
	const created = await prisma.$transaction(async (tx) => {
		const session = await tx.workoutSession.create({
			data: {
				userId,
				date: toDate(payload.date),
				notes: payload.notes,
			},
		});

		let setNumber = 1;
		for (const set of payload.sets) {
			const exerciseName = set.exercise.trim();
			const muscleGroup = inferMuscleGroup(exerciseName, set.muscleGroup);

			const exercise = await tx.exercise.upsert({
				where: { name: exerciseName },
				update: {
					muscleGroup,
				},
				create: {
					name: exerciseName,
					muscleGroup,
				},
			});

			await tx.workoutSet.create({
				data: {
					sessionId: session.id,
					exerciseId: exercise.id,
					reps: set.reps,
					weight: set.weight,
					duration: set.duration,
					setNumber: set.setNumber ?? setNumber,
				},
			});
			setNumber += 1;
		}

		return session;
	});

	return created;
}

export async function listWorkoutSessions(userId: string, filters?: { query?: string; date?: string }) {
	const sessions = await prisma.workoutSession.findMany({
		where: {
			userId,
			...(filters?.date
				? {
						date: {
							gte: new Date(`${filters.date}T00:00:00.000Z`),
							lt: new Date(`${filters.date}T23:59:59.999Z`),
						},
					}
				: {}),
			...(filters?.query
				? {
						sets: {
							some: {
								exercise: {
									name: {
										contains: filters.query,
										mode: "insensitive",
									},
								},
							},
						},
					}
				: {}),
		},
		include: {
			sets: {
				include: {
					exercise: true,
				},
			},
		},
		orderBy: {
			date: "desc",
		},
	});

	return sessions.map((session) => {
		const totalVolume = session.sets.reduce((acc, set) => acc + set.reps * set.weight, 0);
		const dominantMuscle =
			session.sets[0]?.exercise.muscleGroup ?? (session.notes?.trim() ? session.notes : "Session");

		return {
			id: session.id,
			date: session.date.toISOString().slice(0, 10),
			split: dominantMuscle,
			sets: session.sets.length,
			volume: Math.round(totalVolume),
			notes: session.notes,
		};
	});
}