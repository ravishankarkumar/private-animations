import { render } from "murali-js";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, Tattva, timeline, type TattvaState } from "murali-js/core";
import { Label } from "murali-js/text";

const BG = "#040812";
const INK = "#F4FBFF";
const MUTED = "#8BA8B7";
const KITE = "#E7B85A";
const DART = "#6EC8E0";

const PHI = (1 + Math.sqrt(5)) / 2;
const INV = 1 / PHI;

// Each hold pushes in, then the tiling splits. Early pushes are fast.
// The view never sits still. The last move pulls back to the whole pattern.
const HOLDS = [0.55, 0.75, 1.05, 1.45, 2.1, 3.0, 5.0, 8.5];
const MULTIPLIERS = [1, 1.22, 1.55, 2.05, 2.85, 4.05, 5.9, 8.8, 13.2];
const LAST = HOLDS.length - 1;
const PULL = 2.1;
const UNTYPE = 0.5;
const PARK = 0.7;
const PLATE = 6.4;

interface Mat {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

interface Tile {
  kind: "kite" | "dart";
  t: Mat;
  verts: number[][];
}

const rot = (x: number, y: number, n: number): number[] => {
  const angle = (n * 18 * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [c * x - s * y, s * x + c * y];
};

const scaling = (s: number): Mat => ({ a: s, b: 0, c: 0, d: 0, e: s, f: 0 });
const translation = (x: number, y: number): Mat => ({ a: 1, b: 0, c: x, d: 0, e: 1, f: y });
const rotation = (n: number): Mat => {
  const angle = (n * 18 * Math.PI) / 180;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { a: c, b: -s, c: 0, d: s, e: c, f: 0 };
};

// Python `A @ B` applies B first, then A.
const mul = (left: Mat, right: Mat): Mat => ({
  a: left.a * right.a + left.b * right.d,
  b: left.a * right.b + left.b * right.e,
  c: left.a * right.c + left.b * right.f + left.c,
  d: left.d * right.a + left.e * right.d,
  e: left.d * right.b + left.e * right.e,
  f: left.d * right.c + left.e * right.f + left.f,
});
const at = (first: Mat, second: Mat): Mat => mul(first, second);
const chain = (...parts: Mat[]): Mat => parts.reduce((acc, part) => at(acc, part));
const apply = (t: Mat, x: number, y: number): number[] => [
  t.a * x + t.b * y + t.c,
  t.d * x + t.e * y + t.f,
];

const r36 = rot(1, 0, 2);
const r72 = rot(1, 0, 4);
const kite: number[][] = [[0, 0], [1, 0], r36, r72];
const dart: number[][] = [[0, 0], [1, 0], rot(INV, 0, 2), r72];
const thick: number[][] = [[0, 0], [1, 0], [1 + r72[0]!, r72[1]!], r72];
const thin: number[][] = [[0, 0], [1, 0], [1 + r36[0]!, r36[1]!], r36];

const protos: Record<string, number[][]> = {
  kite,
  dart,
  AK1: [kite[0]!, kite[1]!, kite[2]!],
  AK2: [kite[0]!, kite[2]!, kite[3]!],
  AD1: [dart[0]!, dart[1]!, dart[2]!],
  AD2: [dart[0]!, dart[2]!, dart[3]!],
  BL1: [thick[0]!, thick[1]!, thick[2]!],
  BL2: [thick[0]!, thick[2]!, thick[3]!],
  BS1: [thin[0]!, thin[1]!, thin[3]!],
  BS2: [thin[1]!, thin[2]!, thin[3]!],
};

const half: Record<string, [string, Mat][]> = {
  AK1: [
    ["BL1", chain(translation(1, 0), rotation(8), scaling(INV))],
    ["BS2", chain(translation(1, 0), rotation(-4), scaling(INV), translation(-thin[2]![0]!, -thin[2]![1]!))],
  ],
  AK2: [
    ["BL2", chain(rotation(-8), scaling(INV), translation(-thick[2]![0]!, -thick[2]![1]!))],
    ["BS1", chain(translation(kite[3]![0]!, kite[3]![1]!), rotation(-4), scaling(INV))],
  ],
  AD1: [["BL2", chain(rotation(-2), scaling(INV))]],
  AD2: [["BL1", chain(rotation(2), scaling(INV))]],
  BL1: [
    ["AK2", rotation(-2)],
    ["AD2", chain(translation(thick[2]![0]!, thick[2]![1]!), rotation(10))],
  ],
  BL2: [
    ["AK1", rotation(2)],
    ["AD1", chain(translation(thick[2]![0]!, thick[2]![1]!), rotation(10))],
  ],
  BS1: [["AK2", rotation(-2)]],
  BS2: [["AK1", chain(translation(thin[2]![0]!, thin[2]![1]!), rotation(10))]],
};

const toP2: Record<string, "kite" | "dart"> = {
  AK1: "kite",
  AK2: "kite",
  AD1: "dart",
  AD2: "dart",
};

const quant = (n: number): number => {
  const rounded = Math.round(n * 1e5);
  return rounded === 0 ? 0 : rounded;
};

const worldOf = (kind: string, t: Mat): number[][] =>
  protos[kind]!.map(([x, y]) => apply(t, x!, y!));

// Two half-tiles reconstruct one kite or dart, so the same polygon is emitted twice.
const deflateOnce = (tiles: Tile[]): Tile[] => {
  const step = (source: { kind: string; t: Mat }[]): { kind: string; t: Mat }[] =>
    source.flatMap((tile) => {
      if (tile.kind === "kite") return ["AK1", "AK2"].map((kind) => ({ kind, t: tile.t }));
      if (tile.kind === "dart") return ["AD1", "AD2"].map((kind) => ({ kind, t: tile.t }));
      return (half[tile.kind] ?? []).map(([kind, local]) => ({ kind, t: at(tile.t, local) }));
    });
  const finished = step(step(step(tiles)));
  const seen = new Set<string>();
  const drawn: Tile[] = [];
  for (const tile of finished) {
    const kind = toP2[tile.kind];
    if (!kind) continue;
    const verts = worldOf(kind, tile.t);
    const key = `${kind}:${verts.map(([x, y]) => `${quant(x!)},${quant(y!)}`).sort().join(";")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    drawn.push({ kind, t: tile.t, verts });
  }
  return drawn;
};

const sun: Tile[] = [-1, 3, 7, 11, 15].map((turn) => {
  const t = at(rotation(turn), scaling(PHI ** 4));
  return { kind: "kite", t, verts: worldOf("kite", t) };
});

const generations: Tile[][] = [sun];
for (let generation = 0; generation < LAST; generation += 1) {
  generations.push(deflateOnce(generations[generation]!));
}

const known = [5, 15, 45, 125, 345];
known.forEach((count, index) => {
  if (generations[index]?.length !== count) {
    throw new Error(`Penrose generation ${index} has ${generations[index]?.length ?? 0} tiles, expected ${count}.`);
  }
});
for (let index = 1; index < generations.length; index += 1) {
  if (generations[index]!.length <= generations[index - 1]!.length) {
    throw new Error(`Penrose generation ${index} did not grow.`);
  }
}

let originX = 0;
let originY = 0;
for (const tile of sun) {
  for (const [x, y] of tile.verts) {
    originX += x!;
    originY += y!;
  }
}
originX /= sun.length * 4;
originY /= sun.length * 4;

let reach = 0;
for (const tile of generations[LAST]!) {
  for (const [x, y] of tile.verts) {
    reach = Math.max(reach, Math.abs(x! - originX), Math.abs(y! - originY));
  }
}
const fit = (PLATE / 2) * 0.98 / reach;

const place = (x: number, y: number): [number, number] => [
  (x - originX) * fit,
  (y - originY) * fit,
];

const halfPlate = PLATE / 2;
const radiusOf = (tiles: Tile[]): number => {
  let radius = 0;
  for (const tile of tiles) {
    for (const [x, y] of tile.verts) {
      const [px, py] = place(x!, y!);
      radius = Math.max(radius, Math.abs(px), Math.abs(py));
    }
  }
  return radius;
};
// 1 frames the whole plate. Higher values crop toward the center.
const zoomStart = (halfPlate / radiusOf(generations[0]!)) / 1.08;
const zoomAt = (step: number): number => zoomStart * MULTIPLIERS[step]!;

const bodies: string[] = generations.map((tiles) => {
  const ordered = [
    ...tiles.filter((tile) => tile.kind === "kite"),
    ...tiles.filter((tile) => tile.kind === "dart"),
  ];
  return ordered.map((tile) => {
    const points = tile.verts.map(([x, y]) => {
      const [px, py] = place(x!, y!);
      return `${px.toFixed(3)},${(-py).toFixed(3)}`;
    }).join(" ");
    const fill = tile.kind === "kite" ? KITE : DART;
    return `<polygon points="${points}" fill="${fill}" vector-effect="non-scaling-stroke"/>`;
  }).join("");
});

const stageAt: number[] = [];
{
  let time = 0;
  for (const hold of HOLDS) {
    stageAt.push(time);
    time += hold;
  }
}
const DIVE = stageAt[LAST]! + HOLDS[LAST]!;
const BUILD = DIVE + PULL;

interface PenroseState extends TattvaState {
  /** Integer generation. 0 is five kites. */
  generation: number;
  /** 1 shows the whole plate. Larger values close in on the center. */
  zoom: number;
}

class PenrosePlate extends Tattva<PenroseState> {
  private shown = -1;
  private svg: SVGSVGElement | null = null;

  constructor() {
    super({ state: { generation: 0, zoom: zoomAt(0) } });
    this.dynamicGeometry = true;
    this.worldSize = { width: PLATE, height: PLATE };
  }

  override contentHTML(_time: number, state: Readonly<PenroseState> = this.initialState): string | undefined {
    const generation = Math.max(0, Math.min(LAST, Math.round(state.generation)));
    const zoom = Math.max(0.2, state.zoom);
    const half = halfPlate / zoom;
    const view = `${(-half).toFixed(4)} ${(-half).toFixed(4)} ${(half * 2).toFixed(4)} ${(half * 2).toFixed(4)}`;
    const svg = this.svg ?? (typeof document === "undefined" ? null : document.getElementById("penrose-plate"));
    if (!(svg instanceof SVGSVGElement)) {
      this.shown = generation;
      return `<div style="width:100%;height:100%;border-radius:50%;overflow:hidden"><svg id="penrose-plate" xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"><g stroke="${BG}" stroke-width="1.7" stroke-linejoin="round">${bodies[generation]}</g></svg></div>`;
    }
    this.svg = svg;
    if (generation !== this.shown) {
      const group = svg.querySelector("g");
      if (group) group.innerHTML = bodies[generation] ?? "";
      this.shown = generation;
    }
    svg.setAttribute("viewBox", view);
    return undefined;
  }
}

class PenroseTilingShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const plate = this.add(new PenrosePlate(), { at: [0, 0.28] });
    const title = this.add(
      Label("Penrose tiling")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("Kites and darts never repeat")
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
      for (let generation = 0; generation < LAST; generation += 1) {
        t.animate(plate)
          .at(stageAt[generation]!)
          .duration(HOLDS[generation]!)
          .ease("linear")
          .to({ zoom: zoomAt(generation + 1) });
        t.animate(plate)
          .at(stageAt[generation + 1]!)
          .duration(0.04)
          .ease("linear")
          .to({ generation: generation + 1 });
      }
      t.animate(plate)
        .at(stageAt[LAST]!)
        .duration(HOLDS[LAST]!)
        .ease("linear")
        .to({ zoom: zoomAt(LAST + 1) });
      t.animate(plate)
        .at(DIVE)
        .duration(PULL)
        .ease("inOutCubic")
        .to({ zoom: 1 });
      t.wait(BUILD);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(UNTYPE).ease("outCubic").untypewrite();
      t.animate(rule).duration(UNTYPE * 0.84).ease("outCubic").untypewrite();
    }));
    this.play(timeline((t) => {
      t.animate(plate).duration(PARK).ease("inOutCubic").moveTo([0, 4.55]);
      t.animate(plate).duration(PARK).ease("inOutCubic").scaleTo(0.54);
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

render(import.meta.url, PenroseTilingShort, {
  output: sourcePath("../output/fractal-penrose-tiling-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
