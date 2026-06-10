import "dotenv/config";
import { db } from "./utils/db.js";
import { resumePipelineRun } from "./index.js";

async function executeHumanApproval() {
	console.log("Scanning database for paused graph executions...\n");

	// Find the latest run that is paused at the gate
	const pendingRun = await db.pipelineRun.findFirst({
		where: {
			status: "MIGRATING",
			humanApproval: "PENDING",
		},
		orderBy: { createdAt: "desc" },
	});

	if (!pendingRun) {
		console.log(
			"Workspace Clear: No pipeline runs currently require human authorization.",
		);
		return;
	}

	console.log(
		"======================================================================",
	);
	console.log(
		`[SECURITY GATE] Authorization Requested for Run: ${pendingRun.id}`,
	);
	console.log(`Target File: ${pendingRun.sourcePath}`);
	console.log(
		"======================================================================\n",
	);

	// 1. Mutate the persistence layer to explicitly grant authorization
	await db.pipelineRun.update({
		where: { id: pendingRun.id },
		data: { humanApproval: "APPROVED" },
	});

	console.log(
		`[Human Approver] Authorization applied. Persistence layer updated.`,
	);

	// 2. Re-awaken the dormant LangGraph engine
	await resumePipelineRun(pendingRun.id);
}

executeHumanApproval().catch((error) => {
	console.error("\nApproval execution failure:", error.message);
});
