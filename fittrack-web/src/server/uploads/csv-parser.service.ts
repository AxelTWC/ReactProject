import { parse } from "csv-parse/sync";
import { csvRowSchema, CsvRow } from "@/src/server/validators/upload.validator";

export type CsvParseResult = {
	validRows: CsvRow[];
	invalidRows: number;
	errors: Array<{ row: number; message: string }>;
};

export function parseWorkoutCsv(content: string): CsvParseResult {
	const normalizedContent = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;

	let records: Array<Record<string, string>>;
	try {
		records = parse(normalizedContent, {
			columns: true,
			skip_empty_lines: true,
			trim: true,
		}) as Array<Record<string, string>>;
	} catch (error) {
		return {
			validRows: [],
			invalidRows: 1,
			errors: [
				{
					row: 1,
					message: error instanceof Error ? `Invalid CSV format: ${error.message}` : "Invalid CSV format",
				},
			],
		};
	}

	const validRows: CsvRow[] = [];
	const errors: Array<{ row: number; message: string }> = [];

	records.forEach((record, index) => {
		const parsed = csvRowSchema.safeParse(record);
		if (!parsed.success) {
			const issue = parsed.error.issues[0];
			errors.push({
				row: index + 2,
				message: issue?.message ?? "Invalid row",
			});
			return;
		}

		validRows.push(parsed.data);
	});

	return {
		validRows,
		invalidRows: errors.length,
		errors,
	};
}