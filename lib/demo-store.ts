"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { demoAlerts, demoEmails, demoRules } from "./demo-data";
import type { Alert, RuleDefinition, ScanResult, Verdict } from "../types";
import { readStorage, writeStorage } from "./storage";
import { evaluateRules } from "./rulesEngine";

const alertsKey = "demoAlerts";
const rulesKey = "demoRules";
const verdictKey = "demoVerdictOverrides";
const scanKey = "demoScanResults";

export function useScanCache() {
  useEffect(() => {
    const scans: Record<string, ScanResult> = {};
    for (const email of demoEmails) {
      scans[email.id] = email.scanResult;
    }
    writeStorage(scanKey, scans);
  }, []);
}

export function useDemoAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);

  useEffect(() => {
    const stored = readStorage<Alert[]>(alertsKey, demoAlerts).map((alert) => ({
      ...alert,
      createdAt: new Date(alert.createdAt)
    }));
    setAlerts(stored);
  }, []);

  useEffect(() => {
    writeStorage(alertsKey, alerts);
  }, [alerts]);

  const updateStatus = useCallback((id: string, status: Alert["status"]) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status } : alert))
    );
  }, []);

  const addAlerts = useCallback((newAlerts: Alert[]) => {
    setAlerts((prev) => [...newAlerts, ...prev]);
  }, []);

  return { alerts, updateStatus, addAlerts };
}

export function useDemoRules() {
  const [rules, setRules] = useState<RuleDefinition[]>(demoRules);

  useEffect(() => {
    const stored = readStorage<RuleDefinition[]>(rulesKey, demoRules);
    setRules(stored);
  }, []);

  useEffect(() => {
    writeStorage(rulesKey, rules);
  }, [rules]);

  const createRule = useCallback((rule: RuleDefinition) => {
    setRules((prev) => [rule, ...prev]);
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
    );
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  }, []);

  const stats = useMemo(() => {
    const enabled = rules.filter((rule) => rule.enabled).length;
    return { total: rules.length, enabled };
  }, [rules]);

  return { rules, createRule, toggleRule, deleteRule, stats };
}

export function useVerdictOverrides() {
  const [overrides, setOverrides] = useState<Record<string, Verdict>>({});

  useEffect(() => {
    const stored = readStorage<Record<string, Verdict>>(verdictKey, {});
    setOverrides(stored);
  }, []);

  useEffect(() => {
    writeStorage(verdictKey, overrides);
  }, [overrides]);

  const setOverride = useCallback((emailId: string, verdict: Verdict) => {
    setOverrides((prev) => ({ ...prev, [emailId]: verdict }));
  }, []);

  return { overrides, setOverride };
}

export function runRulesOnInbox(rules: RuleDefinition[]) {
  const newAlerts: Alert[] = [];
  const verdictOverrides: Record<string, Verdict> = {};
  let counter = Date.now();

  for (const email of demoEmails) {
    const context = {
      subject: email.subject,
      fromDomain: email.fromEmail.split("@")[1]?.toLowerCase() || "",
      riskScore: email.scanResult.riskScore,
      hasShortenedUrl: email.links.some((link) => link.reason === "URL shortener detected"),
      hasExeAttachment: email.attachments.some((attachment) => attachment.isDangerous),
      urgentLanguage: email.scanResult.reasons.some((reason) => reason.code === "URGENT_LANGUAGE")
    };

    const matches = evaluateRules(rules, context);
    for (const match of matches) {
      if (match.action.verdictOverride) {
        verdictOverrides[email.id] = match.action.verdictOverride;
      }
      if (match.action.createAlert) {
        newAlerts.push({
          id: `alert-${counter++}`,
          emailId: email.id,
          severity: match.action.createAlert.severity,
          title: match.action.createAlert.title,
          message: match.action.createAlert.message,
          status: "OPEN",
          createdAt: new Date()
        });
      }
    }
  }

  return { newAlerts, verdictOverrides };
}
