import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected route
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Get the session token from the cookie
  const sessionToken = request.cookies.get("next-auth.session-token")?.value;

  let isAuthenticated = false;
  if (sessionToken) {
    try {
      // Decode and verify the token
      const session = await decode({
        token: sessionToken,
        secret: process.env.NEXTAUTH_SECRET!,
      });
      isAuthenticated = !!session;
    } catch (error) {
      console.error("Failed to decode session token:", error);
    }
  }

  // If it's a protected route and there's no valid session, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // If it's the login page and there's a valid session, redirect to dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
