import { z } from "zod";

export const ruleSchema = z.object({
  name: z.string().min(3),
  enabled: z.coerce.boolean().default(true),
  severity: z.enum(["LOW", "MED", "HIGH"]),
  subjectContains: z.string().optional(),
  fromDomainEquals: z.string().optional(),
  riskScoreGte: z.coerce.number().int().min(0).max(100).optional(),
  hasShortenedUrl: z.coerce.boolean().optional(),
  hasExeAttachment: z.coerce.boolean().optional(),
  urgentLanguage: z.coerce.boolean().optional(),
  actionCreateAlert: z.coerce.boolean().optional(),
  actionVerdictOverride: z.enum(["SAFE", "SUSPICIOUS", "DANGEROUS"]).optional()
});

export type RuleFormInput = z.infer<typeof ruleSchema>;
