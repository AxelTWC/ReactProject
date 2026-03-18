import { NextRequest } from "next/server";
import { getAuthCookieName, verifyAuthToken } from "@/src/server/auth/auth.service";

export function getRequestUserId(request: NextRequest): string | null {
	const token = request.cookies.get(getAuthCookieName())?.value;
	if (!token) {
		return null;
	}

	const payload = verifyAuthToken(token);
	return payload?.userId ?? null;
}