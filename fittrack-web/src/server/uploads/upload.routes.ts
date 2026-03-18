import { NextResponse } from "next/server";
import { listUserUploads, processWorkoutCsvUpload } from "@/src/server/uploads/upload.service";

export async function handleUploadCsv(userId: string, file: File) {
	const bytes = await file.arrayBuffer();
	const result = await processWorkoutCsvUpload(userId, file.name, Buffer.from(bytes));
	return NextResponse.json(result, { status: 201 });
}

export async function handleListUploads(userId: string) {
	const uploads = await listUserUploads(userId);
	return NextResponse.json({ uploads });
}