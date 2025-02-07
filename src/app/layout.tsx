import "./globals.css";
import Header from "@/src/components/layout/header";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { FooterComponent } from "@/components/footer-section";

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

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
