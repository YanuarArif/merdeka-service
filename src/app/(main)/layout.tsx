import { FooterComponent } from "@/components/footer-section";
import Header from "@/components/header";

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
