import { NextResponse } from "next/server";
import { processWorkoutCsvUpload } from "@/src/server/uploads/upload.service";

export async function handleUploadCsv(userId: string, file: File) {
	const bytes = await file.arrayBuffer();
	const result = await processWorkoutCsvUpload(userId, file.name, Buffer.from(bytes));
	return NextResponse.json(result, { status: 201 });
}