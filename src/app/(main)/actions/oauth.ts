"use server";

import { signIn } from "@/lib/auth";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/dashboard" });
};
