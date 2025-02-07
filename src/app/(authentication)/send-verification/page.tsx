import React from "react";
import SendVerificationEmail from "@/components/auth/send-verification";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SendVerificationPage = async () => {
  const session = await auth();
  const user = session?.user;
  if (user) redirect("/dashboard");
  console.log(session);

  return (
    <div>
      <SendVerificationEmail />
    </div>
  );
};

export default SendVerificationPage;
