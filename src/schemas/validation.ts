import { z } from 'zod';

/**
 * Strict Zod runtime validation schema for parsing and mapping legacy corporate tech debt.
 */
export const legacyDebtAnalysisSchema = z.object({
  fileTarget: z.string().min(1, "Source file target tracking string is mandatory."),
  hasServerSideLogic: z.boolean(),
  extractedQueries: z.array(z.string()).describe("List of raw SQL queries extracted from tags like <cfquery>."),
  inlineScripts: z.array(z.string()).describe("List of unencapsulated JavaScript blocks or interval timers found."),
  styleInjections: z.array(z.string()).describe("Inline styles or archaic presentational font modifications present."),
  metrics: z.object({
    layoutTablesCount: z.number().int().nonnegative(),
    spacerGifsCount: z.number().int().nonnegative(),
    marginHacksCount: z.number().int().nonnegative()
  }),
  proposedNextSteps: z.array(z.string()).min(1, "The engine requires at least one actionable translation recommendation strategy.")
});

export type LegacyDebtAnalysis = z.infer<typeof legacyDebtAnalysisSchema>;
