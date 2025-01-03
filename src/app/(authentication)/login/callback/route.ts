import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic"; // Ensures dynamic behavior
export const revalidate = 0; // No caching

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/";

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
        const isLocalEnv = process.env.NODE_ENV === "development";
        if (isLocalEnv) {
          // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}`); // change from `${origin}${next}` to `${origin}`
        }
      } else {
        console.error("Supabase session exchange error:", error);
      }
    }

    // If the code is not present or an error occurred, redirect to error page
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.redirect("/error?message=unexpected_error"); // Redirect to a general error page with an error message
  }
}
