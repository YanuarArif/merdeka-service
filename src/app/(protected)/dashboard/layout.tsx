import KBar from "@/components/kbar";
import AppSidebar from "@/components/layout/app-sidebar";
import DashboardHeader from "@/components/layout/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <NextTopLoader showSpinner={false} />
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
