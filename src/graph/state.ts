/**
 * Strict union typing enforcing valid target modern files vs legacy extractions
 */
export type IngestionFileType = "CFM_MAIN" | "CFM_INCLUDE" | "HTML_STATIC";

export type IngestionStatus =
  | "PENDING"
  | "PARSING"
  | "RESEARCHING"
  | "SYNTHESIZING"
  | "VALIDATING"
  | "INTERRUPTED"
  | "COMPLETED"
  | "FAILED";

export type HumanApprovalState = "PENDING" | "APPROVED" | "REJECTED";

/**
 * Interface representing a granular data capture of legacy technical debt metrics
 */
export interface ExtractedLegacyDebt {
  readonly rawSqlBlocks: string[];
  readonly inlineScriptBlocks: string[];
  readonly inlineStyles: string[];
  readonly layoutTablesCount: number;
  readonly spacerGifsCount: number;
}

/**
 * The Central Shared Source of Truth Ledger for the Ingestion Framework
 * Enforces absolute data control using strict type bounds.
 */
export interface MigrationGraphState {
  // Input File Telemetry
  readonly fileId: string;
  readonly sourcePath: string;
  readonly fileType: IngestionFileType;

  // Asynchronous Content Buffers
  rawSourceCode: string;
  targetTypeScriptComponent: string | null;

  // Isolated Debt Capture
  extractedDebt: ExtractedLegacyDebt | null;

  // Dynamic System Error Registry
  compilationErrors: string[];

  // State Machine Operations Boundary Checkers
  status: IngestionStatus;
  humanApproval: HumanApprovalState;
  iterationCount: number;
  isSyntaxValidated: boolean;
}
