"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";

export function EmailTable({
  emails
}: {
  emails: {
    id: string;
    from_name: string;
    from_email: string;
    subject: string;
    date: Date;
    scanResult?: { verdict: string; risk_score: number } | null;
  }[];
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Sender</TableHeader>
          <TableHeader>Subject</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Verdict</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {emails.map((email) => (
          <TableRow key={email.id}>
            <TableCell>
              <p className="font-medium text-slate-100">{email.from_name}</p>
              <p className="text-xs text-slate-400">{email.from_email}</p>
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
            <TableCell>
              <Badge
                className={
                  email.scanResult?.verdict === "DANGEROUS"
                    ? "bg-rose-500/20 text-rose-200"
                    : email.scanResult?.verdict === "SUSPICIOUS"
                      ? "bg-amber-500/20 text-amber-200"
                      : "bg-emerald-500/20 text-emerald-200"
                }
              >
                {email.scanResult?.verdict ?? "UNKNOWN"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

