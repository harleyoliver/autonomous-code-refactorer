import "dotenv/config";
import { ingestLegacyMesh } from "./utils/reader.js";
import { invokeArmedDebtParser } from "./utils/bedrock.js";

async function startPipelineRun() {
  console.log("🔄 Launching armed transport integration test...\n");

  const targetPath = "fixtures/legacy-intranet/index.cfm";

  // 1. Ingest the file mesh locally
  const fileMesh = await ingestLegacyMesh(targetPath);
  console.log(
    `📂 Loaded source code asset: ${fileMesh.targetPath} (${fileMesh.sanitizedContent.length} characters)`,
  );

  // 2. Dispatch straight to the specialized transport method
  // Set the second argument to 'false' if you want to test your live AWS ticket status!
  const rawServiceResponse = await invokeArmedDebtParser(
    fileMesh.sanitizedContent,
    true,
  );

  console.log("\n🤖 Raw Gateway Service Response Envelope Received:");
  console.log(
    "======================================================================",
  );
  console.log(rawServiceResponse);
  console.log(
    "======================================================================",
  );
  console.log("\n🏁 Run cycle concluded with clean encapsulation boundaries.");
}

startPipelineRun().catch((error) => {
  console.error(
    "\n🚨 Pipeline orchestrator encountered an unexpected exception:",
    error.message,
  );
});
