import "dotenv/config";
import { randomUUID } from "node:crypto";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { ingestLegacyMesh } from "./utils/reader.js";
import { parserAgentNode } from "./agents/parser.js";
import { researcherAgentNode } from "./agents/researcher.js";
import { migratorAgentNode } from "./agents/migrator.js";
import { db } from "./utils/db.js";

// 1. Define the LangGraph State Channel
// This tells the graph exactly what data object is passed between nodes
const GraphState = Annotation.Root({
  runId: Annotation<string>(),
});

// 2. Wrap existing database agents into formal LangGraph Nodes
async function runParser(state: typeof GraphState.State) {
  await parserAgentNode(state.runId);
  return {}; // Nodes must return a partial state update; this is fully managed by SQLite
}

async function runResearcher(state: typeof GraphState.State) {
  await researcherAgentNode(state.runId);
  return {};
}

async function runMigrator(state: typeof GraphState.State) {
  await migratorAgentNode(state.runId);
  return {};
}

// 3. Define the Conditional Routing Edge
// This acts as the central brain, reading the SQLite status and steering the graph
async function routeNextNode(state: typeof GraphState.State) {
  const record = await db.pipelineRun.findUnique({
    where: { id: state.runId },
  });

  if (!record) {
    console.error(
      `🚨 [Graph Router] Missing database record for ID: ${state.runId}`,
    );
    return END;
  }

  console.log(
    `\n🔀 [Graph Router] Intercepted Database Status: "${record.status}"`,
  );

  // Map the database string to the exact name of the next LangGraph Node
  switch (record.status) {
    case "PENDING":
      return "parser";
    case "RESEARCHING":
      return "researcher";
    case "MIGRATING":
      return "migrator";
    case "COMPLETED":
      console.log(`🎉 [Graph Router] Terminal State Reached. Exiting graph.`);
      return END;
    case "FAILED":
      console.error(
        `🛑 [Graph Router] Pipeline Failure Detected. Halting execution.`,
      );
      return END;
    default:
      return END;
  }
}

// 4. Compile the Mathematical StateGraph Blueprint
const builder = new StateGraph(GraphState)
  .addNode("parser", runParser)
  .addNode("researcher", runResearcher)
  .addNode("migrator", runMigrator)

  // The graph always starts at the parser
  .addEdge(START, "parser")

  // After any node finishes, check the database to decide where to go next
  .addConditionalEdges("parser", routeNextNode)
  .addConditionalEdges("researcher", routeNextNode)
  .addConditionalEdges("migrator", routeNextNode);

// Freeze the blueprint into an executable workflow engine
const workflow = builder.compile();

// 5. Pipeline Entry Point
async function startPipelineRun() {
  console.log("🔄 Bootstrapping LangGraph state-machine architecture...\n");
  const targetPath = "fixtures/infrastructure-status.cfm";

  const fileMesh = await ingestLegacyMesh(targetPath);
  const nextRunId = randomUUID();

  // Initialize our SQLite memory bank
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

  console.log(`🎬 Beginning LangGraph Execution for Run ID: ${nextRunId}\n`);

  // Execute the compiled graph, injecting the initial state
  await workflow.invoke({ runId: nextRunId });

  console.log("\n🏁 LangGraph execution safely cycled down.");
}

startPipelineRun().catch((error) => {
  console.error("\n🚨 Monolithic orchestration failure:", error.message);
});
