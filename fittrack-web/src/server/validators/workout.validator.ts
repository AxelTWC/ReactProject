import { z } from "zod";

export const workoutSetSchema = z.object({
	exercise: z.string().trim().min(1, "Exercise is required"),
	reps: z.number().int().min(1, "Reps must be at least 1"),
	weight: z.number().min(0, "Weight must be non-negative"),
	setNumber: z.number().int().min(1).optional(),
	duration: z.number().int().min(0).optional(),
	muscleGroup: z.string().trim().optional(),
});

export const workoutPayloadSchema = z.object({
	date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
	notes: z.string().max(1000).optional(),
	sets: z.array(workoutSetSchema).min(1, "At least one set is required"),
});

export type WorkoutPayload = z.infer<typeof workoutPayloadSchema>;