import "./globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/layout/providers";
import { auth } from "@/lib/auth";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Merdeka Service",
  description: "Service dan Jual Beli Komputer & Laptop",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.className}`}>
        <NuqsAdapter>
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
