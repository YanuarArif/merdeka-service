import RootLayout from "@/app/layout";
import LoginCard from "@/components/auth/login-card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const LoginPage = async () => {
  const session = await auth();
  const user = session?.user;
  if (user) redirect("/dashboard");
  console.log(session);

  return (
    <div className="w-[350px] transition-all duration-500 ease-in-out md:w-[450px]">
      <LoginCard />
    </div>
  );
};

export default LoginPage;
