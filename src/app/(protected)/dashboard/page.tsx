import DashboardScreen from "@/components/layout/dashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="h-full flex items-center justify-center">
      <DashboardScreen />
    </div>
  );
}
