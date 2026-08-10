import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 Proxy handler for route protection and security headers.
 *
 * Protected routes check for the Appwrite session cookie.
 * All responses receive hardened security headers (CSP, HSTS, X-Frame-Options, etc.).
 */

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/courses",
  "/career-passport",
  "/career-hub",
  "/certificates",
  "/challenges",
  "/community",
  "/events",
  "/help",
  "/jobs",
  "/leaderboard",
  "/learn",
  "/marketplace",
  "/mba-center",
  "/mock-",
  "/settings",
  "/subscription",
  "/workshops",
];

const AUTH_ROUTES = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Detect Appwrite session cookie or our fallback cookie for localhost
  const hasSession = request.cookies.getAll().some(
    (c) => (c.name.startsWith("a_session_") || c.name === "insyt_fallback_session") && c.value.length > 0
  );

  // Protected route guard
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && hasSession) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // Security headers
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
