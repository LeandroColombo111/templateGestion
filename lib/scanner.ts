import type { EmailAttachment, EmailLink, ScanReason, Verdict } from "../types";

export type ScanSignals = {
  hasShortenedUrl: boolean;
  hasExeAttachment: boolean;
  urgentLanguage: boolean;
  lookalikeDomain: boolean;
  displayNameMismatch: boolean;
  suspiciousTld: boolean;
};

export const knownDomains = [
  "acmebank.com",
  "cloudbill.io",
  "globocorp.com",
  "shipfast.io",
  "payloop.com",
  "northwind.dev",
  "newsletter.example",
  "conference.example"
];

export const knownBrands = [
  { name: "Acme Bank", domains: ["acmebank.com"] },
  { name: "CloudBill", domains: ["cloudbill.io"] },
  { name: "GloboCorp", domains: ["globocorp.com"] },
  { name: "PayLoop", domains: ["payloop.com"] },
  { name: "ShipFast", domains: ["shipfast.io"] }
];

export const suspiciousTlds = [".zip", ".mov", ".xyz", ".top", ".click", ".work"];

export const urlShorteners = [
  "bit.ly",
  "t.co",
  "tinyurl.com",
  "short.io",
  "rebrand.ly"
];

export const urgentKeywords = [
  "urgent",
  "immediately",
  "action required",
  "verify now",
  "suspend",
  "within 24 hours",
  "final notice",
  "password expires",
  "wire transfer",
  "asap",
  "payment pending",
  "confirm now"
];

export function extractUrls(text: string): string[] {
  const regex = /(https?:\/\/[^\s)"']+)/gi;
  const matches = text.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}

export function parseDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function isLookalike(domain: string) {
  if (!domain) return false;
  return knownDomains.some((known) => {
    if (domain === known) return false;
    return levenshtein(domain, known) <= 2;
  });
}

function hasSuspiciousTld(domain: string) {
  return suspiciousTlds.some((tld) => domain.endsWith(tld));
}

function includesUrgentLanguage(text: string) {
  const lower = text.toLowerCase();
  return urgentKeywords.some((phrase) => lower.includes(phrase));
}

function displayNameMismatch(fromName: string, fromDomain: string) {
  const lowerName = fromName.toLowerCase();
  return knownBrands.some((brand) => {
    const brandMatch = lowerName.includes(brand.name.toLowerCase());
    if (!brandMatch) return false;
    return !brand.domains.includes(fromDomain);
  });
}

export function evaluateLinks(urls: string[]): {
  links: { url: string; domain: string; isSuspicious: boolean; reason?: string }[];
  hasShortenedUrl: boolean;
} {
  let hasShortenedUrl = false;

  const links = urls.map((url) => {
    const domain = parseDomain(url);
    let isSuspicious = false;
    let reason: string | undefined;

    if (urlShorteners.includes(domain)) {
      isSuspicious = true;
      hasShortenedUrl = true;
      reason = "URL shortener detected";
    } else if (isLookalike(domain)) {
      isSuspicious = true;
      reason = "Lookalike domain";
    } else if (hasSuspiciousTld(domain)) {
      isSuspicious = true;
      reason = "Suspicious TLD";
    }

    return { url, domain, isSuspicious, reason };
  });

  return { links, hasShortenedUrl };
}

export function scanEmail(input: {
  fromName: string;
  fromEmail: string;
  subject: string;
  bodyText: string;
  links: Pick<EmailLink, "url" | "domain" | "isSuspicious">[];
  attachments: Pick<EmailAttachment, "filename" | "mimeType">[];
}) {
  const reasons: ScanReason[] = [];
  const fromDomain = input.fromEmail.split("@")[1]?.toLowerCase() ?? "";

  const lookalike = isLookalike(fromDomain);
  if (lookalike) {
    reasons.push({
      code: "LOOKALIKE_DOMAIN",
      message: "Sender domain closely resembles a trusted brand.",
      weight: 25
    });
  }

  const mismatch = displayNameMismatch(input.fromName, fromDomain);
  if (mismatch) {
    reasons.push({
      code: "DISPLAY_MISMATCH",
      message: "Display name does not match sender domain.",
      weight: 15
    });
  }

  const suspiciousSenderTld = hasSuspiciousTld(fromDomain);
  if (suspiciousSenderTld) {
    reasons.push({
      code: "SUSPICIOUS_TLD",
      message: "Sender uses an uncommon or risky top-level domain.",
      weight: 12
    });
  }

  const urgent = includesUrgentLanguage(
    `${input.subject} ${input.bodyText}`
  );
  if (urgent) {
    reasons.push({
      code: "URGENT_LANGUAGE",
      message: "Email contains urgent or coercive language.",
      weight: 12
    });
  }

  const shortened = input.links.some((link) =>
    urlShorteners.includes(link.domain.toLowerCase())
  );
  if (shortened) {
    reasons.push({
      code: "URL_SHORTENER",
      message: "Contains shortened URLs that obscure destination.",
      weight: 15
    });
  }

  const suspiciousLinks = input.links.filter((link) => link.isSuspicious);
  if (suspiciousLinks.length > 0) {
    reasons.push({
      code: "SUSPICIOUS_LINK",
      message: "Links contain suspicious domains or TLDs.",
      weight: 10 + Math.min(10, suspiciousLinks.length * 2)
    });
  }

  const dangerousAttachment = input.attachments.find((attachment) => {
    const ext = attachment.filename.toLowerCase();
    return [".exe", ".js", ".vbs", ".scr", ".docm", ".xlsm"].some((x) =>
      ext.endsWith(x)
    );
  });

  if (dangerousAttachment) {
    reasons.push({
      code: "DANGEROUS_ATTACHMENT",
      message: "Attachment may contain executable or macro content.",
      weight: 25
    });
  }

  const riskScore = Math.min(
    100,
    reasons.reduce((total, reason) => total + reason.weight, 0)
  );
  const verdict: Verdict =
    riskScore >= 70
      ? "DANGEROUS"
      : riskScore >= 30
        ? "SUSPICIOUS"
        : "SAFE";

  const signals: ScanSignals = {
    hasShortenedUrl: shortened,
    hasExeAttachment: Boolean(dangerousAttachment),
    urgentLanguage: urgent,
    lookalikeDomain: lookalike,
    displayNameMismatch: mismatch,
    suspiciousTld: suspiciousSenderTld
  };

  return { riskScore, verdict, reasons, signals };
}
