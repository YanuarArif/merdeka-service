"use client";

import { useState } from "react";
import LoginCard from "../components/login-card";
import { LoginFlow } from "../components/types";
import DaftarCard from "../components/daftar-card";

const AuthScreen = () => {
  const [state, setState] = useState<LoginFlow>("masuk");

  return (
    <div className="h-full flex items-center justify-center">
      <div className="md:h-auto md:w-[450px]">
        {state === "masuk" ? (
          <LoginCard setState={setState} />
        ) : (
          <DaftarCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
