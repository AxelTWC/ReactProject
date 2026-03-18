import { handleLogout } from "@/src/server/auth/auth.routes";

export async function POST() {
  return handleLogout();
}
