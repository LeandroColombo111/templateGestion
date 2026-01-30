"use client";

import Link from "next/link";
import { StatsCard } from "../../../components/stats-card";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";
import {
  demoEmails,
  getHighRiskEmails,
  getKpis,
  getRiskDistribution,
  getTopDomains
} from "../../../lib/demo-data";
import { useDemoAlerts, useVerdictOverrides } from "../../../lib/demo-store";

const bucketLabels = ["0-19", "20-39", "40-59", "60-79", "80-100"];

export default function DashboardPage() {
  const { alerts } = useDemoAlerts();
  const { overrides } = useVerdictOverrides();
  const kpis = getKpis(alerts);
  const topDomains = getTopDomains();
  const distribution = getRiskDistribution();
  const highRisk = getHighRiskEmails();
  const emailMap = new Map(demoEmails.map((email) => [email.id, email]));
  const recentAlerts = [...alerts]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Risk score distribution</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sampled across the demo inbox.
          </p>
          <div className="mt-6 grid grid-cols-5 gap-3">
            {distribution.map((count, index) => (
              <div key={bucketLabels[index]} className="flex flex-col items-center gap-2">
                <div className="flex h-28 w-full items-end rounded-xl bg-slate-950/60 p-2">
                  <div
                    className="w-full rounded-lg bg-mint-400"
                    style={{ height: `${Math.min(100, count * 18 + 8)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">{bucketLabels[index]}</p>
                <Badge className="bg-slate-800 text-slate-200">{count}</Badge>
              </div>
            ))}
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

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Recent alerts</h2>
          <div className="mt-4 space-y-4">
            {recentAlerts.map((alert) => {
              const email = emailMap.get(alert.emailId);
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
                    {email?.subject ?? "Unknown subject"} - {format(alert.createdAt, "PPP")}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Recent high-risk emails</h2>
          <div className="mt-4 space-y-3">
            {highRisk.map((email) => {
              const effectiveVerdict = overrides[email.id] ?? email.scanResult.verdict;
              return (
                <Link
                  key={email.id}
                  href={`/inbox/${email.id}`}
                  className="block rounded-xl border border-slate-800 bg-slate-950/50 p-3 transition hover:border-mint-400/60"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-100">
                      {email.subject}
                    </p>
                    <Badge
                      className={
                        effectiveVerdict === "DANGEROUS"
                          ? "bg-rose-500/20 text-rose-200"
                          : "bg-amber-500/20 text-amber-200"
                      }
                    >
                      {effectiveVerdict}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {email.fromName} - {email.fromEmail}
                  </p>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
