import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Circle, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { ALPHA, COLOR, FRAME } from "./lib/theme.ts";
import { addArrow } from "./lib/ui.ts";

// Editing contract for the talking-head insert. The underlying animation holds
// on one exact frame throughout this interval, including the Kavriq logo.
const LIVE_CAMERA_START = 41;
const LIVE_CAMERA_END = 70;
const CAMERA_HOLD_DURATION = LIVE_CAMERA_END - LIVE_CAMERA_START;

const SOLID = {
  ai: "#17647D",
  ml: "#1E7A55",
  dl: "#53368A",
  genai: "#C4485C",
} as const;

interface ResultCard {
  all: Tattva[];
  panel: Tattva;
  result: Tattva;
  center: Vec2;
}

interface ChecklistLine {
  all: Tattva[];
  mark: Tattva[];
  label: Tattva;
}

class RuleBasedAiScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    // Rebuild the final composition from Part 1 so this scene cuts seamlessly
    // after 01-introduction.mp4.
    const email = addOpenEmailView(this, { at: [0, 0.02], scale: 0.68 });
    const flagged = addResultCard(this, {
      at: [-5.75, 1.55], fill: SOLID.ai,
      result: "FLAGGED", detail: "Rule-based checks",
    });
    const spam = addResultCard(this, {
      at: [5.75, 1.55], fill: SOLID.ml,
      result: "SPAM 96%", detail: "Learned score",
    });
    const dog = addResultCard(this, {
      at: [-5.75, -1.55], fill: SOLID.dl,
      result: "DOG 98%", detail: "Image recognized",
    });
    const draft = addResultCard(this, {
      at: [5.75, -1.55], fill: SOLID.genai,
      result: "DRAFT", detail: "AI-generated reply",
    });
    const cards = [flagged, spam, dog, draft] as const;

    const connectors = [
      addArrow(this, email.anchors.subject, [-4.52, 1.55], COLOR.ai),
      addArrow(this, email.anchors.body, [4.52, 1.55], COLOR.ml),
      addArrow(this, email.anchors.attachment, [-4.52, -1.55], COLOR.dl),
      addArrow(this, email.anchors.reply, [4.52, -1.55], COLOR.genai),
    ];
    connectors.forEach((arrow) => {
      arrow.at([arrow.initialState.x, arrow.initialState.y, 0.18]);
    });
    bindArrow(this, connectors[0]!, email.subject[0]!, flagged.panel, [2.34, 0.88]);
    bindArrow(this, connectors[1]!, email.body[1]!, spam.panel, [2.34, 0.88]);
    bindArrow(this, connectors[2]!, email.attachment[0]!, dog.panel, [2.34, 0.88]);
    bindArrow(this, connectors[3]!, email.reply[0]!, draft.panel, [2.34, 0.88]);

    // Part 1 parks this chip near the top-right before the cut.
    email.errorChip.forEach((piece) => {
      piece.at([6.35, 3.72, piece.initialState.z + 0.35]);
    });
    const emailMain = email.all.filter((item) => !email.errorChip.includes(item));

    const compactEmailCenter: Vec2 = [-4.52, 0];
    const compactEmailScale = 0.58;
    const compactCardCenters: readonly Vec2[] = [
      [-5.78, 3.62],
      [-3.18, 3.62],
      [-5.78, -3.62],
      [-3.18, -3.62],
    ];
    const compactCardScale = 0.82;

    // This is the duplicate that leaves the four-result layout and becomes the
    // rule-based AI example on the right.
    const focusCard = addResultCard(this, {
      at: compactCardCenters[0]!, fill: SOLID.ai,
      result: "FLAGGED", detail: "Rule-based checks",
    });
    focusCard.all.forEach((item) => item.opacity(0));

    const checklist = [
      addChecklistLine(this, "Unknown sender", [3.56, 0.25]),
      addChecklistLine(this, "Urgent wording", [3.56, -0.48]),
      addChecklistLine(this, "Suspicious link", [3.56, -1.21]),
    ];
    checklist.flatMap((line) => line.all).forEach((item) => item.opacity(0));

    const checklistHeading = this.add(
      Label("HARD-CODED RULES").height(0.19).color(COLOR.ai)
        .css({ fontWeight: 900, letterSpacing: "0.075em" }),
      { at: [3.56, 0.95, 0.24] },
    ).opacity(0);

    // Screen 2 spans x=8..24 and y=-4.5..4.5. The persistent concept diagram
    // lives entirely inside that adjacent canvas, centered at x=16.
    const aiBoundary = this.add(
      Rectangle().size([13.60, 7.55]).cornerRadius(0.34)
        .fill(ALPHA.ai).stroke({ color: COLOR.ai, width: 0.055 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 0 28px rgba(49,215,255,0.12))" })
        .scale(0.22).opacity(0),
      { at: [16, 0, 0.12] },
    );
    const aiLabel = this.add(
      Label("AI").height(0.52).color(COLOR.ai)
        .css({ fontWeight: 950, letterSpacing: "0.07em" }),
      { at: [16, 3.25, 0.18] },
    ).opacity(0);
    const aiDefinition = this.add(
      Label("TASKS ASSOCIATED WITH INTELLIGENCE").height(0.15).color(COLOR.muted)
        .css({ fontWeight: 750, letterSpacing: "0.045em" }),
      { at: [16, 2.80, 0.18] },
    ).opacity(0);

    addFrozenKavriqBrand(this, LIVE_CAMERA_START, LIVE_CAMERA_END);

    const timeline = new Timeline();

    // 0–1.35 s: reorganize the inherited composition in one coordinated move.
    moveAndScaleAround(
      timeline, emailMain, [0, 0.02], compactEmailCenter,
      compactEmailScale, 0.05, 1.25,
    );
    cards.forEach((card, index) => {
      moveAndScaleAround(
        timeline, card.all, card.center, compactCardCenters[index]!,
        compactCardScale, 0.05, 1.25,
      );
    });
    // Focus the rule-based result and quiet the other three systems.
    timeline.animate([spam.all, dog.all, draft.all].flat())
      .at(1.65).duration(0.48).ease("outCubic").fadeTo(0.18);
    timeline.animate(flagged.all).at(1.72).duration(0.28).ease("outCubic").scaleTo(0.91);
    timeline.animate(flagged.all).at(2.13).duration(0.28).ease("inOutCubic").scaleTo(compactCardScale);
    timeline.animate(flagged.result).at(1.76).duration(0.62).indicate();

    // Duplicate the focused card and carry the copy into the open explanation area.
    timeline.animate(focusCard.all).at(3.10).stagger(0.035).duration(0.28).appear();
    moveItemsBy(timeline, focusCard.all, [9.34, -1.72], 3.28, 1.28, 1);
    timeline.animate(flagged.all).at(3.34).duration(0.46).ease("outCubic").fadeTo(0.18);
    timeline.animate(focusCard.result).at(4.62).duration(0.55).indicate();
    timeline.animate(checklistHeading).at(5.15).duration(0).appear();
    timeline.animate(checklistHeading).at(5.15).duration(0.48).typewrite();
    checklist.forEach((line, index) => {
      const at = 6.05 + index * 1.22;
      timeline.animate(line.mark).at(at).duration(0.26).ease("outBack").appear();
      timeline.animate(line.label).at(at + 0.14).duration(0).appear();
      timeline.animate(line.label).at(at + 0.14).duration(0.52).typewrite();
    });

    // 9.2–41 s: the complete checklist remains readable under the narration.
    // 41–70 s: no timeline motion is scheduled. This is the talking-head window.

    // Return from camera: pull back until both adjacent 16:9 canvases are
    // visible, move the copied card into Screen 2, then enter that screen.
    const returnAt = LIVE_CAMERA_END;
    timeline.animate(checklistHeading).at(returnAt).duration(0.42).fadeTo(0);
    timeline.animate(checklist.flatMap((line) => line.all)).at(returnAt).duration(0.42).fadeTo(0);
    timeline.animateCamera(this.camera).at(returnAt).duration(1.25).ease("inOutCubic")
      .frameTo([8, 0, 8], [8, 0, 0]);
    timeline.animateCamera(this.camera).at(returnAt).duration(1.25).ease("inOutCubic").zoomTo(0.5);
    moveItemsBy(timeline, focusCard.all, [21.78, -3.62], returnAt + 0.18, 1.50, 1.08);
    timeline.animate(aiBoundary).at(returnAt + 0.72).duration(0.18).appear();
    timeline.animate(aiBoundary).at(returnAt + 0.72).duration(1.18).ease("outCubic").scaleTo(1);
    timeline.animate(aiLabel).at(returnAt + 1.36).duration(0).appear();
    timeline.animate(aiLabel).at(returnAt + 1.36).duration(0.58).typewrite();
    timeline.animate(aiDefinition).at(returnAt + 1.72).duration(0).appear();
    timeline.animate(aiDefinition).at(returnAt + 1.72).duration(0.72).typewrite();
    timeline.animateCamera(this.camera).at(returnAt + 2.10).duration(1.55).ease("inOutCubic")
      .frameTo([16, 0, 8], [16, 0, 0]);
    timeline.animateCamera(this.camera).at(returnAt + 2.10).duration(1.55).ease("inOutCubic").zoomTo(1);
    timeline.animate(focusCard.all).at(returnAt + 3.05).duration(0.36).ease("outCubic").scaleTo(1.14);
    timeline.animate(focusCard.all).at(returnAt + 3.62).duration(0.34).ease("inOutCubic").scaleTo(1.08);

    this.play(timeline);
    this.wait(3.2);
    this.captureScreenshotsNamed([
      [0, "part-02-continuity"],
      [1.45, "part-02-rearranged"],
      [9.20, "part-02-rule-checklist"],
      [(LIVE_CAMERA_START + LIVE_CAMERA_END) / 2, "part-02-camera-static"],
      [LIVE_CAMERA_END + 1.25, "part-02-adjacent-screens"],
      [LIVE_CAMERA_END + 4.15, "part-02-ai-diagram"],
    ]);
  }
}

function addResultCard(
  scene: Scene,
  spec: { at: Vec2; fill: string; result: string; detail: string },
): ResultCard {
  const [x, y] = spec.at;
  const panel = scene.add(
    Rectangle().size([2.34, 0.88]).cornerRadius(0.20).fill(spec.fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 14px ${spec.fill}40)` }),
    { at: [x, y, 0.20] },
  );
  const result = scene.add(
    Label(spec.result).height(0.21).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.045em" }),
    { at: [x, y + 0.11, 0.22] },
  );
  const detail = scene.add(
    Label(spec.detail).height(0.125).color("rgba(248,250,252,0.78)")
      .css({ fontWeight: 650 }),
    { at: [x, y - 0.20, 0.22] },
  );
  return { all: [panel, result, detail], panel, result, center: spec.at };
}

function addChecklistLine(scene: Scene, text: string, at: Vec2): ChecklistLine {
  const icon = scene.add(
    Circle().radius(0.18).fill(ALPHA.ai).stroke({ color: COLOR.ai, width: 0.035 }),
    { at: [at[0] - 1.32, at[1], 0.22] },
  );
  const check = scene.add(
    Label("✓").height(0.17).color(COLOR.ai).css({ fontWeight: 950 }),
    { at: [at[0] - 1.32, at[1] + 0.005, 0.24] },
  );
  const label = scene.add(
    Label(text).height(0.235).color(COLOR.ink).css({ fontWeight: 760 }),
    { at: [at[0], at[1], 0.24] },
  );
  return { all: [icon, check, label], mark: [icon, check], label };
}

function moveAndScaleAround(
  timeline: Timeline,
  items: readonly Tattva[],
  fromCenter: Vec2,
  toCenter: Vec2,
  scale: number,
  at: number,
  duration: number,
): void {
  items.forEach((item) => {
    const localX = item.initialState.x - fromCenter[0];
    const localY = item.initialState.y - fromCenter[1];
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic")
      .moveTo([
        toCenter[0] + localX * scale,
        toCenter[1] + localY * scale,
        item.initialState.z,
      ]);
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic").scaleTo(scale);
  });
}

function moveItemsBy(
  timeline: Timeline,
  items: readonly Tattva[],
  delta: Vec2,
  at: number,
  duration: number,
  scale: number,
): void {
  items.forEach((item) => {
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic")
      .moveTo([
        item.initialState.x + delta[0],
        item.initialState.y + delta[1],
        item.initialState.z,
      ]);
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic").scaleTo(scale);
  });
}

function bindArrow(
  scene: Scene,
  arrow: Tattva,
  source: Tattva,
  targetPanel: Tattva,
  targetSize: Vec2,
): void {
  const baseLength = Math.max(arrow.worldSize?.width ?? 1, 0.001);
  scene.addUpdater(arrow, ({ state, stateOf }) => {
    const sourceState = stateOf(source);
    const targetState = stateOf(targetPanel);
    if (!sourceState || !targetState) return;

    const towardSourceX = sourceState.x - targetState.x;
    const towardSourceY = sourceState.y - targetState.y;
    const halfWidth = targetSize[0] * Math.abs(targetState.scaleX) / 2;
    const halfHeight = targetSize[1] * Math.abs(targetState.scaleY) / 2;
    const edgeDivisor = Math.max(
      Math.abs(towardSourceX) / Math.max(halfWidth, 0.001),
      Math.abs(towardSourceY) / Math.max(halfHeight, 0.001),
      1,
    );
    const endX = targetState.x + towardSourceX / edgeDivisor;
    const endY = targetState.y + towardSourceY / edgeDivisor;
    const dx = endX - sourceState.x;
    const dy = endY - sourceState.y;
    const length = Math.max(Math.hypot(dx, dy), 0.001);

    state.x = (sourceState.x + endX) / 2;
    state.y = (sourceState.y + endY) / 2;
    state.z = 0.18;
    state.rotationZ = Math.atan2(dy, dx) * 180 / Math.PI;
    state.scaleX = length / baseLength;
    state.scaleY = 1;
    state.opacity = 1;
  });
}

function addFrozenKavriqBrand(scene: Scene, freezeFrom: number, freezeUntil: number): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  scene.updater((time, states) => {
    const motionTime = time <= freezeFrom
      ? time
      : time < freezeUntil
        ? freezeFrom
        : time - CAMERA_HOLD_DURATION;
    // Continue the phase from the 38-second Part 1 render for a clean cut.
    motion.update((motionTime + 38) % motion.duration, states);
  });
}

await renderScene(import.meta.url, RuleBasedAiScene, "02-rule-based-ai.mp4");
