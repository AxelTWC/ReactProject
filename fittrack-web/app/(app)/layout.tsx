import { AppShell } from "@/components/layout/AppShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthCookieName, verifyAuthToken } from "@/src/server/auth/auth.service";
import { prisma } from "@/src/server/db/prisma";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(getAuthCookieName())?.value;
  const payload = token ? verifyAuthToken(token) : null;
  if (!payload) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
