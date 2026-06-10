import fs from "node:fs";
import path from "node:path";
import { db } from "../utils/db.js";
import { synthesizedComponentSchema } from "../schemas/component.js";

/**
 * STATE-GRAPH NODE: MigratorAgent
 * Retrieves active design guidelines from the database, synthesizes a type-safe
 * React component, passes it through the schema firewall, and writes it to disk.
 */
export async function migratorAgentNode(runId: string): Promise<void> {
  console.log(
    `✨ [Node: MigratorAgent] Transmuting design tokens into modern React views for Run ID: ${runId}`,
  );

  // 1. Fetch active state context record from physical storage
  const record = await db.pipelineRun.findUnique({
    where: { id: runId },
    include: { queries: true, scripts: true, styles: true },
  });

  if (!record) {
    throw new Error(
      `[MigratorAgent] Missing database checkpoint state for Run ID: ${runId}`,
    );
  }

  try {
    // Artificial execution latency simulating semantic synthesis
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 2. High-Fidelity Responsive React Component Mock String
    const mockModernComponentCode = `
import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export default function InfrastructureStatus() {
  const [activeZone, setActiveZone] = useState('ZONE-B');

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <main className="max-w-7xl mx-auto p-6 bg-white shadow-md my-6 rounded-lg border border-slate-300">
        <h1 className="text-2xl font-bold text-[#002855] border-b-2 border-[#002855] pb-2 mb-4 flex items-center gap-2">
          <Activity className="text-[#FF8200]" /> Infrastructure SCADA Status
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <p className="text-sm font-semibold">Active Zone: {activeZone}</p>
            <p className="text-xs text-slate-500">Prisma ORM connected.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
    `.trim();

    // 3. Shape object arguments to conform to our semantic validation schema
    const rawAgentOutputPayload = {
      componentName: "InfrastructureStatus",
      targetTargetFolder: "src/components/modernized",
      generatedCode: mockModernComponentCode,
      usedDependencies: ["react", "lucide-react"],
    };

    console.log(
      "🛡️ [Node: MigratorAgent] Passing string code through component firewall guards...",
    );

    // 4. Assert strict Zod refinements (blocking legacy CF tags or presentation styles)
    const validatedComponent = synthesizedComponentSchema.parse(
      rawAgentOutputPayload,
    );
    console.log(
      "✅ [Node: MigratorAgent] Refinement metrics verified safe. No legacy leakage detected.",
    );

    // 5. Build directory structure if it doesn't exist
    const targetDirectory = path.join(
      process.cwd(),
      validatedComponent.targetTargetFolder,
    );
    const targetFilePath = path.join(
      targetDirectory,
      `${validatedComponent.componentName}.tsx`,
    );

    if (!fs.existsSync(targetDirectory)) {
      console.log(
        `📁 [Node: MigratorAgent] Creating missing directory structure at ${targetDirectory}`,
      );
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    // 6. Write the synthesized React component to the drive
    console.log(
      `💾 [Node: MigratorAgent] Writing modernized component to ${targetFilePath}`,
    );
    fs.writeFileSync(targetFilePath, validatedComponent.generatedCode, "utf-8");

    // 7. Apply the mutated component string and advance status parameters
    await db.pipelineRun.update({
      where: { id: runId },
      data: {
        status: "COMPLETED", // Safely promote the state-machine timeline to terminal success
        targetTypeScriptComponent: validatedComponent.generatedCode,
      },
    });

    console.log(
      `✅ [Node: MigratorAgent] Checkpoint saved. State successfully promoted to "COMPLETED".`,
    );
  } catch (error: any) {
    console.error(
      `🚨 [Node: MigratorAgent] Synthesis verification breach:`,
      error.message,
    );
    await db.pipelineRun.update({
      where: { id: runId },
      data: { status: "FAILED" },
    });
    await db.compilationError.create({
      data: {
        errorMessage: `Migrator schema breach: ${error.message}`,
        pipelineRunId: runId,
      },
    });
  }
}
