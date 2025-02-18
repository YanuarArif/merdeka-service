import Announcement from "@/components/announcement";
import { FooterComponent } from "@/components/footer-section";
import Header from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Announcement />
      <Header />
      <main>{children}</main>
      <FooterComponent />
    </>
  );
}
