import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/src/server/db/prisma";

type TokenPayload = {
	userId: string;
	email: string;
};

const TOKEN_TTL = "7d";
const COOKIE_NAME = "fittrack_token";

function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}
	return secret;
}

export function getAuthCookieName(): string {
	return COOKIE_NAME;
}

export async function registerUser(email: string, password: string) {
	const normalizedEmail = email.trim().toLowerCase();
	const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
	if (existing) {
		throw new Error("Email already exists");
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: {
			email: normalizedEmail,
			passwordHash,
		},
		select: {
			id: true,
			email: true,
			createdAt: true,
		},
	});

	return user;
}

export async function loginUser(email: string, password: string) {
	const normalizedEmail = email.trim().toLowerCase();
	const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
	if (!user) {
		throw new Error("Invalid credentials");
	}

	const matches = await bcrypt.compare(password, user.passwordHash);
	if (!matches) {
		throw new Error("Invalid credentials");
	}

	return {
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
	};
}

export function signAuthToken(payload: TokenPayload): string {
	return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyAuthToken(token: string): TokenPayload | null {
	try {
		return jwt.verify(token, getJwtSecret()) as TokenPayload;
	} catch {
		return null;
	}
}