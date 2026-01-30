"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";
import { SignOutButton } from "./sign-out-button";
import type { DemoUser } from "../types";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inbox", label: "Inbox" },
  { href: "/alerts", label: "Alerts" },
  { href: "/rules", label: "Rules" },
  { href: "/training", label: "Training" }
];

export function Sidebar({ user }: { user: DemoUser | null }) {
  return (
    <aside className="flex h-full w-full flex-col gap-6 border-r border-slate-800 bg-slate-950 px-6 py-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Anti-Phishing Lab
        </p>
        <h1 className="mt-2 text-xl font-semibold text-white">Threat Console</h1>
      </div>
      <nav className="flex flex-col gap-2 text-sm text-slate-300">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-3 py-2 transition hover:bg-slate-900/70"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Demo user
        </p>
        <p className="mt-2 text-sm text-slate-100">{user?.name ?? "Guest"}</p>
        <div className="mt-2 flex items-center justify-between">
          <Badge className="bg-slate-800 text-slate-100">
            {user?.role ?? "guest"}
          </Badge>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
