import { prisma } from "@/src/server/db/prisma";
import { parseWorkoutCsv } from "@/src/server/uploads/csv-parser.service";
import { storeCsvFile } from "@/src/server/uploads/storage.service";

function inferMuscleGroup(exerciseName: string, explicit?: string): string {
	if (explicit && explicit.trim()) {
		return explicit.trim();
	}

	const value = exerciseName.toLowerCase();
	if (value.includes("squat") || value.includes("lunge") || value.includes("leg")) {
		return "Legs";
	}
	if (value.includes("bench") || value.includes("press") || value.includes("chest")) {
		return "Chest";
	}
	if (value.includes("row") || value.includes("pull") || value.includes("deadlift")) {
		return "Back";
	}
	if (value.includes("shoulder")) {
		return "Shoulders";
	}
	return "Other";
}

export async function processWorkoutCsvUpload(userId: string, fileName: string, content: Buffer) {
	const stored = await storeCsvFile(fileName, content);
	const parsed = parseWorkoutCsv(content.toString("utf-8"));

	const sessionByDate = new Map<string, string>();

	await prisma.$transaction(async (tx) => {
		for (const row of parsed.validRows) {
			let sessionId = sessionByDate.get(row.date);

			if (!sessionId) {
				const session = await tx.workoutSession.create({
					data: {
						userId,
						date: new Date(`${row.date}T00:00:00.000Z`),
						notes: row.notes,
					},
				});
				sessionId = session.id;
				sessionByDate.set(row.date, session.id);
			}

			const exercise = await tx.exercise.upsert({
				where: {
					name: row.exercise,
				},
				update: {
					muscleGroup: inferMuscleGroup(row.exercise, row.muscleGroup),
				},
				create: {
					name: row.exercise,
					muscleGroup: inferMuscleGroup(row.exercise, row.muscleGroup),
				},
			});

			await tx.workoutSet.create({
				data: {
					sessionId,
					exerciseId: exercise.id,
					reps: row.reps,
					weight: row.weight,
					duration: row.duration,
					setNumber: row.setNumber ?? 1,
				},
			});
		}

		await tx.cSVUpload.create({
			data: {
				userId,
				fileKey: stored.key,
				storageProvider: stored.provider,
			},
		});
	});

	return {
		validRows: parsed.validRows.length,
		invalidRows: parsed.invalidRows,
		errors: parsed.errors,
		fileKey: stored.key,
		storageProvider: stored.provider,
	};
}

function deriveOriginalFileName(fileKey: string): string {
	const parts = fileKey.split("-");
	if (parts.length <= 2) {
		return fileKey;
	}
	return parts.slice(2).join("-");
}

export async function listUserUploads(userId: string) {
	const uploads = await prisma.cSVUpload.findMany({
		where: { userId },
		orderBy: { uploadedAt: "desc" },
		select: {
			id: true,
			fileKey: true,
			uploadedAt: true,
		},
	});

	return uploads.map((upload) => ({
		id: upload.id,
		fileKey: upload.fileKey,
		fileName: deriveOriginalFileName(upload.fileKey),
		uploadedAt: upload.uploadedAt,
	}));
}