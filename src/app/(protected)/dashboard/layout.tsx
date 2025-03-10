// src/components/layout/dashboard-layout.tsx
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
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"; // Default to true unless cookie is explicitly "false"

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen !== false}>
        {" "}
        {/* Default to true unless cookie says otherwise */}
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
