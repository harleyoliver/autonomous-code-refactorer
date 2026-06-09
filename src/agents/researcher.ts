import { db } from "../utils/db.js";

/**
 * STATE-GRAPH NODE: ResearcherAgent
 * Pulls the current run metrics from the database, runs a localized design-token
 * cross-reference map, and promotes the state checkpoint to "SYNTHESIZING".
 */
export async function researcherAgentNode(runId: string): Promise<void> {
  console.log(
    `🔍 [Node: ResearcherAgent] Executing semantic design-token mapping for Run ID: ${runId}`,
  );

  // 1. Fetch the run checkpoint tracking record along with its child relational lists
  const record = await db.pipelineRun.findUnique({
    where: { id: runId },
    include: { scripts: true },
  });

  if (!record) {
    throw new Error(
      `[ResearcherAgent] Database record missing for Run ID: ${runId}`,
    );
  }

  // Artificial execution latency simulating semantic vector search metrics
  await new Promise((resolve) => setTimeout(resolve, 400));

  const systemDesignTokens: string[] = [];

  // 2. Localized Matching Rules (Simulating Similarity Distance Search)
  if (record.layoutTablesCount > 0) {
    systemDesignTokens.push(
      "Tailwind Framework Target: Translate table containers to modern flex-wrap or CSS grids ('grid grid-cols-1 md:grid-cols-3').",
    );
  }

  if (record.scripts.length > 0) {
    systemDesignTokens.push(
      "React Runtime Policy: Encapsulate asynchronous loops inside structural 'useEffect' lifecycle hooks with explicit unmount cleanups.",
    );
  }

  console.log(
    `✅ [Node: ResearcherAgent] Extracted ${systemDesignTokens.length} corporate layout directives.`,
  );

  // 3. Save matching design tokens directly into the database styles table and advance status
  await db.pipelineRun.update({
    where: { id: runId },
    data: {
      status: "SYNTHESIZING", // Automatically advance state-machine timeline
      styles: {
        create: systemDesignTokens.map((token) => ({
          rawStyle: `DESIGN_DIRECTIVE: ${token}`,
        })),
      },
    },
  });

  console.log(
    `✅ [Node: ResearcherAgent] Checkpoint saved. State successfully promoted to "SYNTHESIZING".`,
  );
}
