import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const sceneFiles = [
  "01-ai-headlines.mp4",
  "02-concept-map.mp4",
  "03-inbox-four-systems.mp4",
  "04-ai-umbrella.mp4",
  "05-applied-ai-stack.mp4",
  "06-ml-training-inference.mp4",
  "07-ml-types-data-science.mp4",
  "08-deep-learning.mp4",
  "09-generative-ai.mp4",
  "10-foundation-models.mp4",
  "11-next-token-generation.mp4",
  "12-risks-and-guardrails.mp4",
  "13-recap-map.mp4",
];

const rendersDirectory = fileURLToPath(new URL("../renders/", import.meta.url));
const music = fileURLToPath(
  new URL("../../../resources/audio/raag-pahadi.mp3", import.meta.url),
);
const output = join(rendersDirectory, "what-is-ai-ml-dl-gen-ai.mp4");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "kavriq-ai-master-"));
const concatFile = join(temporaryDirectory, "scenes.txt");

try {
  const concatManifest = sceneFiles
    .map((fileName) => `file '${join(rendersDirectory, fileName).replaceAll("'", "'\\''")}'`)
    .join("\n");
  writeFileSync(concatFile, `${concatManifest}\n`);

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-v", "warning",
      "-f", "concat",
      "-safe", "0",
      "-i", concatFile,
      "-stream_loop", "-1",
      "-i", music,
      "-map", "0:v:0",
      "-map", "1:a:0",
      "-c:v", "copy",
      "-c:a", "aac",
      "-b:a", "192k",
      "-af", "volume=0.18",
      "-shortest",
      output,
    ],
    { stdio: "inherit" },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`Created ${basename(output)}`);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
