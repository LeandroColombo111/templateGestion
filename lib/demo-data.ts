import {
  evaluateLinks,
  extractUrls,
  scanEmail
} from "../services/scanner";
import {
  evaluateRules,
  type RuleDefinition,
  type Severity,
  type Verdict
} from "../services/rulesEngine";

export type DemoLink = {
  id: string;
  email_id: string;
  url: string;
  domain: string;
  is_suspicious: boolean;
  reason?: string | null;
};

export type DemoAttachment = {
  id: string;
  email_id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  is_dangerous: boolean;
  reason?: string | null;
};

export type DemoScanResult = {
  id: string;
  email_id: string;
  risk_score: number;
  verdict: Verdict;
  reasons_json: { code: string; message: string; weight: number }[];
  scanned_at: Date;
};

export type DemoAlert = {
  id: string;
  email_id: string;
  severity: Severity;
  title: string;
  message: string;
  status: "OPEN" | "ACK" | "RESOLVED";
  created_at: Date;
};

export type DemoEmail = {
  id: string;
  from_name: string;
  from_email: string;
  subject: string;
  date: Date;
  body_text: string;
  body_html?: string | null;
  headers_json: Record<string, string>;
  received_at: Date;
  links: DemoLink[];
  attachments: DemoAttachment[];
  scanResult: DemoScanResult;
};

const attachmentDangerousExt = [
  ".exe",
  ".js",
  ".vbs",
  ".scr",
  ".docm",
  ".xlsm"
];

const rawEmails = [
  {
    from_name: "Weekly Product Digest",
    from_email: "newsletter@newsletter.example",
    subject: "Your weekly security digest",
    date: "2026-01-26T08:12:00Z",
    body_text:
      "Hi team, here is the weekly digest. Read more at https://newsletter.example/issue/42",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Acme Bank Security",
    from_email: "security@acmeb4nk.com",
    subject: "Urgent: Verify your account immediately",
    date: "2026-01-25T14:22:00Z",
    body_text:
      "We detected unusual activity. Verify now: http://acmeb4nk.com/verify-login",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    from_name: "Accounts Payable",
    from_email: "billing@cloudblll.io",
    subject: "Invoice #43922 due today",
    date: "2026-01-24T10:45:00Z",
    body_text:
      "Please see attached invoice and pay at http://cloudblll.io/pay/43922",
    headers: { spf: "softfail", dkim: "fail", dmarc: "none" },
    attachments: [
      {
        filename: "Invoice_43922.docm",
        mime_type: "application/vnd.ms-word.document.macroEnabled.12",
        size_bytes: 225024
      }
    ]
  },
  {
    from_name: "CEO - GloboCorp",
    from_email: "ceo@globocorp-exec.com",
    subject: "Need a confidential wire transfer",
    date: "2026-01-23T17:12:00Z",
    body_text:
      "Can you initiate an urgent wire transfer today? Reply immediately.",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "IT Support",
    from_email: "support@northwind.dev",
    subject: "Password expires today - reset required",
    date: "2026-01-23T09:05:00Z",
    body_text:
      "Reset your password at https://northwind-security-reset.com/login",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "ShipFast",
    from_email: "notify@shipfast.io",
    subject: "Package delivery update",
    date: "2026-01-22T13:45:00Z",
    body_text:
      "Track your shipment here: https://bit.ly/shipfast-track",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "HR Updates",
    from_email: "hr@globocorp.com",
    subject: "Policy update: remote work guidelines",
    date: "2026-01-22T08:30:00Z",
    body_text:
      "Review the policy at https://globocorp.com/policies/remote-work",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Conference Team",
    from_email: "events@conference.example",
    subject: "Your registration is confirmed",
    date: "2026-01-21T18:02:00Z",
    body_text:
      "Thanks for registering. Agenda: https://conference.example/agenda",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "PayLoop Alerts",
    from_email: "alert@payl00p.com",
    subject: "Payment pending - action required",
    date: "2026-01-21T12:15:00Z",
    body_text:
      "Resolve your payment at https://payl00p.com/payments/resolve",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    from_name: "Vendor Portal",
    from_email: "vendors@globocorp.com",
    subject: "Updated vendor terms",
    date: "2026-01-20T16:20:00Z",
    body_text:
      "New terms: https://globocorp.com/vendors/terms",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Security Scanner",
    from_email: "scanner@secure-mailer.zip",
    subject: "Malware found in your mailbox",
    date: "2026-01-20T10:12:00Z",
    body_text:
      "Download report at http://secure-mailer.zip/report",
    headers: { spf: "none", dkim: "none", dmarc: "none" },
    attachments: [
      {
        filename: "report.exe",
        mime_type: "application/x-msdownload",
        size_bytes: 842112
      }
    ]
  },
  {
    from_name: "Acme Bank",
    from_email: "updates@acmebank.com",
    subject: "Monthly statement ready",
    date: "2026-01-19T09:40:00Z",
    body_text:
      "View statement at https://acmebank.com/statement/2026-01",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "GloboCorp IT",
    from_email: "it@globocorp.com",
    subject: "VPN maintenance notice",
    date: "2026-01-19T07:20:00Z",
    body_text:
      "Maintenance scheduled. Details: https://globocorp.com/it/vpn",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "CloudBill Billing",
    from_email: "billing@cloudbill.io",
    subject: "Your receipt for January",
    date: "2026-01-18T15:55:00Z",
    body_text:
      "Receipt: https://cloudbill.io/receipts/2026-01",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Support Desk",
    from_email: "support@help-center.work",
    subject: "Ticket escalation notice",
    date: "2026-01-18T11:35:00Z",
    body_text:
      "Your ticket was escalated. Review at https://help-center.work/tickets/219",
    headers: { spf: "softfail", dkim: "fail", dmarc: "fail" }
  },
  {
    from_name: "Payroll Team",
    from_email: "payroll@globocorp.com",
    subject: "Payroll schedule update",
    date: "2026-01-17T09:15:00Z",
    body_text:
      "Schedule details at https://globocorp.com/payroll/schedule",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Storage Notice",
    from_email: "alerts@cloud-storage.top",
    subject: "Storage quota exceeded",
    date: "2026-01-17T06:45:00Z",
    body_text:
      "Increase storage at http://cloud-storage.top/upgrade",
    headers: { spf: "fail", dkim: "none", dmarc: "fail" }
  },
  {
    from_name: "Marketing Ops",
    from_email: "marketing@newsletter.example",
    subject: "February campaign calendar",
    date: "2026-01-16T13:05:00Z",
    body_text:
      "Calendar: https://newsletter.example/calendar/feb",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Security Team",
    from_email: "security@globocorp.com",
    subject: "Phishing simulation results",
    date: "2026-01-16T10:10:00Z",
    body_text:
      "Results are posted at https://globocorp.com/security/sim-results",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Travel Desk",
    from_email: "travel@globocorp.com",
    subject: "Travel policy acknowledgment",
    date: "2026-01-15T18:30:00Z",
    body_text:
      "Review policy: https://globocorp.com/policies/travel",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Project Finance",
    from_email: "finance@globocorp.com",
    subject: "Q1 budget approval",
    date: "2026-01-15T08:40:00Z",
    body_text:
      "Budget docs: https://globocorp.com/finance/q1",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Talent Ops",
    from_email: "talent@globocorp.com",
    subject: "New hire onboarding checklist",
    date: "2026-01-14T14:55:00Z",
    body_text:
      "Checklist: https://globocorp.com/hr/onboarding",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "GloboCorp CEO",
    from_email: "ceo@glob0corp.com",
    subject: "Need gift cards ASAP",
    date: "2026-01-14T11:20:00Z",
    body_text:
      "Please purchase gift cards immediately and send codes.",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    from_name: "Ops Desk",
    from_email: "ops@shipfast.io",
    subject: "Supplier onboarding request",
    date: "2026-01-13T09:50:00Z",
    body_text:
      "Fill form at https://shipfast.io/forms/supplier",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Cloud Storage",
    from_email: "noreply@cloud-storage.top",
    subject: "Final notice: account suspension",
    date: "2026-01-13T07:05:00Z",
    body_text:
      "Final notice. Verify now: http://cloud-storage.top/suspend",
    headers: { spf: "fail", dkim: "fail", dmarc: "fail" }
  },
  {
    from_name: "Accounting",
    from_email: "accounting@globocorp.com",
    subject: "Updated W-9 request",
    date: "2026-01-12T12:15:00Z",
    body_text:
      "Please upload W-9 to https://globocorp.com/vendors/w9",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Benefits",
    from_email: "benefits@globocorp.com",
    subject: "Open enrollment reminder",
    date: "2026-01-11T16:25:00Z",
    body_text:
      "Complete enrollment at https://globocorp.com/hr/benefits",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  },
  {
    from_name: "Payroll Service",
    from_email: "notify@payroll-alerts.click",
    subject: "Direct deposit change requested",
    date: "2026-01-11T08:05:00Z",
    body_text:
      "Confirm deposit change at http://payroll-alerts.click/confirm",
    headers: { spf: "fail", dkim: "fail", dmarc: "none" }
  },
  {
    from_name: "Customer Success",
    from_email: "success@cloudbill.io",
    subject: "Account review follow-up",
    date: "2026-01-10T13:30:00Z",
    body_text:
      "Schedule review at https://cloudbill.io/bookings/review",
    headers: { spf: "pass", dkim: "pass", dmarc: "pass" }
  }
];

export const demoRules: RuleDefinition[] = [
  {
    id: "rule-1",
    name: "High risk auto-alert",
    enabled: true,
    severity: "HIGH",
    condition_json: {
      riskScoreGte: 70
    },
    action_json: {
      createAlert: {
        severity: "HIGH",
        title: "High-risk email detected",
        message: "Auto-escalated based on phishing score."
      }
    },
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "rule-2",
    name: "Shortened URL + urgent language",
    enabled: true,
    severity: "MED",
    condition_json: {
      hasShortenedUrl: true,
      urgentLanguage: true
    },
    action_json: {
      createAlert: {
        severity: "MED",
        title: "Urgent message with shortened URL",
        message: "Potential social engineering pattern detected."
      },
      verdictOverride: "SUSPICIOUS",
      addTag: "SOCIAL_ENGINEERING"
    },
    created_at: "2026-01-01T00:00:00Z"
  }
];

let alertCounter = 1;
let linkCounter = 1;
let attachmentCounter = 1;
let scanCounter = 1;

const alerts: DemoAlert[] = [];

export const demoEmails: DemoEmail[] = rawEmails.map((email, index) => {
  const emailId = `email-${String(index + 1).padStart(2, "0")}`;
  const date = new Date(email.date);

  const urlMatches = extractUrls(`${email.body_text} ${email.body_html ?? ""}`);
  const linkEval = evaluateLinks(urlMatches);

  const links: DemoLink[] = linkEval.links.map((link) => {
    const id = `link-${String(linkCounter++).padStart(3, "0")}`;
    return {
      id,
      email_id: emailId,
      url: link.url,
      domain: link.domain,
      is_suspicious: link.isSuspicious,
      reason: link.reason ?? null
    };
  });

  const attachments: DemoAttachment[] = (email.attachments ?? []).map(
    (attachment) => {
      const lowerName = attachment.filename.toLowerCase();
      const isDangerous = attachmentDangerousExt.some((ext) =>
        lowerName.endsWith(ext)
      );
      const id = `att-${String(attachmentCounter++).padStart(3, "0")}`;
      return {
        id,
        email_id: emailId,
        filename: attachment.filename,
        mime_type: attachment.mime_type,
        size_bytes: attachment.size_bytes,
        is_dangerous: isDangerous,
        reason: isDangerous ? "Executable or macro attachment" : null
      };
    }
  );

  const scan = scanEmail({
    fromName: email.from_name,
    fromEmail: email.from_email,
    subject: email.subject,
    bodyText: email.body_text,
    headers: email.headers,
    links: links.map((link) => ({
      url: link.url,
      domain: link.domain,
      is_suspicious: link.is_suspicious
    })),
    attachments: attachments.map((attachment) => ({
      filename: attachment.filename,
      mime_type: attachment.mime_type,
      size_bytes: attachment.size_bytes
    }))
  });

  let finalVerdict: Verdict = scan.verdict;

  const ruleContext = {
    subject: email.subject,
    fromDomain: email.from_email.split("@")[1]?.toLowerCase() || "",
    riskScore: scan.riskScore,
    hasShortenedUrl: scan.signals.hasShortenedUrl,
    hasExeAttachment: scan.signals.hasExeAttachment,
    urgentLanguage: scan.signals.urgentLanguage
  };

  const matched = evaluateRules(demoRules, ruleContext);

  for (const match of matched) {
    if (match.action.verdictOverride) {
      finalVerdict = match.action.verdictOverride;
    }
    if (match.action.addTag) {
      scan.reasons.push({
        code: "RULE_TAG",
        message: `Rule tag applied: ${match.action.addTag}`,
        weight: 0
      });
    }
    if (match.action.createAlert) {
      alerts.push({
        id: `alert-${String(alertCounter++).padStart(3, "0")}`,
        email_id: emailId,
        severity: match.action.createAlert.severity,
        title: match.action.createAlert.title,
        message: match.action.createAlert.message,
        status: "OPEN",
        created_at: date
      });
    }
  }

  if (finalVerdict === "DANGEROUS") {
    alerts.push({
      id: `alert-${String(alertCounter++).padStart(3, "0")}`,
      email_id: emailId,
      severity: "HIGH",
      title: "Dangerous email",
      message: "Auto-escalated based on score and signals.",
      status: "OPEN",
      created_at: date
    });
  }

  if (scan.signals.hasExeAttachment) {
    alerts.push({
      id: `alert-${String(alertCounter++).padStart(3, "0")}`,
      email_id: emailId,
      severity: "HIGH",
      title: "Executable attachment detected",
      message: "Attachment contains executable or macro content.",
      status: "OPEN",
      created_at: date
    });
  }

  const scanResult: DemoScanResult = {
    id: `scan-${String(scanCounter++).padStart(3, "0")}`,
    email_id: emailId,
    risk_score: scan.riskScore,
    verdict: finalVerdict,
    reasons_json: scan.reasons,
    scanned_at: date
  };

  return {
    id: emailId,
    from_name: email.from_name,
    from_email: email.from_email,
    subject: email.subject,
    date,
    body_text: email.body_text,
    body_html: email.body_html ?? null,
    headers_json: email.headers,
    received_at: date,
    links,
    attachments,
    scanResult
  };
});

export const demoAlerts: DemoAlert[] = alerts.sort(
  (a, b) => b.created_at.getTime() - a.created_at.getTime()
);

export function getEmailById(id: string) {
  return demoEmails.find((email) => email.id === id);
}

export function getTopDomains() {
  const domainCounts = new Map<string, number>();
  for (const email of demoEmails) {
    const domain = email.from_email.split("@")[1] ?? "unknown";
    domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
  }
  return Array.from(domainCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export function getKpis(alertsOverride?: DemoAlert[]) {
  const totalScanned = demoEmails.length;
  const suspiciousCount = demoEmails.filter(
    (email) => email.scanResult.verdict === "SUSPICIOUS"
  ).length;
  const dangerousCount = demoEmails.filter(
    (email) => email.scanResult.verdict === "DANGEROUS"
  ).length;
  const alertsList = alertsOverride ?? demoAlerts;
  const openAlerts = alertsList.filter((alert) => alert.status === "OPEN").length;

  const suspiciousRate = totalScanned
    ? Math.round((suspiciousCount / totalScanned) * 100)
    : 0;
  const dangerousRate = totalScanned
    ? Math.round((dangerousCount / totalScanned) * 100)
    : 0;

  return {
    totalScanned,
    suspiciousCount,
    dangerousCount,
    suspiciousRate,
    dangerousRate,
    openAlerts
  };
}
