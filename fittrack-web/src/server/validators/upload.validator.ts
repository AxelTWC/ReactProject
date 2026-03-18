import { z } from "zod";

export const csvRowSchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	exercise: z.string().trim().min(1),
	reps: z.coerce.number().int().min(1),
	weight: z.coerce.number().min(0),
	setNumber: z.coerce.number().int().min(1).optional(),
	duration: z.coerce.number().int().min(0).optional(),
	notes: z.string().max(1000).optional(),
	muscleGroup: z.string().trim().optional(),
});

export type CsvRow = z.infer<typeof csvRowSchema>;