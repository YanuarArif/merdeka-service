"use client";

import { Input } from "@/components/ui/input";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineLock } from "react-icons/md";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const LoginCard = () => {
  // fungsi untuk login via sosmed auth
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  // form schema from zod
  const formScrema = z.object({
    email: z.string().email({ message: "Email tidak valid" }),
    password: z
      .string()
      .min(1, { message: "Password wajib diisi" })
      .min(6, "Password minimal 6 karakter"),
  });
  const form = useForm<z.infer<typeof formScrema>>({
    resolver: zodResolver(formScrema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // fungsi untuk submit form
  async function onSubmit(values: z.infer<typeof formScrema>) {
    console.log(values);
  }

  if (!isLogin) return null;

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="relative overflow-visible">
                <FormField
                  disabled={isAuthenticating}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex relative items-center">
                          <VscAccount className="absolute left-3" />
                          <Input
                            className="pl-10"
                            placeholder="Email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-center top-10 font-bold text-xs bg-white" />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="relative">
                <FormField
                  disabled={isAuthenticating}
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex relative items-center">
                          <MdOutlineLock className="absolute left-3" />
                          <Input
                            className="pl-10"
                            placeholder="Password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-center font-bold text-xs bg-white" />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <Button
                type="submit"
                disabled={isAuthenticating}
                className="w-full"
              >
                <p>Masuk</p>
              </Button>
            </form>
          </Form>
          <div className="flex items-center">
            <div className="border-t mr-[10px] flex-1" />
            <p className="mx-2">atau login dengan</p>
            <div className="border-t ml-[10px] flex-1" />
          </div>
          <div className="flex flex-col space-y-3">
            <Button
              disabled={isAuthenticating}
              // onClick={() => socialAuth("google")}
              variant={"outline"}
              className=""
            >
              <FcGoogle />
              <p>Login dengan Google</p>
            </Button>
            <Button
              disabled={isAuthenticating}
              // onClick={() => socialAuth("facebook")}
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
              <span className="cursor-pointer text-blue-500 hover:underline">
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
