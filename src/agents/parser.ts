import { tokenizeLegacyDebt } from "../utils/tokenizer.js";
import { legacyDebtAnalysisSchema } from "../schemas/validation.js";
import { invokeArmedDebtParser } from "../utils/bedrock.js";
import { db } from "../utils/db.js";

/**
 * STATE-GRAPH NODE: ParserAgent
 * Opens the target file, queries Amazon Nova Lite for analysis,
 * extracts and parses the JSON data block safely, validates the combined
 * fields against our schemas, and writes the results to SQLite.
 */
export async function parserAgentNode(runId: string): Promise<void> {
	console.log(`[Node: ParserAgent] Fetching data row for Run ID: ${runId}`);

	// 1. Fetch the raw record from our local database
	const record = await db.pipelineRun.findUnique({ where: { id: runId } });
	if (!record || !record.rawSourceCode) {
		throw new Error(
			`[ParserAgent] Missing database record data for Run ID: ${runId}`,
		);
	}

	try {
		// 2. Extract technical metrics locally using regular expressions
		const debtTokens = tokenizeLegacyDebt(record.rawSourceCode);

		// 3. Determine if we are running in Offline Mode via environment variable
		const offlineModeActive = process.env.OFFLINE_MODE === "true";
		if (offlineModeActive) {
			console.log(
				"ℹ[ParserAgent] Offline mode detected in environment variables.",
			);
		} else {
			console.log(
				"[ParserAgent] Running in LIVE mode. Connecting to Bedrock API...",
			);
		}

		// 4. Request analysis from Amazon Bedrock (or mock engine if offline)
		const rawCloudResponse = await invokeArmedDebtParser(
			record.rawSourceCode,
			offlineModeActive,
		);

		// 5. Robust JSON Extraction Logic
		// Find the first occurrence of '{' and the last occurrence of '}' to skip conversational fluff
		const firstBracketIdx = rawCloudResponse.indexOf("{");
		const lastBracketIdx = rawCloudResponse.lastIndexOf("}");

		if (
			firstBracketIdx === -1 ||
			lastBracketIdx === -1 ||
			lastBracketIdx < firstBracketIdx
		) {
			throw new Error(
				`Could not locate a valid JSON object structure inside the model response: \n"${rawCloudResponse}"`,
			);
		}

		// Extract only the text sitting inside the outer curly brackets
		const cleanJsonText = rawCloudResponse.substring(
			firstBracketIdx,
			lastBracketIdx + 1,
		);

		// Parse the extracted string into a standard JavaScript object
		const cloudData = JSON.parse(cleanJsonText);

		// 6. Build our unified tracking object structure
		const rawPayloadObject = {
			fileTarget: record.sourcePath,
			hasServerSideLogic:
				typeof cloudData.hasServerSideLogic === "boolean"
					? cloudData.hasServerSideLogic
					: true,
			extractedQueries: debtTokens.queries,
			inlineScripts: debtTokens.scripts,
			styleInjections: ["border: 1px solid #slate-300"],
			metrics: {
				layoutTablesCount: debtTokens.layoutTablesCount,
				spacerGifsCount: 0,
				marginHacksCount: 0,
			},
			proposedNextSteps:
				Array.isArray(cloudData.proposedNextSteps) &&
				cloudData.proposedNextSteps.length > 0
					? cloudData.proposedNextSteps
					: ["Review database migration steps manually."],
		};

		// 7. Assert runtime verification via our schema firewall
		const validatedData = legacyDebtAnalysisSchema.parse(rawPayloadObject);

		// 8. Save structural records and advance the status flag to RESEARCHING
		await db.pipelineRun.update({
			where: { id: runId },
			data: {
				status: "RESEARCHING",
				layoutTablesCount: validatedData.metrics.layoutTablesCount,
				spacerGifsCount: validatedData.metrics.spacerGifsCount,
				queries: {
					create: validatedData.extractedQueries.map((q) => ({
						rawSql: q.rawSql,
						queryType: q.queryType,
					})),
				},
				scripts: {
					create: validatedData.inlineScripts.map((s) => ({
						rawScript: s,
					})),
				},
				styles: {
					create: validatedData.styleInjections.map((st) => ({
						rawStyle: st,
					})),
				},
			},
		});

		console.log(
			`[Node: ParserAgent] Checkpoint saved. Status advanced to "RESEARCHING".`,
		);
	} catch (error: any) {
		console.error(
			`[Node: ParserAgent] Loop processing error:`,
			error.message,
		);

		// Mark the record as failed in the database so the orchestrator can react
		await db.pipelineRun.update({
			where: { id: runId },
			data: { status: "FAILED" },
		});

		// Record the specific compilation error message to our relational logs
		await db.compilationError.create({
			data: {
				errorMessage: `Parser validation failure: ${error.message}`,
				pipelineRunId: runId,
			},
		});
	}
}
