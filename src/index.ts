import "dotenv/config";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { parserAgentNode } from "./agents/parser.js";
import { researcherAgentNode } from "./agents/researcher.js";
import { migratorAgentNode } from "./agents/migrator.js";
import { criticAgentNode } from "./agents/critic.js";
import { db } from "./utils/db.js";

// 1. Define the LangGraph State Channel
const GraphState = Annotation.Root({
	runId: Annotation<string>(),
});

// 2. Wrap db agents into formal LangGraph Nodes
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

// 3. Boot Router
async function routeFromStart(state: typeof GraphState.State) {
	const record = await db.pipelineRun.findUnique({
		where: { id: state.runId },
	});

	if (!record) return END;

	console.log(
		`\n[Graph Boot] Resuming execution from checkpoint: "${record.status}"`,
	);

	// Jump to the correct node based on the state in db
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

// 4. The Standard Edge Router (Evaluates state after every node)
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
			// HitL Intterupt Gate
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

	// Conditionally route from START based on the database
	.addConditionalEdges(START, routeFromStart)

	// Conditionally route after every node finishes
	.addConditionalEdges("parser", routeNextNode)
	.addConditionalEdges("researcher", routeNextNode)
	.addConditionalEdges("migrator", routeNextNode)
	.addConditionalEdges("critic", routeNextNode);

export const workflow = builder.compile();

// 6. External Re-Awakening Gateway (Currently called by approve-run.ts)
export async function resumePipelineRun(runId: string) {
	console.log(`\nRe-awakening LangGraph State Machine for Run ID: ${runId}`);

	// Re-inject the runId so LangGraph hits START -> routeFromStart -> Migrator
	await workflow.invoke({ runId });
}
