import "dotenv/config";
import { randomUUID } from "node:crypto";
import { ingestLegacyMesh } from "./utils/reader.js";
import { invokeArmedDebtParser } from "./utils/bedrock.js";
import { legacyDebtAnalysisSchema } from "./schemas/validation.js";
import { db } from "./utils/db.js"; // Prisma v7 configured instance

async function startPipelineRun() {
  console.log("🔄 Launching persistent telemetry execution loop...\n");

  const targetPath = "fixtures/legacy-intranet/index.cfm";

  // 1. Ingest local legacy asset mesh
  const fileMesh = await ingestLegacyMesh(targetPath);
  console.log(
    `📂 Loaded source code asset: ${fileMesh.targetPath} (${fileMesh.sanitizedContent.length} characters)`,
  );

  // 2. Dispatch payload to the transport layer (mock-fallback active)
  const rawServiceResponse = await invokeArmedDebtParser(
    fileMesh.sanitizedContent,
    true,
  );
  console.log("📡 Response envelope captured from service gateway.");

  try {
    // 3. Unpack the tool usage structure emitted by the model client
    const envelope = JSON.parse(rawServiceResponse);
    const toolInputArguments = envelope.tool_use.input;

    console.log(
      "🛡️ Passing tool arguments through Zod runtime validation barriers...",
    );
    const validatedData = legacyDebtAnalysisSchema.parse(toolInputArguments);
    console.log(
      "✅ Validation clear. Mapping tokens directly to SQLite data layers...",
    );

    // 4. Generate unique tracking identifiers
    const runId = randomUUID();

    // 5. Execute an atomic Prisma write transaction
    const persistedRecord = await db.pipelineRun.create({
      data: {
        id: runId,
        sourcePath: validatedData.fileTarget,
        fileType: "CFM_MAIN",
        rawSourceCode: fileMesh.sanitizedContent,
        targetTypeScriptComponent: null,
        status: "RESEARCHING",
        humanApproval: "PENDING",
        iterationCount: 1,
        isSyntaxValidated: false,
        layoutTablesCount: validatedData.metrics.layoutTablesCount,
        spacerGifsCount: validatedData.metrics.spacerGifsCount,

        // Populate nested relational sub-tables simultaneously
        queries: {
          create: validatedData.extractedQueries.map((q) => ({ rawSql: q })),
        },
        scripts: {
          create: validatedData.inlineScripts.map((s) => ({ rawScript: s })),
        },
        styles: {
          create: validatedData.styleInjections.map((st) => ({ rawStyle: st })),
        },
      },
      include: {
        queries: true,
        scripts: true,
      },
    });

    // 6. Echo out transaction telemetry to console
    console.log("\n💾 Relational SQL Database Sync Successful!");
    console.log(
      "======================================================================",
    );
    console.log(`[Database ID]:     ${persistedRecord.id}`);
    console.log(`[Saved Path]:      ${persistedRecord.sourcePath}`);
    console.log(`[Status Level]:    ${persistedRecord.status}`);
    console.log(
      `[Extracted Rows]:  Queries: ${persistedRecord.queries.length}, Scripts: ${persistedRecord.scripts.length}`,
    );
    console.log(
      "======================================================================",
    );
  } catch (error: any) {
    console.error(
      "\n🚨 Pipeline execution crashed during ingestion processing loop:",
    );
    if (error && error.errors) {
      console.error(JSON.stringify(error.errors, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

startPipelineRun().catch((error) => {
  console.error(
    "\n🚨 Fatal exception unhandled at orchestrator level:",
    error.message,
  );
});
