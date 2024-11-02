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
import { LoginFlow } from "./types";
import { useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineLock } from "react-icons/md";
import Image from "next/image";

interface LoginCardProps {
  setState: (state: LoginFlow) => void;
}

const LoginCard = ({ setState }: LoginCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <Card className="w-full h-full md:flex">
      <div className="md:w-1/2">
        <CardHeader className="flex items-center">
          <CardTitle>Selamat Datang</CardTitle>
          <CardDescription>
            Silahkan login untuk membuat pesanan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form>
            <div className="flex relative items-center">
              <VscAccount className="absolute left-3" />
              <Input
                required
                disabled={pending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username/Email"
                type="email"
                className="pl-10"
              />
            </div>
          </form>
          <form>
            <div className="flex relative items-center">
              <MdOutlineLock className="absolute left-3" />
              <Input
                required
                disabled={pending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="pl-10"
              />
            </div>
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
      </div>
      <div className="hidden md:block w-1/2 mx-3">
        <div className="flex flex-col h-full items-center justify-center space-y-5">
          <Image
            src="/images/merdeka-logo-cut.png"
            alt="merdeka-logo"
            width={500}
            height={500}
            priority
          />
          <p className="text-center text-sm italic">
            Merdeka menyediakan layanan service dan jual beli komputer.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LoginCard;
