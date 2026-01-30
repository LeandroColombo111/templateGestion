"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "../lib/demo-auth";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-grid">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-10 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-mint-400">
              Anti-Phishing Lab
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Triage email threats with explainable signals, not credentials.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              A production-ready demo SaaS for analyzing inboxes, highlighting phishing
              heuristics, and routing risky messages into alerts. Runs fully in demo
              mode with seeded data.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/login">Launch demo workspace</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/training">Start training module</Link>
              </Button>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Rule-based scans",
                copy: "Composable heuristics score every email with transparent reasons."
              },
              {
                title: "Signals dashboard",
                copy: "Track verdicts, risky domains, and live alert queues."
              },
              {
                title: "Safe demo auth",
                copy: "Credentials are seeded locally. No external tokens required."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
