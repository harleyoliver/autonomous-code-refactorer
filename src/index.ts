import "dotenv/config";
import { randomUUID } from "node:crypto";
import { ingestLegacyMesh } from "./utils/reader.js";
import { parserAgentNode } from "./agents/parser.js";
import { db } from "./utils/db.js";

/**
 * CORE ORCHESTRATION ENGINE
 * Simulates a LangGraph state machine workflow using a database checkpoint router.
 */
async function coordinateStateGraph(runId: string) {
  let pipelineActive = true;
  let safetyLoopBreaker = 0;

  console.log(`🎬 Beginning State-Graph Loop Execution for Run ID: ${runId}\n`);

  while (pipelineActive && safetyLoopBreaker < 10) {
    safetyLoopBreaker++;

    // Read the current state directly from our persistent SQLite checkpoint
    const currentRunState = await db.pipelineRun.findUnique({
      where: { id: runId },
      include: { queries: true, scripts: true, errors: true },
    });

    if (!currentRunState) {
      console.error(
        `🚨 Graph Loop Failure: State record could not be found for ID: ${runId}`,
      );
      break;
    }

    console.log(
      `🔄 [Graph Router] Current Checkpoint Status: "${currentRunState.status}" (Pass ${safetyLoopBreaker})`,
    );

    // CONDITIONAL EDGE ROUTING LOGIC
    switch (currentRunState.status) {
      case "PENDING":
        // Route directly to the database-backed Parser Node
        await parserAgentNode(runId);
        break;

      case "RESEARCHING":
        console.log(
          `🔍 [Graph Router] Ingestion complete. Next state node target: ResearcherAgent Semantic RAG.`,
        );
        // Temporarily spin down the graph execution until we map the researcher table sync hooks next!
        pipelineActive = false;
        break;

      case "FAILED":
        console.error(
          `🛑 [Graph Router] Circuit breaker triggered. Run has transitioned to a FAILED state.`,
        );
        console.error(
          `   Log details:`,
          currentRunState.errors.map((e) => e.errorMessage),
        );
        pipelineActive = false;
        break;

      default:
        console.log(
          `🏁 [Graph Router] Unhandled state sequence or execution path completed clear.`,
        );
        pipelineActive = false;
        break;
    }
  }
}

async function startPipelineRun() {
  console.log("🔄 Bootstrapping state-machine architecture...\n");
  const targetPath = "fixtures/legacy-intranet/index.cfm";

  // Initialize the baseline file mesh payload
  const fileMesh = await ingestLegacyMesh(targetPath);
  const nextRunId = randomUUID();

  // Create the initial entry checkpoint directly in our SQL database file
  await db.pipelineRun.create({
    data: {
      id: nextRunId,
      sourcePath: fileMesh.targetPath,
      fileType: "CFM_MAIN",
      rawSourceCode: fileMesh.sanitizedContent,
      status: "PENDING", // Initial state-machine state
      humanApproval: "PENDING",
      iterationCount: 0,
      isSyntaxValidated: false,
    },
  });

  // Ignite the dynamic graph router loop
  await coordinateStateGraph(nextRunId);

  console.log("\n🏁 Graph execution loop safely cycled down.");
}

startPipelineRun().catch((error) => {
  console.error("\n🚨 Monolithic orchestration failure:", error.message);
});
