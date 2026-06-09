import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

// Defensive runtime sweep ensuring secrets are present before creating transport streams
const accessKeyId = process.env["AWS_ACCESS_KEY_ID"];
const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"];
const region = process.env["AWS_REGION"] || "us-east-1";

if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    "🚨 Critical AWS SDK Initialization Failure: Local credentials registry empty. Verify your un-tracked .env configuration parameters.",
  );
}

/**
 * Centrally Managed, Isolated AWS Bedrock Runtime Client Gateway Stream
 */
export const bedrockClient = new BedrockRuntimeClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
