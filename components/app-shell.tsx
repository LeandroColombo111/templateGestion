"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getStoredUser, type DemoUser } from "../lib/demo-auth";
import { SignOutButton } from "./sign-out-button";
import { Badge } from "./ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inbox", label: "Inbox" },
  { href: "/alerts", label: "Alerts" },
  { href: "/rules", label: "Rules" },
  { href: "/training", label: "Training" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-semibold">
              Anti-Phishing Lab
            </Link>
            <nav className="hidden gap-4 text-sm text-slate-300 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1 transition hover:bg-slate-800/60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-slate-800 text-slate-100">
              {user?.role ?? "guest"}
            </Badge>
            <SignOutButton onSignOut={() => setUser(null)} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
