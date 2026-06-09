/**
 * COGNITIVE CORE: System Prompt Directive
 * Imposes absolute behavioral boundaries on the LLM inference layer,
 * forcing it to operate as a deterministic compiler agent.
 */
export const COMPILER_SYSTEM_PROMPT = `
You are an elite automated code refactoring compiler specializing in legacy systems modernization.
Your current task is to analyze raw 2015-era ColdFusion/CFML code templates and extract its underlying technical debt patterns into clean, structured data tokens.

CRITICAL OPERATIONAL RULES:
1. Do NOT write conversational explanations, filler text, or introductory remarks.
2. You must isolate all embedded database queries inside <cfquery> blocks.
3. You must isolate all client-side inline scripts, unencapsulated timers, and global interval loops.
4. You must accurately count all presentation tables used strictly for visual layout.
5. You must output your analysis parameters strictly by executing the mandatory 'submit_debt_analysis' tool.
`;

/**
 * AMAZON BEDROCK / ANTHROPIC TOOL SPECIFICATION
 * Translates runtime Zod schema into the exact JSON-Schema format
 * required by the model client transport plane for structured tool invocation.
 */
export const DEBT_ANALYSIS_TOOL_SPEC = {
  name: "submit_debt_analysis",
  description:
    "Submits structural technical debt metrics and extracted code segments isolated from the legacy file context.",
  input_schema: {
    type: "object",
    properties: {
      fileTarget: {
        type: "string",
        description: "The relative path target of the file being processed.",
      },
      hasServerSideLogic: {
        type: "boolean",
        description:
          "True if the source contains conditions (<cfif>), iteration loops, or database queries.",
      },
      extractedQueries: {
        type: "array",
        items: { type: "string" },
        description:
          "An array of raw, unedited SQL command blocks extracted directly from <cfquery> tags.",
      },
      inlineScripts: {
        type: "array",
        items: { type: "string" },
        description:
          "An array of raw, unencapsulated client-side JavaScript text blocks found inside the template.",
      },
      styleInjections: {
        type: "array",
        items: { type: "string" },
        description:
          "List of presentational parameters or raw inline style tags discovered.",
      },
      metrics: {
        type: "object",
        properties: {
          layoutTablesCount: { type: "integer", minimum: 0 },
          spacerGifsCount: { type: "integer", minimum: 0 },
          marginHacksCount: { type: "integer", minimum: 0 },
        },
        required: ["layoutTablesCount", "spacerGifsCount", "marginHacksCount"],
      },
      proposedNextSteps: {
        type: "array",
        items: { type: "string" },
        description:
          "Actionable, step-by-step technical recommendations for transforming these specific elements to Next.js components.",
      },
    },
    required: [
      "fileTarget",
      "hasServerSideLogic",
      "extractedQueries",
      "inlineScripts",
      "styleInjections",
      "metrics",
      "proposedNextSteps",
    ],
  },
};
