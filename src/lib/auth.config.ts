// this file for edge browser compatible
import Google from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "../schemas/zod";
import { database } from "./database";
import bcrypt from "bcryptjs";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    // Provider untuk login dengan email dan password
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        // Validasi input menggunakan schema Zod
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }
        // Ambil email dan password dari data yang sudah divalidasi
        const { email, password } = validatedFields.data;
        // Cari pengguna berdasarkan email
        const user = await database.user.findUnique({
          where: { email },
        });

        // Jika pengguna tidak ditemukan, lempar error
        if (!user || !user.password) {
          throw new Error("User tidak ditemukan atau password salah!");
        }
        // Block login jika email belum diverifikasi
        if (user && !user.emailVerified) {
          throw new Error("Verify your email first! Check your inbox.");
        }

        // Bandingkan password yang dimasukkan dengan hash password di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return {
          ...user,
          role: user.role ?? "user",
        };
      },
    }),

    // Provider untuk login dengan Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER",
          emailVerified: new Date(),
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
