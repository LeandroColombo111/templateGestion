"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import type { EmailMessage, Verdict } from "../types";

const verdictStyles: Record<Verdict, string> = {
  SAFE: "bg-emerald-500/20 text-emerald-200",
  SUSPICIOUS: "bg-amber-500/20 text-amber-200",
  DANGEROUS: "bg-rose-500/20 text-rose-200"
};

export function EmailTable({
  emails
}: {
  emails: Array<EmailMessage & { effectiveVerdict: Verdict }>;
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Verdict</TableHeader>
          <TableHeader>Risk</TableHeader>
          <TableHeader>From</TableHeader>
          <TableHeader>Subject</TableHeader>
          <TableHeader>Date</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {emails.map((email) => (
          <TableRow key={email.id}>
            <TableCell>
              <Badge className={verdictStyles[email.effectiveVerdict]}>
                {email.effectiveVerdict}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-slate-300">
              {email.scanResult.riskScore}
            </TableCell>
            <TableCell>
              <p className="font-medium text-slate-100">{email.fromName}</p>
              <p className="text-xs text-slate-400">{email.fromEmail}</p>
            </TableCell>
            <TableCell>
              <Link
                className="text-sm text-mint-400 hover:underline"
                href={`/inbox/${email.id}`}
              >
                {email.subject}
              </Link>
            </TableCell>
            <TableCell className="text-sm text-slate-300">
              {format(email.date, "PPP")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
