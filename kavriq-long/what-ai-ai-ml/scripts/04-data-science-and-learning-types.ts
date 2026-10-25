import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Arrow, Circle, Polygon, Rectangle, VectorShape } from "veena/primitives";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { CATEGORY, COLOR, FRAME } from "./lib/theme.ts";

const SCREEN = {
  diagram: [16, 0] as Vec2,
  dataScience: [32, 0] as Vec2,
} as const;

const CUE = {
  slide: 0.45,
  recap: 1.75,
  comparisonTitle: 9.00,
  questions: 10.20,
  circles: 19.20,
  practices: 22.60,
  tool: 27.20,
  learningTypes: 34.40,
  supervised: 39.30,
  unsupervised: 46.20,
  semiSupervised: 50.20,
  reinforcement: 54.20,
  rememberSupervised: 58.30,
  end: 65.20,
} as const;

const AI_RADIUS = 4.20;
const AI_BOTTOM = -4.25;
const AI_CENTER_Y = AI_BOTTOM + AI_RADIUS;
const ML_RADIUS = (AI_RADIUS * 4) / 5;
const ML_CENTER_Y = AI_BOTTOM + 0.07 + ML_RADIUS;
const ML_COLOR = CATEGORY.ml.fill;
const DS_COLOR = CATEGORY.dataScience.fill;
const OVERLAP_COLOR = "#40512A";
const INACTIVE_FILL = "#0D1425";
const INACTIVE_TEXT = "#66728A";
const DOG_FUR = "#D59A62";
const DOG_MUZZLE = "#F0CAA0";

interface VisualGroup {
  all: Tattva[];
  center: Vec2;
}

interface PillGroup extends VisualGroup {
  panel: Tattva;
  label: Tattva;
}

interface LearningCard extends VisualGroup {
  panel: Tattva;
  label: Tattva;
  target: Vec2;
}

export class DataScienceAndLearningTypesScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    // Reconstruct Segment 3's clean closing diagram for the opening handoff.
    this.add(
      Circle().radius(AI_RADIUS).fill(CATEGORY.ai.fill),
      { at: [SCREEN.diagram[0], AI_CENTER_Y, 0.05] },
    );
    this.add(
      Circle().radius(ML_RADIUS).fill(ML_COLOR),
      { at: [SCREEN.diagram[0], ML_CENTER_Y, 0.10] },
    );
    addText(this, "AI", [SCREEN.diagram[0], 3.74], 0.44, COLOR.ink, 950, 0.20);
    addText(this, "MACHINE LEARNING", [SCREEN.diagram[0], 1.55], 0.30, COLOR.ink, 950, 0.22);

    this.camera.position([SCREEN.diagram[0], 0, 8])
      .lookAt([SCREEN.diagram[0], 0, 0])
      .zoom(1);

    // ------------------------------------------------------------------
    // Beat 1 — compact callback to the previous segment.
    // ------------------------------------------------------------------
    const recapHeading = addText(
      this,
      "FROM LABELLED EMAILS TO A SPAM SCORE",
      [32, 3.55],
      0.30,
      COLOR.ink,
      950,
    );
    const trainingLabel = addText(this, "TRAINING", [25.25, 1.28], 0.15, COLOR.muted, 850);
    const inferenceLabel = addText(this, "INFERENCE", [25.25, -1.52], 0.15, COLOR.muted, 850);
    const labelledEmails = addOriginalEmailCard(this, [28.15, 1.28], "LABELLED EMAILS", true);
    const learnedPatterns = addNode(this, [34.20, 1.28], [2.72, 1.30], ML_COLOR, "LEARNED", "PATTERNS");
    const inferencePatterns = addNode(this, [34.20, 1.28], [2.55, 1.18], ML_COLOR, "LEARNED", "PATTERNS");
    const plus = addText(this, "+", [29.55, -1.52], 0.40, CATEGORY.ml.accent, 900);
    const newEmail = addOriginalEmailCard(this, [31.75, -1.52], "NEW EMAIL", false);
    const spamScore = addNode(this, [36.80, -1.52], [2.38, 1.30], ML_COLOR, "SPAM", "96%");
    const recapArrows = [
      addArrow(this, [29.74, 1.28], [32.72, 1.28], CATEGORY.ml.accent),
      addArrow(this, [33.35, -1.52], [35.48, -1.52], CATEGORY.ml.accent),
    ];
    const recapVisuals = [
      recapHeading,
      trainingLabel,
      inferenceLabel,
      ...labelledEmails.all,
      ...learnedPatterns.all,
      ...inferencePatterns.all,
      plus,
      ...newEmail.all,
      ...spamScore.all,
      ...recapArrows,
    ];
    hide(recapVisuals);

    // ------------------------------------------------------------------
    // Beat 2 — Machine Learning and Data Science overlap.
    // ------------------------------------------------------------------
    const dataScienceHeading = addText(
      this,
      "DATA SCIENCE",
      [32, 3.55],
      0.44,
      CATEGORY.dataScience.accent,
      950,
    ).opacity(0);

    const questionSpecs = [
      { text: "HOW MANY PER DAY?", at: [32, 1.35] as Vec2, width: 4.10 },
      { text: "WHERE DO THEY COME FROM?", at: [32, 0.18] as Vec2, width: 5.05 },
      { text: "IS THE NUMBER INCREASING?", at: [32, -0.99] as Vec2, width: 5.25 },
    ];
    const questionChips = questionSpecs.map(({ text, at, width }) =>
      addPill(this, text, at, [width, 0.72], DS_COLOR, COLOR.ink, 0.18));
    questionChips.forEach((chip) => hide(chip.all));
    const questionTargets: Vec2[] = [
      [36.60, 1.15],
      [36.60, 0.10],
      [36.60, -0.95],
    ];

    const mlFinal: Vec2 = [30.30, -0.25];
    const dsFinal: Vec2 = [32.00, -0.25];
    const vennRadius = 2.55;
    const mlCircle = this.add(
      Circle().radius(vennRadius).fill(ML_COLOR),
      { at: [mlFinal[0], mlFinal[1], 0.08] },
    ).scale(0.82).opacity(0);
    const dsCircle = this.add(
      Circle().radius(vennRadius).fill(DS_COLOR),
      { at: [dsFinal[0], dsFinal[1], 0.09] },
    ).scale(0.82).opacity(0);

    // This opaque lens uses the same circular arcs as the two circles. Its
    // edge therefore sits exactly on their intersection without colour
    // slivers, transparency, or a third mismatched silhouette.
    const overlapLens = this.add(
      VectorShape(
        [
          "M 0 -2.40416",
          "C 1.018 -2.044 1.700 -1.080 1.700 0",
          "C 1.700 1.080 1.018 2.044 0 2.40416",
          "C -1.018 2.044 -1.700 1.080 -1.700 0",
          "C -1.700 -1.080 -1.018 -2.044 0 -2.40416 Z",
        ].join(" "),
        { viewBox: { x: -1.70, y: -2.40416, width: 3.40, height: 4.80832 } },
      ).fill(OVERLAP_COLOR),
      { at: [31.15, -0.25, 0.14] },
    ).opacity(0);

    const mlCircleLabel = addText(
      this,
      "MACHINE\nLEARNING",
      [28.65, 0.72],
      0.24,
      COLOR.ink,
      950,
      0.24,
    ).opacity(0);
    const dsCircleLabel = addText(
      this,
      "DATA\nSCIENCE",
      [33.65, 0.72],
      0.24,
      COLOR.ink,
      950,
      0.24,
    ).opacity(0);

    const practices = addText(
      this,
      "COLLECT\n\nCLEAN\n\nEXPLORE\n\nVISUALISE\n\nVALIDATE",
      [31.15, -0.25],
      0.18,
      COLOR.ink,
      850,
      0.24,
    ).opacity(0);
    const mlSourceLabel = addText(
      this,
      "MACHINE\nLEARNING",
      [32, 2.12],
      0.23,
      COLOR.ink,
      950,
      0.24,
    ).opacity(0);

    const toolRelationship = addText(
      this,
      "DATA SCIENCE CAN USE\n\nMACHINE LEARNING\n\nAS ONE OF THE TOOLS",
      [31.15, -0.25],
      0.17,
      CATEGORY.ml.accent,
      900,
      0.25,
    ).opacity(0);

    // ------------------------------------------------------------------
    // Beat 3 — four ways of learning emerge from Machine Learning.
    // ------------------------------------------------------------------
    const learningHeading = addText(
      this,
      "FOUR COMMON LEARNING APPROACHES",
      [32, 3.78],
      0.31,
      COLOR.ink,
      950,
    ).opacity(0);
    const sourceCenter: Vec2 = [32, 2.12];
    const targets: Vec2[] = [
      [26.15, 0.05],
      [30.05, 0.05],
      [33.95, 0.05],
      [37.85, 0.05],
    ];
    const learningCards = [
      addLearningCard(this, sourceCenter, targets[0]!, "SUPERVISED"),
      addLearningCard(this, sourceCenter, targets[1]!, "UNSUPERVISED"),
      addLearningCard(this, sourceCenter, targets[2]!, "SEMI-SUPERVISED"),
      addLearningCard(this, sourceCenter, targets[3]!, "REINFORCEMENT"),
    ];
    learningCards.forEach((card) => {
      hide(card.all);
      card.all.forEach((item) => item.scale(0.25));
    });

    const spamCallback = addPill(
      this,
      "SPAM 96%",
      [29.55, -2.18],
      [2.55, 0.92],
      ML_COLOR,
      COLOR.ink,
      0.22,
    );
    hide(spamCallback.all);
    const dogCallback = addDogAttachment(this, [34.45, -2.18]);
    hide(dogCallback.all);
    const callbackArrows = [
      addArrow(this, [26.15, -0.52], [29.55, -1.68], CATEGORY.ml.accent),
      addArrow(this, [26.15, -0.52], [34.45, -1.68], CATEGORY.ml.accent),
    ];
    hide(callbackArrows);

    addKavriqBrand(this);

    const timeline = new Timeline();

    // Natural lateral move to the adjacent screen.
    timeline.animateCamera(this.camera).at(CUE.slide).duration(1.15).ease("inOutCubic")
      .frameTo([SCREEN.dataScience[0], 0, 8], [SCREEN.dataScience[0], 0, 0]);

    timeline.animate(recapHeading).at(CUE.recap).duration(0).appear();
    timeline.animate(recapHeading).at(CUE.recap).duration(0.58).typewrite();
    timeline.animate(trainingLabel).at(CUE.recap + 0.58).duration(0.30).appear();
    timeline.animate(labelledEmails.all).at(CUE.recap + 0.70).stagger(0.008).duration(0.28).appear();
    revealArrow(timeline, recapArrows[0]!, CUE.recap + 1.45, 0.40);
    timeline.animate(learnedPatterns.all).at(CUE.recap + 1.88).stagger(0.06).duration(0.35).appear();
    timeline.animate(inferenceLabel).at(CUE.recap + 2.75).duration(0.30).appear();
    timeline.animate(inferencePatterns.all).at(CUE.recap + 2.90).stagger(0.04).duration(0.25).appear();
    moveGroup(
      timeline,
      inferencePatterns.all,
      inferencePatterns.center,
      [27.65, -1.52],
      CUE.recap + 2.90,
      0.72,
    );
    timeline.animate(plus).at(CUE.recap + 3.52).duration(0.28).appear();
    timeline.animate(newEmail.all).at(CUE.recap + 3.72).stagger(0.008).duration(0.28).appear();
    revealArrow(timeline, recapArrows[1]!, CUE.recap + 4.45, 0.40);
    timeline.animate(spamScore.all).at(CUE.recap + 4.88).stagger(0.06).duration(0.35).appear();
    pulseGroup(timeline, spamScore.all, CUE.recap + 5.55, 0.46);
    timeline.animate(recapVisuals).at(CUE.comparisonTitle - 0.45).stagger(0.002).duration(0.38).fadeTo(0);

    timeline.animate(dataScienceHeading).at(CUE.comparisonTitle).duration(0).appear();
    timeline.animate(dataScienceHeading).at(CUE.comparisonTitle).duration(0.62).typewrite();
    questionChips.forEach((chip, index) => {
      timeline.animate(chip.all).at(CUE.questions + index * 1.58)
        .stagger(0.05).duration(0.34).appear();
    });

    timeline.animate(dataScienceHeading).at(CUE.circles).duration(0.50).fadeTo(0);

    questionChips.forEach((chip, index) => {
      const at = CUE.circles + index * 0.10;
      moveGroup(timeline, chip.all, chip.center, questionTargets[index]!, at, 0.82);
      timeline.animate(chip.all).at(at).duration(0.82).ease("inOutCubic").scaleTo(0.76);
      timeline.animate(chip.panel).at(at).duration(0.62).setColor("#263047");
      timeline.animate(chip.label).at(at).duration(0.62).to({ color: "#8A95AA" });
    });

    timeline.animate([mlCircle, dsCircle]).at(CUE.circles + 0.82).stagger(0.10).duration(0.42).appear();
    timeline.animate([mlCircle, dsCircle]).at(CUE.circles + 0.82).duration(0.68)
      .ease("outCubic").scaleTo(1);
    timeline.animate(overlapLens).at(CUE.circles + 1.35).duration(0.40).appear();
    timeline.animate([mlCircleLabel, dsCircleLabel]).at(CUE.circles + 1.48)
      .stagger(0.08).duration(0.38).appear();
    timeline.animate(practices).at(CUE.practices).duration(0).appear();
    timeline.animate(practices).at(CUE.practices).duration(0.90).typewrite();

    timeline.animate(practices).at(CUE.tool - 0.25).duration(0.35).fadeTo(0);
    timeline.animate(toolRelationship).at(CUE.tool + 0.15).duration(0).appear();
    timeline.animate(toolRelationship).at(CUE.tool + 0.15).duration(0.72).typewrite();
    pulseGroup(timeline, [toolRelationship], CUE.tool + 1.20, 0.46);

    const comparison = [
      dataScienceHeading,
      ...questionChips.flatMap((chip) => chip.all),
      dsCircle,
      mlCircleLabel,
      dsCircleLabel,
      overlapLens,
      practices,
      toolRelationship,
    ];
    timeline.animate(comparison).at(CUE.learningTypes).stagger(0.002).duration(0.45).fadeTo(0);
    move(timeline, mlCircle, sourceCenter, CUE.learningTypes, 0.92);
    timeline.animate(mlCircle).at(CUE.learningTypes).duration(0.92).ease("inOutCubic").scaleTo(0.46);
    timeline.animate(mlSourceLabel).at(CUE.learningTypes + 0.45).duration(0.35).appear();
    timeline.animate(learningHeading).at(CUE.learningTypes + 0.55).duration(0).appear();
    timeline.animate(learningHeading).at(CUE.learningTypes + 0.55).duration(0.60).typewrite();

    learningCards.forEach((card, index) => {
      const at = CUE.learningTypes + 1.35 + index * 0.30;
      timeline.animate(card.all).at(at).stagger(0.035).duration(0.28).appear();
      moveGroup(timeline, card.all, card.center, card.target, at, 0.76);
      timeline.animate(card.all).at(at).duration(0.76).ease("inOutCubic").scaleTo(1);
    });

    activateCard(timeline, learningCards, 0, CUE.supervised, CUE.unsupervised - 0.35);
    activateCard(timeline, learningCards, 1, CUE.unsupervised, CUE.semiSupervised - 0.35);
    activateCard(timeline, learningCards, 2, CUE.semiSupervised, CUE.reinforcement - 0.35);
    activateCard(timeline, learningCards, 3, CUE.reinforcement, CUE.rememberSupervised - 0.35);
    // Keep supervised fully active through the closing callbacks and end frame.
    activateCard(timeline, learningCards, 0, CUE.rememberSupervised, CUE.rememberSupervised);

    revealArrow(timeline, callbackArrows[0]!, CUE.rememberSupervised + 0.65, 0.48);
    timeline.animate(spamCallback.all).at(CUE.rememberSupervised + 1.08)
      .stagger(0.05).duration(0.34).appear();
    revealArrow(timeline, callbackArrows[1]!, CUE.rememberSupervised + 2.10, 0.58);
    timeline.animate(dogCallback.all).at(CUE.rememberSupervised + 2.58)
      .stagger(0.025).duration(0.34).appear();
    pulseGroup(
      timeline,
      [spamCallback.all, dogCallback.all].flat(),
      CUE.rememberSupervised + 3.40,
      0.46,
    );

    timeline.wait(CUE.end);
    this.play(timeline);
    this.captureScreenshotsNamed([
      [0.20, "segment-04-continuity"],
      [7.50, "segment-04-email-recap"],
      [14.10, "segment-04-data-science-questions"],
      [24.30, "segment-04-solid-overlap"],
      [28.80, "segment-04-ml-as-tool"],
      [41.20, "segment-04-supervised"],
      [48.00, "segment-04-unsupervised"],
      [52.00, "segment-04-semi-supervised"],
      [56.00, "segment-04-reinforcement"],
      [62.40, "segment-04-handoff"],
    ]);
  }
}

function addText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  color: string,
  weight: number,
  z = 0.20,
): Tattva {
  return scene.add(
    Label(text).height(height).color(color).css({
      fontWeight: weight,
      letterSpacing: "0.035em",
      textAlign: "center",
    }),
    { at: [at[0], at[1], z] },
  );
}

function addOriginalEmailCard(
  scene: Scene,
  at: Vec2,
  caption: string,
  stacked = true,
): VisualGroup {
  const [x, y] = at;
  const all: Tattva[] = [];
  const scale = stacked ? 0.235 : 0.225;
  const width = 11.42 * scale;
  const height = 6.72 * scale;
  if (stacked) {
    all.push(scene.add(
      Rectangle().size([width, height]).cornerRadius(0.18).fill("#10182B")
        .stroke({ color: "#2A3958", width: 0.025 }),
      { at: [x - 0.18, y + 0.18, -0.16] },
    ));
    all.push(scene.add(
      Rectangle().size([width, height]).cornerRadius(0.18).fill("#131D32")
        .stroke({ color: "#2A3958", width: 0.025 }),
      { at: [x - 0.09, y + 0.09, -0.12] },
    ));
  }
  const email = addOpenEmailView(scene, { at, scale });
  all.push(...email.all);
  all.push(addText(
    scene,
    caption,
    [x, y - height / 2 - 0.25],
    0.13,
    stacked ? CATEGORY.ml.accent : COLOR.muted,
    850,
    0.20,
  ));
  return { all, center: at };
}

function addNode(
  scene: Scene,
  at: Vec2,
  size: Vec2,
  fill: string,
  title: string,
  subtitle: string,
): VisualGroup {
  const all = [
    scene.add(
      Rectangle().size(size).cornerRadius(0.26).fill(fill)
        .css({ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.22))" }),
      { at: [at[0], at[1], 0.12] },
    ),
    addText(scene, title, [at[0], at[1] + 0.21], 0.21, COLOR.ink, 950, 0.16),
    addText(scene, subtitle, [at[0], at[1] - 0.23], 0.18, COLOR.ink, 850, 0.16),
  ];
  return { all, center: at };
}

function addPill(
  scene: Scene,
  text: string,
  at: Vec2,
  size: Vec2,
  fill: string,
  ink: string,
  textHeight: number,
): PillGroup {
  const panel = scene.add(
    Rectangle().size(size).cornerRadius(size[1] / 2).fill(fill)
      .css({ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.18))" }),
    { at: [at[0], at[1], 0.18] },
  );
  const label = addText(scene, text, at, textHeight, ink, 850, 0.22);
  return { center: at, all: [panel, label], panel, label };
}

function addLearningCard(scene: Scene, at: Vec2, target: Vec2, text: string): LearningCard {
  const panel = scene.add(
    Rectangle().size([3.46, 1.05]).cornerRadius(0.28).fill(INACTIVE_FILL)
      .stroke({ color: "#24334D", width: 0.025 })
      .css({ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.18))" }),
    { at: [at[0], at[1], 0.20] },
  );
  const label = addText(scene, text, at, 0.18, INACTIVE_TEXT, 900, 0.24);
  return { all: [panel, label], panel, label, center: at, target };
}

function addDogAttachment(scene: Scene, at: Vec2): VisualGroup {
  const [x, y] = at;
  const all: Tattva[] = [];
  all.push(scene.add(
    Rectangle().size([3.42, 0.92]).cornerRadius(0.20).fill("#18223A")
      .stroke({ color: CATEGORY.dl.accent, width: 0.025 }),
    { at: [x, y, 0.20] },
  ));
  all.push(scene.add(
    Rectangle().size([0.72, 0.66]).cornerRadius(0.11).fill("#29445D"),
    { at: [x - 1.16, y, 0.22] },
  ));
  all.push(scene.add(Polygon.regular(3).radius(0.18).fill(DOG_FUR).rotate(-18), { at: [x - 1.34, y + 0.13, 0.23] }));
  all.push(scene.add(Polygon.regular(3).radius(0.18).fill(DOG_FUR).rotate(18), { at: [x - 0.98, y + 0.13, 0.23] }));
  all.push(scene.add(Circle().radius(0.23).fill(DOG_FUR), { at: [x - 1.16, y, 0.24] }));
  all.push(scene.add(Circle().radius(0.10).fill(DOG_MUZZLE), { at: [x - 1.16, y - 0.08, 0.25] }));
  all.push(scene.add(Circle().radius(0.026).fill("#10131C"), { at: [x - 1.24, y + 0.04, 0.26] }));
  all.push(scene.add(Circle().radius(0.026).fill("#10131C"), { at: [x - 1.08, y + 0.04, 0.26] }));
  all.push(scene.add(Circle().radius(0.034).fill("#10131C"), { at: [x - 1.16, y - 0.07, 0.26] }));
  all.push(addText(scene, "dog-photo.jpg", [x + 0.38, y + 0.12], 0.17, COLOR.ink, 800, 0.24));
  all.push(addText(scene, "LABELLED: DOG", [x + 0.38, y - 0.20], 0.12, CATEGORY.dl.accent, 850, 0.24));
  return { all, center: at };
}

function addArrow(scene: Scene, from: Vec2, to: Vec2, color: string): Tattva {
  return scene.add(
    Arrow().from(from).to(to).stroke({ color, width: 0.045 }),
  ).layer(10);
}

function revealArrow(
  timeline: Timeline,
  arrow: Tattva,
  at: number,
  duration: number,
): void {
  timeline.animate(arrow).at(at).duration(0).appear();
  timeline.animate(arrow).at(at).duration(duration).draw();
}

function activateCard(
  timeline: Timeline,
  cards: readonly LearningCard[],
  activeIndex: number,
  at: number,
  until: number,
): void {
  cards.forEach((card, index) => {
    const active = index === activeIndex;
    timeline.animate(card.panel).at(at).duration(0.30)
      .setColor(active ? ML_COLOR : INACTIVE_FILL);
    timeline.animate(card.label).at(at).duration(0.30)
      .to({ color: active ? COLOR.ink : INACTIVE_TEXT });
    timeline.animate(card.panel).at(at).duration(0.30)
      .setStyle({
        filter: active
          ? "drop-shadow(0 0 24px rgba(87,227,161,0.40))"
          : "drop-shadow(0 8px 16px rgba(0,0,0,0.18))",
      });
  });
  const activeCard = cards[activeIndex]!;
  timeline.animate(activeCard.panel).at(at + 0.22).duration(0.24).ease("outCubic").scaleTo(1.04);
  timeline.animate(activeCard.panel).at(at + 0.46).duration(0.28).ease("inOutCubic").scaleTo(1);
  if (until > at) {
    timeline.animate(activeCard.panel).at(until).duration(0.25).setColor(INACTIVE_FILL);
    timeline.animate(activeCard.label).at(until).duration(0.25).to({ color: INACTIVE_TEXT });
  }
}

function move(
  timeline: Timeline,
  item: Tattva,
  to: Vec2,
  at: number,
  duration: number,
): void {
  timeline.animate(item).at(at).duration(duration).ease("inOutCubic")
    .moveTo([to[0], to[1], item.initialState.z]);
}

function pulseGroup(
  timeline: Timeline,
  items: readonly Tattva[],
  at: number,
  duration: number,
): void {
  const half = duration / 2;
  items.forEach((item) => {
    timeline.animate(item).at(at).duration(half).ease("outCubic").scaleTo(1.04);
    timeline.animate(item).at(at + half).duration(half).ease("inOutCubic").scaleTo(1);
  });
}

function moveGroup(
  timeline: Timeline,
  items: readonly Tattva[],
  from: Vec2,
  to: Vec2,
  at: number,
  duration: number,
): void {
  items.forEach((item) => {
    const dx = item.initialState.x - from[0];
    const dy = item.initialState.y - from[1];
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic")
      .moveTo([to[0] + dx, to[1] + dy, item.initialState.z]);
  });
}

function hide(items: readonly Tattva[]): void {
  items.forEach((item) => item.opacity(0));
}

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  scene.updater((time, states) => motion.update((time + 105.5) % motion.duration, states));
}

const runningInBrowser = typeof window !== "undefined";
const invokedDirectly = typeof process !== "undefined"
  && process.argv[1]?.includes("04-data-science-and-learning-types") === true;
if (runningInBrowser || invokedDirectly) {
  await renderScene(
    import.meta.url,
    DataScienceAndLearningTypesScene,
    "04-data-science-and-learning-types.mp4",
  );
}
