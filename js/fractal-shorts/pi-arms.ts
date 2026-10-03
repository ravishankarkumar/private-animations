import { render } from "murali-js";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, Tattva, timeline, type TattvaState } from "murali-js/core";
import { Label, MathText } from "murali-js/text";

const BG = "#040812";
const INK = "#F4FBFF";
const GOLD = "#FFE14A";

// z(θ) = e^{iθ} + e^{iπθ}. The outer arm turns π times as fast as the inner
// arm, so the tip returns near the start and never lands on it. The famous
// 22/7 and 355/113 marks are only waypoints: a fraction of a turn later the
// path slides past the ring. Those closest misses are 0.000180 units after
// 7 turns and 2.09e-9 units after 113. Float64 holds both. The stroke covers
// them until the camera is inside the gap, so each look locks onto the miss.
const MAX_TURNS = 118;
const MISS_A = 7.002137251275432;
const MISS_B = 113.0000072784448;
// The default camera stays centered, so the circle does not wobble. Each close
// look moves to the start ring, punches in with the focus locked on the gap,
// and watches the pen pass. The way home is one move back to that centered
// view. Stopping at a middle zoom paints the miss as a single line.
const STILL_A = 8.6;
const MOVE_A = 1.3;
const FILL = 11.2;
const MOVE_B = 1.2;
const HOLD_END = 0.7;
const FRAME = 1 / 30;
const ZOOM_IN = 2.8;
const ZOOM_A = 7000;
const LOOK_A_X = 1.9999098441556945;
const LOOK_A_Y = 6.260936175964127e-7;
const ZOOM_B = 420000000;
const LOOK_B_X = 1.9999999989543005;
const LOOK_B_Y = 3.548013188044326e-13;
const UNTYPE = 0.5;
const SHRINK = 0.45;
const LIFT = 0.55;

const PLATE = 8.2;
const PIXELS = 1080;
const VIEW = 2.42;
const SAMPLES_PER_TURN = 1400;
const SAMPLE_COUNT = MAX_TURNS * SAMPLES_PER_TURN;
const LIVE_SAMPLES = 220;
const PX_PER_UNIT = (PIXELS * 0.5) / VIEW;
// The trail is stored in a camera-independent buffer so a close look can move
// the camera without redrawing the whole history.
const WORLD_PX = 5120;
const WORLD_HALF = 4.2;
const WORLD_SCALE = WORLD_PX / (WORLD_HALF * 2);
const WORLD_ORIGIN = WORLD_PX / 2;
const TRAIL_PX_AT_ZOOM_1 = 0.85;
const WORLD_LINE = TRAIL_PX_AT_ZOOM_1 * WORLD_SCALE / PX_PER_UNIT;

const TIP_X = new Float32Array(SAMPLE_COUNT + 1);
const TIP_Y = new Float32Array(SAMPLE_COUNT + 1);

function tipAt(theta: number): { x: number; y: number; jx: number; jy: number } {
  const jx = Math.cos(theta);
  const jy = Math.sin(theta);
  const outer = Math.PI * theta;
  return { jx, jy, x: jx + Math.cos(outer), y: jy + Math.sin(outer) };
}

for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
  const theta = (index / SAMPLES_PER_TURN) * Math.PI * 2;
  const tip = tipAt(theta);
  TIP_X[index] = tip.x;
  TIP_Y[index] = tip.y;
}

interface PiArmsState extends TattvaState {
  theta: number;
  zoom: number;
  focusX: number;
  focusY: number;
}

function project(x: number, y: number, zoom: number, focusX: number, focusY: number): [number, number] {
  const scale = PX_PER_UNIT * zoom;
  return [
    PIXELS * 0.5 + (x - focusX) * scale,
    PIXELS * 0.5 - (y - focusY) * scale,
  ];
}

function strokeWorld(context: CanvasRenderingContext2D, from: number, to: number): void {
  if (to <= from) return;
  context.beginPath();
  context.moveTo(WORLD_ORIGIN + TIP_X[from]! * WORLD_SCALE, WORLD_ORIGIN - TIP_Y[from]! * WORLD_SCALE);
  for (let index = from + 1; index <= to; index += 1) {
    context.lineTo(WORLD_ORIGIN + TIP_X[index]! * WORLD_SCALE, WORLD_ORIGIN - TIP_Y[index]! * WORLD_SCALE);
  }
  context.stroke();
}

interface Segment {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

// Liang-Barsky. Keeps canvas coordinates near the plate when the camera is
// inside a 1e-8 window; unclipped world points would project past 1e10 px.
function clipSegment(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): Segment | null {
  const dx = bx - ax;
  const dy = by - ay;
  const p = [-dx, dx, -dy, dy];
  const q = [ax - minX, maxX - ax, ay - minY, maxY - ay];
  let u0 = 0;
  let u1 = 1;
  for (let edge = 0; edge < 4; edge += 1) {
    const pe = p[edge]!;
    const qe = q[edge]!;
    if (pe === 0) {
      if (qe < 0) return null;
      continue;
    }
    const r = qe / pe;
    if (pe < 0) {
      if (r > u1) return null;
      if (r > u0) u0 = r;
    } else {
      if (r < u0) return null;
      if (r < u1) u1 = r;
    }
  }
  return { ax: ax + u0 * dx, ay: ay + u0 * dy, bx: ax + u1 * dx, by: ay + u1 * dy };
}

// Screen-space trail for a close look. Samples stay in float64: the stored
// trail is float32, and that grid is coarser than the 113-turn miss.
function strokeClose(
  context: CanvasRenderingContext2D,
  lastSample: number,
  exactIndex: number,
  zoom: number,
  focusX: number,
  focusY: number,
): void {
  if (lastSample <= 0 && exactIndex <= 0) return;
  const half = VIEW / zoom;
  const pad = half * 0.25;
  const minX = focusX - half - pad;
  const maxX = focusX + half + pad;
  const minY = focusY - half - pad;
  const maxY = focusY + half + pad;
  const scale = PX_PER_UNIT * zoom;
  const worldLimit = (6 / scale) * (6 / scale);
  let lastEnd = Number.NaN;
  const pointAt = (index: number): { x: number; y: number } =>
    tipAt((index / SAMPLES_PER_TURN) * Math.PI * 2);
  const draw = (
    ia: number,
    ib: number,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    depth: number,
  ): void => {
    if ((ax < minX && bx < minX) || (ax > maxX && bx > maxX) || (ay < minY && by < minY) || (ay > maxY && by > maxY)) {
      return;
    }
    if (depth < 32 && (ax - bx) * (ax - bx) + (ay - by) * (ay - by) > worldLimit) {
      const im = (ia + ib) * 0.5;
      const mid = pointAt(im);
      draw(ia, im, ax, ay, mid.x, mid.y, depth + 1);
      draw(im, ib, mid.x, mid.y, bx, by, depth + 1);
      return;
    }
    const clipped = clipSegment(ax, ay, bx, by, minX, minY, maxX, maxY);
    if (!clipped) return;
    const [pax, pay] = project(clipped.ax, clipped.ay, zoom, focusX, focusY);
    const [pbx, pby] = project(clipped.bx, clipped.by, zoom, focusX, focusY);
    if (lastEnd !== ia) context.moveTo(pax, pay);
    context.lineTo(pbx, pby);
    lastEnd = ib;
  };
  // Float32 is only a reject test. Anything that might enter the window is
  // redrawn from the exact angle so the miss cannot snap onto the ring.
  const slop = 1e-5;
  context.beginPath();
  for (let index = 0; index < lastSample; index += 1) {
    const ax = TIP_X[index]!;
    const ay = TIP_Y[index]!;
    const bx = TIP_X[index + 1]!;
    const by = TIP_Y[index + 1]!;
    if (
      (ax < minX - slop && bx < minX - slop)
      || (ax > maxX + slop && bx > maxX + slop)
      || (ay < minY - slop && by < minY - slop)
      || (ay > maxY + slop && by > maxY + slop)
    ) continue;
    const from = pointAt(index);
    const to = pointAt(index + 1);
    draw(index, index + 1, from.x, from.y, to.x, to.y, 0);
  }
  if (exactIndex > lastSample) {
    const from = pointAt(lastSample);
    const to = pointAt(exactIndex);
    draw(lastSample, exactIndex, from.x, from.y, to.x, to.y, 0);
  }
  context.stroke();
}

function strokeSamples(
  context: CanvasRenderingContext2D,
  from: number,
  to: number,
  zoom: number,
  focusX: number,
  focusY: number,
): void {
  if (to <= from) return;
  context.beginPath();
  const [startX, startY] = project(TIP_X[from]!, TIP_Y[from]!, zoom, focusX, focusY);
  context.moveTo(startX, startY);
  for (let index = from + 1; index <= to; index += 1) {
    const [x, y] = project(TIP_X[index]!, TIP_Y[index]!, zoom, focusX, focusY);
    context.lineTo(x, y);
  }
  context.stroke();
}

class PiArmsPlate extends Tattva<PiArmsState> {
  private context: CanvasRenderingContext2D | null = null;
  private trail: HTMLCanvasElement | null = null;
  private trailContext: CanvasRenderingContext2D | null = null;
  private committed = 0;

  constructor() {
    super({ state: { theta: 0, zoom: 1, focusX: 0, focusY: 0 } });
    this.dynamicGeometry = true;
    this.worldSize = { width: PLATE, height: PLATE };
  }

  override contentHTML(_time: number, state: Readonly<PiArmsState> = this.initialState): string | undefined {
    const canvas = document.getElementById("pi-arms-plate");
    if (!(canvas instanceof HTMLCanvasElement)) {
      return `<canvas id="pi-arms-plate" width="${PIXELS}" height="${PIXELS}" style="width:100%;height:100%;display:block"></canvas>`;
    }
    const context = this.context ?? canvas.getContext("2d");
    if (!context) throw new Error("Could not draw the pi arms.");
    this.context = context;
    this.paint(context, state);
    return undefined;
  }

  private paint(context: CanvasRenderingContext2D, state: Readonly<PiArmsState>): void {
    const zoom = Math.max(0.2, state.zoom);
    const { focusX, focusY } = state;
    const theta = Math.max(0, Math.min(MAX_TURNS * Math.PI * 2, state.theta));
    const last = Math.min(SAMPLE_COUNT, Math.round((theta / (Math.PI * 2)) * SAMPLES_PER_TURN));
    context.clearRect(0, 0, PIXELS, PIXELS);
    context.lineJoin = "round";
    context.lineCap = "round";

    this.paintTrail(context, last, theta, zoom, focusX, focusY);
    this.paintArms(context, theta, zoom, focusX, focusY);
    this.paintMarker(context, zoom, focusX, focusY, 2, 0, 6.5, false);
    const tip = tipAt(theta);
    this.paintMarker(context, zoom, focusX, focusY, tip.x, tip.y, 4.6, true);
  }

  private paintTrail(
    context: CanvasRenderingContext2D,
    last: number,
    theta: number,
    zoom: number,
    focusX: number,
    focusY: number,
  ): void {
    if (!this.trail || !this.trailContext) {
      const trail = document.createElement("canvas");
      trail.width = WORLD_PX;
      trail.height = WORLD_PX;
      const trailContext = trail.getContext("2d");
      if (!trailContext) throw new Error("Could not draw the pi trail.");
      trailContext.lineJoin = "round";
      trailContext.lineCap = "round";
      trailContext.strokeStyle = "rgba(244, 251, 255, 0.46)";
      trailContext.lineWidth = WORLD_LINE;
      this.trail = trail;
      this.trailContext = trailContext;
    }
    const trailContext = this.trailContext;
    if (last < this.committed) {
      trailContext.clearRect(0, 0, WORLD_PX, WORLD_PX);
      this.committed = 0;
    }
    const liveFrom = Math.max(0, last - LIVE_SAMPLES);
    if (this.committed < liveFrom) {
      strokeWorld(trailContext, this.committed, liveFrom);
      this.committed = liveFrom;
    }
    const half = VIEW / zoom;
    const srcSize = half * 2 * WORLD_SCALE;
    context.strokeStyle = "rgba(244, 251, 255, 0.46)";
    context.lineWidth = Math.min(3.2, TRAIL_PX_AT_ZOOM_1 * zoom);
    if (srcSize < PIXELS) {
      const exactIndex = Math.min(SAMPLE_COUNT, (theta / (Math.PI * 2)) * SAMPLES_PER_TURN);
      strokeClose(context, Math.floor(exactIndex), exactIndex, zoom, focusX, focusY);
      return;
    }
    const srcX = WORLD_ORIGIN + (focusX - half) * WORLD_SCALE;
    const srcY = WORLD_ORIGIN - (focusY + half) * WORLD_SCALE;
    context.imageSmoothingEnabled = true;
    context.drawImage(this.trail, srcX, srcY, srcSize, srcSize, 0, 0, PIXELS, PIXELS);
    strokeSamples(context, liveFrom, last, zoom, focusX, focusY);
  }

  private paintArms(
    context: CanvasRenderingContext2D,
    theta: number,
    zoom: number,
    focusX: number,
    focusY: number,
  ): void {
    const tip = tipAt(theta);
    const margin = (VIEW / zoom) * 1.8;
    const armBox = {
      minX: focusX - margin,
      maxX: focusX + margin,
      minY: focusY - margin,
      maxY: focusY + margin,
    };
    const inner = clipSegment(0, 0, tip.jx, tip.jy, armBox.minX, armBox.minY, armBox.maxX, armBox.maxY);
    const outer = clipSegment(tip.jx, tip.jy, tip.x, tip.y, armBox.minX, armBox.minY, armBox.maxX, armBox.maxY);
    const jointInside = tip.jx >= armBox.minX && tip.jx <= armBox.maxX && tip.jy >= armBox.minY && tip.jy <= armBox.maxY;
    context.beginPath();
    for (const piece of [inner, outer]) {
      if (!piece) continue;
      const [ax, ay] = project(piece.ax, piece.ay, zoom, focusX, focusY);
      const [bx, by] = project(piece.bx, piece.by, zoom, focusX, focusY);
      if (!jointInside || piece === inner) context.moveTo(ax, ay);
      context.lineTo(bx, by);
    }
    context.strokeStyle = INK;
    context.lineWidth = 3.2;
    context.stroke();
    if (zoom <= 12) {
      const [originX, originY] = project(0, 0, zoom, focusX, focusY);
      const [jointX, jointY] = project(tip.jx, tip.jy, zoom, focusX, focusY);
      const [tipX, tipY] = project(tip.x, tip.y, zoom, focusX, focusY);
      if (Math.abs(jointX) < PIXELS * 2 && Math.abs(jointY) < PIXELS * 2) {
        this.paintHinge(context, originX, originY, jointX, jointY, tipX, tipY);
      }
    }
    this.paintMarker(context, zoom, focusX, focusY, 0, 0, 3.4, true);
    this.paintMarker(context, zoom, focusX, focusY, tip.jx, tip.jy, 4.2, true);
  }

  /** Gold arc in the elbow between the two phasors. Hidden when the arms are almost straight. */
  private paintHinge(
    context: CanvasRenderingContext2D,
    originX: number,
    originY: number,
    jointX: number,
    jointY: number,
    tipX: number,
    tipY: number,
  ): void {
    if (Math.hypot(originX - jointX, originY - jointY) < 8) return;
    if (Math.hypot(tipX - jointX, tipY - jointY) < 8) return;
    const inward = Math.atan2(originY - jointY, originX - jointX);
    const outward = Math.atan2(tipY - jointY, tipX - jointX);
    let sweep = outward - inward;
    while (sweep <= -Math.PI) sweep += Math.PI * 2;
    while (sweep > Math.PI) sweep -= Math.PI * 2;
    if (Math.abs(sweep) < 0.22 || Math.abs(Math.abs(sweep) - Math.PI) < 0.16) return;
    context.save();
    context.beginPath();
    context.arc(jointX, jointY, 26, inward, outward, sweep < 0);
    context.strokeStyle = GOLD;
    context.lineWidth = 2.1;
    context.lineCap = "round";
    context.stroke();
    context.restore();
  }

  private paintMarker(
    context: CanvasRenderingContext2D,
    zoom: number,
    focusX: number,
    focusY: number,
    x: number,
    y: number,
    radius: number,
    filled: boolean,
  ): void {
    const [px, py] = project(x, y, zoom, focusX, focusY);
    if (Math.abs(px) > PIXELS * 2 || Math.abs(py) > PIXELS * 2) return;
    context.save();
    context.beginPath();
    context.arc(px, py, filled ? radius * 2.35 : radius, 0, Math.PI * 2);
    if (filled) {
      context.fillStyle = "rgba(255, 225, 74, 0.22)";
      context.fill();
      context.beginPath();
      context.arc(px, py, radius * 1.45, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 225, 74, 0.5)";
      context.fill();
    } else {
      context.strokeStyle = "rgba(255, 225, 74, 0.34)";
      context.lineWidth = 8;
      context.stroke();
    }
    context.beginPath();
    context.arc(px, py, radius, 0, Math.PI * 2);
    context.strokeStyle = GOLD;
    context.fillStyle = GOLD;
    context.lineWidth = 1.8;
    if (filled) context.fill();
    else context.stroke();
    context.restore();
  }
}

class PiArmsShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const plate = this.add(new PiArmsPlate(), { at: [0, 0.15] });
    const title = this.add(
      Label("Visualization of Pi\nbeing Irrational")
        .height(0.44)
        .color(INK)
        .css({
          fontFamily: '"Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif',
          fontWeight: 600,
          letterSpacing: "0.01em",
        }),
      { at: [0, 6.55] },
    );
    const formula = this.add(
      MathText(String.raw`z(\theta) = e^{\theta i} + e^{\pi \theta i}`)
        .height(0.4)
        .color(INK)
        .css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }),
      { at: [0, -4.9] },
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
      t.animate(formula).at(0.12).duration(0.4).ease("outCubic").appear();
      let cursor = 0;
      const leg = (
        seconds: number,
        thetaTurns: number,
        zoom: number,
        focusX: number,
        focusY: number,
        cameraEase: "linear" | "inOutCubic" | "outCubic",
      ): void => {
        t.animate(plate).at(cursor).duration(seconds).ease("linear").to({
          theta: thetaTurns * Math.PI * 2,
        });
        t.animate(plate).at(cursor).duration(seconds).ease(cameraEase).to({ zoom, focusX, focusY });
        cursor += seconds;
      };
      leg(STILL_A, 6.55, 1, 0, 0, "linear");
      leg(MOVE_A, MISS_A - 1.2e-5, ZOOM_IN, LOOK_A_X, LOOK_A_Y, "inOutCubic");
      leg(0.7, MISS_A - 4e-6, ZOOM_A, LOOK_A_X, LOOK_A_Y, "inOutCubic");
      leg(1.8, MISS_A + 4e-6, ZOOM_A, LOOK_A_X, LOOK_A_Y, "linear");
      // One frame back to the centered camera. A slower zoom spends that
      // frame in between, where the two paths draw on top of each other.
      leg(FRAME, MISS_A + 4e-6, 1, 0, 0, "linear");
      leg(1.2, 8.4, 1, 0, 0, "linear");
      leg(FILL, 112.55, 1, 0, 0, "linear");
      leg(MOVE_B, MISS_B - 3.5e-10, ZOOM_IN, LOOK_B_X, LOOK_B_Y, "inOutCubic");
      leg(0.65, MISS_B - 1e-10, ZOOM_B, LOOK_B_X, LOOK_B_Y, "inOutCubic");
      leg(1.75, MISS_B + 1e-10, ZOOM_B, LOOK_B_X, LOOK_B_Y, "linear");
      leg(FRAME, MISS_B + 1e-10, 1, 0, 0, "linear");
      leg(37 / 30, 115, 1, 0, 0, "linear");
      cursor += HOLD_END;
      t.wait(cursor);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(UNTYPE).ease("outCubic").untypewrite();
      t.animate(formula).duration(UNTYPE * 0.84).ease("outCubic").disappear();
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(SHRINK).ease("inOutCubic").scaleTo(0.48);
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(LIFT).ease("inOutCubic").moveTo([0, 4.6]);
    }));
    this.play(YouTubeSubscribeSequence(subscribe, {
      entranceDuration: 0.6,
      subscribeAt: 0.95,
      bellAt: 1.6,
      actionDuration: 0.45,
    }));
    this.wait(2.6);
  }
}

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

render(import.meta.url, PiArmsShort, {
  output: sourcePath("../output/fractal-pi-arms-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
