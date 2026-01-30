"use client";

import { useState, type FormEvent } from "react";
import { ruleSchema, type RuleFormInput } from "../lib/validators";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";
import type { RuleDefinition } from "../types";

const initialState: RuleFormInput = {
  name: "",
  enabled: true,
  severity: "MED",
  actionCreateAlert: true
};

export function RulesForm({
  onCreate
}: {
  onCreate: (rule: RuleDefinition) => void;
}) {
  const [form, setForm] = useState<RuleFormInput>(initialState);
  const [error, setError] = useState<string | null>(null);

  function handleChange<K extends keyof RuleFormInput>(
    key: K,
    value: RuleFormInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = ruleSchema.safeParse(form);
    if (!parsed.success) {
      setError("Please fill the required rule fields.");
      return;
    }

    const condition = {
      subjectContains: parsed.data.subjectContains || undefined,
      fromDomainEquals: parsed.data.fromDomainEquals
        ? parsed.data.fromDomainEquals.toLowerCase()
        : undefined,
      riskScoreGte: parsed.data.riskScoreGte,
      hasShortenedUrl: parsed.data.hasShortenedUrl ?? undefined,
      hasExeAttachment: parsed.data.hasExeAttachment ?? undefined,
      urgentLanguage: parsed.data.urgentLanguage ?? undefined
    };

    const action = {
      createAlert: parsed.data.actionCreateAlert
        ? {
            severity: parsed.data.severity,
            title: `Rule: ${parsed.data.name}`,
            message: "Triggered by custom rule conditions."
          }
        : undefined,
      verdictOverride: parsed.data.actionVerdictOverride
    };

    onCreate({
      id: `rule-${Date.now()}`,
      name: parsed.data.name,
      enabled: parsed.data.enabled,
      severity: parsed.data.severity,
      condition,
      action,
      createdAt: new Date().toISOString()
    });

    setForm(initialState);
    setError(null);
  }

  return (
    <Card className="border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold">Create rule</h2>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">
            Rule name
          </label>
          <Input
            name="name"
            placeholder="Shortened URL escalation"
            value={form.name ?? ""}
            onChange={(event) => handleChange("name", event.target.value)}
            required
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Subject contains
            </label>
            <Input
              name="subjectContains"
              placeholder="invoice"
              value={form.subjectContains ?? ""}
              onChange={(event) =>
                handleChange("subjectContains", event.target.value)
              }
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              From domain equals
            </label>
            <Input
              name="fromDomainEquals"
              placeholder="acmebank.com"
              value={form.fromDomainEquals ?? ""}
              onChange={(event) =>
                handleChange("fromDomainEquals", event.target.value)
              }
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Risk score {">="}
            </label>
            <Input
              name="riskScoreGte"
              type="number"
              min={0}
              max={100}
              value={form.riskScoreGte ?? ""}
              onChange={(event) =>
                handleChange(
                  "riskScoreGte",
                  event.target.value ? Number(event.target.value) : undefined
                )
              }
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Severity
            </label>
            <Select
              name="severity"
              value={form.severity}
              onChange={(event) =>
                handleChange("severity", event.target.value as RuleFormInput["severity"])
              }
            >
              <option value="LOW">Low</option>
              <option value="MED">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <Checkbox
              checked={Boolean(form.hasShortenedUrl)}
              onChange={(event) =>
                handleChange("hasShortenedUrl", event.currentTarget.checked)
              }
            />
            Has shortened URL
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <Checkbox
              checked={Boolean(form.hasExeAttachment)}
              onChange={(event) =>
                handleChange("hasExeAttachment", event.currentTarget.checked)
              }
            />
            Has executable attachment
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <Checkbox
              checked={Boolean(form.urgentLanguage)}
              onChange={(event) =>
                handleChange("urgentLanguage", event.currentTarget.checked)
              }
            />
            Urgent language
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <Checkbox
              checked={Boolean(form.actionCreateAlert ?? true)}
              onChange={(event) =>
                handleChange("actionCreateAlert", event.currentTarget.checked)
              }
            />
            Create alert
          </label>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Verdict override
            </label>
            <Select
              name="actionVerdictOverride"
              value={form.actionVerdictOverride ?? ""}
              onChange={(event) =>
                handleChange(
                  "actionVerdictOverride",
                  event.target.value as RuleFormInput["actionVerdictOverride"]
                )
              }
            >
              <option value="">None</option>
              <option value="SAFE">Safe</option>
              <option value="SUSPICIOUS">Suspicious</option>
              <option value="DANGEROUS">Dangerous</option>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Save rule</Button>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <Checkbox
              checked={Boolean(form.enabled)}
              onChange={(event) => handleChange("enabled", event.currentTarget.checked)}
            />
            Enabled
          </label>
          {error ? <span className="text-xs text-rose-400">{error}</span> : null}
        </div>
      </form>
    </Card>
  );
}
