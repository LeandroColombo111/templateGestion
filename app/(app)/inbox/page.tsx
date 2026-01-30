"use client";

import { useMemo, useState } from "react";
import { InboxFilters, type InboxFilterState } from "../../../components/inbox-filters";
import { EmailTable } from "../../../components/email-table";
import { demoEmails } from "../../../lib/demo-data";

const initialFilters: InboxFilterState = {
  verdict: "",
  domain: "",
  start: "",
  end: ""
};

export default function InboxPage() {
  const [filters, setFilters] = useState<InboxFilterState>(initialFilters);

  const filtered = useMemo(() => {
    const results = demoEmails.filter((email) => {
      if (filters.verdict && email.scanResult.verdict !== filters.verdict) {
        return false;
      }
      if (filters.domain) {
        const domain = email.from_email.split("@")[1] ?? "";
        if (!domain.includes(filters.domain.toLowerCase())) return false;
      }
      if (filters.start) {
        if (email.date < new Date(filters.start)) return false;
      }
      if (filters.end) {
        if (email.date > new Date(filters.end)) return false;
      }
      return true;
    });
    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Inbox
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Email triage</h1>
        <p className="mt-2 text-sm text-slate-400">
          Filter by verdict, sender domain, or date range.
        </p>
      </div>

      <InboxFilters filters={filters} onChange={setFilters} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <EmailTable emails={filtered} />
      </div>
    </div>
  );
}
