"use server";

import { DaftarSchema } from "@/schemas/zod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { database } from "@/lib/database";
import { generateVerificationToken } from "@/lib/token";
import { resendVerificationEmail } from "@/lib/email";

export const register = async (values: z.infer<typeof DaftarSchema>) => {
  // Validasi input menggunakan Zod schema
  const validatedFields = DaftarSchema.safeParse(values);
  // Return error jika validasi gagal
  if (!validatedFields.success) {
    return { error: "Input tidak valid!" };
  }

  // Destructure data yang sudah tervalidasi
  const { username, email, password } = validatedFields.data;

  try {
    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cek apakah email sudah terdaftar
    const existingUser = await database.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    // Return error jika username/email sudah digunakan
    if (existingUser) {
      if (existingUser.username === username) {
        return {
          error: "Username tidak tersedia!",
        };
      }
      if (existingUser.email === email) {
        return { error: "Email sudah terdaftar!" };
      }
    }

    const lowerCaseEmail = email.toLowerCase();
    const lowerCaseUsername = username.toLowerCase();
    // Buat user baru di database
    await database.user.create({
      data: {
        username: lowerCaseUsername,
        email: lowerCaseEmail,
        password: hashedPassword,
      },
    });

    // Generate token verifikasi
    const verificationToken = await generateVerificationToken(email);
    // Kirim email verifikasi (tambahan)
    await resendVerificationEmail(email, verificationToken);

    return {
      success: "Pendaftaran berhasil!\nCek email untuk verifikasi",
      redirectTo: `/send-verification?email=${encodeURIComponent(email)}`,
    };
  } catch (error) {
    console.error("Registrasi error:", error);
    return { error: "Terjadi kesalahan saat registrasi!" };
  }
};
