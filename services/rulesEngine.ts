export type Severity = "LOW" | "MED" | "HIGH";
export type Verdict = "SAFE" | "SUSPICIOUS" | "DANGEROUS";

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
  addTag?: string;
};

export type RuleContext = {
  subject: string;
  fromDomain: string;
  riskScore: number;
  hasShortenedUrl: boolean;
  hasExeAttachment: boolean;
  urgentLanguage: boolean;
};

export type RuleDefinition = {
  id: string;
  name: string;
  enabled: boolean;
  severity: Severity;
  condition_json: RuleCondition;
  action_json: RuleAction;
  created_at: string;
};

export function matchRule(condition: RuleCondition, context: RuleContext) {
  if (condition.subjectContains) {
    if (!context.subject.toLowerCase().includes(condition.subjectContains.toLowerCase())) {
      return false;
    }
  }
  if (condition.fromDomainEquals) {
    if (context.fromDomain !== condition.fromDomainEquals.toLowerCase()) {
      return false;
    }
  }
  if (typeof condition.riskScoreGte === "number") {
    if (context.riskScore < condition.riskScoreGte) {
      return false;
    }
  }
  if (typeof condition.hasShortenedUrl === "boolean") {
    if (context.hasShortenedUrl !== condition.hasShortenedUrl) {
      return false;
    }
  }
  if (typeof condition.hasExeAttachment === "boolean") {
    if (context.hasExeAttachment !== condition.hasExeAttachment) {
      return false;
    }
  }
  if (typeof condition.urgentLanguage === "boolean") {
    if (context.urgentLanguage !== condition.urgentLanguage) {
      return false;
    }
  }
  return true;
}

export function evaluateRules(rules: RuleDefinition[], context: RuleContext) {
  const matched: {
    rule: RuleDefinition;
    action: RuleAction;
    condition: RuleCondition;
  }[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const condition = rule.condition_json as RuleCondition;
    if (matchRule(condition, context)) {
      matched.push({
        rule,
        action: rule.action_json as RuleAction,
        condition
      });
    }
  }

  return matched;
}
