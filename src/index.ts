import "dotenv/config";
import { randomUUID } from "node:crypto";
import { ingestLegacyMesh } from "./utils/reader.js";
import { parserAgentNode } from "./agents/parser.js";
import { researcherAgentNode } from "./agents/researcher.js";
import { generatorAgentNode } from "./agents/generator.js";
import { db } from "./utils/db.js";

/**
 * CORE ORCHESTRATION ENGINE
 * Executes an automated multi-agent state graph pipeline backed by SQLite checkpoints.
 */
async function coordinateStateGraph(runId: string) {
  let pipelineActive = true;
  let safetyLoopBreaker = 0;

  console.log(
    `🎬 Beginning Unified State-Graph Execution for Run ID: ${runId}\n`,
  );

  while (pipelineActive && safetyLoopBreaker < 10) {
    safetyLoopBreaker++;

    // Read state parameters directly out of the SQLite db row
    const currentRunState = await db.pipelineRun.findUnique({
      where: { id: runId },
      include: { errors: true },
    });

    if (!currentRunState) {
      console.error(
        `🚨 Graph Loop Failure: State record could not be found for ID: ${runId}`,
      );
      break;
    }

    console.log(
      `🔄 [Graph Router] Step ${safetyLoopBreaker} Checkpoint Status: "${currentRunState.status}"`,
    );

    // CONDITIONAL EDGE ROUTING CIRCUIT
    switch (currentRunState.status) {
      case "PENDING":
        await parserAgentNode(runId);
        break;

      case "RESEARCHING":
        await researcherAgentNode(runId);
        break;

      case "SYNTHESIZING":
        // Dynamically invoke the Generator Agent Node
        await generatorAgentNode(runId);
        break;

      case "COMPLETED":
        console.log(
          `🎉 [Graph Router] Terminal Node Reached: Ingestion pipeline run has concluded successfully.`,
        );
        pipelineActive = false;
        break;

      case "FAILED":
        console.error(
          `🛑 [Graph Router] Execution aborted. Run transitioned to a FAILED state.`,
        );
        pipelineActive = false;
        break;

      default:
        console.log(`🏁 [Graph Router] Unhandled routing tag.`);
        pipelineActive = false;
        break;
    }
  }

  // Final database introspection review
  const finalAudit = await db.pipelineRun.findUnique({
    where: { id: runId },
    include: { queries: true, scripts: true, styles: true },
  });

  if (finalAudit) {
    console.log("\n📊 Final Local SQLite Database Audit Matrix:");
    console.log(
      "======================================================================",
    );
    console.log(`[Run ID]:           ${finalAudit.id}`);
    console.log(`[Final State]:      ${finalAudit.status}`);
    console.log(`[SQL Queries Rec]:  Count: ${finalAudit.queries.length}`);
    console.log(
      `[Design Rules]:     Count: ${finalAudit.styles.filter((s) => s.rawStyle.startsWith("DESIGN_DIRECTIVE")).length}`,
    );
    console.log(
      `[React Code Size]:  ${finalAudit.targetTypeScriptComponent?.length || 0} code characters.`,
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
      iterationCount: 1,
      isSyntaxValidated: false,
    },
  });

  await coordinateStateGraph(nextRunId);
  console.log("\n🏁 Graph execution loop safely cycled down.");
}

startPipelineRun().catch((error) => {
  console.error("\n🚨 Monolithic orchestration failure:", error.message);
});
