"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { demoAlerts, demoRules, type DemoAlert } from "./demo-data";
import type { RuleDefinition } from "../services/rulesEngine";

const alertsKey = "demoAlerts";
const rulesKey = "demoRules";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useDemoAlerts() {
  const [alerts, setAlerts] = useState<DemoAlert[]>(demoAlerts);

  useEffect(() => {
    const stored = safeParse<DemoAlert[]>(
      typeof window === "undefined" ? null : window.localStorage.getItem(alertsKey),
      demoAlerts
    );
    setAlerts(
      stored.map((alert) => ({
        ...alert,
        created_at: new Date(alert.created_at)
      }))
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(alertsKey, JSON.stringify(alerts));
  }, [alerts]);

  const updateStatus = useCallback((id: string, status: DemoAlert["status"]) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status } : alert))
    );
  }, []);

  return { alerts, updateStatus };
}

export function useDemoRules() {
  const [rules, setRules] = useState<RuleDefinition[]>(demoRules);

  useEffect(() => {
    const stored = safeParse<RuleDefinition[]>(
      typeof window === "undefined" ? null : window.localStorage.getItem(rulesKey),
      demoRules
    );
    setRules(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(rulesKey, JSON.stringify(rules));
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
