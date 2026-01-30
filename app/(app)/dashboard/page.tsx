"use client";

import { StatsCard } from "../../../components/stats-card";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";
import { demoEmails, getKpis, getTopDomains } from "../../../lib/demo-data";
import { useDemoAlerts } from "../../../lib/demo-store";

export default function DashboardPage() {
  const { alerts } = useDemoAlerts();
  const kpis = getKpis(alerts);
  const topDomains = getTopDomains();
  const emailMap = new Map(demoEmails.map((email) => [email.id, email]));
  const recentAlerts = [...alerts]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Threat posture</h1>
        <p className="mt-2 text-sm text-slate-400">
          Demo workspace seeded with realistic email traffic.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total scanned" value={kpis.totalScanned} />
        <StatsCard
          label="Suspicious"
          value={`${kpis.suspiciousRate}%`}
          helper={`${kpis.suspiciousCount} messages`}
        />
        <StatsCard
          label="Dangerous"
          value={`${kpis.dangerousRate}%`}
          helper={`${kpis.dangerousCount} messages`}
        />
        <StatsCard label="Open alerts" value={kpis.openAlerts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Recent alerts</h2>
          <div className="mt-4 space-y-4">
            {recentAlerts.map((alert) => {
              const email = emailMap.get(alert.email_id);
              return (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-100">{alert.title}</p>
                    <Badge
                      className={
                        alert.severity === "HIGH"
                          ? "bg-rose-500/20 text-rose-200"
                          : alert.severity === "MED"
                            ? "bg-amber-500/20 text-amber-200"
                            : "bg-slate-700 text-slate-200"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{alert.message}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {email?.subject ?? "Unknown subject"} - {format(alert.created_at, "PPP")}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Top risky domains</h2>
          <p className="mt-2 text-sm text-slate-400">
            Based on sender volume in demo dataset.
          </p>
          <div className="mt-4 space-y-3">
            {topDomains.map(([domain, count]) => (
              <div
                key={domain}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
              >
                <span className="text-sm text-slate-100">{domain}</span>
                <Badge className="bg-slate-800 text-slate-200">
                  {count} emails
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
