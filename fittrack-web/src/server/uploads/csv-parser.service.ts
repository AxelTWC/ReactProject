import { parse } from "csv-parse/sync";
import { csvRowSchema, CsvRow } from "@/src/server/validators/upload.validator";

export type CsvParseResult = {
	validRows: CsvRow[];
	invalidRows: number;
	errors: Array<{ row: number; message: string }>;
};

export function parseWorkoutCsv(content: string): CsvParseResult {
	const records = parse(content, {
		columns: true,
		skip_empty_lines: true,
		trim: true,
	}) as Array<Record<string, string>>;

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