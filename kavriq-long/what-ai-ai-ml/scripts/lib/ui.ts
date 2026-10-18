import type { Scene, Tattva, Vec2, Vec3 } from "veena/core";
import { Arrow, Circle, Line, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { ALPHA, COLOR } from "./theme.ts";

export type VisualGroup = Tattva[];

export interface CardSpec {
  title: string;
  subtitle?: string;
  detail?: string;
  result?: string;
  color: string;
  fill?: string;
  at: Vec2;
  size?: Vec2;
}

export function addHeading(scene: Scene, title: string, subtitle?: string): VisualGroup {
  const items: VisualGroup = [];
  items.push(scene.add(
    Label(title).height(0.46).color(COLOR.ink).css({ fontWeight: 900, letterSpacing: "-0.025em" }),
    { at: [0, 3.55, 0] },
  ));
  if (subtitle) {
    items.push(scene.add(
      Label(subtitle).height(0.19).color(COLOR.muted).css({ fontWeight: 650 }),
      { at: [0, 3.03, 0] },
    ));
  }
  return items;
}

export function addCard(scene: Scene, spec: CardSpec): VisualGroup {
  const [x, y] = spec.at;
  const [width, height] = spec.size ?? [3.5, 1.65];
  const fill = spec.fill ?? COLOR.panel;
  const items: VisualGroup = [
    scene.add(
      Rectangle()
        .size([width, height])
        .cornerRadius(0.2)
        .fill(fill)
        .stroke({ color: spec.color, width: 0.045 })
        .css({ borderStyle: "none" }),
      { at: [x, y, 0] },
    ),
    scene.add(
      Label(spec.title.toUpperCase())
        .height(0.25)
        .color(spec.color)
        .css({ fontWeight: 900, letterSpacing: "0.065em" }),
      { at: [x, y + height * 0.25, 0.02] },
    ),
  ];
  if (spec.subtitle) {
    items.push(scene.add(
      Label(spec.subtitle).height(0.16).color(COLOR.muted).css({ fontWeight: 700 }),
      { at: [x, y - 0.02, 0.02] },
    ));
  }
  if (spec.detail) {
    items.push(scene.add(
      Label(spec.detail).height(0.16).color(COLOR.ink).css({ fontWeight: 650 }),
      { at: [x, y - height * 0.25, 0.02] },
    ));
  }
  if (spec.result) {
    const resultY = y - height * 0.34;
    items.push(
      scene.add(
        Rectangle()
          .size([Math.min(width - 0.45, Math.max(1.25, spec.result.length * 0.105)), 0.34])
          .cornerRadius(0.16)
          .fill(fillFor(spec.color))
          .stroke({ color: spec.color, width: 0.025 })
          .css({ borderStyle: "none" }),
        { at: [x, resultY, 0.03] },
      ),
      scene.add(
        Label(spec.result).height(0.145).color(spec.color).css({ fontWeight: 850, letterSpacing: "0.04em" }),
        { at: [x, resultY, 0.04] },
      ),
    );
  }
  return items;
}

export interface EmailMessage {
  all: VisualGroup;
  anchors: {
    sender: Vec2;
    body: Vec2;
    attachment: Vec2;
    reply: Vec2;
  };
}

export function addEmailMessage(scene: Scene, at: Vec2 = [0, 0], scale = 1): EmailMessage {
  const [x, y] = at;
  const w = 3.8 * scale;
  const h = 2.5 * scale;
  const items: VisualGroup = [];
  items.push(scene.add(
    Rectangle()
      .size([w, h])
      .cornerRadius(0.22 * scale)
      .fill(COLOR.panel)
      .stroke({ color: COLOR.grid, width: 0.045 })
      .css({ borderStyle: "none" }),
    { at: [x, y, 0] },
  ));
  items.push(scene.add(
    Circle().radius(0.23 * scale).fill(ALPHA.ai).stroke({ color: COLOR.ai, width: 0.035 }),
    { at: [x - w * 0.38, y + h * 0.31, 0.02] },
  ));
  items.push(scene.add(
    Label("A").height(0.19 * scale).color(COLOR.ai).css({ fontWeight: 900 }),
    { at: [x - w * 0.38, y + h * 0.31, 0.03] },
  ));
  items.push(scene.add(
    Label("Alex Morgan  •  alex@example.com").height(0.15 * scale).color(COLOR.ink).css({ fontWeight: 750 }),
    { at: [x - w * 0.02, y + h * 0.35, 0.02] },
  ));
  items.push(scene.add(
    Label("Subject: Project review meeting").height(0.18 * scale).color(COLOR.ink).css({ fontWeight: 850 }),
    { at: [x, y + h * 0.12, 0.02] },
  ));
  items.push(scene.add(
    Label("Can we meet Tuesday at 10:00?\nPlease review the attached image.")
      .height(0.145 * scale)
      .color(COLOR.muted)
      .css({ fontWeight: 600, textAlign: "left" }),
    { at: [x - w * 0.08, y - h * 0.12, 0.02] },
  ));
  const attachmentAt: Vec2 = [x - w * 0.28, y - h * 0.35];
  items.push(scene.add(
    Rectangle().size([1.2 * scale, 0.42 * scale]).cornerRadius(0.1).fill(COLOR.panelSoft)
      .stroke({ color: COLOR.grid, width: 0.025 }).css({ borderStyle: "none" }),
    { at: [attachmentAt[0], attachmentAt[1], 0.02] },
  ));
  items.push(scene.add(
    Label("▧  dog-photo.jpg").height(0.13 * scale).color(COLOR.muted).css({ fontWeight: 700 }),
    { at: [attachmentAt[0], attachmentAt[1], 0.03] },
  ));
  const replyAt: Vec2 = [x + w * 0.25, y - h * 0.35];
  items.push(scene.add(
    Rectangle().size([1.3 * scale, 0.42 * scale]).cornerRadius(0.1).fill(ALPHA.genai)
      .stroke({ color: COLOR.genai, width: 0.025 }).css({ borderStyle: "none" }),
    { at: [replyAt[0], replyAt[1], 0.02] },
  ));
  items.push(scene.add(
    Label("Reply with AI").height(0.13 * scale).color(COLOR.genai).css({ fontWeight: 800 }),
    { at: [replyAt[0], replyAt[1], 0.03] },
  ));
  return {
    all: items,
    anchors: {
      sender: [x - w * 0.38, y + h * 0.31],
      body: [x + w * 0.5, y],
      attachment: attachmentAt,
      reply: replyAt,
    },
  };
}

export function addArrow(scene: Scene, from: Vec2, to: Vec2, color: string): Tattva {
  return scene.add(Arrow().from(from).to(to).stroke({ color, width: 0.045 }));
}

export function addLine(scene: Scene, from: Vec2, to: Vec2, color: string, width = 0.035): Tattva {
  return scene.add(Line().from(from).to(to).stroke({ color, width }));
}

export function addPill(scene: Scene, text: string, at: Vec2, color: string, width?: number): VisualGroup {
  const actualWidth = width ?? Math.max(1.2, text.length * 0.12);
  return [
    scene.add(
      Rectangle().size([actualWidth, 0.42]).cornerRadius(0.2).fill(fillFor(color))
        .stroke({ color, width: 0.025 }).css({ borderStyle: "none" }),
      { at: [at[0], at[1], 0] },
    ),
    scene.add(
      Label(text).height(0.15).color(color).css({ fontWeight: 850, letterSpacing: "0.04em" }),
      { at: [at[0], at[1], 0.02] },
    ),
  ];
}

export function addProgressBar(
  scene: Scene,
  at: Vec2,
  width: number,
  progress: number,
  color: string,
): VisualGroup {
  const clamped = Math.max(0, Math.min(1, progress));
  const filledWidth = width * clamped;
  return [
    scene.add(
      Rectangle().size([width, 0.28]).cornerRadius(0.14).fill(COLOR.panelSoft)
        .stroke({ color: COLOR.grid, width: 0.02 }).css({ borderStyle: "none" }),
      { at: [at[0], at[1], 0] },
    ),
    scene.add(
      Rectangle().size([filledWidth, 0.22]).cornerRadius(0.11).fill(color).css({ borderStyle: "none" }),
      { at: [at[0] - (width - filledWidth) / 2, at[1], 0.02] },
    ),
  ];
}

export function nodesAndEdges(
  scene: Scene,
  layers: readonly number[],
  center: Vec2,
  color: string,
  layerGap = 1.25,
  nodeGap = 0.62,
): { nodes: VisualGroup; edges: VisualGroup; layerCenters: Vec2[] } {
  const nodes: VisualGroup = [];
  const edges: VisualGroup = [];
  const layerCenters: Vec2[] = [];
  const startX = center[0] - ((layers.length - 1) * layerGap) / 2;
  const positions = layers.map((count, layerIndex) => {
    const x = startX + layerIndex * layerGap;
    layerCenters.push([x, center[1]]);
    return Array.from({ length: count }, (_, nodeIndex): Vec2 => [
      x,
      center[1] + ((count - 1) * nodeGap) / 2 - nodeIndex * nodeGap,
    ]);
  });
  for (let layer = 0; layer < positions.length - 1; layer += 1) {
    for (const from of positions[layer]) {
      for (const to of positions[layer + 1]) {
        edges.push(addLine(scene, from, to, "rgba(155,109,255,0.28)", 0.022));
      }
    }
  }
  for (const layer of positions) {
    for (const position of layer) {
      nodes.push(scene.add(
        Circle().radius(0.15).fill(ALPHA.dl).stroke({ color, width: 0.03 }),
        { at: [position[0], position[1], 0.04] },
      ));
    }
  }
  return { nodes, edges, layerCenters };
}

export function position3([x, y]: Vec2, z = 0): Vec3 {
  return [x, y, z];
}

function fillFor(color: string): string {
  if (color === COLOR.ai) return ALPHA.ai;
  if (color === COLOR.ml) return ALPHA.ml;
  if (color === COLOR.dl) return ALPHA.dl;
  if (color === COLOR.foundation) return ALPHA.foundation;
  if (color === COLOR.genai) return ALPHA.genai;
  if (color === COLOR.warning) return ALPHA.warning;
  return ALPHA.muted;
}
