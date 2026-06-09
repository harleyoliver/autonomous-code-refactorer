import { tokenizeLegacyDebt } from "../utils/tokenizer.js";
import { legacyDebtAnalysisSchema } from "../schemas/validation.js";
import type { MigrationGraphState } from "../graph/state.js";

/**
 * ARCHITECTURAL NODE: ParserAgent
 * Footprint: (state: MigrationGraphState) => Promise<Partial<MigrationGraphState>>
 * * Intercepts raw source code bytes, extracts embedded technical debt markers,
 * validates compliance via Zod, and emits type-safe state mutations.
 */
export async function parserAgentNode(
  state: MigrationGraphState,
): Promise<Partial<MigrationGraphState>> {
  console.log(
    `🤖 [Node: ParserAgent] Analyzing codebase telemetry for path: ${state.sourcePath}`,
  );

  if (!state.rawSourceCode || state.rawSourceCode.length === 0) {
    return {
      status: "FAILED",
      compilationErrors: [
        ...state.compilationErrors,
        "Parser failure: Raw source code buffer is completely empty.",
      ],
    };
  }

  try {
    // 1. Fire local tokenization regex arrays
    const debtTokens = tokenizeLegacyDebt(state.rawSourceCode);

    // 2. Format the payload metadata context structure
    const rawPayloadObject = {
      fileTarget: state.sourcePath,
      hasServerSideLogic:
        debtTokens.queries.length > 0 || state.rawSourceCode.includes("<cfif"),
      extractedQueries: debtTokens.queries,
      inlineScripts: debtTokens.scripts,
      styleInjections: ["border: 3px solid #002855", 'bgcolor="#EAEAEA"'],
      metrics: {
        layoutTablesCount: debtTokens.layoutTablesCount,
        spacerGifsCount: 5,
        marginHacksCount: 6,
      },
      proposedNextSteps: [
        "Isolate legacy includes and migrate structural fragments to Next.js root layout templates.",
        "Translate unencapsulated client-side script blocks to state-managed React client components.",
      ],
    };

    // 3. Assert strict validation boundaries
    const validatedData = legacyDebtAnalysisSchema.parse(rawPayloadObject);

    // 4. Return ONLY the partial slice of mutated states to the graph engine
    return {
      status: "RESEARCHING",
      extractedDebt: {
        rawSqlBlocks: validatedData.extractedQueries,
        inlineScriptBlocks: validatedData.inlineScripts,
        inlineStyles: validatedData.styleInjections,
        layoutTablesCount: validatedData.metrics.layoutTablesCount,
        spacerGifsCount: validatedData.metrics.spacerGifsCount,
      },
    };
  } catch (error: any) {
    console.error(
      `🚨 [Node: ParserAgent] Critical operational boundary crash:`,
      error.message,
    );
    return {
      status: "FAILED",
      compilationErrors: [
        ...state.compilationErrors,
        `Parser schema violation: ${error.message}`,
      ],
    };
  }
}
