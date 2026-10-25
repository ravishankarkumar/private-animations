import { render } from "veena";
import { WaveMesh } from "veena/composite";
import { Scene, Timeline } from "veena/core";
import { outputPath } from "../lib/render.ts";
import { COLOR, FRAME } from "../lib/theme.ts";

/**
 * One-minute, seamless background plate for green-screen host footage.
 * It intentionally contains no branding, text, audio, or foreground objects.
 */
class WaveMeshBackgroundPlate extends Scene {
  constructor() {
    super({
      width: FRAME.width,
      height: FRAME.height,
      background: COLOR.background,
    });
  }

  override construct(): void {
    this.camera
      .perspective({ fov: 44, near: 0.1, far: 100 })
      .position([0, 9.5, 10.5])
      .lookAt([0, 4, -3.5]);

    const mesh = this.add(
      WaveMesh()
        .size(32, 18)
        .amplitude(1.15)
        .samples(81, 45)
        .palette({
          near: COLOR.ai,
          far: COLOR.dl,
          peak: COLOR.ink,
          fill: "#17647D",
          sparkle: COLOR.ink,
        })
        .lineOpacity(0.68)
        .fillOpacity(0.07)
        .nodes({ size: 0.030, opacity: 0.56 })
        .sparkles({ size: 0.072, ratio: 0.018 })
        .farFade(0.70)
        .glowVariation(0.20),
      { at: [0, -2.35, -5] },
    );

    const timeline = new Timeline();
    // Six complete cycles in sixty seconds makes the first and final frame
    // identical, allowing the plate to loop cleanly when a longer take needs it.
    timeline.animate(mesh).duration(60).ease("linear").to({ phase: 6 });
    this.play(timeline);
  }
}

const source = decodeURIComponent(new URL(import.meta.url).pathname);
if (typeof window !== "undefined") {
  await render(source, WaveMeshBackgroundPlate);
} else {
  await render(source, WaveMeshBackgroundPlate, {
    output: outputPath("background-wave-mesh-60s.mp4"),
    fps: FRAME.fps,
  });
}
