import type { MigrationGraphState } from "../graph/state.js";

/**
 * ARCHITECTURAL NODE: ResearcherAgent
 * Footprint: (state: MigrationGraphState) => Promise<Partial<MigrationGraphState>>
 * * Inspects the extracted legacy debt tokens, executes a localized lookup
 * against approved corporate design standards, and appends modern UI tokens.
 */
export async function researcherAgentNode(
  state: MigrationGraphState,
): Promise<Partial<MigrationGraphState>> {
  console.log(
    "🔍 [Node: ResearcherAgent] Querying corporate design system tokens matching extracted debt...",
  );

  // Defensive Guard: If a previous node failed or skipped debt extraction, this node halts operations safely
  if (!state.extractedDebt) {
    return {
      status: "FAILED",
      compilationErrors: [
        ...state.compilationErrors,
        "Researcher failure: No extracted legacy debt tokens available to map matching design styles.",
      ],
    };
  }

  // Artificial execution delay mimicking local similarity search latency metrics
  await new Promise((resolve) => setTimeout(resolve, 500));

  const systemDesignTokens: string[] = [];

  // SYSTEMATIC MATCHING LOGIC (Simulating Semantic Vector Distance Matching)
  if (state.extractedDebt.layoutTablesCount > 0) {
    systemDesignTokens.push(
      "Tailwind Framework Target: Use layout primitives like 'grid' and 'flex' with explicit responsive mobile bounds ('grid-cols-1 md:grid-cols-3').",
    );
  }

  if (state.extractedDebt.inlineScriptBlocks.length > 0) {
    systemDesignTokens.push(
      "React Runtime Policy: Enforce strict encapsulation hooks ('useState', 'useEffect'). All intervals must return an explicit clean-up unmount un-register signature.",
    );
  }

  if (state.extractedDebt.inlineStyles.length > 0) {
    systemDesignTokens.push(
      "Corporate Branding Token: Primary corporate navy color must map strictly to 'bg-[#002855]'. Accent highlight borders must map strictly to 'border-[#FF8200]'.",
    );
  }

  console.log(
    `✅ [Node: ResearcherAgent] Extracted ${systemDesignTokens.length} matching corporate design directives.`,
  );

  // Return ONLY the slice of state modifications we are authorized to alter
  return {
    status: "SYNTHESIZING",
    designContextTokens: systemDesignTokens,
  };
}
