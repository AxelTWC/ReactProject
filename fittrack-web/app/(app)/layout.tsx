import { AppShell } from "@/components/layout/AppShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthCookieName, verifyAuthToken } from "@/src/server/auth/auth.service";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  if (!token || !verifyAuthToken(token)) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
