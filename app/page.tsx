"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "../lib/demo-auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    router.replace(user ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
      Redirecting to the dashboard...
    </div>
  );
}
