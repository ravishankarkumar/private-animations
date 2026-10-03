import { render } from "murali-js";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, Tattva, timeline, type TattvaState } from "murali-js/core";
import { Label } from "murali-js/text";

const BG = "#040812";
const INK = "#F4FBFF";
const GOLD = "#FFE14A";

// 24/25 is just short of a whole number of wobbles per turn, so the loop
// closes only after 25 revolutions and the passes weave into a ring.
const TURNS = 25;
const TURN_DURATIONS = [
  0.24, 0.24, 0.26, 0.28, 0.32,
  0.38, 0.44, 0.5, 0.58, 0.66,
  0.74, 0.82, 0.9, 1, 1.1,
  1.2, 1.32, 1.44, 1.56, 1.7,
  1.86, 2.02, 2.2, 2.45, 3.15,
];
const DRAW_END = TURN_DURATIONS.reduce((sum, duration) => sum + duration, 0);
const HOLD = 0.4;
const WRITE = 2;
const READ = 1.8;
const UNTYPE = 0.5;
const SHRINK = 0.45;
const LIFT = 0.55;

const PLATE = 7.4;
const PIXELS = 1080;
const SAMPLES_PER_TURN = 140;
const SAMPLE_COUNT = TURNS * SAMPLES_PER_TURN;
const THETA_END = TURNS * Math.PI * 2;
const AMPLITUDE = 4;
const OFFSET = 10;
const FREQUENCY = 24 / 25;
const MAX_RADIUS = OFFSET + AMPLITUDE;

const RING_X = new Float32Array(SAMPLE_COUNT + 1);
const RING_Y = new Float32Array(SAMPLE_COUNT + 1);
const PIXEL_SCALE = (PIXELS / 2) * 0.96 / MAX_RADIUS;
for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
  const theta = (index / SAMPLE_COUNT) * THETA_END;
  const radius = AMPLITUDE * Math.sin(FREQUENCY * theta) + OFFSET;
  const half = PIXELS / 2;
  RING_X[index] = half + radius * Math.cos(theta) * PIXEL_SCALE;
  RING_Y[index] = half - radius * Math.sin(theta) * PIXEL_SCALE;
}

interface SineRingState extends TattvaState {
  /** 0 is the start of the first loop. 1 is the closed ring. */
  progress: number;
}

function paintRing(context: CanvasRenderingContext2D, progress: number): void {
  const clamped = Math.min(1, Math.max(0, progress));
  const last = Math.round(clamped * SAMPLE_COUNT);
  context.clearRect(0, 0, PIXELS, PIXELS);
  if (last < 1) return;
  context.beginPath();
  context.moveTo(RING_X[0]!, RING_Y[0]!);
  for (let index = 1; index <= last; index += 1) {
    context.lineTo(RING_X[index]!, RING_Y[index]!);
  }
  context.strokeStyle = GOLD;
  context.lineWidth = 2.6;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.stroke();

  const fade = clamped < 0.992 ? 1 : (1 - clamped) / 0.008;
  if (fade <= 0) return;
  context.globalAlpha = fade;
  context.beginPath();
  context.arc(RING_X[last]!, RING_Y[last]!, 7.5 * fade, 0, Math.PI * 2);
  context.fillStyle = INK;
  context.fill();
  context.lineWidth = 2.2;
  context.strokeStyle = GOLD;
  context.stroke();
  context.globalAlpha = 1;
}

class SineRingPlate extends Tattva<SineRingState> {
  private context: CanvasRenderingContext2D | null = null;

  constructor() {
    super({ state: { progress: 0 } });
    this.dynamicGeometry = true;
    this.worldSize = { width: PLATE, height: PLATE };
  }

  override contentHTML(_time: number, state: Readonly<SineRingState> = this.initialState): string | undefined {
    const canvas = document.getElementById("sine-ring-plate");
    if (!(canvas instanceof HTMLCanvasElement)) {
      return `<canvas id="sine-ring-plate" width="${PIXELS}" height="${PIXELS}" style="width:100%;height:100%;display:block"></canvas>`;
    }
    const context = this.context ?? canvas.getContext("2d");
    if (!context) throw new Error("Could not draw the sine ring.");
    this.context = context;
    paintRing(context, state.progress);
    return undefined;
  }
}

class SineRingFormula extends Tattva {
  constructor() {
    super();
    this.worldFontSize = 0.32;
    this.worldSize = { width: 4.7, height: 0.56 };
  }

  override contentHTML(): string {
    return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" style="color:${INK}">
      <mrow>
        <mi>r</mi><mo>=</mo><mn>4</mn>
        <mi mathvariant="normal">sin</mi><mo>(</mo>
        <mfrac><mrow><mn>24</mn><mi>θ</mi></mrow><mn>25</mn></mfrac>
        <mo>)</mo><mo>+</mo><mn>10</mn>
      </mrow>
    </math>`;
  }
}

class SineRingShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const plate = this.add(new SineRingPlate(), { at: [0, 0.45] });
    const title = this.add(
      Label("Sine ring")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      new SineRingFormula(),
      { at: [0, 6.18] },
    );
    const subscribe = this.add(
      YouTubeSubscribe("Kavriq", {
        handle: "@kavriq",
        message: "Subscribe for more visual stories",
        layout: "compact",
        size: [5.2, 3.5],
      }).opacity(0).layer(60),
      { at: [0, -0.7] },
    );

    this.play(timeline((t) => {
      t.animate(title).duration(0.01).revealText(1, 1);
      t.animate(title).at(0.05).duration(0.4).appear();
      t.animate(rule).at(0).duration(0.45).ease("outCubic").appear();
      let cursor = 0;
      for (let turn = 0; turn < TURN_DURATIONS.length; turn += 1) {
        const duration = TURN_DURATIONS[turn]!;
        t.animate(plate)
          .at(cursor)
          .duration(duration)
          .ease("linear")
          .to({ progress: (turn + 1) / TURN_DURATIONS.length });
        cursor += duration;
      }
      // Keep the original exit time even though the formula now enters at the
      // beginning of the short instead of after the ring finishes drawing.
      t.wait(cursor + HOLD + WRITE + READ);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(UNTYPE).ease("outCubic").untypewrite();
      t.animate(rule).duration(UNTYPE * 0.84).ease("outCubic").disappear();
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(SHRINK).ease("inOutCubic").scaleTo(0.62);
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(LIFT).ease("inOutCubic").moveTo([0, 4.4]);
    }));
    this.play(YouTubeSubscribeSequence(subscribe, {
      entranceDuration: 0.6,
      subscribeAt: 0.95,
      bellAt: 1.6,
      actionDuration: 0.45,
    }));
    this.wait(2.5);
  }
}

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

render(import.meta.url, SineRingShort, {
  output: sourcePath("../output/fractal-sine-ring-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
