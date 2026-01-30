export type Role = "ADMIN" | "ANALYST";

export type Verdict = "SAFE" | "SUSPICIOUS" | "DANGEROUS";

export type Severity = "LOW" | "MED" | "HIGH";

export type AlertStatus = "OPEN" | "ACK" | "RESOLVED";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type EmailLink = {
  id: string;
  emailId: string;
  url: string;
  domain: string;
  isSuspicious: boolean;
  reason?: string | null;
};

export type EmailAttachment = {
  id: string;
  emailId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  isDangerous: boolean;
  reason?: string | null;
};

export type ScanReason = {
  code: string;
  message: string;
  weight: number;
};

export type ScanResult = {
  id: string;
  emailId: string;
  riskScore: number;
  verdict: Verdict;
  reasons: ScanReason[];
  scannedAt: Date;
};

export type EmailMessage = {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  date: Date;
  bodyText: string;
  bodyHtml?: string | null;
  headers: Record<string, string>;
  receivedAt: Date;
  links: EmailLink[];
  attachments: EmailAttachment[];
  scanResult: ScanResult;
};

export type RuleCondition = {
  subjectContains?: string;
  fromDomainEquals?: string;
  riskScoreGte?: number;
  hasShortenedUrl?: boolean;
  hasExeAttachment?: boolean;
  urgentLanguage?: boolean;
};

export type RuleAction = {
  createAlert?: {
    severity: Severity;
    title: string;
    message: string;
  };
  verdictOverride?: Verdict;
};

export type RuleDefinition = {
  id: string;
  name: string;
  enabled: boolean;
  severity: Severity;
  condition: RuleCondition;
  action: RuleAction;
  createdAt: string;
};

export type Alert = {
  id: string;
  emailId: string;
  severity: Severity;
  title: string;
  message: string;
  status: AlertStatus;
  createdAt: Date;
};
