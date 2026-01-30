"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser } from "../lib/demo-auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (pathname.includes("/rules") && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
