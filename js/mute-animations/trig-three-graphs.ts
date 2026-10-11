import { render } from "murali-js";
import { Scene, Tattva, timeline, type TattvaState } from "murali-js/core";
import { Label } from "murali-js/text";

const BG = "#040812";
const INK = "#F7FBFF";
const MUTED = "#8EA5B8";
const GRID = "rgba(142,165,184,0.18)";
const CYAN = "#43DFFF";
const VIOLET = "#A982FF";
const GOLD = "#FFD166";

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

const TAU = Math.PI * 2;
const PIXEL_WIDTH = 1080;
const PIXEL_HEIGHT = 1500;

interface TrigPlateState extends TattvaState {
  progress: number;
}

type GraphSpec = {
  name: string;
  color: string;
  centerY: number;
  fn: (angle: number) => number;
  tangent?: boolean;
};

const graphs: readonly GraphSpec[] = [
  { name: "sin θ", color: CYAN, centerY: 390, fn: Math.sin },
  { name: "cos θ", color: VIOLET, centerY: 750, fn: Math.cos },
  { name: "tan θ", color: GOLD, centerY: 1110, fn: Math.tan, tangent: true },
];

function line(
  context: CanvasRenderingContext2D,
  from: readonly [number, number],
  to: readonly [number, number],
  color: string,
  width: number,
  dash: readonly number[] = [],
): void {
  context.beginPath();
  context.setLineDash([...dash]);
  context.moveTo(from[0], from[1]);
  context.lineTo(to[0], to[1]);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
  context.setLineDash([]);
}

function dot(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  glow = 0,
): void {
  context.save();
  context.shadowColor = color;
  context.shadowBlur = glow;
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function drawArrowHead(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string,
): void {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(-15, -8);
  context.lineTo(-15, 8);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.restore();
}

function paintTrig(context: CanvasRenderingContext2D, progress: number): void {
  const p = Math.min(1, Math.max(0, progress));
  const angle = p * TAU;
  context.clearRect(0, 0, PIXEL_WIDTH, PIXEL_HEIGHT);
  context.lineCap = "round";
  context.lineJoin = "round";

  // Each function gets its own rotating circle and its own direct output graph.
  const circleX = 165;
  const circleRadius = 92;
  const graphLeft = 390;
  const graphRight = 1015;
  const graphWidth = graphRight - graphLeft;
  const graphAmplitude = 80;
  const playheadX = graphLeft + p * graphWidth;

  for (const graph of graphs) {
    const cy = graph.centerY;
    const top = cy - 136;
    context.beginPath();
    context.roundRect(28, top, 1020, 260, 28);
    context.fillStyle = "rgba(14,23,43,0.72)";
    context.fill();
    context.strokeStyle = "rgba(142,165,184,0.16)";
    context.lineWidth = 2;
    context.stroke();

    // The rotating source circle.
    line(context, [circleX - 112, cy], [circleX + 118, cy], GRID, 2.5);
    line(context, [circleX, cy - 112], [circleX, cy + 112], GRID, 2.5);
    drawArrowHead(context, circleX + 118, cy, 0, MUTED);
    drawArrowHead(context, circleX, cy - 112, -Math.PI / 2, MUTED);

    context.save();
    context.beginPath();
    context.arc(circleX, cy, circleRadius, 0, TAU);
    context.strokeStyle = "rgba(247,251,255,0.62)";
    context.lineWidth = 4;
    context.shadowColor = graph.color;
    context.shadowBlur = 12;
    context.stroke();
    context.restore();

    const px = circleX + Math.cos(angle) * circleRadius;
    const py = cy - Math.sin(angle) * circleRadius;
    line(context, [circleX, cy], [px, py], INK, 5);

    let source: readonly [number, number];
    let measureLabel: string;
    if (graph.name.startsWith("sin")) {
      line(context, [px, py], [circleX, py], graph.color, 4, [8, 7]);
      source = [circleX, py];
      measureLabel = "HEIGHT";
    } else if (graph.name.startsWith("cos")) {
      line(context, [px, py], [px, cy], graph.color, 4, [8, 7]);
      source = [px, cy];
      measureLabel = "WIDTH";
    } else {
      const tangentLength = 62;
      const tx = -Math.sin(angle);
      const ty = -Math.cos(angle);
      line(
        context,
        [px - tx * tangentLength, py - ty * tangentLength],
        [px + tx * tangentLength, py + ty * tangentLength],
        graph.color,
        4,
      );
      source = [px, py];
      measureLabel = "SLOPE";
    }

    dot(context, px, py, 9, INK, 18);
    dot(context, px, py, 5.5, graph.color, 15);
    context.save();
    context.beginPath();
    context.arc(circleX, cy, 35, 0, -angle, true);
    context.strokeStyle = graph.color;
    context.lineWidth = 4;
    context.stroke();
    context.font = "800 20px Inter, ui-sans-serif, sans-serif";
    context.fillStyle = graph.color;
    context.fillText("θ", circleX + 42, cy - 12);
    context.restore();

    context.font = "850 18px Inter, ui-sans-serif, sans-serif";
    context.fillStyle = graph.color;
    context.textAlign = "center";
    context.fillText(measureLabel, circleX, top + 29);
    context.textAlign = "start";

    context.font = "900 28px Inter, ui-sans-serif, sans-serif";
    context.fillStyle = graph.color;
    context.fillText(graph.name, graphLeft, top + 32);

    line(context, [graphLeft, graph.centerY], [graphRight, graph.centerY], GRID, 3);
    for (let tick = 0; tick <= 4; tick += 1) {
      const x = graphLeft + graphWidth * tick / 4;
      line(context, [x, top + 44], [x, top + 228], "rgba(142,165,184,0.1)", 2);
    }

    const samples = Math.max(1, Math.floor(p * 520));
    context.save();
    context.strokeStyle = graph.color;
    context.lineWidth = 6;
    context.shadowColor = graph.color;
    context.shadowBlur = 14;
    context.beginPath();
    let drawing = false;
    for (let sample = 0; sample <= samples; sample += 1) {
      const sampleProgress = samples === 0 ? 0 : p * sample / samples;
      const sampleAngle = sampleProgress * TAU;
      const rawValue = graph.fn(sampleAngle);
      const visible = !graph.tangent || Math.abs(rawValue) <= 1.52;
      const value = graph.tangent ? Math.max(-1.52, Math.min(1.52, rawValue)) / 1.52 : rawValue;
      const x = graphLeft + sampleProgress * graphWidth;
      const y = graph.centerY - value * graphAmplitude;
      if (!visible) {
        drawing = false;
      } else if (!drawing) {
        context.moveTo(x, y);
        drawing = true;
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
    context.restore();

    line(context, [playheadX, top + 44], [playheadX, top + 228], "rgba(247,251,255,0.32)", 2);
    const currentRaw = graph.fn(angle);
    if (!graph.tangent || Math.abs(currentRaw) <= 1.52) {
      const current = graph.tangent
        ? Math.max(-1.52, Math.min(1.52, currentRaw)) / 1.52
        : currentRaw;
      const endpointY = graph.centerY - current * graphAmplitude;
      line(context, source, [playheadX, endpointY], `${graph.color}55`, 3, [9, 9]);
      dot(context, playheadX, endpointY, 9, graph.color, 18);
    }
  }

  context.font = "700 21px Inter, ui-sans-serif, sans-serif";
  context.fillStyle = MUTED;
  context.textAlign = "center";
  for (const graph of graphs) {
    context.fillText("0", graphLeft, graph.centerY + 109);
    context.fillText("π", graphLeft + graphWidth / 2, graph.centerY + 109);
    context.fillText("2π", graphRight, graph.centerY + 109);
  }
  context.textAlign = "start";
}

class TrigPlate extends Tattva<TrigPlateState> {
  private context: CanvasRenderingContext2D | null = null;

  constructor() {
    super({ state: { progress: 0 } });
    this.dynamicGeometry = true;
    this.worldSize = { width: 8.1, height: 11.25 };
  }

  override contentHTML(
    _time: number,
    state: Readonly<TrigPlateState> = this.initialState,
  ): string | undefined {
    const canvas = document.getElementById("trig-three-graphs-plate");
    if (!(canvas instanceof HTMLCanvasElement)) {
      return `<canvas id="trig-three-graphs-plate" width="${PIXEL_WIDTH}" height="${PIXEL_HEIGHT}" style="width:100%;height:100%;display:block"></canvas>`;
    }
    const context = this.context ?? canvas.getContext("2d");
    if (!context) throw new Error("Could not draw the trigonometry plate.");
    this.context = context;
    paintTrig(context, state.progress);
    return undefined;
  }
}

class TrigThreeGraphsShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const kicker = this.add(
      Label("TRIGONOMETRY • VISUALIZED")
        .height(0.22)
        .color(CYAN)
        .css({ fontWeight: 900, letterSpacing: "0.15em" }),
      { at: [0, 7.25] },
    );
    const openingTitle = this.add(
      Label("HOW DOES A CIRCLE\nBECOME A WAVE?")
        .height(0.58)
        .color(INK)
        .css({ fontWeight: 950, letterSpacing: "-0.02em", lineHeight: "1.08" }),
      { at: [0, 6.35] },
    );
    const conceptTitle = this.add(
      Label("ONE ANGLE. THREE GRAPHS.")
        .height(0.46)
        .color(INK)
        .css({ fontWeight: 950, letterSpacing: "0.01em" }),
      { at: [0, 6.35] },
    );
    const plate = this.add(new TrigPlate(), { at: [0, -0.05] });

    const sineCaption = this.add(
      Label("HEIGHT AROUND THE CIRCLE  →  SINE")
        .height(0.25)
        .color(CYAN)
        .css({ fontWeight: 900, letterSpacing: "0.045em" }),
      { at: [0, -6.32] },
    );
    const cosineCaption = this.add(
      Label("SIDEWAYS POSITION  →  COSINE")
        .height(0.25)
        .color(VIOLET)
        .css({ fontWeight: 900, letterSpacing: "0.045em" }),
      { at: [0, -6.32] },
    );
    const tangentCaption = this.add(
      Label("SLOPE OF THE RADIUS  →  TANGENT")
        .height(0.25)
        .color(GOLD)
        .css({ fontWeight: 900, letterSpacing: "0.04em" }),
      { at: [0, -6.32] },
    );
    const finalCaption = this.add(
      Label("SAME ANGLE.\nTHREE DIFFERENT PATTERNS.")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 950, letterSpacing: "0.025em", lineHeight: "1.15" }),
      { at: [0, -6.12] },
    );

    const closingTitle = this.add(
      Label("HOW DOES A CIRCLE\nBECOME A WAVE?")
        .height(0.58)
        .color(INK)
        .css({ fontWeight: 950, letterSpacing: "-0.02em", lineHeight: "1.08" }),
      { at: [0, 6.35] },
    );

    this.play(timeline((t) => {
      // Opening frame is intentionally complete so the final frame can cut
      // back to it without a flash or fade.
      t.animate(openingTitle).at(0.38).duration(0.58).indicate();
      t.animate(openingTitle).at(1.35).duration(0.58).indicate();
      t.animate(openingTitle).at(2.28).duration(0.3).disappear();
      t.animate(conceptTitle).at(2.42).duration(0.5).ease("outCubic").appear();

      // One full revolution draws all three curves in sync.
      t.animate(plate).at(2.55).duration(18.1).ease("linear").to({ progress: 1 });
      t.animate(sineCaption).at(3.0).duration(0.45).appear();
      t.animate(sineCaption).at(7.15).duration(0.3).disappear();
      t.animate(cosineCaption).at(7.28).duration(0.45).appear();
      t.animate(cosineCaption).at(11.7).duration(0.3).disappear();
      t.animate(tangentCaption).at(11.82).duration(0.45).appear();
      t.animate(tangentCaption).at(16.45).duration(0.3).disappear();

      t.animate(finalCaption).at(20.9).duration(0.6).ease("outCubic").appear();
      t.animate(conceptTitle).at(21.15).duration(0.58).indicate();
      t.animate(finalCaption).at(22.15).duration(0.62).indicate();
      t.animate(plate).at(23.0).duration(0.45).ease("inOutCubic").scaleTo(1.025);
      t.animate(plate).at(23.45).duration(0.38).ease("inOutCubic").scaleTo(1);

      // Snap the traces back into the circle, then restore the opening hook.
      t.animate([conceptTitle, finalCaption]).at(25.55).stagger(0.04).duration(0.3).disappear();
      t.animate(plate).at(25.65).duration(1.5).ease("inOutCubic").to({ progress: 0 });
      t.animate(closingTitle).at(27.05).duration(0.5).ease("outCubic").appear();
      t.animate(closingTitle).at(28.0).duration(0.58).indicate();
      t.animate(closingTitle).at(29.35).duration(0.6).indicate();
      t.wait(30);
    }));
  }
}

render(import.meta.url, TrigThreeGraphsShort, {
  output: sourcePath("../output/trig-three-graphs-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.18,
  },
});
