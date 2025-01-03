import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        `${origin || process.env.NEXT_PUBLIC_BASE_URL || "/"}/auth/auth-code-error`
      ); // Fallback for origin
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Supabase auth error:", error);
        return NextResponse.redirect(
          `${origin || process.env.NEXT_PUBLIC_BASE_URL || "/"}/auth/auth-code-error`
        ); // Fallback here too
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      let redirectUrl = origin || process.env.NEXT_PUBLIC_BASE_URL || "/";

      if (isLocalEnv) {
        redirectUrl = `${origin || process.env.NEXT_PUBLIC_BASE_URL || "/"}`;
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}`;
      }

      return NextResponse.redirect(redirectUrl);
    } catch (supabaseError) {
      console.error("Supabase client or auth error:", supabaseError);
      return NextResponse.redirect(
        `${origin || process.env.NEXT_PUBLIC_BASE_URL || "/"}/auth/auth-code-error`
      );
    }
  } catch (error) {
    console.error("Error in /login/callback route:", error);
    return NextResponse.redirect(
      `${origin || process.env.NEXT_PUBLIC_BASE_URL || "/"}/auth/auth-code-error`
    );
  }
}
