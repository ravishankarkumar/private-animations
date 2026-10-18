import { render } from "veena";
import type { Scene } from "veena/core";

export type SceneConstructor = new () => Scene;

export function outputPath(fileName: string): string {
  return decodeURIComponent(new URL(`../../renders/${fileName}`, import.meta.url).pathname);
}

function audioPath(): string {
  return decodeURIComponent(
    new URL("../../../../resources/audio/raag-pahadi.mp3", import.meta.url).pathname,
  );
}

export function renderScene(
  source: string,
  scene: SceneConstructor,
  fileName: string,
): ReturnType<typeof render> {
  // During browser bundling Murali re-evaluates this module only to register the
  // scene class. Avoid resolving a filesystem output URL in that environment.
  if (typeof window !== "undefined") return render(source, scene);
  return render(source, scene, {
    output: outputPath(fileName),
    fps: 30,
    audio: {
      source: audioPath(),
      volume: 0.18,
    },
  });
}
