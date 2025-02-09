import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { database } from "@/lib/database";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

const combinedProviders = [
  ...authConfig.providers,
  Resend({
    from: "updates.example.com",
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: combinedProviders,
  adapter: PrismaAdapter(database),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: { signIn: "/login" },
  // Callbacks untuk pengganti middleware
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isAuthRoute = [
        "/login",
        "/register",
        "/send-verification",
        "/verification-email",
      ].includes(pathname);
      const protectedRoutes = ["/dashboard", "/user"];

      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (!isLoggedIn && protectedRoutes.includes(pathname)) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        // session.user.id = token.id; // aku belum tahu masalahnya dimana, jadi sementara di komen(offkan) aja dulu dan masih aman tidak ada error
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.type !== "credentials") return true;

      const existingUser = await database.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
  },
});
