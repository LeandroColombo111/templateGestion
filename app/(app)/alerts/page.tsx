"use client";

import { AlertsTable } from "../../../components/alerts-table";
import { demoEmails } from "../../../lib/demo-data";
import { useDemoAlerts } from "../../../lib/demo-store";

export default function AlertsPage() {
  const { alerts, updateStatus } = useDemoAlerts();
  const emailMap = new Map(demoEmails.map((email) => [email.id, email]));
  const decorated = alerts
    .map((alert) => ({
      ...alert,
      email: {
        subject: emailMap.get(alert.email_id)?.subject ?? "Unknown subject"
      }
    }))
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Alerts
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Active escalations</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review and update incident status.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <AlertsTable alerts={decorated} onStatusChange={updateStatus} />
      </div>
    </div>
  );
}
