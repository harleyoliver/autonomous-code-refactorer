-- CreateTable
CREATE TABLE "PipelineRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourcePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "rawSourceCode" TEXT NOT NULL,
    "targetTypeScriptComponent" TEXT,
    "status" TEXT NOT NULL,
    "humanApproval" TEXT NOT NULL,
    "iterationCount" INTEGER NOT NULL,
    "isSyntaxValidated" BOOLEAN NOT NULL,
    "layoutTablesCount" INTEGER NOT NULL DEFAULT 0,
    "spacerGifsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SqlQuery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rawSql" TEXT NOT NULL,
    "pipelineRunId" TEXT NOT NULL,
    CONSTRAINT "SqlQuery_pipelineRunId_fkey" FOREIGN KEY ("pipelineRunId") REFERENCES "PipelineRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InlineScript" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rawScript" TEXT NOT NULL,
    "pipelineRunId" TEXT NOT NULL,
    CONSTRAINT "InlineScript_pipelineRunId_fkey" FOREIGN KEY ("pipelineRunId") REFERENCES "PipelineRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InlineStyle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rawStyle" TEXT NOT NULL,
    "pipelineRunId" TEXT NOT NULL,
    CONSTRAINT "InlineStyle_pipelineRunId_fkey" FOREIGN KEY ("pipelineRunId") REFERENCES "PipelineRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompilationError" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "errorMessage" TEXT NOT NULL,
    "pipelineRunId" TEXT NOT NULL,
    CONSTRAINT "CompilationError_pipelineRunId_fkey" FOREIGN KEY ("pipelineRunId") REFERENCES "PipelineRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
