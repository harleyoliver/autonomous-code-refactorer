import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Initialize the AWS communication client using the region from your .env file
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * Sends code text over the network to Amazon Nova Lite for structured analysis.
 * If fallbackActive is true, it skips the network and returns a simple template string.
 */
export async function invokeArmedDebtParser(
  rawCode: string,
  fallbackActive: boolean,
): Promise<string> {
  if (fallbackActive) {
    console.log(
      "ℹ️ [AWS Bedrock] Simulation active: Returning local template data.",
    );
    return JSON.stringify({
      hasServerSideLogic: true,
      proposedNextSteps: [
        "Isolate inline raw SQL and replace with programmatic Prisma ORM queries.",
        "Refactor legacy ColdFusion nested <table border='1'> layouts to clean Tailwind CSS tables.",
        "Secure overpressure monitoring alerts behind custom Next.js API authorization hooks.",
      ],
    });
  }

  console.log(
    "📡 [AWS Bedrock] Establishing live connection to Amazon Nova Lite...",
  );

  const modelId = "amazon.nova-lite-v1:0";

  // Prompt forcing the AI engine to output clean, predictable data formats
  const promptText = `
You are a software migration utility. Analyze this legacy code block.
You must return a raw JSON object matching this exact format:
{
  "hasServerSideLogic": true,
  "proposedNextSteps": ["Step 1 description text", "Step 2 description text"]
}
Do not write any markdown code blocks, conversational introductions, or commentary. Return only the raw JSON object string.

Legacy Source Code:
${rawCode}
  `;

  const command = new InvokeModelCommand({
    modelId: modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: [{ text: promptText }],
        },
      ],
      inferenceConfig: {
        temperature: 0.1,
        maxTokens: 2000,
      },
    }),
  });

  const response = await client.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsedData = JSON.parse(responseBody);

  return parsedData.output.message.content[0].text;
}

/**
 * Sends legacy CFML and extracted parameters to Amazon Nova Lite to output a clean TSX/Tailwind component.
 * Supports offline simulation mode.
 */
export async function invokeArmedDebtMigrator(
  rawCode: string,
  queries: string[],
  directives: string[],
  fallbackActive: boolean,
): Promise<string> {
  if (fallbackActive) {
    return `
import React from 'react';

interface PressureReading {
  alertId: string;
  pressurePsi: number;
  nodeLocation: string;
}

interface ModernGridProps {
  alerts?: PressureReading[];
}

export const OverpressureMonitorGrid: React.FC<ModernGridProps> = ({ 
  alerts = [
    { alertId: "1", pressurePsi: 145, nodeLocation: "Grid Node A-12 (CRITICAL)" },
    { alertId: "2", pressurePsi: 160, nodeLocation: "Grid Sector B-4 (CRITICAL)" }
  ] 
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-rose-500 tracking-tight">
          ⚠️ SCADA Overpressure Active Monitoring
        </h2>
        <span className="px-3 py-1 text-xs font-semibold text-rose-400 bg-rose-950/50 border border-rose-900 rounded-full animate-pulse">
          LIVE SYSTEM STATUS
        </span>
      </div>

      <div className="overflow-hidden border border-slate-800 rounded-lg bg-slate-950">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Node Location</th>
              <th className="px-6 py-4">Status Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-sm text-slate-300">
            {alerts.map((alert) => (
              <tr key={alert.alertId} className="hover:bg-slate-900/30 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-200">
                  {alert.nodeLocation}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-300 border border-red-900/50">
                    CRITICAL ({alert.pressurePsi} PSI)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-500 italic">
        * System automatically synchronized. Raw inline queries successfully refactored to Prisma operations.
      </div>
    </div>
  );
};

export default OverpressureMonitorGrid;
    `.trim();
  }

  console.log(
    "📡 [AWS Bedrock] Requesting AI Modernization Translation via Nova Lite...",
  );

  const promptText = `
You are a senior software architect specializing in legacy migrations. 
Analyze this legacy ColdFusion code, its extracted SQL queries, and architectural instructions.
Synthesize this into a single, clean, beautiful TypeScript React component.

Legacy Code:
${rawCode}

Extracted Database Details:
${queries.join("\n")}

Architectural Directives:
${directives.join("\n")}

Return ONLY raw typescript/JSX code. Do not wrap the code in markdown code blocks like \`\`\`tsx, and do not write conversational introductions or commentary. Start directly with the React imports.
  `;

  const command = new InvokeModelCommand({
    modelId: "amazon.nova-lite-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [{ role: "user", content: [{ text: promptText }] }],
      inferenceConfig: { temperature: 0.1, maxTokens: 4000 },
    }),
  });

  const response = await client.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsedData = JSON.parse(responseBody);

  return parsedData.output.message.content[0].text;
}
