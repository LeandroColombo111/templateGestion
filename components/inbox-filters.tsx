"use client";

import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Button } from "./ui/button";

export type InboxFilterState = {
  verdict: string;
  domain: string;
  start: string;
  end: string;
};

export function InboxFilters({
  filters,
  onChange
}: {
  filters: InboxFilterState;
  onChange: (next: InboxFilterState) => void;
}) {
  return (
    <form
      className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="md:col-span-1">
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
      <div className="md:col-span-1">
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
      <div className="md:col-span-1">
        <label className="text-xs uppercase tracking-wide text-slate-400">
          Start date
        </label>
        <Input
          name="start"
          type="date"
          value={filters.start}
          onChange={(event) =>
            onChange({ ...filters, start: event.target.value })
          }
        />
      </div>
      <div className="md:col-span-1">
        <label className="text-xs uppercase tracking-wide text-slate-400">
          End date
        </label>
        <Input
          name="end"
          type="date"
          value={filters.end}
          onChange={(event) =>
            onChange({ ...filters, end: event.target.value })
          }
        />
      </div>
      <div className="flex items-end">
        <Button type="button" className="w-full" onClick={() => onChange({ ...filters })}
        >
          Apply filters
        </Button>
      </div>
    </form>
  );
}
