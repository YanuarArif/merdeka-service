"use client";

import { useState } from "react";
import LoginCard from "../components/login-card";
import { LoginFlow } from "../types/auth";
import DaftarCard from "../components/daftar-card";

const AuthScreen = () => {
  const [state, setState] = useState<LoginFlow>("masuk");

  return (
    <div className="h-full flex items-center justify-center bg-black/20">
      <div className="md:h-auto md:w-[700px] transition-all duration-500 ease-in-out sm:w-[300px]">
        {state === "masuk" ? <LoginCard /> : <DaftarCard />}
      </div>
    </div>
  );
};

export default AuthScreen;
