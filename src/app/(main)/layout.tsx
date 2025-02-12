import { FooterComponent } from "@/components/footer-section";
import HeaderUi from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderUi />
      <main>{children}</main>
      <FooterComponent />
    </>
  );
}
