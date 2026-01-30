"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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
    createdAt: Date;
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
          <TableHeader>Actions</TableHeader>
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
              {format(alert.createdAt, "PPP")}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => onStatusChange(alert.id, "ACK")}
                >
                  Ack
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() => onStatusChange(alert.id, "RESOLVED")}
                >
                  Resolve
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
