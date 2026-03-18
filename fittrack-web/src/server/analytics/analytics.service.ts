import { prisma } from "@/src/server/db/prisma";

function getWeekLabel(date: Date): string {
	const day = date.getUTCDate();
	const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
	return `${month} ${day}`;
}

function estimatedOneRM(weight: number, reps: number): number {
	return weight * (1 + reps / 30);
}

export async function getAnalyticsSummary(userId: string, from?: string, to?: string) {
	const fromDate = from ? new Date(`${from}T00:00:00.000Z`) : new Date(Date.now() - 28 * 86400000);
	const toDate = to ? new Date(`${to}T23:59:59.999Z`) : new Date();

	const sessions = await prisma.workoutSession.findMany({
		where: {
			userId,
			date: {
				gte: fromDate,
				lte: toDate,
			},
		},
		include: {
			sets: {
				include: {
					exercise: true,
				},
			},
		},
		orderBy: {
			date: "asc",
		},
	});

	const weeklyMap = new Map<string, number>();
	const oneRMTrend: Array<{ date: string; oneRM: number }> = [];
	const muscleVolumeMap = new Map<string, number>();
	const exerciseFrequencyMap = new Map<string, number>();

	let totalVolume = 0;
	let totalOneRM = 0;
	let oneRMCount = 0;

	for (const session of sessions) {
		let sessionVolume = 0;
		let sessionPeakOneRM = 0;

		for (const set of session.sets) {
			const volume = set.reps * set.weight;
			sessionVolume += volume;
			totalVolume += volume;

			const e1rm = estimatedOneRM(set.weight, set.reps);
			totalOneRM += e1rm;
			oneRMCount += 1;
			sessionPeakOneRM = Math.max(sessionPeakOneRM, e1rm);

			const muscle = set.exercise.muscleGroup;
			muscleVolumeMap.set(muscle, (muscleVolumeMap.get(muscle) ?? 0) + volume);

			const exerciseName = set.exercise.name;
			exerciseFrequencyMap.set(exerciseName, (exerciseFrequencyMap.get(exerciseName) ?? 0) + 1);
		}

		const weekKey = getWeekLabel(session.date);
		weeklyMap.set(weekKey, (weeklyMap.get(weekKey) ?? 0) + Math.round(sessionVolume));

		if (sessionPeakOneRM > 0) {
			oneRMTrend.push({
				date: session.date.toISOString().slice(5, 10),
				oneRM: Math.round(sessionPeakOneRM),
			});
		}
	}

	const weeks = Math.max(1, Math.ceil((toDate.getTime() - fromDate.getTime()) / (7 * 86400000)));
	const consistencyRaw = sessions.length / weeks;
	const consistencyScore = Math.max(0, Math.min(5, Number((consistencyRaw * 2.5).toFixed(1))));

	const muscleDistribution = Array.from(muscleVolumeMap.entries())
		.map(([muscleGroup, volume]) => ({
			muscleGroup,
			percent: totalVolume > 0 ? Math.round((volume / totalVolume) * 100) : 0,
		}))
		.sort((a, b) => b.percent - a.percent)
		.slice(0, 6);

	const exerciseFrequency = Array.from(exerciseFrequencyMap.entries())
		.map(([exerciseName, count]) => ({ exerciseName, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 6);

	const volumeTrend = Array.from(weeklyMap.entries()).map(([week, volume]) => ({ week, volume }));

	return {
		kpis: {
			weeklyVolume: Math.round(totalVolume),
			avgEstimatedOneRM: oneRMCount > 0 ? Math.round(totalOneRM / oneRMCount) : 0,
			consistencyScore,
		},
		charts: {
			volumeTrend,
			oneRMTrend: oneRMTrend.slice(-8),
			muscleDistribution,
			exerciseFrequency,
		},
	};
}