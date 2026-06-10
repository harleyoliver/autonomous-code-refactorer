import "dotenv/config";
import { randomUUID } from "node:crypto";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { ingestLegacyMesh } from "./utils/reader.js";
import { parserAgentNode } from "./agents/parser.js";
import { researcherAgentNode } from "./agents/researcher.js";
import { migratorAgentNode } from "./agents/migrator.js";
import { criticAgentNode } from "./agents/critic.js";
import { db } from "./utils/db.js";

// 1. Define the LangGraph State Channel
const GraphState = Annotation.Root({
	runId: Annotation<string>(),
});

// 2. Wrap existing agents into LangGraph Nodes
async function runParser(state: typeof GraphState.State) {
	await parserAgentNode(state.runId);
	return {};
}

async function runResearcher(state: typeof GraphState.State) {
	await researcherAgentNode(state.runId);
	return {};
}

async function runMigrator(state: typeof GraphState.State) {
	await migratorAgentNode(state.runId);
	return {};
}

async function runCritic(state: typeof GraphState.State) {
	await criticAgentNode(state.runId);
	return {};
}

// 3. NEW: The Intelligent Boot Router (Runs immediately on START)
async function routeFromStart(state: typeof GraphState.State) {
	const record = await db.pipelineRun.findUnique({
		where: { id: state.runId },
	});

	if (!record) return END;

	console.log(
		`\n[Graph Boot] Resuming execution from checkpoint: "${record.status}"`,
	);

	// Jump straight to the correct node based on the physical database state!
	switch (record.status) {
		case "PENDING":
			return "parser";
		case "RESEARCHING":
			return "researcher";
		case "MIGRATING":
			return "migrator";
		case "CRITIQUING":
			return "critic";
		default:
			return END;
	}
}

// 4. EXISTING: The Standard Edge Router
async function routeNextNode(state: typeof GraphState.State) {
	const record = await db.pipelineRun.findUnique({
		where: { id: state.runId },
	});
	if (!record) return END;

	console.log(`\n[Graph Router] State advanced to: "${record.status}"`);

	switch (record.status) {
		case "PENDING":
			return "parser";
		case "RESEARCHING":
			return "researcher";
		case "MIGRATING":
			if (record.humanApproval === "PENDING") {
				console.log(
					`[Graph Router] EXECUTION HALTED: Awaiting human review.`,
				);
				return END;
			}
			return "migrator";
		case "CRITIQUING":
			return "critic";
		case "COMPLETED":
			console.log(
				`[Graph Router] Terminal State Reached. Exiting graph.`,
			);
			return END;
		case "FAILED":
			console.error(`[Graph Router] Pipeline Failure Detected.`);
			return END;
		default:
			return END;
	}
}

// 5. Compile the Stateless Blueprint
const builder = new StateGraph(GraphState)
	.addNode("parser", runParser)
	.addNode("researcher", runResearcher)
	.addNode("migrator", runMigrator)
	.addNode("critic", runCritic)

	// 👈 THE FIX: We dynamically route from START instead of hardcoding to parser
	.addConditionalEdges(START, routeFromStart)

	.addConditionalEdges("parser", routeNextNode)
	.addConditionalEdges("researcher", routeNextNode)
	.addConditionalEdges("migrator", routeNextNode)
	.addConditionalEdges("critic", routeNextNode);

export const workflow = builder.compile();

// 6. Initial Pipeline Entry Point
async function startPipelineRun() {
	console.log("Bootstrapping LangGraph state-machine architecture...\n");
	const targetPath = "fixtures/infrastructure-status.cfm";

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

	console.log(`Beginning LangGraph Execution for Run ID: ${nextRunId}`);
	await workflow.invoke({ runId: nextRunId });
	console.log(
		"\nLangGraph execution hit native breakpoint. Awaiting human approval.",
	);
}

// 7. External Re-Awakening Gateway
export async function resumePipelineRun(runId: string) {
	console.log(`\nRe-awakening LangGraph State Machine for Run ID: ${runId}`);

	// Pass the state payload again so LangGraph can query the db
	await workflow.invoke({ runId });
}

if (process.argv[1].endsWith("index.ts")) {
	startPipelineRun().catch((error) => {
		console.error("\nMonolithic orchestration failure:", error.message);
	});
}
