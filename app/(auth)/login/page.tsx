"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../../components/login-form";
import { getStoredUser } from "../../../lib/demo-auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-400">
            Back to dashboard
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
