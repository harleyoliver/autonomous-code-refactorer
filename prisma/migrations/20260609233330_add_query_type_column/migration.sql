-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SqlQuery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rawSql" TEXT NOT NULL,
    "queryType" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "pipelineRunId" TEXT NOT NULL,
    CONSTRAINT "SqlQuery_pipelineRunId_fkey" FOREIGN KEY ("pipelineRunId") REFERENCES "PipelineRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SqlQuery" ("id", "pipelineRunId", "rawSql") SELECT "id", "pipelineRunId", "rawSql" FROM "SqlQuery";
DROP TABLE "SqlQuery";
ALTER TABLE "new_SqlQuery" RENAME TO "SqlQuery";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
