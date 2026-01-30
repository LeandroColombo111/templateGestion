"use client";

import { useRouter } from "next/navigation";
import { clearStoredUser } from "../lib/demo-auth";
import { Button } from "./ui/button";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="text-slate-200 hover:text-white"
      onClick={() => {
        clearStoredUser();
        router.replace("/login");
      }}
    >
      Sign out
    </Button>
  );
}
