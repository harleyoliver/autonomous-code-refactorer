import "dotenv/config";
import { randomUUID } from "node:crypto";
import { ingestLegacyMesh } from "./utils/reader.js";
import { parserAgentNode } from "./agents/parser.js";
import { researcherAgentNode } from "./agents/researcher.js";
import { db } from "./utils/db.js";

/**
 * CORE ORCHESTRATION ENGINE
 * Coordinates conditional graph boundaries across persistent local database states.
 */
async function coordinateStateGraph(runId: string) {
  let pipelineActive = true;
  let safetyLoopBreaker = 0;

  console.log(`🎬 Beginning State-Graph Loop Execution for Run ID: ${runId}\n`);

  while (pipelineActive && safetyLoopBreaker < 10) {
    safetyLoopBreaker++;

    const currentRunState = await db.pipelineRun.findUnique({
      where: { id: runId },
      include: { queries: true, scripts: true, styles: true, errors: true },
    });

    if (!currentRunState) {
      console.error(
        `🚨 Graph Loop Failure: State record could not be found for ID: ${runId}`,
      );
      break;
    }

    console.log(
      `\n🔄 [Graph Router] Checkpoint Status: "${currentRunState.status}" (Pass ${safetyLoopBreaker})`,
    );

    switch (currentRunState.status) {
      case "PENDING":
        await parserAgentNode(runId);
        break;

      case "RESEARCHING":
        // Dynamically invoke the Researcher Agent Node
        await researcherAgentNode(runId);
        break;

      case "SYNTHESIZING":
        console.log(
          `✨ [Graph Router] Knowledge hydration complete. System ready for Component Synthesis Node.`,
        );
        // TODO Stop the loop here until I map out the Component Synthesis Node file
        pipelineActive = false;
        break;

      case "FAILED":
        console.error(
          `🛑 [Graph Router] Execution aborted. Run transitioned to a FAILED state.`,
        );
        pipelineActive = false;
        break;

      default:
        console.log(
          `🏁 [Graph Router] Loop reached an unhandled termination point.`,
        );
        pipelineActive = false;
        break;
    }
  }

  // Final Audit Log display to view persistent table metrics
  const finalAudit = await db.pipelineRun.findUnique({
    where: { id: runId },
    include: { queries: true, scripts: true, styles: true },
  });

  if (finalAudit) {
    console.log("\n📊 Final Local SQLite Database Audit Matrix:");
    console.log(
      "======================================================================",
    );
    console.log(`[Run ID]:       ${finalAudit.id}`);
    console.log(`[Final Status]: ${finalAudit.status}`);
    console.log(`[SQL Queries]:  Count: ${finalAudit.queries.length}`);
    console.log(
      `[Design Rules]: Count: ${finalAudit.styles.filter((s) => s.rawStyle.startsWith("DESIGN_DIRECTIVE")).length}`,
    );
    console.log(
      "======================================================================",
    );
  }
}

async function startPipelineRun() {
  console.log("🔄 Bootstrapping state-machine architecture...\n");
  const targetPath = "fixtures/legacy-intranet/index.cfm";

  const fileMesh = await ingestLegacyMesh(targetPath);
  const nextRunId = randomUUID();

  await db.pipelineRun.create({
    data: {
      id: nextRunId,
      sourcePath: fileMesh.targetPath,
      fileType: "CFM_MAIN",
      rawSourceCode: fileMesh.sanitizedContent,
      status: "PENDING",
      humanApproval: "PENDING",
      iterationCount: 0,
      isSyntaxValidated: false,
    },
  });

  await coordinateStateGraph(nextRunId);
  console.log("\n🏁 Graph execution loop safely cycled down.");
}

startPipelineRun().catch((error) => {
  console.error("\n🚨 Monolithic orchestration failure:", error.message);
});
