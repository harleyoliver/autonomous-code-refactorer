import * as fs from "node:fs/promises";
import * as path from "node:path";

export interface ExtractedPageMesh {
  targetPath: string;
  sanitizedContent: string;
  detectedIncludes: string[];
}

/**
 * Utility tool designed to scan and deconstruct legacy inclusion maps locally.
 */
export async function ingestLegacyMesh(
  relativeFilePath: string,
): Promise<ExtractedPageMesh> {
  const absolutePath = path.resolve(process.cwd(), relativeFilePath);

  try {
    const rawContent = await fs.readFile(absolutePath, "utf-8");

    // Regular expression targeting legacy 2015 server-side inclusion patterns
    const includeRegex = /<cfinclude\s+template=["']([^"']+)["']\s*\/?>/gi;
    const detectedIncludes: string[] = [];
    let match;

    // Iterate through code blocks to extract paths of fragment dependencies
    while ((match = includeRegex.exec(rawContent)) !== null) {
      if (match[1]) {
        detectedIncludes.push(match[1]);
      }
    }

    return {
      targetPath: relativeFilePath,
      sanitizedContent: rawContent,
      detectedIncludes,
    };
  } catch (error: any) {
    throw new Error(
      `Fatal execution failure during local file mapping: ${error.message}`,
    );
  }
}
