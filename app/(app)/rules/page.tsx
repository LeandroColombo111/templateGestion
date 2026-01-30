"use client";

import { RulesForm } from "../../../components/rules-form";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useDemoRules } from "../../../lib/demo-store";

export default function RulesPage() {
  const { rules, createRule, toggleRule, deleteRule, stats } = useDemoRules();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Admin rules
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Rule engine</h1>
        <p className="mt-2 text-sm text-slate-400">
          Compose conditional policies for triage and alerting.
        </p>
      </div>

      <RulesForm onCreate={createRule} />

      <Card className="border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Existing rules</h2>
          <Badge className="bg-slate-800 text-slate-200">
            {stats.enabled}/{stats.total} enabled
          </Badge>
        </div>
        <div className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Rule</TableHeader>
                <TableHeader>Severity</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <p className="font-medium text-slate-100">{rule.name}</p>
                    <p className="text-xs text-slate-500">
                      {JSON.stringify(rule.condition_json)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-slate-800 text-slate-200">
                      {rule.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        rule.enabled
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-slate-700 text-slate-200"
                      }
                    >
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => toggleRule(rule.id)}
                      >
                        {rule.enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={() => deleteRule(rule.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
