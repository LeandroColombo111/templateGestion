import type { RuleCondition, RuleDefinition, RuleAction } from "../types";

export type RuleContext = {
  subject: string;
  fromDomain: string;
  riskScore: number;
  hasShortenedUrl: boolean;
  hasExeAttachment: boolean;
  urgentLanguage: boolean;
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
  const matched: { rule: RuleDefinition; action: RuleAction; condition: RuleCondition }[] = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const condition = rule.condition;
    if (matchRule(condition, context)) {
      matched.push({
        rule,
        action: rule.action,
        condition
      });
    }
  }

  return matched;
}
