import { cookies } from "next/headers";
import { handleMe } from "@/src/server/auth/auth.routes";
import { getAuthCookieName } from "@/src/server/auth/auth.service";

export async function GET() {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  return handleMe(token);
}
