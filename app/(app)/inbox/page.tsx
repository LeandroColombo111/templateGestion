"use client";

import { useMemo, useState } from "react";
import { InboxFilters, type InboxFilterState } from "../../../components/inbox-filters";
import { EmailTable } from "../../../components/email-table";
import { demoEmails } from "../../../lib/demo-data";
import { useVerdictOverrides } from "../../../lib/demo-store";

const initialFilters: InboxFilterState = {
  verdict: "",
  domain: "",
  search: ""
};

export default function InboxPage() {
  const [filters, setFilters] = useState<InboxFilterState>(initialFilters);
  const { overrides } = useVerdictOverrides();

  const filtered = useMemo(() => {
    const results = demoEmails.filter((email) => {
      const effectiveVerdict = overrides[email.id] ?? email.scanResult.verdict;
      if (filters.verdict && effectiveVerdict !== filters.verdict) {
        return false;
      }
      if (filters.domain) {
        const domain = (email.fromEmail.split("@")[1] ?? "").toLowerCase();
        if (!domain.includes(filters.domain.toLowerCase())) return false;
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const haystack = `${email.fromName} ${email.fromEmail} ${email.subject}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
    return results
      .map((email) => ({
        ...email,
        effectiveVerdict: overrides[email.id] ?? email.scanResult.verdict
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filters, overrides]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Inbox
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Email triage</h1>
        <p className="mt-2 text-sm text-slate-400">
          Filter by verdict, sender domain, or search text.
        </p>
      </div>

      <InboxFilters filters={filters} onChange={setFilters} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <EmailTable emails={filtered} />
      </div>
    </div>
  );
}
