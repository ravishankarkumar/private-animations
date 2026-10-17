import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sceneFiles = [
  "01-ai-headlines.ts",
  "02-concept-map.ts",
  "03-inbox-four-systems.ts",
  "04-ai-umbrella.ts",
  "05-applied-ai-stack.ts",
  "06-ml-training-inference.ts",
  "07-ml-types-data-science.ts",
  "08-deep-learning.ts",
  "09-generative-ai.ts",
  "10-foundation-models.ts",
  "11-next-token-generation.ts",
  "12-risks-and-guardrails.ts",
  "13-recap-map.ts",
];

const tsx = fileURLToPath(new URL("../node_modules/.bin/tsx", import.meta.url));

for (const sceneFile of sceneFiles) {
  console.log(`\nRendering ${sceneFile}`);
  const result = spawnSync(tsx, [fileURLToPath(new URL(sceneFile, import.meta.url))], {
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
