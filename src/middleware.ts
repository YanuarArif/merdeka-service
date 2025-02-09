import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { nextUrl } = req;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = [
    "/",
    "/login",
    "/register",
    "/verification-email",
    "/send-verification",
    "/reset-password",
  ].includes(nextUrl.pathname);

  // Allow public routes and API routes
  if (isPublicRoute || isApiRoute) {
    return;
  }

  // Redirect to login if accessing protected route while not authenticated
  if (!isAuthenticated) {
    const redirectUrl = new URL("/login", nextUrl);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(redirectUrl);
  }

  return;
});

// Configure middleware matcher
export const config = {
  matcher: [
    // Match all routes except static files and api
    "/((?!_next/static|_next/image|favicon.ico|images|assets|static|media).*)",
  ],
};
