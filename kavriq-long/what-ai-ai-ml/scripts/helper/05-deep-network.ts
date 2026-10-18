import { CanvasTattva, type CanvasContext } from "veena/adapters";
import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type TattvaState } from "veena/core";
import { Label } from "veena/text";
import { renderScene } from "../lib/render.ts";
import { COLOR, FRAME } from "../lib/theme.ts";

const LAYERS = 4;
const NODES = 50;
/** Links drawn per node. A full 50×50 matrix would paint the space between planes solid. */
const FANOUT = 4;
/** Half-extent of each layer plane. The plane is vertical and runs into the screen. */
const HALF = 1.28;
const GAP = 5.4;
const PLANE_Y = 0.45;
const WORLD = [16, 9] as const;
const LAYER_NAMES = ["INPUT", "HIDDEN 1", "HIDDEN 2", "OUTPUT"] as const;

const TARGET = [0.2, -0.1, 0] as const;
const FOCAL = 1 / Math.tan(24 * Math.PI / 360);
/** Matches the shot length. The orbit finishes as the forward pass is holding. */
const MOVE_SECONDS = 11.5;

const LAYER_TINT = [
  [126, 214, 242],
  [176, 164, 255],
  [198, 186, 255],
  [236, 214, 255],
] as const;
const ROSE = [206, 150, 172] as const;
const PULSE = [214, 246, 255] as const;
const WHITE = [246, 244, 255] as const;

interface NetworkState extends TattvaState {
  epoch: number;
}

interface WorldNode {
  layer: number;
  x: number;
  y: number;
  z: number;
  seed: number;
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
  backward: boolean;
}

interface CameraPose {
  azimuth: number;
  elevation: number;
  distance: number;
}

interface CameraFrame {
  eye: readonly [number, number, number];
  basis: CameraBasis;
  referenceDepth: number;
}

const nodes = buildNodes();
const edges = buildEdges(nodes);

class DeepNetworkScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const network = this.add(new CanvasTattva<NetworkState>({
      draw(context, state, sample) {
        paintNetwork(context, state.epoch, sample.time, frameCamera(poseAt(sample.time)));
      },
    }, { size: [WORLD[0], WORLD[1]], state: { epoch: 0 } }), { at: [0, 0, 0] });
    network.opacity(0);

    const title = this.add(
      Label("DEEP LEARNING").height(0.42).color(COLOR.ink)
        .css({ fontWeight: 900, letterSpacing: "-0.03em" }),
      { at: [0, 3.62, 1] },
    );
    const subtitle = this.add(
      Label("4 LAYERS  ·  50 NODES ON EACH PLANE  ·  WEIGHTS LIVE ON THE EDGES")
        .height(0.18).color(COLOR.muted).css({ fontWeight: 750, letterSpacing: "0.04em" }),
      { at: [0, 3.12, 1] },
    );
    const opening = frameCamera(poseAt(0));
    const layerLabels = LAYER_NAMES.map((name, layer) => this.add(
      Label(name).height(0.18).color(COLOR.dl).css({ fontWeight: 800, letterSpacing: "0.08em" }),
      { at: [projectLayerCenter(layer, opening).x, -3.22, 1] },
    ));
    const training = this.add(
      Label("TRAINING").height(0.22).color(COLOR.warning)
        .css({ fontWeight: 850, letterSpacing: "0.14em" }),
      { at: [0, -3.92, 1] },
    );
    const locked = this.add(
      Label("WEIGHTS LOCKED  ·  ONE PASS FORWARD").height(0.22).color(COLOR.ml)
        .css({ fontWeight: 850, letterSpacing: "0.08em" }),
      { at: [0, -3.92, 1] },
    );
    locked.opacity(0);
    addKavriqBrand(this);
    this.updater((time, states) => {
      const camera = frameCamera(poseAt(time));
      layerLabels.forEach((label, layer) => {
        const state = states.get(label);
        if (!state) return;
        state.x = projectLayerCenter(layer, camera).x;
      });
    });

    const timeline = new Timeline();
    timeline.animate(network).at(0.15).duration(0.7).appear();
    timeline.animate([title, subtitle, ...layerLabels, training]).at(0.25).stagger(0.06).duration(0.4).appear();
    timeline.animate(network).at(0.9).duration(6.6).ease("inOutCubic").to({ epoch: 1 });
    timeline.animate(training).at(7.55).duration(0.35).disappear();
    timeline.animate(locked).at(7.7).duration(0.4).appear();
    this.play(timeline);
    this.wait(Math.max(0, MOVE_SECONDS - this.duration));
    this.captureScreenshotsNamed([
      [1.6, "05-deep-network-training.png"],
      [4.6, "05-deep-network-settling.png"],
      [9.4, "05-deep-network-forward.png"],
    ]);
  }
}

function paintNetwork(
  { canvas, context, pixelsPerUnit }: CanvasContext,
  epoch: number,
  time: number,
  camera: CameraFrame,
): void {
  const settle = smoothstep(clamp(epoch, 0, 1));
  const drawnEdges = edges.map((edge) => {
    const from = projectWith(edge.ax, edge.ay, edge.az, camera);
    const to = projectWith(edge.bx, edge.by, edge.bz, camera);
    return { edge, from, to, depth: (from.depth + to.depth) / 2 };
  }).sort((left, right) => right.depth - left.depth);
  const drawnNodes = nodes.map((node) => ({
    node,
    point: projectWith(node.x, node.y, node.z, camera),
  })).sort((left, right) => right.point.depth - left.point.depth);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  for (const drawn of drawnEdges) {
    const { edge, from, to, depth } = drawn;
    const weight = weightAt(edge, settle, time);
    const magnitude = Math.abs(weight);
    const scale = camera.referenceDepth / depth;
    const ink = edgeInk(edge.fromLayer, weight);
    const [x0, y0] = worldToPixel(from.x, from.y, canvas);
    const [x1, y1] = worldToPixel(to.x, to.y, canvas);
    context.strokeStyle = rgba(ink, weight >= 0 ? 0.07 + magnitude * 0.5 : 0.04 + magnitude * 0.22);
    context.lineWidth = Math.max(1, pixelsPerUnit * (0.005 + magnitude * 0.02) * scale);
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();

    if (magnitude > 0.34) {
      const messy = fract(time * 0.72 + edge.seed);
      const shared = fract(time * 0.32);
      const along = mix(messy, shared, settle * settle);
      strokePulse(
        context, x0, y0, x1, y1, along,
        rgba(PULSE, 0.28 + magnitude * 0.45),
        pixelsPerUnit * 0.012 * scale,
      );
    }
    if (edge.backward && settle < 0.96 && magnitude > 0.2) {
      const back = fract(time * 0.48 + edge.seed * 0.37);
      strokePulse(
        context, x0, y0, x1, y1, 1 - back,
        rgba(ROSE, 0.32 * (1 - settle)),
        pixelsPerUnit * 0.01 * scale,
      );
    }
  }

  for (const drawn of drawnNodes) {
    const { node, point } = drawn;
    const wave = fract(time * 0.32);
    const glow = Math.exp(-24 * (node.layer / (LAYERS - 1) - wave) ** 2) * settle * settle;
    const flicker = (1 - settle) * (0.35 + 0.65 * Math.abs(Math.sin(time * 3.1 + node.seed * 12)));
    const tint = LAYER_TINT[node.layer] ?? LAYER_TINT[1];
    const [x, y] = worldToPixel(point.x, point.y, canvas);
    const radius = pixelsPerUnit * (0.05 + glow * 0.018) * (camera.referenceDepth / point.depth);
    context.fillStyle = rgba(tint, 0.16 + glow * 0.38);
    context.beginPath();
    context.arc(x, y, radius * 2.35, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = rgba(mixChannel(tint, WHITE, 0.55 + Math.max(glow, flicker) * 0.4), 0.96);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

function strokePulse(
  context: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  along: number,
  color: string,
  width: number,
): void {
  const start = Math.max(0, along - 0.05);
  const end = Math.min(1, along + 0.018);
  context.strokeStyle = color;
  context.lineWidth = Math.max(1.25, width);
  context.beginPath();
  context.moveTo(mix(x0, x1, start), mix(y0, y1, start));
  context.lineTo(mix(x0, x1, end), mix(y0, y1, end));
  context.stroke();
}

function buildNodes(): WorldNode[] {
  const points: WorldNode[] = [];
  const inset = HALF - 0.08;
  for (let layer = 0; layer < LAYERS; layer += 1) {
    const planeX = (layer - (LAYERS - 1) / 2) * GAP;
    for (let index = 0; index < NODES; index += 1) {
      const [depth, height] = scatter(layer, index);
      points.push({
        layer,
        x: planeX,
        y: PLANE_Y + (height * 2 - 1) * inset,
        z: (depth * 2 - 1) * inset,
        seed: hash(layer * 1000 + index * 17 + 3),
      });
    }
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
        const initial = seed * 2 - 1;
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
          initial,
          target: sign * (keep > 0.42 ? 0.25 + keep * 0.75 : keep * 0.18),
          seed,
          backward: hash(seed * 29 + 2) > 0.8,
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

/** Even scatter on the unit plane, shifted per layer so the clouds do not match. */
function scatter(layer: number, index: number): [number, number] {
  const g = 1.324717957244746;
  const n = index + 1;
  const u = fract(0.5 + n / g + layer * 0.173);
  const v = fract(0.5 + n / (g * g) + layer * 0.271);
  const jx = (hash(layer * 40 + index * 3 + 1) - 0.5) * 0.045;
  const jy = (hash(layer * 40 + index * 5 + 2) - 0.5) * 0.045;
  return [clamp(u + jx, 0.02, 0.98), clamp(v + jy, 0.02, 0.98)];
}

function poseAt(time: number): CameraPose {
  const t = clamp(time / MOVE_SECONDS, 0, 1);
  const turn = smoothstep(t);
  return {
    azimuth: mix(28, 48, turn),
    elevation: 12 + Math.sin(t * Math.PI) * 4,
    distance: mix(30, 26.5, turn),
  };
}

function frameCamera(pose: CameraPose): CameraFrame {
  const eye = orbit(pose.distance, pose.azimuth, pose.elevation);
  const basis = cameraBasis(eye, TARGET);
  const origin = projectWith(TARGET[0], TARGET[1], TARGET[2], { eye, basis, referenceDepth: 1 });
  return { eye, basis, referenceDepth: origin.depth };
}

function projectLayerCenter(layer: number, camera: CameraFrame): ProjectedPoint {
  return projectWith((layer - (LAYERS - 1) / 2) * GAP, PLANE_Y, 0, camera);
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

function orbit(distance: number, azimuthDegrees: number, elevationDegrees: number): [number, number, number] {
  const azimuth = azimuthDegrees * Math.PI / 180;
  const elevation = elevationDegrees * Math.PI / 180;
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
  const forward = normalize([
    target[0] - eye[0],
    target[1] - eye[1],
    target[2] - eye[2],
  ]);
  const right = normalize(cross(forward, [0, 1, 0]));
  return { right, up: cross(right, forward), forward };
}

function projectWith(x: number, y: number, z: number, camera: CameraFrame): ProjectedPoint {
  const relative = [x - camera.eye[0], y - camera.eye[1], z - camera.eye[2]] as const;
  const cameraX = dot(relative, camera.basis.right);
  const cameraY = dot(relative, camera.basis.up);
  const depth = dot(relative, camera.basis.forward);
  const aspect = WORLD[0] / WORLD[1];
  return {
    x: (cameraX / depth) * FOCAL / aspect * (WORLD[0] / 2),
    y: (cameraY / depth) * FOCAL * (WORLD[1] / 2),
    depth,
  };
}

function edgeInk(fromLayer: number, weight: number): [number, number, number] {
  const from = LAYER_TINT[fromLayer] ?? LAYER_TINT[1];
  const to = LAYER_TINT[fromLayer + 1] ?? from;
  const tint = mixChannel(from, to, 0.5);
  if (weight >= 0) return mixChannel(tint, WHITE, Math.abs(weight) * 0.72);
  return mixChannel(tint, ROSE, 0.78);
}

function weightAt(edge: WorldEdge, settle: number, time: number): number {
  const wobble = Math.sin(time * 5.4 + edge.seed * 18) * (1 - settle) * 0.42;
  return clamp(mix(edge.initial, edge.target, settle) + wobble, -1, 1);
}

function worldToPixel(x: number, y: number, canvas: HTMLCanvasElement): [number, number] {
  return [
    (x / WORLD[0] + 0.5) * canvas.width,
    (0.5 - y / WORLD[1]) * canvas.height,
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

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  scene.updater((time, states) => {
    motion.update((1.49 + time) % motion.duration, states);
  });
}

function hash(value: number): number {
  return fract(Math.sin(value * 127.1 + 311.7) * 43758.5453);
}

function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
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
  const length = Math.hypot(value[0], value[1], value[2]);
  return [value[0] / length, value[1] / length, value[2] / length];
}

await renderScene(import.meta.url, DeepNetworkScene, "05-deep-network.mp4");
