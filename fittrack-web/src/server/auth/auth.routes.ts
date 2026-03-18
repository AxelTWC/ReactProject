import { NextResponse } from "next/server";
import { z } from "zod";
import {
	getAuthCookieName,
	loginUser,
	registerUser,
	signAuthToken,
	verifyAuthToken,
} from "@/src/server/auth/auth.service";

const authSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export async function handleRegister(body: unknown) {
	const parsed = authSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
	}

	try {
		const user = await registerUser(parsed.data.email, parsed.data.password);
		const token = signAuthToken({ userId: user.id, email: user.email });
		const response = NextResponse.json({ user });
		response.cookies.set(getAuthCookieName(), token, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
		return response;
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Registration failed" },
			{ status: 400 },
		);
	}
}

export async function handleLogin(body: unknown) {
	const parsed = authSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
	}

	try {
		const user = await loginUser(parsed.data.email, parsed.data.password);
		const token = signAuthToken({ userId: user.id, email: user.email });
		const response = NextResponse.json({ user });
		response.cookies.set(getAuthCookieName(), token, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
		});
		return response;
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Login failed" },
			{ status: 401 },
		);
	}
}

export function handleLogout() {
	const response = NextResponse.json({ ok: true });
	response.cookies.set(getAuthCookieName(), "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		expires: new Date(0),
	});
	return response;
}

export function handleMe(token: string | undefined) {
	if (!token) {
		return NextResponse.json({ user: null });
	}

	const payload = verifyAuthToken(token);
	if (!payload) {
		return NextResponse.json({ user: null });
	}

	return NextResponse.json({
		user: {
			id: payload.userId,
			email: payload.email,
		},
	});
}