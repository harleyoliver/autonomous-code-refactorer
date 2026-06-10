import { db } from "../utils/db.js";

/**
 * STATE-GRAPH NODE: CriticAgent
 * Inspects the synthesized React component for security flaws, legacy leaks,
 * or linting errors. Routes back to Migrator Agent on failure, or COMPLETED on success.
 */
export async function criticAgentNode(runId: string): Promise<void> {
	console.log(
		`[Node: CriticAgent] Inspecting synthesized code for Run ID: ${runId}`,
	);

	const record = await db.pipelineRun.findUnique({ where: { id: runId } });

	if (!record || !record.targetTypeScriptComponent) {
		throw new Error(
			`[CriticAgent] Missing code payload for Run ID: ${runId}`,
		);
	}

	// 1. The Anti-Infinite Loop Guardrail
	if (record.iterationCount >= 3) {
		console.error(
			`[Node: CriticAgent] Maximum retry iterations reached. Forcing pipeline failure.`,
		);
		await db.pipelineRun.update({
			where: { id: runId },
			data: { status: "FAILED" },
		});
		return;
	}

	// Artificial execution latency
	await new Promise((resolve) => setTimeout(resolve, 300));

	// 2. Static Code Analysis (Simulated Linting/Security Check)
	const generatedCode = record.targetTypeScriptComponent;

	// Example rule: Enterprise policy forbids the use of raw eval() or localStorage without wrappers
	const hasSecurityFlaw =
		generatedCode.includes("eval(") ||
		generatedCode.includes("localStorage");

	if (hasSecurityFlaw) {
		console.log(
			`[Node: CriticAgent] Security flaw detected. Routing back to Migrator for Iteration ${record.iterationCount + 1}.`,
		);

		// Demote the status, wipe the offending code, and increment the retry counter
		await db.pipelineRun.update({
			where: { id: runId },
			data: {
				status: "MIGRATING",
				iterationCount: record.iterationCount + 1,
				targetTypeScriptComponent: null,
			},
		});

		await db.compilationError.create({
			data: {
				errorMessage:
					"Critic rejected code: Unsafe browser APIs detected.",
				pipelineRunId: runId,
			},
		});
	} else {
		console.log(
			`[Node: CriticAgent] Code passes all enterprise static analysis rules.`,
		);

		// Grant final approval and close the loop
		await db.pipelineRun.update({
			where: { id: runId },
			data: { status: "COMPLETED" },
		});
	}
}
