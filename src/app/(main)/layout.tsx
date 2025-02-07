import Header from "@/src/components/layout/header";
import { FooterComponent } from "@/components/footer-section";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <FooterComponent />
    </>
  );
}
