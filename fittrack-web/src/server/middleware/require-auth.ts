import { NextRequest } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/server/db/prisma";

async function resolveAppUserIdByEmail(email: string | null | undefined): Promise<string | null> {
	if (!email) {
		return null;
	}

	const normalizedEmail = email.trim().toLowerCase();
	if (!normalizedEmail) {
		return null;
	}

	const user = await prisma.user.upsert({
		where: { email: normalizedEmail },
		update: {},
		create: {
			email: normalizedEmail,
			passwordHash: "oauth-account",
		},
		select: { id: true },
	});

	return user.id;
}

export async function getRequestUserId(request: NextRequest): Promise<string | null> {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	return resolveAppUserIdByEmail(session?.user?.email);
}

export async function getHeadersUserId(headers: Headers): Promise<string | null> {
	const session = await auth.api.getSession({ headers });
	return resolveAppUserIdByEmail(session?.user?.email);
}