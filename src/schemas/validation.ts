import { z } from "zod";

/**
 * Validation schema for parsing and mapping legacy technical debt data.
 * Verifies that incoming data matches exact object and variable properties.
 */
export const legacyDebtAnalysisSchema = z.object({
  fileTarget: z
    .string()
    .min(1, "Source file target tracking string is mandatory."),
  hasServerSideLogic: z.boolean(),

  // UPDATED: Now checks for an array of objects instead of plain text strings
  extractedQueries: z.array(
    z.object({
      rawSql: z.string().min(1, "SQL command text cannot be empty."),
      queryType: z.enum(["READ", "WRITE", "UNKNOWN"]), // Forces value to match one of these three flags
    }),
  ),

  inlineScripts: z
    .array(z.string())
    .describe(
      "List of unencapsulated JavaScript blocks or interval timers found.",
    ),
  styleInjections: z
    .array(z.string())
    .describe(
      "Inline styles or archaic presentational font modifications present.",
    ),

  metrics: z.object({
    layoutTablesCount: z.number().int().nonnegative(),
    spacerGifsCount: z.number().int().nonnegative(),
    marginHacksCount: z.number().int().nonnegative(),
  }),

  proposedNextSteps: z
    .array(z.string())
    .min(
      1,
      "The engine requires at least one actionable translation recommendation strategy.",
    ),
});

export type LegacyDebtAnalysis = z.infer<typeof legacyDebtAnalysisSchema>;
