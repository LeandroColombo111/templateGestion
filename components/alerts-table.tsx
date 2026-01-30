"use client";

import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";

export function AlertsTable({
  alerts,
  onStatusChange
}: {
  alerts: {
    id: string;
    title: string;
    message: string;
    severity: string;
    status: string;
    created_at: Date;
    email: { subject: string };
  }[];
  onStatusChange: (id: string, status: "OPEN" | "ACK" | "RESOLVED") => void;
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Alert</TableHeader>
          <TableHeader>Severity</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Created</TableHeader>
          <TableHeader>Action</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.id}>
            <TableCell>
              <p className="font-medium text-slate-100">{alert.title}</p>
              <p className="text-xs text-slate-400">{alert.email.subject}</p>
              <p className="text-xs text-slate-500">{alert.message}</p>
            </TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell>
              <Badge className="bg-slate-800 text-slate-200">
                {alert.status}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-slate-400">
              {format(alert.created_at, "PPP")}
            </TableCell>
            <TableCell>
              <select
                name="status"
                value={alert.status}
                onChange={(event) =>
                  onStatusChange(
                    alert.id,
                    event.target.value as "OPEN" | "ACK" | "RESOLVED"
                  )
                }
                className="h-9 rounded-lg border border-slate-700 bg-slate-950/60 px-2 text-xs text-slate-100"
              >
                <option value="OPEN">Open</option>
                <option value="ACK">Ack</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
