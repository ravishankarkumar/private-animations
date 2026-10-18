import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Circle, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { renderScene } from "./lib/render.ts";
import { COLOR, FRAME } from "./lib/theme.ts";

const DATA_SCIENCE = "#E6C75A";
const DATA_SCIENCE_FILL = "rgba(140,117,38,0.78)";
const MACHINE_LEARNING_FILL = "rgba(30,122,85,0.78)";
const DATA_SCIENCE_CARD = "#8C7526";
const ACTIVE_ML_TEXT = "#071A16";
const LEARNING_SUBTITLE = "#BDFBE1";
const DATA_SCIENCE_LABEL = "#FFE58A";
const NORMAL_ML_CARD = "#145C43";
const SOLID = {
  ml: "#1E7A55",
} as const;

interface LearningRow {
  all: Tattva[];
  panel: Tattva;
  label: Tattva;
}

class DataScienceAndLearningTypesScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    // -------------------------------------------------------------------
    // Screen 4 — Machine Learning compared with Data Science.
    // -------------------------------------------------------------------
    this.camera.position([32, 0, 8]).lookAt([32, 0, 0]).zoom(1);
    const comparisonTitle = addText(
      this,
      "MACHINE LEARNING  vs  DATA SCIENCE",
      [32, 3.72],
      0.38,
      COLOR.ink,
      950,
    );
    comparisonTitle.opacity(0);

    const mlCircle = this.add(
      Circle().radius(2.63).fill(MACHINE_LEARNING_FILL)
        .css({ filter: "drop-shadow(0 0 28px rgba(87,227,161,0.13))" }),
      { at: [28.45, 0.36, 0.14] },
    ).opacity(0);
    const dsCircle = this.add(
      Circle().radius(2.63).fill(DATA_SCIENCE_FILL)
        .css({ filter: "drop-shadow(0 0 28px rgba(230,199,90,0.13))" }),
      { at: [35.55, 0.36, 0.15] },
    ).opacity(0);
    const mlCircleLabel = addText(this, "MACHINE\nLEARNING", [28.45, 1.98], 0.29, COLOR.ml, 950, 0.24);
    const dsCircleLabel = addText(this, "DATA\nSCIENCE", [35.55, 1.98], 0.29, DATA_SCIENCE, 950, 0.24);
    mlCircleLabel.opacity(0);
    dsCircleLabel.opacity(0);

    const overlapHeading = addText(this, "DATA", [32, 1.22], 0.31, COLOR.ink, 950, 0.34);
    overlapHeading.opacity(0);
    const sharedPractices = ["COLLECT", "CLEAN", "EXPLORE", "VALIDATE"].map((text, index) => {
      const item = addText(this, text, [32, 0.62 - index * 0.55], 0.21, COLOR.ink, 850, 0.34);
      item.opacity(0);
      return item;
    });

    const mlConnector = addText(this, "↙", [28.75, -2.48], 0.42, LEARNING_SUBTITLE, 950, 0.42)
      .layer(10).css({ filter: "drop-shadow(0 0 8px rgba(189,251,225,0.42))" }).opacity(0);
    const dsConnector = addText(this, "↘", [35.25, -2.48], 0.42, DATA_SCIENCE_LABEL, 950, 0.42)
      .layer(10).css({ filter: "drop-shadow(0 0 8px rgba(255,229,138,0.42))" }).opacity(0);
    const mlStatement = addBottomStatement(
      this,
      [27.60, -3.25],
      "LEARN PATTERNS",
      "PREDICT NEW CASES",
      COLOR.ml,
    );
    const dsStatement = addBottomStatement(
      this,
      [36.40, -3.25],
      "FIND INSIGHTS",
      "GUIDE HUMAN DECISIONS",
      DATA_SCIENCE,
    );
    hide([...mlStatement, ...dsStatement]);

    // -------------------------------------------------------------------
    // Expanded Machine Learning circle and its five learning approaches.
    // -------------------------------------------------------------------
    const learningHeading = addText(this, "MACHINE LEARNING", [31.72, 3.12], 0.36, COLOR.ink, 950, 0.36);
    learningHeading.opacity(0);
    const learningSubheading = addText(
      this,
      "DIFFERENT WAYS A SYSTEM CAN LEARN",
      [31.72, 2.66],
      0.18,
      LEARNING_SUBTITLE,
      800,
      0.36,
    );
    learningSubheading.opacity(0);
    const dataScienceContextLabel = addText(
      this,
      "DATA\nSCIENCE",
      [36.95, 0.36],
      0.29,
      DATA_SCIENCE_LABEL,
      900,
      0.36,
    );
    dataScienceContextLabel.opacity(0);

    const learningRows = [
      addLearningRow(this, [32, 1.72], "SUPERVISED LEARNING"),
      addLearningRow(this, [32, 0.78], "UNSUPERVISED LEARNING"),
      addLearningRow(this, [32, -0.16], "SEMI-SUPERVISED LEARNING"),
      addLearningRow(this, [32, -1.10], "REINFORCEMENT LEARNING"),
      addLearningRow(this, [32, -2.04], "SELF-SUPERVISED LEARNING"),
    ];
    learningRows.forEach((row) => hide(row.all));

    addKavriqBrand(this);

    // -------------------------------------------------------------------
    // Timeline — one continuous Segment 4 video.
    // -------------------------------------------------------------------
    const timeline = new Timeline();
    const start = 0;

    // This file begins when the standalone animation screen appears.
    timeline.animate(comparisonTitle).at(start).duration(0).appear();
    timeline.animate(comparisonTitle).at(start).duration(0.70).typewrite();

    // Two separate circles arrive.
    timeline.animate([mlCircle, dsCircle]).at(start + 0.75).stagger(0.16).duration(0.55).appear();
    timeline.animate([mlCircleLabel, dsCircleLabel]).at(start + 1.05).stagger(0.18).duration(0.40).appear();

    // First meeting: the circles touch at x = 32 without overlapping. Their
    // inner edges remain at the contact point while the bodies compress
    // horizontally, like two elastic balls colliding.
    move(timeline, mlCircle, [29.37, 0.36], start + 2.20, 0.72, "inCubic");
    move(timeline, mlCircleLabel, [29.37, 1.98], start + 2.20, 0.72, "inCubic");
    move(timeline, dsCircle, [34.63, 0.36], start + 2.20, 0.72, "inCubic");
    move(timeline, dsCircleLabel, [34.63, 1.98], start + 2.20, 0.72, "inCubic");

    // A brief, restrained deformation. Moving the centres slightly outward
    // keeps the inner edges anchored at the collision point while squashed.
    move(timeline, mlCircle, [29.53, 0.36], start + 2.92, 0.16, "inOutCubic");
    move(timeline, mlCircleLabel, [29.53, 1.98], start + 2.92, 0.16, "inOutCubic");
    move(timeline, dsCircle, [34.47, 0.36], start + 2.92, 0.16, "inOutCubic");
    move(timeline, dsCircleLabel, [34.47, 1.98], start + 2.92, 0.16, "inOutCubic");
    timeline.animate([mlCircle, dsCircle]).at(start + 2.92).duration(0.16)
      .ease("inOutCubic").scale3DTo([0.94, 1.04, 1]);

    // Rebound and immediately reverse into the second approach. There is no
    // stationary interval between the two motions.
    move(timeline, mlCircle, [28.92, 0.36], start + 3.08, 0.54, "outCubic");
    move(timeline, mlCircleLabel, [28.92, 1.98], start + 3.08, 0.54, "outCubic");
    move(timeline, dsCircle, [35.08, 0.36], start + 3.08, 0.54, "outCubic");
    move(timeline, dsCircleLabel, [35.08, 1.98], start + 3.08, 0.54, "outCubic");
    timeline.animate([mlCircle, dsCircle]).at(start + 3.08).duration(0.34)
      .ease("outCubic").scale3DTo([1, 1, 1]);

    // Second meeting: settle into a readable overlap.
    move(timeline, mlCircle, [30.60, 0.36], start + 3.62, 0.96, "inOutCubic");
    move(timeline, mlCircleLabel, [29.60, 1.98], start + 3.62, 0.96, "inOutCubic");
    move(timeline, dsCircle, [33.40, 0.36], start + 3.62, 0.96, "inOutCubic");
    move(timeline, dsCircleLabel, [34.40, 1.98], start + 3.62, 0.96, "inOutCubic");

    timeline.animate(overlapHeading).at(start + 6.05).duration(0).appear();
    timeline.animate(overlapHeading).at(start + 6.05).duration(0.42).typewrite();
    sharedPractices.forEach((item, index) => {
      const at = start + 7.00 + index * 1.00;
      timeline.animate(item).at(at).duration(0).appear();
      timeline.animate(item).at(at).duration(0.38).typewrite();
    });

    timeline.animate(mlConnector).at(start + 11.70).duration(0.40).appear();
    timeline.animate(mlStatement).at(start + 12.15).stagger(0.07).duration(0.40).appear();
    timeline.animate(dsConnector).at(start + 14.00).duration(0.40).appear();
    timeline.animate(dsStatement).at(start + 14.45).stagger(0.07).duration(0.40).appear();

    // Let the shared-practices explanation breathe before changing modes.
    timeline.animate(sharedPractices).at(start + 22.00).stagger(0.08).duration(0.40).indicate();

    // Data Science recedes; Machine Learning takes over the screen.
    const comparisonCopy = [
      comparisonTitle,
      overlapHeading,
      ...sharedPractices,
      mlConnector,
      dsConnector,
      ...mlStatement,
      ...dsStatement,
      mlCircleLabel,
      dsCircleLabel,
    ];
    timeline.animate(comparisonCopy).at(start + 28.50).stagger(0.002).duration(0.50).fadeTo(0);
    move(timeline, dsCircle, [36.95, 0.36], start + 28.65, 1.10, "inOutCubic");
    timeline.animate(dsCircle).at(start + 28.65).duration(0.75).fadeTo(0.55);
    move(timeline, mlCircle, [32, 0.05], start + 28.65, 1.15, "inOutCubic");
    timeline.animate(mlCircle).at(start + 28.65).duration(1.15).ease("inOutCubic").scaleTo(1.46);
    timeline.animate(learningHeading).at(start + 29.45).duration(0).appear();
    timeline.animate(learningHeading).at(start + 29.45).duration(0.55).typewrite();
    timeline.animate(learningSubheading).at(start + 30.10).duration(0).appear();
    timeline.animate(learningSubheading).at(start + 30.10).duration(0.60).typewrite();
    timeline.animate(dataScienceContextLabel).at(start + 29.65).duration(0.55).fadeTo(0.85);

    // Each row remains highlighted throughout its explanation. Previously
    // introduced rows stay visible at reduced emphasis.
    revealAndFocusRow(timeline, learningRows, 0, start + 33.00);
    settleRow(timeline, learningRows[0]!, start + 49.32);
    revealAndFocusRow(timeline, learningRows, 1, start + 49.50);

    settleRow(timeline, learningRows[1]!, start + 69.82);
    revealAndFocusRow(timeline, learningRows, 2, start + 70.00);

    settleRow(timeline, learningRows[2]!, start + 80.82);
    revealAndFocusRow(timeline, learningRows, 3, start + 81.00);

    settleRow(timeline, learningRows[3]!, start + 101.32);
    revealAndFocusRow(timeline, learningRows, 4, start + 101.50);

    // Final recap: the five approaches are all visible as peers.
    learningRows.forEach((row, index) => {
      timeline.animate(row.all).at(start + 116.00 + index * 0.025)
        .duration(0.40).fadeTo(1);
      timeline.animate(row.panel).at(start + 116.00 + index * 0.025)
        .duration(0.40).setColor(NORMAL_ML_CARD);
      timeline.animate(row.panel).at(start + 116.00 + index * 0.025)
        .duration(0.40).setStyle({ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.20))" });
      timeline.animate(row.label).at(start + 116.10 + index * 0.05)
        .duration(0.45).to({ color: COLOR.ink });
    });

    this.play(timeline);
    // Hold the completed learning-types frame through the closing narration.
    this.wait(13.2);
    this.captureScreenshotsNamed([
      [start + 1.50, "part-04-separate-circles"],
      [start + 2.99, "part-04-first-collision"],
      [start + 5.55, "part-04-overlap"],
      [start + 18.50, "part-04-ml-vs-data-science"],
      [start + 35.00, "part-04-supervised"],
      [start + 53.00, "part-04-unsupervised"],
      [start + 73.00, "part-04-semi-supervised"],
      [start + 85.00, "part-04-reinforcement"],
      [start + 105.00, "part-04-self-supervised"],
      [start + 117.00, "part-04-learning-types-recap"],
      [start + 127.00, "part-04-final-hold"],
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
  z = 0.28,
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

function addBottomStatement(
  scene: Scene,
  at: Vec2,
  firstLine: string,
  secondLine: string,
  color: string,
): Tattva[] {
  const [x, y] = at;
  const panel = scene.add(
    Rectangle().size([5.80, 1.05]).cornerRadius(0.23)
      .fill(color === COLOR.ml ? SOLID.ml : DATA_SCIENCE_CARD)
      .css({ borderStyle: "none", filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.22))" }),
    { at: [x, y, 0.25] },
  );
  const first = addText(scene, firstLine, [x, y + 0.20], 0.18, COLOR.ink, 900, 0.30);
  const second = addText(scene, `→  ${secondLine}`, [x, y - 0.22], 0.22, COLOR.ink, 900, 0.30);
  return [panel, first, second];
}

function addLearningRow(scene: Scene, at: Vec2, text: string): LearningRow {
  const panel = scene.add(
    Rectangle().size([5.80, 0.78]).cornerRadius(0.24)
      .fill(NORMAL_ML_CARD)
      .css({ borderStyle: "none", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.20))" }),
    { at: [at[0], at[1], 0.32] },
  );
  const label = addText(scene, text, at, 0.24, COLOR.ink, 900, 0.36);
  return { all: [panel, label], panel, label };
}

function revealAndFocusRow(
  timeline: Timeline,
  rows: readonly LearningRow[],
  index: number,
  at: number,
): void {
  const row = rows[index]!;
  timeline.animate(row.all).at(at).stagger(0.05).duration(0.52).ease("inOutCubic").appear();
  timeline.animate(row.panel).at(at + 0.14).duration(0.62).ease("inOutCubic").setColor(COLOR.ml);
  timeline.animate(row.panel).at(at + 0.40).duration(0.01)
    .setStyle({ filter: "drop-shadow(0 0 24px rgba(87,227,161,0.48))" });
  timeline.animate(row.panel).at(at + 0.18).duration(0.54).ease("inOutCubic").scaleTo(1.035);
  timeline.animate(row.label).at(at + 0.14).duration(0.58).ease("inOutCubic").to({ color: ACTIVE_ML_TEXT });
  timeline.animate(row.panel).at(at + 0.78).duration(0.40).ease("inOutCubic").scaleTo(1);
}

function settleRow(timeline: Timeline, row: LearningRow, at: number): void {
  timeline.animate(row.all).at(at).duration(0.68).ease("inOutCubic").fadeTo(1);
  timeline.animate(row.panel).at(at).duration(0.68).ease("inOutCubic").setColor(NORMAL_ML_CARD);
  timeline.animate(row.panel).at(at + 0.28).duration(0.01)
    .setStyle({ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.20))" });
  timeline.animate(row.label).at(at).duration(0.68).ease("inOutCubic").to({ color: COLOR.ink });
}

function move(
  timeline: Timeline,
  item: Tattva,
  to: Vec2,
  at: number,
  duration: number,
  ease: "inCubic" | "outCubic" | "outBack" | "inOutCubic",
): void {
  timeline.animate(item).at(at).duration(duration).ease(ease)
    .moveTo([to[0], to[1], item.initialState.z]);
}

function hide(items: readonly Tattva[]): void {
  items.forEach((item) => item.opacity(0));
}

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  const inheritedPhase = 1.49;
  scene.updater((time, states) => {
    const motionTime = inheritedPhase + time;
    motion.update(motionTime % motion.duration, states);
  });
}

await renderScene(
  import.meta.url,
  DataScienceAndLearningTypesScene,
  "04-data-science-and-learning-types.mp4",
);
