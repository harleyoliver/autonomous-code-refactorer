export interface ExtractedQueryObj {
  rawSql: string;
  queryType: "READ" | "WRITE" | "UNKNOWN";
}

export interface TokenExtractionResult {
  queries: ExtractedQueryObj[];
  scripts: string[];
  layoutTablesCount: number;
}

/**
 * Text tokenizer that scans a raw string buffer, extracts embedded code tags,
 * and categorizes database operations based on standard text matching.
 */
export function tokenizeLegacyDebt(rawSource: string): TokenExtractionResult {
  const queryRegex = /<cfquery[^>]*>([\s\S]*?)<\/cfquery>/gi;
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const tableRegex = /<table[^>]*>/gi;

  const queries: ExtractedQueryObj[] = [];
  const scripts: string[] = [];
  let match;

  // Isolate and classify database query strings
  while ((match = queryRegex.exec(rawSource)) !== null) {
    if (match[1]) {
      const cleanSql = match[1].trim();
      const upperSql = cleanSql.toUpperCase();

      // Standard text matching to determine database interaction type
      let type: "READ" | "WRITE" | "UNKNOWN" = "UNKNOWN";
      if (upperSql.includes("SELECT")) {
        type = "READ";
      } else if (
        upperSql.includes("UPDATE") ||
        upperSql.includes("INSERT") ||
        upperSql.includes("DELETE")
      ) {
        type = "WRITE";
      }

      queries.push({
        rawSql: cleanSql,
        queryType: type,
      });
    }
  }

  // Isolate user scripts
  while ((match = scriptRegex.exec(rawSource)) !== null) {
    if (match[1]) {
      scripts.push(match[1].trim());
    }
  }

  const tableMatches = rawSource.match(tableRegex);
  const layoutTablesCount = tableMatches ? tableMatches.length : 0;

  return {
    queries,
    scripts,
    layoutTablesCount,
  };
}
