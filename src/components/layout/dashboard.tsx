"use client";

import { logout } from "@/app/(main)/actions/logout";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const DashboardScreen = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>Dashboard</div>
      <Button disabled={isPending} onClick={handleLogout}>
        {isPending ? "Logging out..." : "Logout"}
      </Button>
      <Button onClick={() => router.push("/")}>Home</Button>
    </div>
  );
};

export default DashboardScreen;
