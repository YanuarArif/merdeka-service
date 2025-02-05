import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import NavbarPage from "./layout/navbarpage";
import { FooterComponent } from "@/components/footer-section";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Merdeka Service",
  description: "Service dan Jual Beli Komputer & Laptop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarPage />
          {children}
          <FooterComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}
