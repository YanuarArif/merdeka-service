"use server";

import { z } from "zod";
import { LoginSchema } from "@/schemas/zod";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/app/(main)/data/user";
import { database } from "@/lib/database";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validasi input menggunakan Zod schema
  const validatedFields = LoginSchema.safeParse(values);
  // Return error jika validasi gagal
  if (!validatedFields.success) {
    return { error: "Input tidak valid!" };
  }

  // Destructure data yang sudah tervalidasi
  const { email, password } = validatedFields.data;
  // Check if user exists and is verified
  const existingUser = await getUserByEmail(email);

  // Jika pengguna tidak ditemukan, lempar error
  if (!existingUser || !existingUser.password) {
    return { error: "User tidak ditemukan atau password salah!" };
  }
  if (!existingUser || !existingUser.emailVerified) {
    return {
      error: "Akun belum terverifikasi!\nSilakan cek email untuk verifikasi.",
    };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });

    // Return success jika login berhasil
    return {
      success: "Login berhasil!",
      redirectTo: `/dashboard`,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah!" };
        default:
          return { error: "Ada yang salah!" };
      }
    }
    throw error;
  }
};
