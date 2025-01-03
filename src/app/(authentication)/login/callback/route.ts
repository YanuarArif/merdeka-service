import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/";

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        let redirectUrl = origin; // Default redirect URL

        if (isLocalEnv) {
          redirectUrl = `${origin}`;
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}`;
        } else {
          redirectUrl = origin;
        }

        return NextResponse.redirect(redirectUrl);
      }
    }

    // Handle cases where code is missing or Supabase error occurs
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  } catch (error) {
    console.error("Error in /login/callback route:", error);
    // Handle the error gracefully during build or runtime
    if (process.env.NODE_ENV === "development") {
      // During development, re-throw the error for easier debugging
      throw error;
    } else {
      // During build or production, redirect to a safe fallback
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }
}
