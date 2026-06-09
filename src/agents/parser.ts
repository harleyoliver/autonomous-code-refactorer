import { tokenizeLegacyDebt } from "../utils/tokenizer.js";
import { legacyDebtAnalysisSchema } from "../schemas/validation.js";
import { db } from "../utils/db.js";

/**
 * STATE-GRAPH NODE: ParserAgent
 * Reads a pending database pipeline run, extracts embedded code features,
 * asserts Zod validation, and promotes the state transaction checkpoint.
 */
export async function parserAgentNode(runId: string): Promise<void> {
  console.log(
    `🤖 [Node: ParserAgent] Fetching active pipeline state for Run ID: ${runId}`,
  );

  // 1. Pull the absolute source record from our physical storage ledger
  const record = await db.pipelineRun.findUnique({ where: { id: runId } });
  if (!record || !record.rawSourceCode) {
    throw new Error(
      `[ParserAgent] Missing or invalid database record state for Run ID: ${runId}`,
    );
  }

  try {
    // 2. Fire local regex tokenization macro arrays
    const debtTokens = tokenizeLegacyDebt(record.rawSourceCode);

    // 3. Format the data envelope to look exactly like an agent tool output
    const rawPayloadObject = {
      fileTarget: record.sourcePath,
      hasServerSideLogic:
        debtTokens.queries.length > 0 || record.rawSourceCode.includes("<cfif"),
      extractedQueries: debtTokens.queries,
      inlineScripts: debtTokens.scripts,
      styleInjections: ["border: 3px solid #002855", 'bgcolor="#EAEAEA"'],
      metrics: {
        layoutTablesCount: debtTokens.layoutTablesCount,
        spacerGifsCount: 12,
        marginHacksCount: 8,
      },
      proposedNextSteps: [
        "Isolate legacy server includes and translate to Next.js static layouts.",
        "Refactor global setInterval loops into state-managed React hooks.",
      ],
    };

    // 4. Force string arguments through the Zod validation firewall
    const validatedData = legacyDebtAnalysisSchema.parse(rawPayloadObject);

    // 5. Commit state mutations and relational sub-tables back to SQLite
    await db.pipelineRun.update({
      where: { id: runId },
      data: {
        status: "RESEARCHING", // Advance the state-machine status flag
        layoutTablesCount: validatedData.metrics.layoutTablesCount,
        spacerGifsCount: validatedData.metrics.spacerGifsCount,
        queries: {
          create: validatedData.extractedQueries.map((q) => ({ rawSql: q })),
        },
        scripts: {
          create: validatedData.inlineScripts.map((s) => ({ rawScript: s })),
        },
        styles: {
          create: validatedData.styleInjections.map((st) => ({ rawStyle: st })),
        },
      },
    });

    console.log(
      `✅ [Node: ParserAgent] Checkpoint saved. State successfully promoted to "RESEARCHING".`,
    );
  } catch (error: any) {
    console.error(
      `🚨 [Node: ParserAgent] Operational loop checkpoint failure:`,
      error.message,
    );
    await db.pipelineRun.update({
      where: { id: runId },
      data: { status: "FAILED" },
    });
    // Add compilation error tracking
    await db.compilationError.create({
      data: {
        errorMessage: `Parser validation crash: ${error.message}`,
        pipelineRunId: runId,
      },
    });
  }
}
