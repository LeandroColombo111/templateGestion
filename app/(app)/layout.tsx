import { AppShell } from "../../components/app-shell";
import { AuthGuard } from "../../components/auth-guard";
import type { ReactNode } from "react";

export default function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
