export interface TokenExtractionResult {
  queries: string[];
  scripts: string[];
  layoutTablesCount: number;
}

/**
 * Technical debt tokenizer designed to inspect, match, and extract
 * embedded monolithic operations from a raw source string buffer.
 */
export function tokenizeLegacyDebt(rawSource: string): TokenExtractionResult {
  // Regex parsing boundaries matching multi-line blocks tags
  const queryRegex = /<cfquery[^>]*>([\s\S]*?)<\/cfquery>/gi;
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const tableRegex = /<table[^>]*>/gi;

  const queries: string[] = [];
  const scripts: string[] = [];

  let match;

  // Isolate and extract all embedded database queries
  while ((match = queryRegex.exec(rawSource)) !== null) {
    if (match[1]) {
      queries.push(match[1].trim());
    }
  }

  // Isolate and extract all client-side global scripts
  while ((match = scriptRegex.exec(rawSource)) !== null) {
    if (match[1]) {
      scripts.push(match[1].trim());
    }
  }

  // Calculate high-level layout table density metrics
  const tableMatches = rawSource.match(tableRegex);
  const layoutTablesCount = tableMatches ? tableMatches.length : 0;

  return {
    queries,
    scripts,
    layoutTablesCount,
  };
}
