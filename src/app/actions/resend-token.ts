"use server";

import { resendVerificationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/token";

export const resendToken = async (email: string) => {
  try {
    const token = await generateVerificationToken(email);
    await resendVerificationEmail(email, token);
    return { success: true };
  } catch (error) {
    console.error("Resend error:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
