import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const session = await auth();

    // Auth routes (login, register, etc.)
    const isAuthRoute = [
      "/login",
      "/register",
      "/send-verification",
      "/verification-email",
    ].includes(request.nextUrl.pathname);

    // Protected routes
    const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/user");

    // Admin-only routes
    const isAdminRoute =
      request.nextUrl.pathname.startsWith("/dashboard/users");

    // Redirect from auth routes if logged in
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Require login for protected routes
    if (!session && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Require admin for admin routes
    if (session && session.user?.role !== "ADMIN" && isAdminRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If all checks pass, continue to the route
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user/:path*",
    "/login",
    "/register",
    "/send-verification",
    "/verification-email",
  ],
};
