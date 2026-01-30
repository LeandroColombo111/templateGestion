"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getStoredUser } from "../lib/demo-auth";
import type { DemoUser } from "../types";
import { Sidebar } from "./sidebar";
import { useScanCache } from "../lib/demo-store";

export function AppShell({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  useScanCache();

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        <Sidebar user={user} />
        <main className="px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
