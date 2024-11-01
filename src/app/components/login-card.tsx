"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuthActions } from "@convex-dev/auth/react";
import { LoginFlow } from "./types";
import { useState } from "react";

interface LoginCardProps {
  setState: (state: LoginFlow) => void;
}

const LoginCard = ({ setState }: LoginCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const providerLogin = (value: "google" | "facebook") => {
    setPending(true);
    signIn(value);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Selamat Datang</CardTitle>
        <CardDescription>Silahkan login untuk membuat pesanan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form>
          <Input
            required
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username/Email"
            type="email"
          />
        </form>
        <form>
          <Input
            required
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
        </form>
        <Button type="submit" disabled={pending} className="w-full">
          Login
        </Button>
        <div className="flex items-center">
          <div className="border-t mr-[10px] flex-1" />
          <p>atau login dengan</p>
          <div className="border-t ml-[10px] flex-1" />
        </div>
        <div className="flex flex-col space-y-3">
          <Button
            disabled={pending}
            onClick={() => providerLogin("google")}
            variant={"outline"}
            className=""
          >
            <FcGoogle />
            <p>Login dengan Google</p>
          </Button>
          <Button
            disabled={pending}
            onClick={() => providerLogin("facebook")}
            variant={"outline"}
            className=""
          >
            <FaFacebookSquare className="text-blue-600" />
            <p>Login dengan Facebook</p>
          </Button>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            Belum punya akun?{" "}
            <span
              onClick={() => setState("daftar")}
              className="cursor-pointer text-blue-500 hover:underline"
            >
              Daftar
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
