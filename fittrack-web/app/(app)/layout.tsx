import { AppShell } from "@/components/layout/AppShell";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getHeadersUserId } from "@/src/server/middleware/require-auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user?.email) {
    redirect("/login");
  }

  const userId = await getHeadersUserId(requestHeaders);
  if (!userId) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
