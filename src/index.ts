import "dotenv/config";
import { randomUUID } from "node:crypto";
import { ingestLegacyMesh } from "./utils/reader.js";
import { parserAgentNode } from "./agents/parser.js";
import type { MigrationGraphState, IngestionFileType } from "./graph/state.js";

/**
 * HIGH-LEVEL GRAPH INITIALIZER
 */
async function initializeGraphState(
  relativeFilePath: string,
  type: IngestionFileType,
): Promise<MigrationGraphState> {
  const fileMesh = await ingestLegacyMesh(relativeFilePath);

  return {
    fileId: randomUUID(),
    sourcePath: fileMesh.targetPath,
    fileType: type,
    rawSourceCode: fileMesh.sanitizedContent,
    targetTypeScriptComponent: null,
    extractedDebt: null,
    compilationErrors: [],
    status: "PENDING",
    humanApproval: "PENDING",
    iterationCount: 0,
    isSyntaxValidated: false,
  };
}

// Master Operational Run Loop
async function startPipelineRun() {
  console.log("🔄 Launching modular state-machine node sweep...\n");

  // 1. Bootstrap the base state canvas object
  let globalState = await initializeGraphState(
    "fixtures/legacy-intranet/index.cfm",
    "CFM_MAIN",
  );

  console.log(
    `📂 Initialized State Machine Channel for: ${globalState.sourcePath} (Status: ${globalState.status})`,
  );

  // 2. Advance the state machine by executing our isolated Parser Agent Node
  globalState.status = "PARSING";
  const parserMutationResult = await parserAgentNode(globalState);

  // 3. Apply the node modifications back onto the master ledger copy
  globalState = { ...globalState, ...parserMutationResult };

  console.log("\n✅ Master Ledger Merged with Node Mutations Successfully:");
  console.log(
    "======================================================================",
  );
  console.log(`[Global Status]: ${globalState.status}`);
  console.dir(globalState.extractedDebt, { depth: null, colors: true });
  console.log(
    "======================================================================",
  );
  console.log(
    "\n🏁 Run cycle concluded with clean state isolation structures.",
  );
}

startPipelineRun().catch((error) => {
  console.error(
    "\n🚨 Pipeline orchestrator encountered fatal runtime exception:",
    error.message,
  );
});
