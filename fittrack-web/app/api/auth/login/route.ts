import { NextRequest } from "next/server";
import { handleLogin } from "@/src/server/auth/auth.routes";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleLogin(body);
}
