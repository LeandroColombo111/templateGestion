"use client";

import { Badge } from "./ui/badge";
import { useVerdictOverrides } from "../lib/demo-store";
import type { Verdict } from "../types";

const verdictStyles: Record<Verdict, string> = {
  SAFE: "bg-emerald-500/20 text-emerald-200",
  SUSPICIOUS: "bg-amber-500/20 text-amber-200",
  DANGEROUS: "bg-rose-500/20 text-rose-200"
};

export function EmailVerdictPanel({
  emailId,
  baseVerdict,
  riskScore
}: {
  emailId: string;
  baseVerdict: Verdict;
  riskScore: number;
}) {
  const { overrides } = useVerdictOverrides();
  const effective = overrides[emailId] ?? baseVerdict;

  return (
    <div className="mt-3 flex items-center gap-3">
      <Badge className={verdictStyles[effective]}>{effective}</Badge>
      <p className="text-sm text-slate-400">Risk score: {riskScore}</p>
    </div>
  );
}
