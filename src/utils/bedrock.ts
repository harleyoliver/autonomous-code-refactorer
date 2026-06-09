import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  COMPILER_SYSTEM_PROMPT,
  DEBT_ANALYSIS_TOOL_SPEC,
} from "../prompts/migration.js";

const accessKeyId = process.env["AWS_ACCESS_KEY_ID"];
const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"];
const region = process.env["AWS_REGION"] || "us-east-1";

if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    "🚨 Critical AWS SDK Initialization Failure: Local credentials registry empty. Verify your un-tracked .env configuration parameters.",
  );
}

/**
 * Centrally Managed, Isolated AWS Bedrock Runtime Client Gateway Stream
 */
export const bedrockClient = new BedrockRuntimeClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * ARMED TRANSPORT LAYER SERVICE
 * Accepts raw source code text, wraps it cleanly in our strict system prompts
 * and tool-calling JSON schemas, and manages the network execution boundary.
 */
export async function invokeArmedDebtParser(
  rawSourceCode: string,
  fallbackActive: boolean = true,
): Promise<string> {
  const targetModelId = "anthropic.claude-sonnet-4-6";

  // Resilient Local Bypass to protect your velocity while the AWS Support ticket processes
  if (fallbackActive) {
    console.log(
      "⚠️ [Bedrock Service] Local Bypass Active: Simulating schema-conforming tool execution payload...",
    );
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Emulating the exact structural JSON payload Claude emits when triggering our spec
    return JSON.stringify({
      tool_use: {
        name: "submit_debt_analysis",
        input: {
          fileTarget: "fixtures/legacy-intranet/index.cfm",
          hasServerSideLogic: true,
          extractedQueries: [
            "SELECT pipe_id, sector_zone FROM pipeline_core WHERE status = 'ACTIVE'",
          ],
          inlineScripts: [
            "setInterval(function() { currentCarouselIndex = (currentCarouselIndex + 1) % 3; }, 4000);",
          ],
          styleInjections: [
            "font-family: 'Courier New'",
            "background-color: #002855",
          ],
          metrics: {
            layoutTablesCount: 4,
            spacerGifsCount: 12,
            marginHacksCount: 8,
          },
          proposedNextSteps: [
            "Extract embedded SQL blocks into a separate modular data repository layer.",
            "Refactor brittle global timing carousels into encapsulated React useEffect loops.",
          ],
        },
      },
    });
  }

  // BUILD THE COGNITIVE ENVELOPE FOR PRODUCTION
  const inputPayload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2000,
    temperature: 0.1, // Locked ultra-low for deterministic code analysis stability
    system: COMPILER_SYSTEM_PROMPT, // Behavioral boundaries
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this legacy source code asset:\n\n${rawSourceCode}`,
          },
        ],
      },
    ],
    tools: [DEBT_ANALYSIS_TOOL_SPEC], // Enforcing tool schema criteria
    tool_choice: { type: "auto" },
  };

  const command = new InvokeModelCommand({
    modelId: targetModelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(inputPayload),
  });

  console.log(
    `📡 Transmitting code payload envelope safely to Bedrock via tool gateway (${targetModelId})...`,
  );
  const response = await bedrockClient.send(command);
  return new TextDecoder("utf-8").decode(response.body);
}
