"use client";

import { useRouter } from "next/navigation";
import { clearStoredUser } from "../lib/demo-auth";
import { Button } from "./ui/button";

export function SignOutButton({
  onSignOut
}: {
  onSignOut?: () => void;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="text-slate-200 hover:text-white"
      onClick={() => {
        clearStoredUser();
        onSignOut?.();
        router.replace("/");
      }}
    >
      Sign out
    </Button>
  );
}
