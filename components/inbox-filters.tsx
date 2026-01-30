"use client";

import { Input } from "./ui/input";
import { Select } from "./ui/select";

export type InboxFilterState = {
  verdict: string;
  domain: string;
  search: string;
};

export function InboxFilters({
  filters,
  onChange
}: {
  filters: InboxFilterState;
  onChange: (next: InboxFilterState) => void;
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-3">
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-400">
          Verdict
        </label>
        <Select
          name="verdict"
          value={filters.verdict}
          onChange={(event) =>
            onChange({ ...filters, verdict: event.target.value })
          }
        >
          <option value="">All</option>
          <option value="SAFE">Safe</option>
          <option value="SUSPICIOUS">Suspicious</option>
          <option value="DANGEROUS">Dangerous</option>
        </Select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-400">
          Sender domain
        </label>
        <Input
          name="domain"
          placeholder="acmebank.com"
          value={filters.domain}
          onChange={(event) =>
            onChange({ ...filters, domain: event.target.value })
          }
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-400">
          Search text
        </label>
        <Input
          name="search"
          placeholder="subject or sender"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
      </div>
    </div>
  );
}
