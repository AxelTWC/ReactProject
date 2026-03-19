import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/workouts") ||
      request.nextUrl.pathname.startsWith("/upload") ||
      request.nextUrl.pathname.startsWith("/profile")) {
    response.headers.set("cache-control", "no-store, max-age=0, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
