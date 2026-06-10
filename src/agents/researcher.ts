import { db } from "../utils/db.js";

/**
 * STATE-GRAPH NODE: ResearcherAgent
 * Pulls the current run metrics from the database, runs a localized design-token
 * cross-reference map, and promotes the state checkpoint to "MIGRATING".
 */
export async function researcherAgentNode(runId: string): Promise<void> {
	console.log(
		`[Node: ResearcherAgent] Executing semantic design-token mapping for Run ID: ${runId}`,
	);

	// Fetch the run checkpoint tracking record
	const record = await db.pipelineRun.findUnique({
		where: { id: runId },
		include: { queries: true, scripts: true },
	});

	if (!record) {
		throw new Error(
			`[ResearcherAgent] Database record missing for Run ID: ${runId}`,
		);
	}

	// Artificial execution latency
	await new Promise((resolve) => setTimeout(resolve, 400));

	const systemDesignTokens: string[] = [];

	// Localized Matching Rules
	if (record.layoutTablesCount > 0) {
		systemDesignTokens.push(
			"Rebuild legacy nested layout tables with responsive Tailwind HTML grid rows.",
		);
	}
	if (record.queries.length > 0) {
		systemDesignTokens.push(
			"Refactor direct inline raw sql query blocks to safe Prisma ORM operations.",
		);
	}
	systemDesignTokens.push(
		"Isolate system status logic blocks into native TypeScript services.",
	);

	console.log(
		`[Node: ResearcherAgent] Extracted ${systemDesignTokens.length} corporate layout directives.`,
	);

	// Save matching design tokens and ADVANCE TO MIGRATING
	await db.pipelineRun.update({
		where: { id: runId },
		data: {
			status: "MIGRATING",
			styles: {
				create: systemDesignTokens.map((token) => ({
					rawStyle: `DESIGN_DIRECTIVE: ${token}`,
				})),
			},
		},
	});

	console.log(
		`[Node: ResearcherAgent] Checkpoint saved. State successfully promoted to "MIGRATING".`,
	);
}
