"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiMail, FiClock, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { resendToken } from "@/app/(main)/actions/resend-token";

export default function SendVerificationEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (email) {
      setCountdown(30);
    }
  }, [email]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((current) => (current > 0 ? current - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const onResendEmail = useCallback(async () => {
    if (!email || isResending) return;

    try {
      setIsResending(true);
      const resendingToken = await resendToken(email);

      if (resendingToken?.success) {
        setCountdown(30);
        toast({
          title: "Email verifikasi terkirim",
          description: "Silakan cek inbox email Anda",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim ulang email verifikasi",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  }, [email, toast, isResending]);

  return (
    <div className="flex min-h-[600px] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <FiMail className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Pendaftaran Berhasil!
            </h1>
            <p className="text-muted-foreground text-sm">
              Silakan cek email Anda untuk verifikasi akun
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {email && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm font-medium">{email}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground text-center">
            <p>
              Tidak menerima email? Periksa folder spam atau klik tombol di
              bawah untuk kirim ulang.
            </p>
          </div>

          <Button
            onClick={onResendEmail}
            disabled={countdown > 0 || isResending}
            className="w-full gap-2"
            variant="outline"
          >
            {countdown > 0 ? (
              <>
                <FiClock className="h-4 w-4" />
                Kirim ulang dalam {countdown}s
              </>
            ) : (
              "Kirim ulang email verifikasi"
            )}
          </Button>
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
