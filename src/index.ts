import "dotenv/config"; // Safely load environment configuration variables
import * as fs from "fs";
import * as path from "path";
import { db } from "./utils/db.js";
import { parserAgentNode } from "./agents/parser.js";
import { researcherAgentNode } from "./agents/researcher.js";
import { migratorAgentNode } from "./agents/migrator.js";

/**
 * STATE-GRAPH ROUTER
 * Directs traffic between nodes based on the current database status string
 * until a terminal status checkpoint (COMPLETED / FAILED) is logged.
 */
async function coordinateStateGraph(runId: string) {
  let pipelineActive = true;
  let safetyLoopBreaker = 0;

  console.log(
    `\n🌀 [State Graph Router] Initiating pipeline runner loop for Run: ${runId}`,
  );

  while (pipelineActive && safetyLoopBreaker < 12) {
    safetyLoopBreaker++;

    // Fetch the freshest, single-source-of-truth status from SQLite
    const currentRunState = await db.pipelineRun.findUnique({
      where: { id: runId },
    });

    if (!currentRunState) {
      console.error(`🚨 [Graph Router] Record lookup failed for ID: ${runId}`);
      pipelineActive = false;
      break;
    }

    console.log(
      `🔄 [Graph Router] Current Step Status: "${currentRunState.status}" (Cycle: ${safetyLoopBreaker})`,
    );

    switch (currentRunState.status) {
      case "PENDING":
        // Step 1: Run parsing, metrics, and regex tokenizer operations
        await parserAgentNode(runId);
        break;

      case "RESEARCHING":
        // Step 2: Run deep structural recommendations and architecture guidelines
        await researcherAgentNode(runId);
        break;

      case "MIGRATING":
        // Step 3: Synthesis of modernization templates & write code to disk
        await migratorAgentNode(runId);
        break;

      case "COMPLETED":
        console.log(
          `\n🎉 [Graph Router] Pipeline finished successfully! Terminal checkpoint reached.`,
        );
        pipelineActive = false;
        break;

      case "FAILED":
        console.log(
          `\n🚨 [Graph Router] Pipeline processing aborted due to internal validation errors.`,
        );
        pipelineActive = false;
        break;

      default:
        console.error(
          `🚨 [Graph Router] Encountered unrecognized status state: ${currentRunState.status}`,
        );
        pipelineActive = false;
        break;
    }
  }

  if (safetyLoopBreaker >= 12) {
    console.warn(
      "⚠️ [Graph Router] Circuit breaker triggered! Terminated to prevent an infinite loop.",
    );
  }
}

/**
 * APPLICATION ENTRY POINT
 * Initializes the database entry, extracts raw source files,
 * and passes management control to the state-graph orchestrator.
 */
async function bootstrapPipeline() {
  console.log("🏁 Launching Migration Analysis Engine...");

  const targetFileRelativePath = "fixtures/infrastructure-status.cfm";
  const absolutePath = path.resolve(targetFileRelativePath);

  // Validate the targeted file exists on disk
  if (!fs.existsSync(absolutePath)) {
    console.warn(`⚠️ Target file not found at: ${targetFileRelativePath}`);
    console.log(
      "Creating a sample legacy file to proceed with the analysis demo...",
    );

    // Auto-create a mock directory and legacy ColdFusion test file if missing
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(
      absolutePath,
      `
      <cfoutput>
        <h2>SCADA Overpressure Grid</h2>
        <cfquery name="GetPressureAlerts" datasource="scada_db">
          SELECT alert_id, pressure_psi, node_location
          FROM pressure_readings
          WHERE alert_level = 'CRITICAL'
        </cfquery>
        
        <table border="1" cellpadding="5" cellspacing="0">
          <cfloop query="GetPressureAlerts">
            <tr><td>#node_location# (Alert)</td></tr>
          </cfloop>
        </table>
      </cfoutput>
    `.trim(),
    );
  }

  // Read file data
  const rawFileContents = fs.readFileSync(absolutePath, "utf8");

  // Establish unique transaction variables
  const nextRunId = `run_${Date.now()}`;
  const fileMesh = {
    targetPath: targetFileRelativePath,
    sanitizedContent: rawFileContents,
  };

  // Create the persistent database record tracking our pipeline process
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

  console.log(
    `💾 [Database Initialized] Saved run record "${nextRunId}" to SQLite.`,
  );

  // Delegate control to the state graph router loop
  await coordinateStateGraph(nextRunId);
}

// Fire the application
bootstrapPipeline()
  .catch((err) =>
    console.error("🚨 Pipeline crash during bootstrap:", err.message),
  )
  .finally(() => db.$disconnect());
