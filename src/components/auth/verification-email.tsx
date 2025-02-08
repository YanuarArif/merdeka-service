"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCheck, FiX, FiLoader, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateToken } from "@/app/actions/verify-token";

export default function VerificationEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token || !email) {
          throw new Error("Token atau email tidak valid");
        }

        const result = await validateToken(email, token);

        if (result?.success) {
          setStatus("success");
          toast({
            title: "Verifikasi Berhasil",
            description: "Email Anda telah terverifikasi",
          });
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Gagal memverifikasi email"
        );
        toast({
          title: "Verifikasi Gagal",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    verifyEmail();
  }, [token, email, toast, errorMessage]);

  return (
    <div className="flex min-h-[600px] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            {status === "loading" && (
              <FiLoader className="h-6 w-6 text-blue-600 animate-spin" />
            )}
            {status === "success" && (
              <FiCheck className="h-6 w-6 text-green-600" />
            )}
            {status === "error" && <FiX className="h-6 w-6 text-red-600" />}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {status === "loading" && "Memverifikasi Email..."}
              {status === "success" && "Verifikasi Berhasil!"}
              {status === "error" && "Verifikasi Gagal"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {status === "loading" && "Sedang memproses verifikasi..."}
              {status === "success" && (
                <>
                  {"Email Anda telah berhasil diverifikasi"}
                  <br />{" "}
                  {/* Optional: Add a line break for visual separation */}
                  {"Silahkan login..."}
                </>
              )}
              {status === "error" && errorMessage}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {email && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm font-medium">{email}</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center text-sm text-red-600">
              <p>Silakan coba lagi atau hubungi dukungan teknis</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/login">
              <FiArrowLeft className="h-4 w-4" />
              Kembali ke Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
