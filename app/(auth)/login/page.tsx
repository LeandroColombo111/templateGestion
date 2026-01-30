import Link from "next/link";
import { LoginForm } from "../../../components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-400">
            Back to overview
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
