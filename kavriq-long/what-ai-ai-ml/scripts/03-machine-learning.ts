import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Circle, Line, Rectangle, ShapeMorph } from "veena/primitives";
import { Fireworks } from "veena/storytelling";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { CATEGORY, COLOR, FRAME } from "./lib/theme.ts";

const SCREEN = {
  email: [0, 0] as Vec2,
  diagram: [16, 0] as Vec2,
  ml: [0, 9] as Vec2,
} as const;

const CUE = {
  returnToEmail: 0.45,
  focusSpam: 1.90,
  liftSpam: 2.55,
  rewriteSpam: 3.25,
  mlTakeaway: 5.25,
  training: 6.30,
  inference: 12.70,
  plot: 18.30,
  intuition: 27.10,
  fit: 30.20,
  plotInference: 45.05,
  recap: 49.90,
  taxonomy: 56.00,
  end: 66.40,
} as const;

const EMAIL_SCALE = 0.82;
const EMAIL_CARD_W = 11.42 * EMAIL_SCALE;
const EMAIL_CARD_H = 6.72 * EMAIL_SCALE;
const RESULT_W = 2.62;
const RESULT_H = 0.94;
const ML_TITLE_HEIGHT = 0.22;
// Ink width, in ems, of Inter 950 "MACHINE LEARNING" at 0.035em tracking.
// The typewriter grows from the left of this box, so the finished line sits
// on the pill centre instead of hanging to the right.
const ML_TITLE_INK_EM = 10.70;
const RESULT_X = EMAIL_CARD_W / 2 + 0.30 + RESULT_W / 2;
const RESULT_Y = EMAIL_CARD_H / 2 + 0.22 + RESULT_H / 2;
// Same closing circle as Segment 2. Equal radial steps, AI : ML : DL : GenAI
// = 5 : 4 : 3 : 2, sharing a bottom with a thin gap like the desktop Venn.
// Deep Learning and Generative AI are reserved here and not drawn yet.
const AI_RADIUS = 4.20;
const AI_BOTTOM = -4.25;
const AI_CENTER_Y = AI_BOTTOM + AI_RADIUS;
const NEST_GAP = 0.07;
const ML_BALL_RADIUS = (AI_RADIUS * 4) / 5;
const DL_RADIUS = (AI_RADIUS * 3) / 5;
const NEST_X = 16;
const DIAGRAM_FLOOR_Y = AI_BOTTOM + NEST_GAP;
const NEST_Y = DIAGRAM_FLOOR_Y + ML_BALL_RADIUS;
const AI_LABEL_Y = (AI_CENTER_Y + AI_RADIUS + NEST_Y + ML_BALL_RADIUS) / 2;
const ML_LABEL_Y = (DIAGRAM_FLOOR_Y + 2 * DL_RADIUS + NEST_Y + ML_BALL_RADIUS) / 2;
const PLOT_DATA = [
  { area: 1.0, price: 23 },
  { area: 1.8, price: 29 },
  { area: 2.6, price: 45 },
  { area: 3.4, price: 54 },
  { area: 4.2, price: 63 },
  { area: 5.0, price: 79 },
] as const;

interface ResultCard {
  all: Tattva[];
  panel: Tattva;
  title: Tattva;
  detail: Tattva;
  center: Vec2;
}

interface RewriteCard extends ResultCard {
  mlTitle: Tattva;
}

interface MiniEmail {
  all: Tattva[];
  center: Vec2;
}

interface NumberPacket {
  all: Tattva[];
  center: Vec2;
}

interface Gauge {
  all: Tattva[];
  fill: Tattva;
}

interface Graph {
  all: Tattva[];
}

interface FitState {
  all: Tattva[];
  line: Tattva;
  error: Tattva;
}

export class MachineLearningScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    // ---------------------------------------------------------------------
    // Persistent world: reconstruct Segment 2's exact final screen and the
    // email screen below the ML explainer. Nothing is rebuilt during a move.
    // ---------------------------------------------------------------------
    const email = addOpenEmailView(this, { at: SCREEN.email, scale: EMAIL_SCALE });
    const positions = {
      flagged: [-RESULT_X, RESULT_Y] as Vec2,
      spam: [RESULT_X, RESULT_Y] as Vec2,
      dog: [-RESULT_X, -RESULT_Y] as Vec2,
      draft: [RESULT_X, -RESULT_Y] as Vec2,
    };
    const flagged = addResultCard(this, positions.flagged, CATEGORY.ai.fill, "FLAGGED", "SUSPICIOUS");
    const spam = addResultCard(this, positions.spam, CATEGORY.ml.fill, "SPAM", "CLASSIFIED");
    const dog = addResultCard(this, positions.dog, CATEGORY.dl.fill, "DOG DETECTED", "ATTACHMENT");
    const draft = addResultCard(this, positions.draft, CATEGORY.genai.fill, "DRAFT REPLY", "GENERATED RESPONSE");
    const originalCards = [flagged, spam, dog, draft];

    const connectors = [
      addLine(this, [-4.18, 1.94], [-RESULT_X + RESULT_W / 2, RESULT_Y + 0.24], COLOR.ai, 0.045),
      addLine(this, [-4.04, 1.36], [-RESULT_X + RESULT_W / 2, RESULT_Y], COLOR.ai, 0.045),
      addLine(this, [-3.57, -0.35], [-RESULT_X + RESULT_W / 2, RESULT_Y - 0.24], COLOR.ai, 0.045),
      addLine(this, [3.65, 1.94], [RESULT_X - RESULT_W / 2, RESULT_Y], COLOR.ml, 0.045),
      addLine(this, [-3.25, -0.84], [-RESULT_X + RESULT_W / 2, -RESULT_Y], COLOR.dl, 0.045),
      addLine(this, [3.15, -2.04], [RESULT_X - RESULT_W / 2, -RESULT_Y], COLOR.genai, 0.045),
    ];
    originalCards.flatMap((card) => card.all).forEach((item) => item.opacity(0.20));
    connectors.forEach((item) => item.opacity(0.20));

    const aiCircle = this.add(
      Circle().radius(AI_RADIUS).fill(CATEGORY.ai.fill)
        .stroke({ color: CATEGORY.ai.fill, width: 0.01 }),
      { at: [NEST_X, AI_CENTER_Y, 0.08] },
    );
    const aiLabel = addText(this, "AI", [NEST_X, AI_LABEL_Y], 0.44, COLOR.ink, 950, 0.30);

    this.camera.position([16, 0, 8]).lookAt([16, 0, 0]).zoom(1);

    const movingCard = addRewriteCard(this, positions.spam);
    hide(movingCard.all);

    // The wide rounded banner reads optically left-heavy next to the long
    // takeaway. Nudge the entire banner group right while the takeaway stays
    // on the exact frame centre.
    const titleCenter: Vec2 = [0.45, 12.62];
    // The compact result card is widened non-uniformly while it travels. Swap
    // it for a natively sized banner at rest so its corner radius remains
    // geometrically round instead of being stretched into an oval. The same
    // object later morphs into the ball; it is not replaced by a second shape.
    // The circle keyframe is already the final Machine Learning radius.
    // Nothing scales the ball after this morph.
    const mlTitleBanner = this.add(
      ShapeMorph(
        Rectangle().size([RESULT_W * 1.85, RESULT_H * 1.15]).cornerRadius(0.30)
          .fill(CATEGORY.ml.fill),
        Circle().radius(ML_BALL_RADIUS).fill(CATEGORY.ml.fill),
      ).css({ filter: `drop-shadow(0 8px 16px ${CATEGORY.ml.fill}4D)` }),
      { at: [titleCenter[0], titleCenter[1], 0.24] },
    ).opacity(0);
    const mlTitleBannerLabel = addText(
      this,
      "MACHINE LEARNING",
      titleCenter,
      ML_TITLE_HEIGHT,
      COLOR.ink,
      950,
      0.26,
    ).opacity(0);
    fitLabelWidth(mlTitleBannerLabel, ML_TITLE_HEIGHT, ML_TITLE_INK_EM);
    const takeaway = addText(
      this,
      "LEARNS PATTERNS FROM EXAMPLES",
      [0, 11.72],
      0.24,
      COLOR.ink,
      900,
    ).opacity(0);

    // ---------------------------------------------------------------------
    // Training / inference email demonstration.
    // ---------------------------------------------------------------------
    const modelPanel = this.add(
      Rectangle().size([3.82, 3.05]).cornerRadius(0.28).fill(CATEGORY.ml.fill)
        .css({ borderStyle: "none", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.28))" }),
      { at: [3.20, 8.75, 0.16] },
    ).opacity(0);
    const modelLabel = addText(this, "ADJUSTABLE PARAMETERS", [3.20, 10.00], 0.16, COLOR.ink, 850).opacity(0);
    const inferenceModelPanel = this.add(
      Rectangle().size([3.82, 3.05]).cornerRadius(0.28).fill("#8A4B16")
        .css({ borderStyle: "none", filter: "drop-shadow(0 12px 28px rgba(255,159,67,0.24))" }),
      { at: [3.20, 8.75, 0.18] },
    ).opacity(0);
    const inferenceModelLabel = addText(this, "FIXED PARAMETERS", [3.05, 10.00], 0.16, COLOR.ink, 850).opacity(0);
    const inferenceLock = addLockIcon(this, [4.62, 9.98]);
    hide(inferenceLock);
    const gauges = Array.from({ length: 6 }, (_, index) =>
      addGauge(this, [2.08 + index * 0.45, 8.62], index),
    );
    gauges.flatMap((gauge) => gauge.all).forEach((item) => item.opacity(0));

    const examples = [
      addTrainingEmail(this, [-4.85, 8.75], "SPAM", "URGENT: Transfer needed", "unknown.sender", COLOR.warning),
      addTrainingEmail(this, [-4.85, 8.75], "NOT SPAM", "Weekly team update", "maya@company", COLOR.ml),
      addTrainingEmail(this, [-4.85, 8.75], "SPAM", "You won a prize", "claim-now", COLOR.warning),
      addTrainingEmail(this, [-4.85, 8.75], "NOT SPAM", "Project review", "team@company", COLOR.ml),
    ];
    examples.flatMap((example) => example.all).forEach((item) => item.opacity(0));

    const inputBox = this.add(
      Rectangle().size([1.72, 1.35]).cornerRadius(0.22).fill(COLOR.panel)
        .stroke({ color: COLOR.ai, width: 0.035 }).css({ borderStyle: "none" }),
      { at: [-0.72, 8.75, 0.22] },
    ).opacity(0);
    const inputIcon = addText(this, "TEXT  →  NUMBERS", [-0.72, 8.92], 0.135, COLOR.ai, 950, 0.25).opacity(0);
    const inputLabel = addText(this, "NUMERICAL FEATURES", [-0.72, 8.48], 0.082, COLOR.muted, 850, 0.25).opacity(0);
    const inputVisuals = [inputBox, inputIcon, inputLabel];

    const trainingNumbers = Array.from({ length: 4 }, (_, exampleIndex) => {
      const values = [
        ["0.82", "−0.31", "1.14", "0.06", "−0.77", "0.43"],
        ["−0.20", "0.67", "0.41", "1.03", "0.18", "−0.52"],
        ["1.06", "0.24", "−0.72", "0.88", "−0.09", "0.35"],
        ["0.16", "0.91", "−0.12", "0.54", "0.73", "−0.28"],
      ][exampleIndex]!;
      return values.map((value, valueIndex) =>
        addNumberPacket(this, [-0.02, 9.18 - (valueIndex % 3) * 0.43], value),
      );
    });
    trainingNumbers.flat(2).flatMap((packet) => packet.all).forEach((item) => item.opacity(0));
    const updatePulse = addPill(this, "ERROR  →  UPDATE", [3.20, 7.55], COLOR.gold, 2.75);
    hide(updatePulse);

    const trainingActive = addPill(this, "TRAINING", [2.00, 6.72], COLOR.background, 2.20, CATEGORY.ml.accent);
    const trainingInactive = addPill(this, "TRAINING", [2.00, 6.72], "#66728A", 2.20, "#0D1425");
    const inferenceInactive = addPill(this, "INFERENCE", [4.55, 6.72], "#66728A", 2.25, "#0D1425");
    const inferenceActive = addPill(this, "INFERENCE", [4.55, 6.72], COLOR.background, 2.25, CATEGORY.ai.accent);
    hide([...trainingActive, ...trainingInactive, ...inferenceInactive, ...inferenceActive]);
    const newEmail = addTrainingEmail(this, [-4.85, 8.75], "NEW EMAIL", "URGENT: Meeting moved", "unknown.sender", COLOR.ai);
    hide(newEmail.all);
    const inferenceNumbers = ["0.93", "−0.48", "1.20", "0.11", "−0.64", "0.39"].map((value, index) =>
      addNumberPacket(this, [-0.02, 9.18 - (index % 3) * 0.43], value),
    );
    inferenceNumbers.flatMap((packet) => packet.all).forEach((item) => item.opacity(0));
    const inferenceSpam = addInferenceResult(this, 8.75);

    // ---------------------------------------------------------------------
    // Plot data and graph. x is thousands of sq ft; y is lakh rupees.
    // ---------------------------------------------------------------------
    const plotTitle = addText(this, "PLOT PRICES IN MUZAFFARPUR", [0, 11.70], 0.24, COLOR.ink, 950).opacity(0);
    const csv = addCsv(this, [0, 8.72]);
    hide(csv.all);
    const graph = addGraph(this);
    hide(graph.all);

    const data = PLOT_DATA;
    const csvDots = data.map((_, index) => this.add(
      Circle().radius(0.11).fill(COLOR.ml).stroke({ color: COLOR.ink, width: 0.018 }),
      { at: [3.30, 9.42 - index * 0.45, 0.34] },
    ).opacity(0));

    const estimate = graphPoint(4, 60);
    const estimateDot = this.add(
      Circle().radius(0.14).fill(COLOR.gold).stroke({ color: COLOR.gold, width: 0.01 }),
      { at: [estimate[0], estimate[1], 0.38] },
    ).opacity(0);
    const estimateV = addLine(this, [estimate[0], 6.62], estimate, COLOR.gold, 0.04).opacity(0);
    const estimateH = addLine(this, estimate, [-6.05, estimate[1]], COLOR.gold, 0.04).opacity(0);
    const estimateX = addText(this, "4,000", [estimate[0], 6.30], 0.14, COLOR.gold, 900).opacity(0);
    const estimateY = addText(this, "₹60 LAKH", [-5.42, estimate[1] + 0.22], 0.17, COLOR.gold, 950).opacity(0);
    const estimateCaption = addText(this, "YOUR ESTIMATE", [-2.45, 10.72], 0.16, COLOR.gold, 900).opacity(0);

    const baseEquation = addText(this, "y = ax + b", [4.55, 10.20], 0.34, COLOR.ink, 850).opacity(0);
    const fitStates = [
      addFitState(this, -4, 56, "a = -4", "b = 56", "HIGH ERROR", COLOR.warning),
      addFitState(this, 9, 16, "a = 9", "b = 16", "LOWER ERROR", COLOR.gold),
      addFitState(this, 14, 7, "a = 14", "b = 7", "LOWEST ERROR", COLOR.ml),
    ];
    fitStates.flatMap((state) => state.all).forEach((item) => item.opacity(0));
    const trainedEquation = addText(this, "y = 14x + 7", [4.55, 8.16], 0.31, COLOR.ml, 950).opacity(0);
    const trained = addPill(this, "TRAINED", [4.55, 7.48], COLOR.ml, 1.95);
    hide(trained);
    const trainingFireworks = this.add(
      Fireworks()
        .fit(this)
        .burstCount(5)
        .particlesPerBurst(32)
        .cycleDuration(4.2)
        .spread(1.75)
        .gravity(1.30)
        .trail(0.11)
        .glow(0.92)
        .palette([CATEGORY.ml.accent, CATEGORY.ai.accent, COLOR.gold])
        .seed(31)
        .layer(8),
    ).opacity(0);

    const input = addText(this, "4,000 sq ft  →  x = 4", [4.55, 9.28], 0.20, COLOR.ai, 900).opacity(0);
    const substitution = addText(this, "y = 14(4) + 7 = 63", [4.55, 8.66], 0.23, COLOR.ink, 900).opacity(0);
    const prediction = graphPoint(4, 63);
    const inferenceV = addLine(this, [prediction[0], 6.62], prediction, COLOR.ai, 0.05).opacity(0);
    const inferenceH = addLine(this, prediction, [-6.05, prediction[1]], COLOR.ai, 0.05).opacity(0);
    const predictedPrice = addText(this, "₹63 LAKH", [-5.42, prediction[1] + 0.22], 0.18, COLOR.ai, 950).opacity(0);

    // ---------------------------------------------------------------------
    // One compact recap. The green stays on the Machine Learning pill.
    // The panel holds the model only. Training and inference sit under it
    // as two bullets, in the colours already used on the email demo.
    // ---------------------------------------------------------------------
    const recapPanel = this.add(
      Rectangle().size([7.15, 2.88]).cornerRadius(0.26)
        .fill(COLOR.panel)
        .stroke({ color: CATEGORY.ml.accent, width: 0.04 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.30))" }),
      { at: [0, 10.03, 0.20] },
    ).opacity(0);
    const recapCaption = addText(
      this, "PLOT PRICES IN MUZAFFARPUR", [0, 11.05], 0.15, COLOR.muted, 800,
    ).opacity(0);
    const recapModel = addText(this, "MODEL", [0, 10.52], 0.22, COLOR.ink, 950).opacity(0);
    const recapEquation = addText(this, "y = 14x + 7", [0, 9.90], 0.36, COLOR.ink, 950).opacity(0);
    const recapA = addPill(this, "a = 14", [-1.21, 9.18], COLOR.ml, 1.70, COLOR.panelSoft);
    const recapB = addPill(this, "b = 7", [0.79, 9.18], COLOR.ml, 1.55, COLOR.panelSoft);
    const recapLock = addLockIcon(this, [1.92, 9.18]);
    const trainingCopy = "TRAINING  —  ADJUST PARAMETERS USING EXAMPLES";
    const inferenceCopy = "INFERENCE  —  USE THE LOCKED MODEL ON A NEW EXAMPLE";
    const pointHeight = 0.17;
    const pointAdvance = pointHeight * 0.58;
    const trainingWidth = trainingCopy.length * pointAdvance;
    const inferenceWidth = inferenceCopy.length * pointAdvance;
    const pointDot = 0.055;
    const pointGap = 0.20;
    const pointBlock = pointDot * 2 + pointGap + Math.max(trainingWidth, inferenceWidth);
    const pointDotX = -pointBlock / 2 + pointDot;
    const recapTraining = addRecapPoint(this, trainingCopy, 8.12, COLOR.ml, trainingWidth, pointDotX);
    const recapInference = addRecapPoint(this, inferenceCopy, 7.56, COLOR.ai, inferenceWidth, pointDotX);
    const recap = [
      recapPanel, recapCaption, recapModel, recapEquation,
      ...recapA, ...recapB, ...recapLock, ...recapTraining, ...recapInference,
    ];
    hide(recap);

    // ---------------------------------------------------------------------
    // Zoom out first and hold that frame. The pill morphs into a ball that
    // is already its final radius. It drops, bounces once, and jumps. On
    // the diagram it lands on a floor, bounces twice, and that seat is the
    // nested position. The camera moves in only after the ball has settled.
    // ---------------------------------------------------------------------
    const ML_FLOOR_Y = 5.30;
    const ML_BALL_REST_Y = ML_FLOOR_Y + ML_BALL_RADIUS;
    const mlFloor = this.add(
      Line().from([-4.60, ML_FLOOR_Y]).to([5.50, ML_FLOOR_Y])
        .stroke({ color: "rgba(154,167,193,0.72)", width: 0.08 }),
    );
    mlFloor.at([mlFloor.initialState.x, mlFloor.initialState.y, 0.06]).opacity(0);
    const diagramFloor = this.add(
      Line().from([NEST_X - 4.80, DIAGRAM_FLOOR_Y]).to([NEST_X + 4.80, DIAGRAM_FLOOR_Y])
        .stroke({ color: "rgba(154,167,193,0.72)", width: 0.08 }),
    );
    diagramFloor.at([diagramFloor.initialState.x, diagramFloor.initialState.y, 0.06]).opacity(0);
    const mlDiagramLabel = addText(
      this, "MACHINE\nLEARNING", [NEST_X, ML_LABEL_Y], 0.24, COLOR.ink, 950, 0.30,
    ).opacity(0);

    addKavriqBrand(this);

    // ---------------------------------------------------------------------
    // Timeline
    // ---------------------------------------------------------------------
    const timeline = new Timeline();

    timeline.animateCamera(this.camera).at(CUE.returnToEmail).duration(1.35).ease("inOutCubic")
      .frameTo([0, 0, 8], [0, 0, 0]);
    timeline.animate(spam.all).at(CUE.focusSpam).duration(0.35).fadeTo(1);
    timeline.animate(spam.panel).at(CUE.focusSpam).duration(0.28).scaleTo(1.06);
    timeline.animate(spam.panel).at(CUE.focusSpam + 0.30).duration(0.25).scaleTo(1);
    timeline.animate(movingCard.all.filter((item) => item !== movingCard.mlTitle))
      .at(CUE.liftSpam).stagger(0.02).duration(0.20).appear();
    timeline.animate(spam.all).at(CUE.liftSpam + 0.18).duration(0.28).fadeTo(0.20);

    moveGroup(
      timeline,
      movingCard.all.filter((item) => item !== movingCard.panel && item !== movingCard.mlTitle),
      positions.spam,
      titleCenter,
      CUE.liftSpam,
      2.05,
      1.12,
    );
    // Keep the replacement title at its resting size. The card's 1.12 travel
    // scale used to apply to these words, and the later swap back to scale 1
    // made them jump.
    timeline.animate(movingCard.mlTitle).at(CUE.liftSpam).duration(2.05).ease("inOutCubic")
      .moveTo([titleCenter[0], titleCenter[1], 0.26]);
    // Widen the physical card throughout its journey. The long replacement
    // title therefore never spends a frame inside the compact result surface.
    timeline.animate(movingCard.panel).at(CUE.liftSpam).duration(2.05).ease("inOutCubic")
      .to({ x: titleCenter[0], y: titleCenter[1], scaleX: 1.85, scaleY: 1.15 });
    // Resolve the travelling surface into the native banner as it arrives.
    // Both titles share one size and one centre, so the swap does not move
    // the words.
    const titleSettleAt = CUE.liftSpam + 2.05;
    timeline.animate(movingCard.panel).at(titleSettleAt).duration(0).fadeTo(0);
    timeline.animate(mlTitleBanner).at(titleSettleAt).duration(0).appear();
    timeline.animate(movingCard.mlTitle).at(titleSettleAt).duration(0).fadeTo(0);
    timeline.animate(mlTitleBannerLabel).at(titleSettleAt).duration(0).appear();
    timeline.animateCamera(this.camera).at(CUE.liftSpam + 0.18).duration(2.05).ease("inOutCubic")
      .frameTo([0, 9, 8], [0, 9, 0]);
    timeline.animate(movingCard.title).at(CUE.rewriteSpam).duration(0.38).untypewrite();
    timeline.animate(movingCard.detail).at(CUE.rewriteSpam + 0.04).duration(0.40).untypewrite();
    timeline.animate(movingCard.mlTitle).at(CUE.rewriteSpam + 0.36).duration(0).appear();
    timeline.animate(movingCard.mlTitle).at(CUE.rewriteSpam + 0.36).duration(0.68).typewrite();
    timeline.animate(takeaway).at(CUE.mlTakeaway).duration(0).appear();
    timeline.animate(takeaway).at(CUE.mlTakeaway).duration(0.72).typewrite();

    timeline.animate(inputVisuals).at(CUE.training).stagger(0.08).duration(0.32).appear();
    timeline.animate([modelPanel, modelLabel]).at(CUE.training + 0.18).stagger(0.10).duration(0.35).appear();
    timeline.animate(gauges.flatMap((gauge) => gauge.all)).at(CUE.training + 0.30).stagger(0.04).duration(0.30).appear();
    timeline.animate([...trainingActive, ...inferenceInactive])
      .at(CUE.training + 0.38).stagger(0.035).duration(0.30).appear();
    const gaugeTargets = [
      [0.52, 0.68, 0.42, 0.74, 0.58, 0.82],
      [0.66, 0.48, 0.61, 0.56, 0.76, 0.64],
      [0.44, 0.73, 0.55, 0.81, 0.63, 0.88],
      [0.59, 0.62, 0.70, 0.67, 0.79, 0.72],
    ];
    examples.forEach((example, index) => {
      const at = CUE.training + 0.82 + index * 1.22;
      timeline.animate(example.all).at(at).stagger(0.018).duration(0.25).appear();
      moveGroup(timeline, example.all, example.center, [-0.72, 8.75], at + 0.40, 0.55, 0.48);
      timeline.animate(example.all).at(at + 0.86).duration(0.18).fadeTo(0);
      trainingNumbers[index]!.forEach((packet, packetIndex) => {
        const packetAt = at + 0.68 + packetIndex * 0.055;
        timeline.animate(packet.all).at(packetAt).stagger(0.02).duration(0.20).appear();
        moveGroup(
          timeline,
          packet.all,
          packet.center,
          [1.42, 9.18 - (packetIndex % 3) * 0.43],
          packetAt + 0.06,
          0.38,
          0.92,
        );
        timeline.animate(packet.all).at(packetAt + 0.36).duration(0.14).fadeTo(0);
      });
      // The label stays up for the whole training pass. A 0.3s flash
      // on each example was gone before it could be read.
      if (index === 0) {
        timeline.animate(updatePulse).at(at + 1.00).stagger(0.025).duration(0.28).appear();
      }
      timeline.animate(updatePulse[1]!).at(at + 1.10).duration(0.36).indicate();
      gauges.forEach((gauge, gaugeIndex) => {
        const target = gaugeTargets[index]![gaugeIndex]!;
        const microTarget = Math.max(0.34, Math.min(0.94, target + ((gaugeIndex + index) % 2 === 0 ? 0.07 : -0.06)));
        timeline.animate(gauge.fill).at(at + 1.04 + gaugeIndex * 0.018)
          .duration(0.22).ease("inOutCubic").scaleTo(microTarget);
        timeline.animate(gauge.fill).at(at + 1.27 + gaugeIndex * 0.018)
          .duration(0.20).ease("inOutCubic").scaleTo(target);
      });
    });
    timeline.animate(updatePulse).at(CUE.inference - 0.22).duration(0.22).fadeTo(0);
    timeline.animate(trainingActive).at(CUE.inference).duration(0.22).fadeTo(0);
    timeline.animate(inferenceInactive).at(CUE.inference).duration(0.22).fadeTo(0);
    timeline.animate([modelPanel, modelLabel]).at(CUE.inference).duration(0.30).fadeTo(0);
    timeline.animate([inferenceModelPanel, inferenceModelLabel, ...inferenceLock])
      .at(CUE.inference + 0.08).stagger(0.035).duration(0.30).appear();
    timeline.animate([...trainingInactive, ...inferenceActive])
      .at(CUE.inference + 0.18).stagger(0.035).duration(0.30).appear();
    timeline.animate(inferenceModelPanel).at(CUE.inference + 0.46).duration(0.20).ease("outCubic").scaleTo(1.025);
    timeline.animate(inferenceModelPanel).at(CUE.inference + 0.66).duration(0.22).ease("inOutCubic").scaleTo(1);
    timeline.animate(newEmail.all).at(CUE.inference + 1.02).stagger(0.02).duration(0.26).appear();
    moveGroup(timeline, newEmail.all, newEmail.center, [-0.72, 8.75], CUE.inference + 1.28, 0.68, 0.48);
    timeline.animate(newEmail.all).at(CUE.inference + 1.82).duration(0.20).fadeTo(0);
    inferenceNumbers.forEach((packet, packetIndex) => {
      const packetAt = CUE.inference + 1.62 + packetIndex * 0.055;
      timeline.animate(packet.all).at(packetAt).stagger(0.02).duration(0.20).appear();
      moveGroup(
        timeline,
        packet.all,
        packet.center,
        [1.42, 9.18 - (packetIndex % 3) * 0.43],
        packetAt + 0.06,
        0.40,
        0.92,
      );
      timeline.animate(packet.all).at(packetAt + 0.38).duration(0.14).fadeTo(0);
    });
    timeline.animate([inferenceSpam.panel, inferenceSpam.title]).at(CUE.inference + 2.62).stagger(0.05).duration(0.32).appear();
    timeline.animate(inferenceSpam.score).at(CUE.inference + 3.30).duration(0.34).appear();
    timeline.animate(inferenceSpam.score).at(CUE.inference + 3.58).duration(0.45).indicate();

    const pipeline = [
      ...inputVisuals, ...updatePulse, modelPanel, modelLabel,
      inferenceModelPanel, inferenceModelLabel, ...inferenceLock, ...gauges.flatMap((gauge) => gauge.all),
      ...trainingActive, ...trainingInactive, ...inferenceInactive, ...inferenceActive,
      inferenceSpam.panel, inferenceSpam.title, inferenceSpam.score,
    ];
    timeline.animate(pipeline).at(CUE.plot - 0.55).stagger(0.004).duration(0.38).fadeTo(0);
    timeline.animate(takeaway).at(CUE.plot - 0.45).duration(0.30).fadeTo(0);
    timeline.animate(plotTitle).at(CUE.plot).duration(0).appear();
    timeline.animate(plotTitle).at(CUE.plot).duration(0.62).typewrite();
    timeline.animate(csv.all).at(CUE.plot + 0.65).stagger(0.02).duration(0.38).appear();
    moveGroup(timeline, csv.all, csv.center, [4.55, 8.72], CUE.plot + 1.85, 0.78, 0.88);
    timeline.animate(graph.all).at(CUE.plot + 2.02).stagger(0.055).duration(0.48).appear();
    csvDots.forEach((dot, index) => {
      const at = CUE.plot + 2.62 + index * 0.58;
      timeline.animate(csv.rowHighlights[index]!).at(at).duration(0.18).fadeTo(0.46);
      timeline.animate(dot).at(at + 0.08).duration(0.18).appear();
      timeline.animate(dot).at(at + 0.08).duration(0.52).ease("inOutCubic")
        .moveTo([...graphPoint(data[index]!.area, data[index]!.price), 0.34]);
      timeline.animate(csv.rowHighlights[index]!).at(at + 0.42).duration(0.18).fadeTo(0);
    });

    timeline.animate(estimateDot).at(CUE.intuition).duration(0.24).appear();
    timeline.animate(estimateV).at(CUE.intuition + 0.18).duration(0).appear();
    timeline.animate(estimateV).at(CUE.intuition + 0.18).duration(0.48).draw();
    timeline.animate(estimateH).at(CUE.intuition + 0.64).duration(0).appear();
    timeline.animate(estimateH).at(CUE.intuition + 0.64).duration(0.42).draw();
    timeline.animate([estimateX, estimateY]).at(CUE.intuition + 0.40).stagger(0.30).duration(0.30).appear();
    timeline.animate(estimateCaption).at(CUE.intuition + 1.05).duration(0).appear();
    timeline.animate(estimateCaption).at(CUE.intuition + 1.05).duration(0.52).typewrite();

    const intuition = [estimateDot, estimateV, estimateH, estimateX, estimateY, estimateCaption];
    timeline.animate(intuition).at(CUE.fit).duration(0.30).fadeTo(0);
    timeline.animate(csv.all).at(CUE.fit).duration(0.35).fadeTo(0.06);
    timeline.animate(baseEquation).at(CUE.fit + 0.35).duration(0).appear();
    timeline.animate(baseEquation).at(CUE.fit + 0.35).duration(0.54).typewrite();
    fitStates.forEach((state, index) => {
      const at = CUE.fit + 1.10 + index * 1.62;
      if (index > 0) timeline.animate(fitStates[index - 1]!.all).at(at).duration(0.26).fadeTo(0);
      timeline.animate(state.all).at(at).stagger(0.02).duration(0.32).appear();
      timeline.animate(state.line).at(at).duration(0.44).draw();
    });
    // "LOWEST ERROR" describes the final search step. Clear it before the
    // resolved equation and TRAINED badge take over the same status area.
    timeline.animate(fitStates[2]!.error).at(CUE.fit + 5.72).duration(0.24).fadeTo(0);
    timeline.animate(trainedEquation).at(CUE.fit + 5.92).duration(0).appear();
    timeline.animate(trainedEquation).at(CUE.fit + 5.92).duration(0.54).typewrite();
    timeline.animate(trained).at(CUE.fit + 6.42).stagger(0.05).duration(0.30).appear();
    timeline.animate(trainingFireworks).at(CUE.fit + 6.35).duration(0.28).appear();
    timeline.animate(trainingFireworks).at(CUE.fit + 11.70).duration(0.42).disappear();

    timeline.animate(fitStates[2]!.all.filter((item) => item !== fitStates[2]!.line))
      .at(CUE.plotInference).duration(0.28).fadeTo(0);
    timeline.animate(input).at(CUE.plotInference + 0.22).duration(0).appear();
    timeline.animate(input).at(CUE.plotInference + 0.22).duration(0.58).typewrite();
    timeline.animate(substitution).at(CUE.plotInference + 1.02).duration(0).appear();
    timeline.animate(substitution).at(CUE.plotInference + 1.02).duration(0.68).typewrite();
    timeline.animate(inferenceV).at(CUE.plotInference + 1.80).duration(0).appear();
    timeline.animate(inferenceV).at(CUE.plotInference + 1.80).duration(0.48).draw();
    timeline.animate(inferenceH).at(CUE.plotInference + 2.28).duration(0).appear();
    timeline.animate(inferenceH).at(CUE.plotInference + 2.28).duration(0.44).draw();
    timeline.animate(predictedPrice).at(CUE.plotInference + 2.70).duration(0.32).appear();
    timeline.animate(predictedPrice).at(CUE.plotInference + 2.98).duration(0.46).indicate();

    const graphStage = [
      ...graph.all, ...csv.all, ...csvDots, ...fitStates.flatMap((state) => state.all),
      baseEquation, trainedEquation, ...trained, input, substitution,
      inferenceV, inferenceH, predictedPrice,
    ];
    timeline.animate(graphStage).at(CUE.recap).stagger(0.001).duration(0.42).fadeTo(0);
    timeline.animate(plotTitle).at(CUE.recap).duration(0.36).fadeTo(0);
    timeline.animate(recap).at(CUE.recap + 0.35).stagger(0.04).duration(0.35).appear();
    timeline.animate(recapTraining[1]!).at(CUE.recap + 1.45).duration(0.45).indicate();
    timeline.animate(recapInference[1]!).at(CUE.recap + 2.30).duration(0.45).indicate();

    timeline.animate(recap).at(CUE.taxonomy).stagger(0.002).duration(0.36).fadeTo(0);
    // Pull back before the ball moves, far enough that the title ball and
    // the diagram floor are both in frame. The camera then stays still.
    const widePadX = 0.55;
    const widePadY = 0.42;
    const wideMinX = titleCenter[0] - ML_BALL_RADIUS - widePadX;
    const wideMaxX = NEST_X + AI_RADIUS + widePadX;
    const wideMinY = AI_BOTTOM - widePadY;
    const wideMaxY = titleCenter[1] + ML_BALL_RADIUS + widePadY;
    const wideZoom = Math.min(16 / (wideMaxX - wideMinX), 9 / (wideMaxY - wideMinY));
    const wideX = (wideMinX + wideMaxX) / 2;
    const wideY = (wideMinY + wideMaxY) / 2;
    const zoomAt = CUE.taxonomy + 0.08;
    const zoomDuration = 1.15;
    timeline.animateCamera(this.camera).at(zoomAt).duration(zoomDuration).ease("inOutCubic")
      .frameTo([wideX, wideY, 8], [wideX, wideY, 0]);
    timeline.animateCamera(this.camera).at(zoomAt).duration(zoomDuration).ease("inOutCubic")
      .zoomTo(wideZoom);

    // The banner and the ball are one ShapeMorph. The circle is already the
    // final radius, so the morph is the only size change.
    const morphAt = zoomAt + zoomDuration + 0.06;
    const morphDuration = 0.80;
    timeline.animate(mlTitleBannerLabel).at(morphAt).duration(0.18).fadeTo(0);
    timeline.animate(mlTitleBanner).at(morphAt).duration(morphDuration).ease("inOutCubic").morphTo(1);
    timeline.animate(mlFloor).at(morphAt + 0.55).duration(0.24).ease("outCubic").appear();

    const gravity = 9.8;
    const bounceHop = 1.20;
    // Higher than the bounce, so the leave reads as a jump rather than a skim.
    const jumpRise = 2.15;
    const fallAt = morphAt + morphDuration + 0.08;
    const firstDrop = titleCenter[1] - ML_BALL_REST_Y;
    const firstFall = Math.sqrt(2 * gravity * firstDrop) / gravity;
    const bounceVy = Math.sqrt(2 * gravity * bounceHop);
    const bounceFlight = 2 * bounceVy / gravity;
    // The bounce lands and the jump begins on that same contact.
    const launchAt = fallAt + firstFall + bounceFlight;
    const launchVy = Math.sqrt(2 * gravity * jumpRise);
    const halfG = 0.5 * gravity;
    const flight = (launchVy + Math.sqrt(launchVy * launchVy + 2 * gravity * (ML_BALL_REST_Y - NEST_Y))) / gravity;
    const launchVx = (NEST_X - titleCenter[0]) / flight;
    const impactAt = launchAt + flight;
    const landHops = [0.42, 0.13];
    const landRebound = landHops.map((hop) => Math.sqrt(2 * gravity * hop));
    const landFlight = landRebound.map((speed) => 2 * speed / gravity);
    const settledAt = impactAt + landFlight.reduce((sum, duration) => sum + duration, 0);
    this.addUpdater(mlTitleBanner, ({ time, state }) => {
      if (time < fallAt || time > settledAt) return;
      const squash = (age: number) => {
        const span = 0.08;
        if (age < 0 || age > span) {
          state.scaleX = 1;
          state.scaleY = 1;
          return;
        }
        const amount = Math.sin(Math.PI * age / span);
        state.scaleY = 1 - 0.10 * amount;
        state.scaleX = 1 + 0.08 * amount;
      };
      if (time <= fallAt + firstFall) {
        const t = time - fallAt;
        state.x = titleCenter[0];
        state.y = Math.max(ML_BALL_REST_Y, titleCenter[1] - halfG * t * t);
        state.z = 0.24;
        squash(time - (fallAt + firstFall));
        return;
      }
      if (time < launchAt) {
        const t = time - (fallAt + firstFall);
        state.x = titleCenter[0];
        state.y = ML_BALL_REST_Y + bounceVy * t - halfG * t * t;
        state.z = 0.24;
        squash(t);
        return;
      }
      if (time <= impactAt) {
        const t = time - launchAt;
        state.x = titleCenter[0] + launchVx * t;
        state.y = ML_BALL_REST_Y + launchVy * t - halfG * t * t;
        state.z = 0.24 + (0.18 - 0.24) * (t / flight);
        squash(t);
        return;
      }
      let hopStart = impactAt;
      for (let index = 0; index < landHops.length; index += 1) {
        const span = landFlight[index]!;
        if (time <= hopStart + span) {
          const t = time - hopStart;
          state.x = NEST_X;
          state.y = NEST_Y + landRebound[index]! * t - halfG * t * t;
          state.z = 0.18;
          squash(t);
          return;
        }
        hopStart += span;
      }
      state.x = NEST_X;
      state.y = NEST_Y;
      state.z = 0.18;
      state.scaleX = 1;
      state.scaleY = 1;
    }, { from: fallAt, until: settledAt });
    timeline.animate(mlTitleBanner).at(settledAt).duration(0).moveTo([NEST_X, NEST_Y, 0.18]);
    timeline.animate(mlFloor).at(launchAt).duration(0.24).ease("inCubic").fadeTo(0);
    timeline.animate(diagramFloor).at(launchAt).duration(0.22).ease("outCubic").appear();
    timeline.animate(diagramFloor).at(settledAt + 0.35).duration(0.30).ease("inCubic").fadeTo(0);
    // The AI circle is already in its final place. Focus it only once the
    // ball has finished bouncing on the diagram floor.
    const focusAt = settledAt + 0.72;
    timeline.animateCamera(this.camera).at(focusAt).duration(1.15).ease("inOutCubic")
      .frameTo([NEST_X, 0, 8], [NEST_X, 0, 0]);
    timeline.animateCamera(this.camera).at(focusAt).duration(1.15).ease("inOutCubic")
      .zoomTo(1);
    timeline.animate(mlDiagramLabel).at(focusAt + 0.55).duration(0.36).appear();

    timeline.wait(CUE.end);
    this.play(timeline);
    this.captureScreenshotsNamed([
      [0, "segment-03-continuity"],
      [5.75, "segment-03-ml-title"],
      [11.55, "segment-03-training"],
      [16.35, "segment-03-inference"],
      [24.90, "segment-03-plot-data"],
      [28.65, "segment-03-intuitive-estimate"],
      [38.20, "segment-03-trained-line"],
      [48.25, "segment-03-plot-inference"],
      [53.00, "segment-03-recap"],
      [morphAt - 0.04, "segment-03-wide-hold"],
      [fallAt + firstFall * 0.55, "segment-03-ball-falling"],
      [fallAt + firstFall + bounceFlight * 0.50, "segment-03-ball-jump"],
      [launchAt + flight * 0.45, "segment-03-ball-flight"],
      [impactAt + 0.04, "segment-03-ball-floor"],
      [CUE.end - 0.40, "segment-03-taxonomy"],
    ]);
  }
}

interface InferenceResult {
  panel: Tattva;
  title: Tattva;
  score: Tattva;
}

// Measured ink widths, in ems, for Inter with 0.035em tracking.
// Cap height is 0.72em and sits on the label anchor.
const SPAM_INK_EM = 2.99;
const SCORE_INK_EM = 2.42;
const INFERENCE_CAP_EM = 0.72;

function addInferenceResult(scene: Scene, y: number): InferenceResult {
  const titleHeight = 0.22;
  const scoreHeight = 0.155;
  const titleCap = titleHeight * INFERENCE_CAP_EM;
  const scoreCap = scoreHeight * INFERENCE_CAP_EM;
  const lineGap = 0.12;
  const padX = 0.40;
  const padY = 0.22;
  const titleWidth = SPAM_INK_EM * titleHeight;
  const width = titleWidth + padX * 2;
  const height = titleCap + lineGap + scoreCap + padY * 2;
  const blockHalf = (titleCap + lineGap + scoreCap) / 2;
  // The model panel ends at x = 5.11. Hold a clear gap so the result stays separate.
  const modelRight = 3.20 + 3.82 / 2;
  const x = modelRight + 0.24 + width / 2;
  const panel = scene.add(
    Rectangle().size([width, height]).cornerRadius(0.20).fill(CATEGORY.ml.fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 16px ${CATEGORY.ml.fill}4D)` }),
    { at: [x, y, 0.22] },
  );
  const title = addCenteredText(scene, "SPAM", [x, y + (blockHalf - titleCap / 2)], titleHeight, 950, SPAM_INK_EM);
  const score = addCenteredText(scene, "96%", [x, y - (blockHalf - scoreCap / 2)], scoreHeight, 850, SCORE_INK_EM);
  hide([panel, title, score]);
  return { panel, title, score };
}

function addResultCard(scene: Scene, at: Vec2, fill: string, title: string, detail: string): ResultCard {
  const panel = scene.add(
    Rectangle().size([RESULT_W, RESULT_H]).cornerRadius(0.20).fill(fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 16px ${fill}4D)` }),
    { at: [at[0], at[1], 0.22] },
  );
  const titleLabel = addText(scene, title, [at[0], at[1] + 0.13], 0.22, COLOR.ink, 950, 0.24);
  const detailLabel = addText(scene, detail || "\u200B", [at[0], at[1] - 0.20], 0.125, "rgba(248,250,252,0.78)", 700, 0.24);
  return { all: [panel, titleLabel, detailLabel], panel, title: titleLabel, detail: detailLabel, center: at };
}

function addRewriteCard(scene: Scene, at: Vec2): RewriteCard {
  const base = addResultCard(scene, at, CATEGORY.ml.fill, "SPAM", "CLASSIFIED");
  const mlTitle = addText(scene, "MACHINE LEARNING", at, ML_TITLE_HEIGHT, COLOR.ink, 950, 0.26).opacity(0);
  fitLabelWidth(mlTitle, ML_TITLE_HEIGHT, ML_TITLE_INK_EM);
  return { ...base, all: [...base.all, mlTitle], mlTitle };
}

function addTrainingEmail(
  scene: Scene,
  at: Vec2,
  tag: string,
  subject: string,
  sender: string,
  tagColor: string,
): MiniEmail {
  const [x, y] = at;
  const all: Tattva[] = [];
  all.push(scene.add(
    Rectangle().size([3.55, 1.62]).cornerRadius(0.18).fill("#18223A")
      .stroke({ color: "#334260", width: 0.028 }).css({ borderStyle: "none" }),
    { at: [x, y, 0.24] },
  ));
  all.push(scene.add(
    Rectangle().size([3.50, 0.30]).cornerRadius(0.14).fill("#10182B")
      .css({ borderStyle: "none" }),
    { at: [x, y + 0.64, 0.25] },
  ));
  all.push(addText(scene, "INBOX", [x - 1.25, y + 0.64], 0.10, COLOR.muted, 800, 0.27));
  all.push(scene.add(
    Circle().radius(0.18).fill("#243654"),
    { at: [x - 1.36, y + 0.20, 0.26] },
  ));
  all.push(addText(scene, "@", [x - 1.36, y + 0.20], 0.13, COLOR.ai, 900, 0.28));
  all.push(addText(scene, subject, [x + 0.24, y + 0.28], 0.16, COLOR.ink, 850, 0.27));
  all.push(addText(scene, sender, [x + 0.08, y - 0.02], 0.105, COLOR.muted, 700, 0.27));
  all.push(scene.add(
    Rectangle().size([2.35, 0.075]).cornerRadius(0.035).fill("#64728E")
      .css({ borderStyle: "none" }),
    { at: [x + 0.18, y - 0.34, 0.27] },
  ));
  all.push(scene.add(
    Rectangle().size([1.72, 0.075]).cornerRadius(0.035).fill("#465570")
      .css({ borderStyle: "none" }),
    { at: [x - 0.13, y - 0.55, 0.27] },
  ));
  all.push(scene.add(
    Rectangle().size([1.02, 0.31]).cornerRadius(0.15).fill(tagColor)
      .css({ borderStyle: "none" }),
    { at: [x + 1.18, y + 0.63, 0.28] },
  ));
  all.push(addText(scene, tag, [x + 1.18, y + 0.63], 0.105, COLOR.ink, 950, 0.30));
  return { all, center: at };
}

function addNumberPacket(scene: Scene, at: Vec2, value: string): NumberPacket {
  const panel = scene.add(
    Rectangle().size([0.82, 0.31]).cornerRadius(0.15).fill("#10283A")
      .stroke({ color: COLOR.ai, width: 0.018 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.30] },
  );
  const label = addText(scene, value, at, 0.115, COLOR.ai, 900, 0.32);
  return { all: [panel, label], center: at };
}

function addMiniEmail(scene: Scene, at: Vec2, tag: string, subject: string, color: string): MiniEmail {
  const panel = scene.add(
    Rectangle().size([2.78, 0.72]).cornerRadius(0.15).fill(COLOR.panel)
      .stroke({ color, width: 0.03 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.24] },
  );
  const tagLabel = addText(scene, tag, [at[0] - 0.73, at[1] + 0.12], 0.125, color, 900, 0.26);
  const subjectLabel = addText(scene, subject, [at[0], at[1] - 0.16], 0.12, COLOR.muted, 700, 0.26);
  return { all: [panel, tagLabel, subjectLabel], center: at };
}

function addGauge(scene: Scene, at: Vec2, index: number): Gauge {
  const track = scene.add(
    Rectangle().size([0.27, 1.50]).cornerRadius(0.11).fill("#123D31")
      .css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.22] },
  );
  const fill = scene.add(
    Rectangle().size([0.20, 1.22]).cornerRadius(0.085)
      .fill(index % 2 === 0 ? CATEGORY.ml.accent : CATEGORY.ai.accent)
      .css({ borderStyle: "none", transformOrigin: "50% 100%" }),
    { at: [at[0], at[1], 0.24] },
  ).scale(0.30 + index * 0.055);
  return { all: [track, fill], fill };
}

function addCsv(scene: Scene, center: Vec2): { all: Tattva[]; rowHighlights: Tattva[]; center: Vec2 } {
  const [x, y] = center;
  const all: Tattva[] = [];
  const rowHighlights: Tattva[] = [];
  all.push(scene.add(
    Rectangle().size([5.05, 4.00]).cornerRadius(0.24).fill(COLOR.panel)
      .stroke({ color: COLOR.grid, width: 0.04 }).css({ borderStyle: "none" }),
    { at: [x, y, 0.18] },
  ));
  all.push(addText(scene, "MUZAFFARPUR-PLOT-PRICES.CSV", [x, y + 1.58], 0.17, COLOR.ml, 900));
  all.push(addText(scene, "PLOT SIZE (SQ FT)", [x - 1.18, y + 1.13], 0.13, COLOR.muted, 850));
  all.push(addText(scene, "PRICE (₹ LAKH)", [x + 1.22, y + 1.13], 0.13, COLOR.muted, 850));
  const rows = [["1,000", "23"], ["1,800", "29"], ["2,600", "45"], ["3,400", "54"], ["4,200", "63"], ["5,000", "79"]];
  rows.forEach(([area, price], index) => {
    const rowY = y + 0.68 - index * 0.45;
    const highlight = scene.add(
      Rectangle().size([4.55, 0.34]).cornerRadius(0.07).fill("#245F49").css({ borderStyle: "none" }),
      { at: [x, rowY, 0.20] },
    ).opacity(0);
    rowHighlights.push(highlight);
    all.push(highlight);
    all.push(addText(scene, area!, [x - 1.18, rowY], 0.13, COLOR.ink, 750));
    all.push(addText(scene, price!, [x + 1.22, rowY], 0.13, COLOR.ink, 750));
  });
  return { all, rowHighlights, center };
}

function addGraph(scene: Scene): Graph {
  const all: Tattva[] = [
    addLine(scene, [-6.05, 6.62], [1.28, 6.62], COLOR.ink, 0.045),
    addLine(scene, [-6.05, 6.62], [-6.05, 10.92], COLOR.ink, 0.045),
    addText(scene, "PLOT SIZE (THOUSAND SQ FT)", [-2.40, 6.12], 0.145, COLOR.muted, 800),
    addText(scene, "PRICE (₹ LAKH)", [-6.05, 11.16], 0.12, COLOR.muted, 800),
  ];
  [1, 2, 3, 4, 5].forEach((value) => all.push(
    addText(scene, `${value}`, [graphPoint(value, 0)[0], 6.35], 0.12, COLOR.muted, 700),
  ));
  [20, 40, 60, 80].forEach((value) => all.push(
    addText(scene, `${value}`, [-6.32, graphPoint(0, value)[1]], 0.12, COLOR.muted, 700),
  ));
  return { all };
}

function graphPoint(areaInThousands: number, priceInLakhs: number): Vec2 {
  return [
    -6.05 + (areaInThousands / 5.5) * 7.15,
    6.62 + (priceInLakhs / 85) * 4.10,
  ];
}

function addFitState(
  scene: Scene,
  slope: number,
  intercept: number,
  slopeLabel: string,
  interceptLabel: string,
  errorLabel: string,
  color: string,
): FitState {
  const from = graphPoint(0, intercept);
  const to = graphPoint(5.5, slope * 5.5 + intercept);
  const line = addLine(scene, from, to, COLOR.ml, 0.06);
  line.at([line.initialState.x, line.initialState.y, 0.36]);
  const a = addPill(scene, slopeLabel, [4.55, 9.55], color, 1.85);
  const b = addPill(scene, interceptLabel, [4.55, 8.98], color, 1.85);
  const error = addText(scene, errorLabel, [4.55, 7.98], 0.16, color, 950);
  const residuals = PLOT_DATA.map(({ area, price }) => {
    const point = graphPoint(area, price);
    const fitted = graphPoint(area, slope * area + intercept);
    return addLine(scene, point, [point[0], fitted[1]], "rgba(255,107,95,0.58)", 0.022);
  });
  return { all: [line, ...a, ...b, error, ...residuals], line, error };
}

function addRecapPoint(
  scene: Scene,
  text: string,
  y: number,
  color: string,
  textWidth: number,
  dotX: number,
): Tattva[] {
  const dot = scene.add(
    Circle().radius(0.055).fill(color),
    { at: [dotX, y, 0.30] },
  );
  const label = addText(scene, text, [dotX + 0.055 + 0.20 + textWidth / 2, y], 0.17, color, 850);
  return [dot, label];
}

function addLockIcon(scene: Scene, at: Vec2): Tattva[] {
  const shackle = scene.add(
    Circle().radius(0.12).fill("transparent").stroke({ color: COLOR.gold, width: 0.035 }),
    { at: [at[0], at[1] + 0.06, 0.29] },
  );
  const body = scene.add(
    Rectangle().size([0.27, 0.22]).cornerRadius(0.045).fill(COLOR.gold)
      .css({ borderStyle: "none" }),
    { at: [at[0], at[1] - 0.06, 0.31] },
  );
  const keyhole = scene.add(
    Circle().radius(0.028).fill("#8A4B16"),
    { at: [at[0], at[1] - 0.05, 0.33] },
  );
  return [shackle, body, keyhole];
}

function addPill(
  scene: Scene,
  text: string,
  at: Vec2,
  color: string,
  width: number,
  fill = "#14223A",
): Tattva[] {
  const panel = scene.add(
    Rectangle().size([width, 0.46]).cornerRadius(0.22).fill(fill)
      .css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.28] },
  );
  const label = addText(scene, text, at, 0.15, color, 900, 0.30);
  return [panel, label];
}

function addCenteredText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  weight: number,
  inkEm: number,
): Tattva {
  // The default label box is 0.58em per character. These glyphs are wider, and
  // a narrower box paints the line from the left edge, so the ink sits right
  // of the anchor. Give the line a box that matches its ink and keep it centered.
  const label = Label(text).height(height).color(COLOR.ink)
    .css({ fontWeight: weight, letterSpacing: "0.035em", textAlign: "center" });
  label.worldSize = {
    width: Math.max(label.worldSize?.width ?? 0, inkEm * height),
    height: label.worldSize?.height ?? height,
  };
  return scene.add(label, { at: [at[0], at[1], 0.24] });
}

function fitLabelWidth(label: Tattva, height: number, inkEm: number): void {
  label.worldSize = {
    width: Math.max(label.worldSize?.width ?? 0, inkEm * height),
    height: label.worldSize?.height ?? height,
  };
}

function addText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  color: string,
  weight: number,
  z = 0.24,
): Tattva {
  return scene.add(
    Label(text).height(height).color(color)
      .typewriter().css({ fontWeight: weight, letterSpacing: "0.035em", textAlign: "center" }),
    { at: [at[0], at[1], z] },
  );
}

function addLine(scene: Scene, from: Vec2, to: Vec2, color: string, width: number): Tattva {
  const line = scene.add(Line().from(from).to(to).stroke({ color, width }));
  line.at([line.initialState.x, line.initialState.y, 0.20]);
  return line;
}

function bouncingBallDuration(
  startY: number,
  restY: number,
  gravity: number,
  restitution: number,
  restVelocity: number,
): number {
  const drop = Math.max(0, startY - restY);
  const impactVelocity = Math.sqrt(2 * gravity * drop);
  let duration = impactVelocity / gravity;
  let reboundVelocity = impactVelocity * restitution;
  while (reboundVelocity > restVelocity) {
    duration += 2 * reboundVelocity / gravity;
    reboundVelocity *= restitution;
  }
  return duration;
}

function bouncingBallY(
  elapsed: number,
  startY: number,
  restY: number,
  gravity: number,
  restitution: number,
  restVelocity: number,
): number {
  const drop = Math.max(0, startY - restY);
  const impactVelocity = Math.sqrt(2 * gravity * drop);
  const firstFall = impactVelocity / gravity;
  if (elapsed <= firstFall) {
    return Math.max(restY, startY - 0.5 * gravity * elapsed * elapsed);
  }

  let remaining = elapsed - firstFall;
  let reboundVelocity = impactVelocity * restitution;
  while (reboundVelocity > restVelocity) {
    const flight = 2 * reboundVelocity / gravity;
    if (remaining <= flight) {
      return restY + reboundVelocity * remaining - 0.5 * gravity * remaining * remaining;
    }
    remaining -= flight;
    reboundVelocity *= restitution;
  }
  return restY;
}

function hide(items: readonly Tattva[]): void {
  items.forEach((item) => item.opacity(0));
}

function moveGroup(
  timeline: Timeline,
  items: readonly Tattva[],
  from: Vec2,
  to: Vec2,
  at: number,
  duration: number,
  scale: number,
): void {
  items.forEach((item) => {
    const localX = item.initialState.x - from[0];
    const localY = item.initialState.y - from[1];
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic")
      .moveTo([to[0] + localX * scale, to[1] + localY * scale, item.initialState.z]);
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic").scaleTo(scale);
  });
}

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  scene.updater((time, states) => motion.update((time + 94.1) % motion.duration, states));
}

const runningInBrowser = typeof window !== "undefined";
const invokedDirectly = typeof process !== "undefined"
  && process.argv[1]?.includes("03-machine-learning") === true;
if (runningInBrowser || invokedDirectly) {
  await renderScene(import.meta.url, MachineLearningScene, "03-machine-learning.mp4");
}
