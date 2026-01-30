import { mockEmails } from "../data/mockEmails";
import type {
  Alert,
  EmailAttachment,
  EmailLink,
  EmailMessage,
  RuleDefinition,
  ScanResult,
  Severity,
  Verdict
} from "../types";
import { evaluateLinks, extractUrls, scanEmail } from "./scanner";
import { evaluateRules } from "./rulesEngine";

const attachmentDangerousExt = [
  ".exe",
  ".js",
  ".vbs",
  ".scr",
  ".docm",
  ".xlsm"
];

export const demoRules: RuleDefinition[] = [
  {
    id: "rule-1",
    name: "High risk auto-alert",
    enabled: true,
    severity: "HIGH",
    condition: {
      riskScoreGte: 70
    },
    action: {
      createAlert: {
        severity: "HIGH",
        title: "High-risk email detected",
        message: "Auto-escalated based on phishing score."
      }
    },
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "rule-2",
    name: "Shortened URL + urgent language",
    enabled: true,
    severity: "MED",
    condition: {
      hasShortenedUrl: true,
      urgentLanguage: true
    },
    action: {
      createAlert: {
        severity: "MED",
        title: "Urgent message with shortened URL",
        message: "Potential social engineering pattern detected."
      },
      verdictOverride: "SUSPICIOUS"
    },
    createdAt: "2026-01-01T00:00:00Z"
  }
];

let alertCounter = 1;
let linkCounter = 1;
let attachmentCounter = 1;
let scanCounter = 1;

const alerts: Alert[] = [];

export const demoEmails: EmailMessage[] = mockEmails.map((email, index) => {
  const emailId = `email-${String(index + 1).padStart(2, "0")}`;
  const date = new Date(email.date);

  const urlMatches = extractUrls(email.bodyText);
  const linkEval = evaluateLinks(urlMatches);

  const links: EmailLink[] = linkEval.links.map((link) => {
    const id = `link-${String(linkCounter++).padStart(3, "0")}`;
    return {
      id,
      emailId,
      url: link.url,
      domain: link.domain,
      isSuspicious: link.isSuspicious,
      reason: link.reason ?? null
    };
  });

  const attachments: EmailAttachment[] = (email.attachments ?? []).map(
    (attachment) => {
      const lowerName = attachment.filename.toLowerCase();
      const isDangerous = attachmentDangerousExt.some((ext) =>
        lowerName.endsWith(ext)
      );
      const id = `att-${String(attachmentCounter++).padStart(3, "0")}`;
      return {
        id,
        emailId,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
        isDangerous,
        reason: isDangerous ? "Executable or macro attachment" : null
      };
    }
  );

  const scan = scanEmail({
    fromName: email.fromName,
    fromEmail: email.fromEmail,
    subject: email.subject,
    bodyText: email.bodyText,
    links: links.map((link) => ({
      url: link.url,
      domain: link.domain,
      isSuspicious: link.isSuspicious
    })),
    attachments: attachments.map((attachment) => ({
      filename: attachment.filename,
      mimeType: attachment.mimeType
    }))
  });

  let finalVerdict: Verdict = scan.verdict;

  const ruleContext = {
    subject: email.subject,
    fromDomain: email.fromEmail.split("@")[1]?.toLowerCase() || "",
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
    if (match.action.createAlert) {
      alerts.push({
        id: `alert-${String(alertCounter++).padStart(3, "0")}`,
        emailId,
        severity: match.action.createAlert.severity,
        title: match.action.createAlert.title,
        message: match.action.createAlert.message,
        status: "OPEN",
        createdAt: date
      });
    }
  }

  if (finalVerdict === "DANGEROUS") {
    alerts.push({
      id: `alert-${String(alertCounter++).padStart(3, "0")}`,
      emailId,
      severity: "HIGH",
      title: "Dangerous email",
      message: "Auto-escalated based on score and signals.",
      status: "OPEN",
      createdAt: date
    });
  }

  if (scan.signals.hasExeAttachment) {
    alerts.push({
      id: `alert-${String(alertCounter++).padStart(3, "0")}`,
      emailId,
      severity: "HIGH",
      title: "Executable attachment detected",
      message: "Attachment contains executable or macro content.",
      status: "OPEN",
      createdAt: date
    });
  }

  const scanResult: ScanResult = {
    id: `scan-${String(scanCounter++).padStart(3, "0")}`,
    emailId,
    riskScore: scan.riskScore,
    verdict: finalVerdict,
    reasons: scan.reasons,
    scannedAt: date
  };

  return {
    id: emailId,
    fromName: email.fromName,
    fromEmail: email.fromEmail,
    subject: email.subject,
    date,
    bodyText: email.bodyText,
    bodyHtml: null,
    headers: email.headers,
    receivedAt: date,
    links,
    attachments,
    scanResult
  };
});

export const demoAlerts: Alert[] = alerts.sort(
  (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
);

export function getEmailById(id: string) {
  return demoEmails.find((email) => email.id === id);
}

export function getTopDomains() {
  const domainCounts = new Map<string, number>();
  for (const email of demoEmails) {
    const domain = email.fromEmail.split("@")[1] ?? "unknown";
    domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
  }
  return Array.from(domainCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export function getKpis(alertsOverride?: Alert[]) {
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

export function getRiskDistribution() {
  const buckets = [0, 0, 0, 0, 0];
  for (const email of demoEmails) {
    const score = email.scanResult.riskScore;
    const index = Math.min(4, Math.floor(score / 20));
    buckets[index] += 1;
  }
  return buckets;
}

export function getHighRiskEmails() {
  return [...demoEmails]
    .filter((email) => email.scanResult.verdict !== "SAFE")
    .sort((a, b) => b.scanResult.riskScore - a.scanResult.riskScore)
    .slice(0, 6);
}
