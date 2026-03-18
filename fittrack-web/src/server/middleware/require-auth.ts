import { NextRequest } from "next/server";
import { getAuthCookieName, verifyAuthToken } from "@/src/server/auth/auth.service";
import { prisma } from "@/src/server/db/prisma";

export async function getRequestUserId(request: NextRequest): Promise<string | null> {
	const token = request.cookies.get(getAuthCookieName())?.value;
	if (!token) {
		return null;
	}

	const payload = verifyAuthToken(token);
	if (!payload?.userId) {
		return null;
	}

	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
		select: { id: true },
	});

	return user?.id ?? null;
}