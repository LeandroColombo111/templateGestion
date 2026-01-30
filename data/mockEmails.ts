export type MockEmailInput = {
  fromName: string;
  fromEmail: string;
  subject: string;
  date: string;
  bodyText: string;
  headers: Record<string, string>;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }>;
};

export const mockEmails: MockEmailInput[] = [
  {
    fromName: "Weekly Product Digest",
    fromEmail: "newsletter@newsletter.example",
    subject: "Your weekly security digest",
    date: "2026-01-26T08:12:00Z",
    bodyText:
      "Hi team, here is the weekly digest. Read more at https://newsletter.example/issue/42",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Acme Bank Security",
    fromEmail: "security@acmeb4nk.com",
    subject: "Urgent: Verify your account immediately",
    date: "2026-01-25T14:22:00Z",
    bodyText:
      "We detected unusual activity. Verify now: http://acmeb4nk.com/verify-login",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    fromName: "Accounts Payable",
    fromEmail: "billing@cloudblll.io",
    subject: "Invoice #43922 due today",
    date: "2026-01-24T10:45:00Z",
    bodyText:
      "Please see attached invoice and pay at http://cloudblll.io/pay/43922",
    headers: { spf: "softfail", dkim: "fail", dmarc: "none" },
    attachments: [
      {
        filename: "Invoice_43922.docm",
        mimeType: "application/vnd.ms-word.document.macroEnabled.12",
        sizeBytes: 225024
      }
    ]
  },
  {
    fromName: "CEO - GloboCorp",
    fromEmail: "ceo@globocorp-exec.com",
    subject: "Need a confidential wire transfer",
    date: "2026-01-23T17:12:00Z",
    bodyText:
      "Can you initiate an urgent wire transfer today? Reply immediately.",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "IT Support",
    fromEmail: "support@northwind.dev",
    subject: "Password expires today - reset required",
    date: "2026-01-23T09:05:00Z",
    bodyText:
      "Reset your password at https://northwind-security-reset.com/login",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "ShipFast",
    fromEmail: "notify@shipfast.io",
    subject: "Package delivery update",
    date: "2026-01-22T13:45:00Z",
    bodyText:
      "Track your shipment here: https://bit.ly/shipfast-track",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "HR Updates",
    fromEmail: "hr@globocorp.com",
    subject: "Policy update: remote work guidelines",
    date: "2026-01-22T08:30:00Z",
    bodyText:
      "Review the policy at https://globocorp.com/policies/remote-work",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Conference Team",
    fromEmail: "events@conference.example",
    subject: "Your registration is confirmed",
    date: "2026-01-21T18:02:00Z",
    bodyText:
      "Thanks for registering. Agenda: https://conference.example/agenda",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "PayLoop Alerts",
    fromEmail: "alert@payl00p.com",
    subject: "Payment pending - action required",
    date: "2026-01-21T12:15:00Z",
    bodyText:
      "Resolve your payment at https://payl00p.com/payments/resolve",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    fromName: "Vendor Portal",
    fromEmail: "vendors@globocorp.com",
    subject: "Updated vendor terms",
    date: "2026-01-20T16:20:00Z",
    bodyText:
      "New terms: https://globocorp.com/vendors/terms",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Security Scanner",
    fromEmail: "scanner@secure-mailer.zip",
    subject: "Malware found in your mailbox",
    date: "2026-01-20T10:12:00Z",
    bodyText:
      "Download report at http://secure-mailer.zip/report",
    headers: { spf: "none", dkim: "none", dmarc: "none" },
    attachments: [
      {
        filename: "report.exe",
        mimeType: "application/x-msdownload",
        sizeBytes: 842112
      }
    ]
  },
  {
    fromName: "Acme Bank",
    fromEmail: "updates@acmebank.com",
    subject: "Monthly statement ready",
    date: "2026-01-19T09:40:00Z",
    bodyText:
      "View statement at https://acmebank.com/statement/2026-01",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "GloboCorp IT",
    fromEmail: "it@globocorp.com",
    subject: "VPN maintenance notice",
    date: "2026-01-19T07:20:00Z",
    bodyText:
      "Maintenance scheduled. Details: https://globocorp.com/it/vpn",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "CloudBill Billing",
    fromEmail: "billing@cloudbill.io",
    subject: "Your receipt for January",
    date: "2026-01-18T15:55:00Z",
    bodyText:
      "Receipt: https://cloudbill.io/receipts/2026-01",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Support Desk",
    fromEmail: "support@help-center.work",
    subject: "Ticket escalation notice",
    date: "2026-01-18T11:35:00Z",
    bodyText:
      "Your ticket was escalated. Review at https://help-center.work/tickets/219",
    headers: { spf: "softfail", dkim: "fail", dmarc: "fail" }
  },
  {
    fromName: "Payroll Team",
    fromEmail: "payroll@globocorp.com",
    subject: "Payroll schedule update",
    date: "2026-01-17T09:15:00Z",
    bodyText:
      "Schedule details at https://globocorp.com/payroll/schedule",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Storage Notice",
    fromEmail: "alerts@cloud-storage.top",
    subject: "Storage quota exceeded",
    date: "2026-01-17T06:45:00Z",
    bodyText:
      "Increase storage at http://cloud-storage.top/upgrade",
    headers: { spf: "fail", dkim: "none", dmarc: "fail" }
  },
  {
    fromName: "Marketing Ops",
    fromEmail: "marketing@newsletter.example",
    subject: "February campaign calendar",
    date: "2026-01-16T13:05:00Z",
    bodyText:
      "Calendar: https://newsletter.example/calendar/feb",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Security Team",
    fromEmail: "security@globocorp.com",
    subject: "Phishing simulation results",
    date: "2026-01-16T10:10:00Z",
    bodyText:
      "Results are posted at https://globocorp.com/security/sim-results",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Travel Desk",
    fromEmail: "travel@globocorp.com",
    subject: "Travel policy acknowledgment",
    date: "2026-01-15T18:30:00Z",
    bodyText:
      "Review policy: https://globocorp.com/policies/travel",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Project Finance",
    fromEmail: "finance@globocorp.com",
    subject: "Q1 budget approval",
    date: "2026-01-15T08:40:00Z",
    bodyText:
      "Budget docs: https://globocorp.com/finance/q1",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Talent Ops",
    fromEmail: "talent@globocorp.com",
    subject: "New hire onboarding checklist",
    date: "2026-01-14T14:55:00Z",
    bodyText:
      "Checklist: https://globocorp.com/hr/onboarding",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "GloboCorp CEO",
    fromEmail: "ceo@glob0corp.com",
    subject: "Need gift cards ASAP",
    date: "2026-01-14T11:20:00Z",
    bodyText:
      "Please purchase gift cards immediately and send codes.",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    fromName: "Ops Desk",
    fromEmail: "ops@shipfast.io",
    subject: "Supplier onboarding request",
    date: "2026-01-13T09:50:00Z",
    bodyText:
      "Fill form at https://shipfast.io/forms/supplier",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Cloud Storage",
    fromEmail: "noreply@cloud-storage.top",
    subject: "Final notice: account suspension",
    date: "2026-01-13T07:05:00Z",
    bodyText:
      "Final notice. Verify now: http://cloud-storage.top/suspend",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    fromName: "Accounting",
    fromEmail: "accounting@globocorp.com",
    subject: "Updated W-9 request",
    date: "2026-01-12T12:15:00Z",
    bodyText:
      "Please upload W-9 to https://globocorp.com/vendors/w9",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Benefits",
    fromEmail: "benefits@globocorp.com",
    subject: "Open enrollment reminder",
    date: "2026-01-11T16:25:00Z",
    bodyText:
      "Complete enrollment at https://globocorp.com/hr/benefits",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    fromName: "Payroll Service",
    fromEmail: "notify@payroll-alerts.click",
    subject: "Direct deposit change requested",
    date: "2026-01-11T08:05:00Z",
    bodyText:
      "Confirm deposit change at http://payroll-alerts.click/confirm",
    headers: { spf: "fail", dkim: "fail", dmarc: "none" }
  },
  {
    fromName: "Customer Success",
    fromEmail: "success@cloudbill.io",
    subject: "Account review follow-up",
    date: "2026-01-10T13:30:00Z",
    bodyText:
      "Schedule review at https://cloudbill.io/bookings/review",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  }
];
