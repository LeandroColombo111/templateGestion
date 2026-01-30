"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authenticate, storeUser } from "../lib/demo-auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("admin@demo.local");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const user = authenticate(email, password);
    if (!user) {
      setError("Invalid credentials. Try admin@demo.local / demo1234.");
      setLoading(false);
      return;
    }

    storeUser(user);
    router.replace("/dashboard");
  }

  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/70">
      <div className="space-y-6 p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-mint-400">
            Demo Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-slate-300">
            Use seeded demo users. No external auth needed.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm text-rose-400">{error}</p>
          ) : null}
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Enter workspace"}
          </Button>
        </form>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="font-medium text-slate-200">Demo users</p>
          <p>Admin: admin@demo.local / demo1234</p>
          <p>Analyst: analyst@demo.local / demo1234</p>
        </div>
      </div>
    </Card>
  );
}
