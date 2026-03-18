import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/src/server/analytics/analytics.service";

export async function handleAnalyticsSummary(userId: string, from?: string, to?: string) {
	const summary = await getAnalyticsSummary(userId, from, to);
	return NextResponse.json(summary);
}