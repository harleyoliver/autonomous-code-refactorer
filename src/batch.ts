import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ingestLegacyMesh } from "./utils/reader.js";
import { db } from "./utils/db.js";
import { workflow } from "./index.js"; // Import our compiled LangGraph engine

// Recursively find all target legacy files inside a directory
function findLegacyFiles(dir: string, fileList: string[] = []): string[] {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			findLegacyFiles(filePath, fileList);
		} else if (filePath.endsWith(".cfm")) {
			fileList.push(filePath);
		}
	}

	return fileList;
}

async function executeBatchRun() {
	console.log("Initiating Batch Processor...\n");

	const fixturesDir = path.join(process.cwd(), "fixtures");
	const targetFiles = findLegacyFiles(fixturesDir);

	if (targetFiles.length === 0) {
		console.log("No legacy files found to process.");
		return;
	}

	console.log(
		`Found ${targetFiles.length} legacy assets. Injecting into database...\n`,
	);

	const processingPromises = targetFiles.map(async (absolutePath) => {
		// 1. Convert absolute path to a clean relative path for insertion into the db
		const relativePath = path.relative(process.cwd(), absolutePath);

		// 2. Read the raw legacy code
		const fileMesh = await ingestLegacyMesh(relativePath);
		const runId = randomUUID();

		// 3. Register the file into the SQLite persistence ledger
		await db.pipelineRun.create({
			data: {
				id: runId,
				sourcePath: fileMesh.targetPath,
				fileType: "CFM_MAIN",
				rawSourceCode: fileMesh.sanitizedContent,
				status: "PENDING",
				humanApproval: "PENDING",
				iterationCount: 1,
				isSyntaxValidated: false,
			},
		});

		console.log(`Queued Run ID: ${runId} [${relativePath}]`);

		// 4. Trigger the LangGraph workflow asynchronously
		return workflow.invoke({ runId });
	});

	// 5. Fire all graph executions concurrently
	await Promise.all(processingPromises);

	console.log(
		"\nBatch injection complete. All graphs have hit their native breakpoints.",
	);
	console.log("Run approval script to authorize synthesis for all files.");
}

executeBatchRun().catch((error) => {
	console.error("\nBatch processing failure:", error.message);
});
