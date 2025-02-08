import DashboardScreen from "@/components/layout/dashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const DashBoard = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/");

  return (
    <div className="h-full flex items-center justify-center">
      <DashboardScreen />
    </div>
  );
};

export default DashBoard;
