import VerificationEmail from "@/components/auth/verification-email";
import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const VerificationPage = async () => {
  const session = await auth();
  const user = session?.user;
  if (user) redirect("/dashboard");
  console.log(session);

  return (
    <div className="flex items-center justify-center">
      <VerificationEmail />
    </div>
  );
};

export default VerificationPage;
