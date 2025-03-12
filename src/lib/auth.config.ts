import { neon } from "@neondatabase/serverless";
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "../schemas/zod";
import { database } from "./database";
import bcrypt from "bcryptjs";
import { Pool } from "@neondatabase/serverless";

// Import koneksi edge-compatible database
import { edgeDb, edgePool } from "./db-edge";

// File ini untuk kompatibilitas dengan edge browser
export default {
  providers: [
    // Provider untuk login dengan email dan password
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      // Fungsi untuk memvalidasi login dengan email dan password
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await database.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("User tidak ditemukan atau password salah!");
        }

        if (user && !user.emailVerified) {
          throw new Error("Verify your email first! Check your inbox.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return {
          ...user,
          role: user.role ?? "USER",
        };
      },
    }),

    // Provider untuk login dengan Google
    // Menggunakan SQL langsung untuk kompatibilitas dengan edge runtime
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      // Mengatur data profil dari Google
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
  callbacks: {
    async signIn({ user, account }) {
      // Menangani login dengan Google menggunakan SQL langsung
      if (account?.provider === "google") {
        try {
          // Cek apakah user sudah ada di database
          const result = await edgeDb`
            -- Cari user berdasarkan email
            SELECT * FROM users WHERE email = ${user.email}
          `;

          if (result.length === 0) {
            // Buat user baru jika belum ada
            await edgeDb`
              INSERT INTO users (
                id,
                email, 
                name, 
                role, 
                "emailVerified",
                image,
                created_at,
                updated_at
              )
              VALUES (
                gen_random_uuid(),
                ${user.email}, 
                ${user.name}, 
                'USER', 
                ${new Date().toISOString()}, 
                ${user.image},
                ${new Date().toISOString()},
                ${new Date().toISOString()}
              )
            `;
          }
          return true;
        } catch (error) {
          console.error("Error saat pembuatan user baru dengan Google:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Memperbarui token dengan informasi peran pengguna
      if (account?.provider === "google") {
        // Ambil data JWT untuk user Google
        const user = await edgeDb`
          -- Query untuk mendapatkan id dan role dari email
          SELECT id, role FROM users WHERE email = ${token.email}
        `;
        if (user[0]) {
          token.role = user[0].role;
          token.id = user[0].id;
        }
      } else if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Memperbarui sesi dengan data terbaru dari database
      if (session.user) {
        if (token.email) {
          // Ambil data sesi dari database
          const user = await edgeDb`
            -- Query untuk mendapatkan data lengkap user
            SELECT id, role, email, name, image
            FROM users
            WHERE email = ${token.email}
          `;

          if (!user[0]) {
            return { ...session, user: undefined };
          }

          session.user.id = user[0].id;
          session.user.role = user[0].role;
          session.user.email = user[0].email;
          session.user.name = user[0].name;
          session.user.image = user[0].image;
        }
      }
      return session;
    },
  },
  // Konfigurasi halaman dan sesi
  pages: {
    signIn: "/login", // Halaman login kustom
  },
  session: {
    strategy: "jwt", // Menggunakan JWT untuk menyimpan sesi
  },
} satisfies NextAuthConfig;
