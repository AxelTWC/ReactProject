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
	const exerciseByName = new Map<string, string>();
	const firstNoteByDate = new Map<string, string | undefined>();

	for (const row of parsed.validRows) {
		if (!firstNoteByDate.has(row.date)) {
			firstNoteByDate.set(row.date, row.notes);
		}
	}

	const uniqueDates = Array.from(new Set(parsed.validRows.map((row) => row.date))).sort();
	const uniqueExercises = Array.from(new Set(parsed.validRows.map((row) => row.exercise)));

	await prisma.$transaction(async (tx) => {
		for (const date of uniqueDates) {
			const session = await tx.workoutSession.create({
				data: {
					userId,
					date: new Date(`${date}T00:00:00.000Z`),
					notes: firstNoteByDate.get(date),
				},
			});
			sessionByDate.set(date, session.id);
		}

		for (const exerciseName of uniqueExercises) {
			const sampleRow = parsed.validRows.find((row) => row.exercise === exerciseName);
			const exercise = await tx.exercise.upsert({
				where: {
					name: exerciseName,
				},
				update: {
					muscleGroup: inferMuscleGroup(exerciseName, sampleRow?.muscleGroup),
				},
				create: {
					name: exerciseName,
					muscleGroup: inferMuscleGroup(exerciseName, sampleRow?.muscleGroup),
				},
			});
			exerciseByName.set(exerciseName, exercise.id);
		}

		const setRows = parsed.validRows.map((row) => ({
			sessionId: sessionByDate.get(row.date)!,
			exerciseId: exerciseByName.get(row.exercise)!,
			reps: row.reps,
			weight: row.weight,
			duration: row.duration,
			setNumber: row.setNumber ?? 1,
		}));

		if (setRows.length > 0) {
			await tx.workoutSet.createMany({
				data: setRows,
			});
		}

		await tx.cSVUpload.create({
			data: {
				userId,
				fileKey: stored.key,
				storageProvider: stored.provider,
			},
		});
	}, {
		maxWait: 10000,
		timeout: 60000,
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