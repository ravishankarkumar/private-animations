import { render } from "veena";
import { CanvasTattva, type CanvasContext } from "veena/adapters";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "veena/composite";
import { Scene, timeline } from "veena/core";
import { Label } from "veena/text";

const BG = "#070A16";
const INK = "#F4FBFF";
const MUTED = "#8BA8B7";

// Six vertical sheets spaced along X. Input is the cyan sheet on the left.
// A portrait frame cannot hold a wide side view and a tall sheet at once,
// so the camera starts on a fitted 3/4, dives along the row, then pulls
// back to the output side. The turn is front-loaded so frame 1 is already moving.
const LAYERS = 6;
const NODES = 64;
const FANOUT = 3;
const HALF = 2.8;
const GAP = 2.85;
const WORLD_W = 8.6;
const WORLD_H = 13.0;

const SHOW = 31;
const UNTYPE = 0.5;
const PARK = 0.7;
const BIRTH_LEAD = -0.06;
const LAYER_STEP = 0.22;
const LAYER_FILL = 0.72;
const NODE_POP = 0.12;
const EDGE_DRAW = 0.26;
const FLOW_AT = 2.45;
const FLOW_RATE = 0.4;

const LAYER_TINT: readonly (readonly [number, number, number])[] = [
  [126, 214, 242],
  [150, 188, 248],
  [176, 164, 255],
  [198, 176, 255],
  [218, 196, 255],
  [236, 214, 255],
];
const ROSE: readonly [number, number, number] = [206, 150, 172];
const WHITE: readonly [number, number, number] = [246, 244, 255];
const PULSE: readonly [number, number, number] = [214, 246, 255];

interface WorldNode {
  layer: number;
  x: number;
  y: number;
  z: number;
  seed: number;
  born: number;
  build: number;
}

interface WorldEdge {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  fromLayer: number;
  initial: number;
  target: number;
  seed: number;
  drawAt: number;
}

interface CameraFrame {
  eye: readonly [number, number, number];
  target: readonly [number, number, number];
  basis: CameraBasis;
  fov: number;
  referenceDepth: number;
}

interface CameraBasis {
  right: readonly [number, number, number];
  up: readonly [number, number, number];
  forward: readonly [number, number, number];
}

interface ProjectedPoint {
  x: number;
  y: number;
  depth: number;
}

const nodes = buildNodes();
const edges = buildEdges(nodes);

class NeuralNetworkShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const plate = this.add(new CanvasTattva({
      draw(context, _state, sample) {
        paintNetwork(context, sample.time);
      },
    }, { size: [WORLD_W, WORLD_H] }), { at: [0, -0.42] });
    const title = this.add(
      Label("Neural network")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("Weights live on the edges")
        .height(0.23)
        .color(MUTED)
        .css({ fontWeight: 500 }),
      { at: [0, 6.28] },
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
      t.animate(rule).duration(0.01).revealText(1, 1);
      t.animate(title).at(0.05).duration(0.4).appear();
      t.animate(rule).at(0.18).duration(0.35).appear();
      t.wait(SHOW);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(UNTYPE).ease("outCubic").untypewrite();
      t.animate(rule).duration(UNTYPE * 0.84).ease("outCubic").untypewrite();
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(PARK).ease("inOutCubic").moveTo([0, 4.15]);
      t.animate(plate).duration(PARK).ease("inOutCubic").scaleTo(0.92);
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

function paintNetwork({ canvas, context, pixelsPerUnit }: CanvasContext, time: number): void {
  const camera = frameCamera(Math.min(time, SHOW));
  const settle = inOutCubic((time - FLOW_AT - 0.4) / 9.5);
  const flowing = time >= FLOW_AT;
  const travel = fract((time - FLOW_AT) * FLOW_RATE) * (LAYERS - 1);
  const wave = fract((time - FLOW_AT) * FLOW_RATE);

  const drawnEdges = edges.map((edge, index) => {
    const from = projectWith(edge.ax, edge.ay, edge.az, camera);
    const to = projectWith(edge.bx, edge.by, edge.bz, camera);
    return { edge, from, to, depth: (from.depth + to.depth) / 2, index };
  }).sort((left, right) => right.depth - left.depth || left.index - right.index);
  const drawnNodes = nodes.map((node, index) => ({
    node,
    point: projectWith(node.x, node.y, node.z, camera),
    index,
  })).sort((left, right) => right.point.depth - left.point.depth || left.index - right.index);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  for (const drawn of drawnEdges) {
    const { edge, from, to, depth } = drawn;
    if (from.depth < 0.5 || to.depth < 0.5) continue;
    const draw = smoothstep((time - edge.drawAt) / EDGE_DRAW);
    if (draw <= 0.02) continue;
    const weight = weightAt(edge, settle, time);
    const magnitude = Math.abs(weight);
    const scale = Math.min(4.5, camera.referenceDepth / depth);
    const [x0, y0] = worldToPixel(from.x, from.y, canvas);
    const [x1, y1] = worldToPixel(to.x, to.y, canvas);
    const ink = edgeInk(edge.fromLayer, weight);
    context.strokeStyle = rgba(ink, weight >= 0 ? 0.07 + magnitude * 0.46 : 0.045 + magnitude * 0.22);
    context.lineWidth = Math.max(1, pixelsPerUnit * (0.0045 + magnitude * 0.012) * scale);
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(mix(x0, x1, draw), mix(y0, y1, draw));
    context.stroke();

    if (!flowing || draw < 0.999) continue;
    if (settle < 0.96 && magnitude > 0.34) {
      const along = fract(time * 0.72 + edge.seed);
      strokeSpan(
        context, x0, y0, x1, y1,
        Math.max(0, along - 0.045),
        Math.min(1, along + 0.016),
        rgba(PULSE, (0.2 + magnitude * 0.28) * (1 - settle)),
        pixelsPerUnit * 0.012 * scale,
      );
    }
    const local = travel - edge.fromLayer;
    if (magnitude > 0.3 && travel > 0.06 && local > 0.04 && local < 1) {
      const start = Math.max(0, local - 0.16);
      const end = local;
      if (end - start > 0.02) {
        strokeSpan(
          context, x0, y0, x1, y1, start, end,
          rgba(PULSE, 0.46 + magnitude * 0.14),
          pixelsPerUnit * 0.022 * scale,
        );
      }
    }
  }

  for (const drawn of drawnNodes) {
    const { node, point } = drawn;
    if (point.depth < 0.5) continue;
    const reveal = outCubic((time - node.born) / NODE_POP);
    if (reveal <= 0.02) continue;
    const layerT = node.layer / (LAYERS - 1);
    const glow = flowing ? Math.exp(-24 * (layerT - wave) ** 2) * settle * settle : 0;
    const tint = LAYER_TINT[node.layer] ?? LAYER_TINT[0]!;
    const [x, y] = worldToPixel(point.x, point.y, canvas);
    const radius = pixelsPerUnit
      * (0.04 + glow * 0.014)
      * node.build
      * Math.min(6, camera.referenceDepth / point.depth)
      * reveal;
    context.fillStyle = rgba(tint, (0.1 + glow * 0.28) * reveal);
    context.beginPath();
    context.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = rgba(mixChannel(tint, [18, 22, 36], 0.42), 0.96);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = rgba(mixChannel(tint, WHITE, 0.58 + glow * 0.34), 1);
    context.beginPath();
    context.arc(x - radius * 0.16, y - radius * 0.2, radius * 0.76, 0, Math.PI * 2);
    context.fill();
  }
}

function strokeSpan(
  context: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  start: number,
  end: number,
  color: string,
  width: number,
): void {
  context.strokeStyle = color;
  context.lineWidth = Math.max(1.15, width);
  context.beginPath();
  context.moveTo(mix(x0, x1, start), mix(y0, y1, start));
  context.lineTo(mix(x0, x1, end), mix(y0, y1, end));
  context.stroke();
}

function buildNodes(): WorldNode[] {
  const points: WorldNode[] = [];
  const inset = HALF - 0.08;
  const step = LAYER_FILL / (NODES - 1);
  for (let layer = 0; layer < LAYERS; layer += 1) {
    const x = (layer - 2.5) * GAP;
    const draft: { y: number; z: number; seed: number }[] = [];
    for (let index = 0; index < NODES; index += 1) {
      const [across, depth] = scatter(layer, index);
      draft.push({
        y: (across * 2 - 1) * inset,
        z: (depth * 2 - 1) * inset,
        seed: hash(layer * 1000 + index * 17 + 3),
      });
    }
    const order = draft
      .map((node, index) => ({ index, key: -node.y * 1.4 + node.z * 0.35 }))
      .sort((left, right) => left.key - right.key);
    const rankOf = new Array<number>(NODES);
    order.forEach((entry, rank) => {
      rankOf[entry.index] = rank;
    });
    draft.forEach((node, index) => {
      points.push({
        layer,
        x,
        y: node.y,
        z: node.z,
        seed: node.seed,
        born: BIRTH_LEAD + layer * LAYER_STEP + rankOf[index]! * step,
        build: 0.74 + node.seed * 0.5,
      });
    });
  }
  return points;
}

function buildEdges(points: WorldNode[]): WorldEdge[] {
  const links: WorldEdge[] = [];
  for (let layer = 0; layer < LAYERS - 1; layer += 1) {
    for (let index = 0; index < NODES; index += 1) {
      const from = points[layer * NODES + index]!;
      for (const target of fanout(layer, index)) {
        const to = points[(layer + 1) * NODES + target]!;
        const seed = hash(layer * 8000 + index * 130 + target * 17);
        const keep = hash(seed * 19 + 4);
        const sign = hash(seed * 23 + 8) > 0.7 ? -1 : 1;
        links.push({
          ax: from.x,
          ay: from.y,
          az: from.z,
          bx: to.x,
          by: to.y,
          bz: to.z,
          fromLayer: layer,
          initial: seed * 2 - 1,
          target: sign * (keep > 0.42 ? 0.25 + keep * 0.75 : keep * 0.18),
          seed,
          drawAt: Math.max(from.born, to.born) + NODE_POP,
        });
      }
    }
  }
  return links;
}

function fanout(layer: number, index: number): number[] {
  const chosen: number[] = [];
  let salt = 1;
  while (chosen.length < FANOUT && salt < 48) {
    const pick = Math.floor(hash(layer * 997 + index * 131 + salt * 17) * NODES);
    salt += 1;
    if (!chosen.includes(pick)) chosen.push(pick);
  }
  return chosen;
}

function scatter(layer: number, index: number): [number, number] {
  const g = 1.324717957244746;
  const n = index + 1;
  const u = fract(0.5 + n / g + layer * 0.173);
  const v = fract(0.5 + n / (g * g) + layer * 0.271);
  const jx = (hash(layer * 40 + index * 3 + 1) - 0.5) * 0.045;
  const jy = (hash(layer * 40 + index * 5 + 2) - 0.5) * 0.045;
  return [clamp(u + jx, 0.02, 0.98), clamp(v + jy, 0.02, 0.98)];
}

function frameCamera(time: number): CameraFrame {
  const u = clamp(time / SHOW, 0, 1);
  const turned = 1 - (1 - u) ** 2.1;
  const dive = Math.sin(Math.PI * clamp((u - 0.05) / 0.88, 0, 1));
  const eye = orbit(
    mix(30, 44, u) - 24 * dive,
    -50 + 98 * turned,
    mix(13, 11, u) - 7 * dive,
  );
  const target: readonly [number, number, number] = [mix(-0.2, 0.35, u), 0.1, 0];
  const fov = mix(46, 32, u) + 16 * dive;
  const basis = cameraBasis(eye, target);
  const origin = projectRaw(target[0], target[1], target[2], eye, basis, fov);
  return { eye, target, basis, fov, referenceDepth: origin.depth };
}

function projectWith(x: number, y: number, z: number, camera: CameraFrame): ProjectedPoint {
  return projectRaw(x, y, z, camera.eye, camera.basis, camera.fov);
}

function projectRaw(
  x: number,
  y: number,
  z: number,
  eye: readonly [number, number, number],
  basis: CameraBasis,
  fov: number,
): ProjectedPoint {
  const relative = [x - eye[0], y - eye[1], z - eye[2]] as const;
  const cameraX = dot(relative, basis.right);
  const cameraY = dot(relative, basis.up);
  const depth = dot(relative, basis.forward);
  const focal = 1 / Math.tan((fov * Math.PI) / 360);
  const scale = focal * (WORLD_H / 2);
  return {
    x: (cameraX / depth) * scale,
    y: (cameraY / depth) * scale,
    depth,
  };
}

function orbit(distance: number, azimuthDegrees: number, elevationDegrees: number): [number, number, number] {
  const azimuth = (azimuthDegrees * Math.PI) / 180;
  const elevation = (elevationDegrees * Math.PI) / 180;
  const horizontal = Math.cos(elevation) * distance;
  return [
    Math.sin(azimuth) * horizontal,
    Math.sin(elevation) * distance,
    Math.cos(azimuth) * horizontal,
  ];
}

function cameraBasis(
  eye: readonly [number, number, number],
  target: readonly [number, number, number],
): CameraBasis {
  const forward = normalize([target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]]);
  const right = normalize(cross(forward, [0, 1, 0]));
  return { right, up: cross(right, forward), forward };
}

function edgeInk(fromLayer: number, weight: number): [number, number, number] {
  const from = LAYER_TINT[fromLayer] ?? LAYER_TINT[1]!;
  const to = LAYER_TINT[fromLayer + 1] ?? from;
  const tint = mixChannel(from, to, 0.5);
  if (weight >= 0) return mixChannel(tint, WHITE, Math.abs(weight) * 0.62);
  return mixChannel(tint, ROSE, 0.78);
}

function weightAt(edge: WorldEdge, settle: number, time: number): number {
  const wobble = Math.sin(time * 5.4 + edge.seed * 18) * (1 - settle) * 0.42;
  return clamp(mix(edge.initial, edge.target, settle) + wobble, -1, 1);
}

function worldToPixel(x: number, y: number, canvas: HTMLCanvasElement): [number, number] {
  return [
    (x / WORLD_W + 0.5) * canvas.width,
    (0.5 - y / WORLD_H) * canvas.height,
  ];
}

function rgba(channel: readonly [number, number, number], alpha: number): string {
  return `rgba(${channel[0]}, ${channel[1]}, ${channel[2]}, ${clamp(alpha, 0, 1)})`;
}

function mixChannel(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  amount: number,
): [number, number, number] {
  const t = clamp(amount, 0, 1);
  return [
    Math.round(mix(from[0], to[0], t)),
    Math.round(mix(from[1], to[1], t)),
    Math.round(mix(from[2], to[2], t)),
  ];
}

function hash(value: number): number {
  return fract(Math.sin(value * 127.1 + 311.7) * 43758.5453);
}

function smoothstep(value: number): number {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function inOutCubic(value: number): number {
  const t = clamp(value, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

function outCubic(value: number): number {
  const t = clamp(value, 0, 1);
  return 1 - (1 - t) ** 3;
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function fract(value: number): number {
  return value - Math.floor(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function dot(left: readonly [number, number, number], right: readonly [number, number, number]): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function cross(
  left: readonly [number, number, number],
  right: readonly [number, number, number],
): [number, number, number] {
  return [
    left[1] * right[2] - left[2] * right[1],
    left[2] * right[0] - left[0] * right[2],
    left[0] * right[1] - left[1] * right[0],
  ];
}

function normalize(value: readonly [number, number, number]): [number, number, number] {
  const length = Math.hypot(value[0], value[1], value[2]) || 1;
  return [value[0] / length, value[1] / length, value[2] / length];
}

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

render(import.meta.url, NeuralNetworkShort, {
  output: sourcePath("../output/fractal-neural-network-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
