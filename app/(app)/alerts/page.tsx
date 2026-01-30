"use client";

import { useMemo, useState } from "react";
import { AlertsTable } from "../../../components/alerts-table";
import { Card } from "../../../components/ui/card";
import { Select } from "../../../components/ui/select";
import { demoEmails } from "../../../lib/demo-data";
import { useDemoAlerts } from "../../../lib/demo-store";

export default function AlertsPage() {
  const { alerts, updateStatus } = useDemoAlerts();
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const emailMap = new Map(demoEmails.map((email) => [email.id, email]));

  const decorated = useMemo(() => {
    return alerts
      .map((alert) => ({
        ...alert,
        email: {
          subject: emailMap.get(alert.emailId)?.subject ?? "Unknown subject"
        }
      }))
      .filter((alert) => (status ? alert.status === status : true))
      .filter((alert) => (severity ? alert.severity === severity : true))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [alerts, emailMap, severity, status]);

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

      <Card className="border-slate-800 bg-slate-900/60 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Status
            </label>
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="ACK">Ack</option>
              <option value="RESOLVED">Resolved</option>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Severity
            </label>
            <Select value={severity} onChange={(event) => setSeverity(event.target.value)}>
              <option value="">All</option>
              <option value="LOW">Low</option>
              <option value="MED">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
        </div>
      </Card>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <AlertsTable alerts={decorated} onStatusChange={updateStatus} />
      </div>
    </div>
  );
}
