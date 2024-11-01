import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isLoginPage = createRouteMatcher(["/login"]);
const isRegisterPage = createRouteMatcher(["/dashboard"]);

export default convexAuthNextjsMiddleware((request) => {
  if (isLoginPage(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  if (isRegisterPage(request) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/login");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
