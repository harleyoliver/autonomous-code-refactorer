import "dotenv/config";
import { db } from "./utils/db.js";

async function inspectLatestRun() {
  console.log(
    "\n🔍 Querying SQLite database for the latest transaction run...\n",
  );

  // Dynamically fetch the absolute latest run based on creation time
  const latestRun = await db.pipelineRun.findFirst({
    orderBy: { createdAt: "desc" },
    include: { queries: true, scripts: true, styles: true },
  });

  if (!latestRun) {
    console.log("🚨 No pipeline runs found in the database.");
    return;
  }

  console.log(
    "======================================================================",
  );
  console.log(`📡 [RUN ID]:       ${latestRun.id}`);
  console.log(`📁 [SOURCE PATH]:  ${latestRun.sourcePath}`);
  console.log(`🚦 [STATUS]:       ${latestRun.status}`);
  console.log(`🔄 [ITERATIONS]:   ${latestRun.iterationCount}`);
  console.log(
    "======================================================================\n",
  );

  console.log("📊 [Extracted Technical Debt Metrics]:");
  console.log(`  • Layout Tables Count:  ${latestRun.layoutTablesCount}`);
  console.log(`  • Spacer GIFs Count:    ${latestRun.spacerGifsCount}\n`);

  console.log("🎨 [Design Directives & Style Injections]:");
  latestRun.styles.forEach((s) => console.log(`  • ${s.rawStyle}`));
  console.log("");

  console.log("🗄️  [Extracted Legacy SQL Queries]:");
  latestRun.queries.forEach((q, i) => {
    console.log(`  [Query ${i + 1}] Type: ${q.queryType || "UNKNOWN"}`);
    console.log(`  SQL:  ${q.rawSql}\n`);
  });

  console.log("✨ [Modernized TypeScript React Component Output]:");

  // Read the code directly from our relational SQLite table!
  if (latestRun.targetTypeScriptComponent) {
    console.log(
      "\n----------------------------------------------------------------------",
    );
    console.log(latestRun.targetTypeScriptComponent);
    console.log(
      "----------------------------------------------------------------------\n",
    );
  } else {
    console.log("  ⚠️ No component code found in the database for this run.");
  }
}

inspectLatestRun().catch((error) => {
  console.error("🚨 Inspector script crashed:", error.message);
});
