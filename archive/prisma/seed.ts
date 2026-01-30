import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";
import { evaluateLinks, extractUrls, scanEmail } from "../services/scanner";
import { evaluateRules } from "../services/rulesEngine";
import type { Severity, Verdict } from "@prisma/client";

const demoPassword = "demo1234";

const attachmentDangerousExt = [".exe", ".js", ".vbs", ".scr", ".docm", ".xlsm"];

const demoEmails = [
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

async function main() {
  await prisma.alert.deleteMany();
  await prisma.scanResult.deleteMany();
  await prisma.link.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.emailMessage.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Demo Admin",
        email: "admin@demo.local",
        password_hash: passwordHash,
        role: "ADMIN"
      },
      {
        name: "Demo Analyst",
        email: "analyst@demo.local",
        password_hash: passwordHash,
        role: "ANALYST"
      }
    ]
  });

  await prisma.rule.createMany({
    data: [
      {
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
        }
      },
      {
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
        }
      }
    ]
  });

  const rules = await prisma.rule.findMany();

  for (const email of demoEmails) {
    const bodyText = email.body_text;
    const bodyHtml = email.body_html ?? null;

    const urlMatches = extractUrls(`${bodyText} ${bodyHtml ?? ""}`);
    const linkEval = evaluateLinks(urlMatches);

    const createdEmail = await prisma.emailMessage.create({
      data: {
        from_name: email.from_name,
        from_email: email.from_email,
        subject: email.subject,
        date: new Date(email.date),
        body_text: bodyText,
        body_html: bodyHtml,
        headers_json: email.headers,
        received_at: new Date(email.date)
      }
    });

    if (linkEval.links.length) {
      await prisma.link.createMany({
        data: linkEval.links.map((link) => ({
          email_id: createdEmail.id,
          url: link.url,
          domain: link.domain,
          is_suspicious: link.isSuspicious,
          reason: link.reason
        }))
      });
    }

    const attachments = (email.attachments ?? []).map((attachment) => {
      const lowerName = attachment.filename.toLowerCase();
      const isDangerous = attachmentDangerousExt.some((ext) =>
        lowerName.endsWith(ext)
      );
      return {
        ...attachment,
        is_dangerous: isDangerous,
        reason: isDangerous ? "Executable or macro attachment" : null
      };
    });

    if (attachments.length) {
      await prisma.attachment.createMany({
        data: attachments.map((attachment) => ({
          email_id: createdEmail.id,
          filename: attachment.filename,
          mime_type: attachment.mime_type,
          size_bytes: attachment.size_bytes,
          is_dangerous: attachment.is_dangerous,
          reason: attachment.reason
        }))
      });
    }

    const scan = scanEmail({
      fromName: createdEmail.from_name,
      fromEmail: createdEmail.from_email,
      subject: createdEmail.subject,
      bodyText: createdEmail.body_text,
      headers: email.headers,
      links: linkEval.links.map((link) => ({
        url: link.url,
        domain: link.domain,
        is_suspicious: link.isSuspicious
      })),
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        mime_type: attachment.mime_type,
        size_bytes: attachment.size_bytes
      }))
    });

    const ruleContext = {
      subject: createdEmail.subject,
      fromDomain:
        createdEmail.from_email.split("@")[1]?.toLowerCase() || "",
      riskScore: scan.riskScore,
      hasShortenedUrl: scan.signals.hasShortenedUrl,
      hasExeAttachment: scan.signals.hasExeAttachment,
      urgentLanguage: scan.signals.urgentLanguage
    };

    const matched = evaluateRules(rules, ruleContext);
    let finalVerdict = scan.verdict as Verdict;
    const alertQueue: { severity: Severity; title: string; message: string }[] = [];

    for (const match of matched) {
      const action = match.action;
      if (action.verdictOverride) {
        finalVerdict = action.verdictOverride;
      }
      if (action.addTag) {
        scan.reasons.push({
          code: "RULE_TAG",
          message: `Rule tag applied: ${action.addTag}`,
          weight: 0
        });
      }
      if (action.createAlert) {
        alertQueue.push(action.createAlert);
      }
    }

    if (finalVerdict === "DANGEROUS") {
      alertQueue.push({
        severity: "HIGH",
        title: "Dangerous email",
        message: "Auto-escalated based on score and signals."
      });
    }

    const scanResult = await prisma.scanResult.create({
      data: {
        email_id: createdEmail.id,
        risk_score: scan.riskScore,
        verdict: finalVerdict,
        reasons_json: scan.reasons
      }
    });

    if (alertQueue.length) {
      await prisma.alert.createMany({
        data: alertQueue.map((alert) => ({
          email_id: createdEmail.id,
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          status: "OPEN"
        }))
      });
    }

    if (scanResult && scan.signals.hasExeAttachment) {
      await prisma.alert.create({
        data: {
          email_id: createdEmail.id,
          severity: "HIGH",
          title: "Executable attachment detected",
          message: "Attachment contains executable or macro content.",
          status: "OPEN"
        }
      });
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
