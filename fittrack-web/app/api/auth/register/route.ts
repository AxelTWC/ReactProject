import { NextRequest } from "next/server";
import { handleRegister } from "@/src/server/auth/auth.routes";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleRegister(body);
}
