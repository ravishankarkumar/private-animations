import type { Scene, Tattva, Vec2 } from "veena/core";
import { Arrow, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { CATEGORY, COLOR } from "./theme.ts";

const FILL = {
  ai: CATEGORY.ai.fill,
  ml: CATEGORY.ml.fill,
  dl: CATEGORY.dl.fill,
  genai: CATEGORY.genai.fill,
  overlap: "#35194F",
  foundation: CATEGORY.foundation.fill,
  dataScience: CATEGORY.dataScience.fill,
  dataScienceOverlap: "#123744",
  warning: "#3B2026",
} as const;

export interface MapGroup {
  all: Tattva[];
  center: Vec2;
}

export interface FinalConceptMap {
  all: Tattva[];
  ai: MapGroup;
  ml: MapGroup;
  dl: MapGroup;
  genai: MapGroup;
  foundation: MapGroup;
  dataScience: MapGroup;
  flagged: MapGroup;
  spam: MapGroup;
  dog: MapGroup;
  reply: MapGroup;
  correctionChip: MapGroup;
  generation: MapGroup;
}

interface FinalConceptMapOptions {
  corrected?: boolean;
  dataScienceVisible?: boolean;
}

export function addFinalConceptMap(
  scene: Scene,
  options: FinalConceptMapOptions = {},
): FinalConceptMap {
  const corrected = options.corrected ?? false;
  const showDataScience = options.dataScienceVisible ?? false;

  const aiRegion = scene.add(
    Rectangle().size([13.60, 7.55]).cornerRadius(0.38).fill(FILL.ai).css({ borderStyle: "none" }),
    { at: [16, 0, 0.10] },
  );
  const aiLabel = mapText(scene, "ARTIFICIAL INTELLIGENCE", [16, 3.27], 0.31, COLOR.ink, 950, 0.48);
  const ai: MapGroup = { all: [aiRegion, aiLabel], center: [16, 0] };

  const mlRegion = scene.add(
    Rectangle().size([7.40, 4.75]).cornerRadius(0.34).fill(FILL.ml).css({ borderStyle: "none" }),
    { at: [18.05, -0.42, 0.20] },
  );
  const mlLabel = mapText(scene, "MACHINE LEARNING", [15.65, 1.48], 0.25, COLOR.ink, 950, 0.48);
  const ml: MapGroup = { all: [mlRegion, mlLabel], center: [18.05, -0.42] };

  const dlRegion = scene.add(
    Rectangle().size([4.40, 2.60]).cornerRadius(0.30).fill(FILL.dl).css({ borderStyle: "none" }),
    { at: [18.75, 0.15, 0.30] },
  );
  const dlLabel = mapText(scene, "DEEP LEARNING", [18.70, 0.98], 0.22, COLOR.ink, 950, 0.48);
  const dl: MapGroup = { all: [dlRegion, dlLabel], center: [18.75, 0.15] };

  const genAiRegion = scene.add(
    Rectangle().size([4.15, 1.65]).cornerRadius(0.29).fill(FILL.genai).css({ borderStyle: "none" }),
    { at: [20.55, -1.35, 0.36] },
  );
  const overlapRegion = scene.add(
    Rectangle().size([2.25, 1.10]).cornerRadius(0.25).fill(FILL.overlap).css({ borderStyle: "none" }),
    { at: [19.55, -0.75, 0.38] },
  );
  const genAiLabel = mapText(scene, "GENERATIVE AI", [21.20, -0.85], 0.18, COLOR.ink, 950, 0.50);
  const genai: MapGroup = { all: [genAiRegion, overlapRegion, genAiLabel], center: [20.55, -1.35] };

  const flagged = mapCard(scene, [12.15, -0.40], FILL.ai, "FLAGGED", "Rules · no learning");
  const spam = mapCard(scene, [15.75, -0.65], FILL.ml, "SPAM 96%", "Learned score");
  const dog = mapCard(scene, [17.55, 0.15], FILL.dl, "DOG 98%", "Deep network", 1.92);
  const reply = mapCard(
    scene,
    [20.88, -1.58],
    FILL.genai,
    "DRAFT REPLY",
    corrected ? "Tuesday · verified" : "Generated output",
  );

  const foundation = mapCard(
    scene,
    [19.55, 0.05],
    FILL.foundation,
    "FOUNDATION MODEL",
    "LLM · shared base",
    1.86,
    0.76,
    0.135,
  );
  const generationArrow = scene.add(
    Arrow().from([20.18, -0.37]).to([20.63, -1.02]).stroke({ color: COLOR.foundation, width: 0.04 }),
  );
  const generationLabel = mapText(scene, "GENERATES", [20.77, -0.58], 0.10, COLOR.foundation, 900, 0.63);
  const generation: MapGroup = { all: [generationArrow, generationLabel], center: [20.48, -0.67] };

  // Data Science is a solid composite: slate outside the ML region and a
  // dark-cyan inset where it overlaps ML. A narrow background gutter keeps
  // the crossing legible without implying transparency.
  const dataScienceBody = scene.add(
    Rectangle().size([4.30, 2.20]).cornerRadius(0.30).fill(FILL.dataScience).css({ borderStyle: "none" }),
    { at: [11.25, -2.00, 0.18] },
  );
  const dataScienceOverlap = scene.add(
    Rectangle().size([1.80, 1.92]).cornerRadius(0.25).fill(FILL.dataScienceOverlap).css({ borderStyle: "none" }),
    { at: [14.05, -1.90, 0.28] },
  );
  const dataScienceLabel = mapText(scene, "DATA SCIENCE", [11.12, -1.78], 0.20, COLOR.ink, 950, 0.50);
  const dataScienceDetail = mapText(scene, "UNDERSTAND · DECIDE", [11.18, -2.30], 0.11, "rgba(248,250,252,0.82)", 760, 0.50);
  const dataScience: MapGroup = {
    all: [dataScienceBody, dataScienceOverlap, dataScienceLabel, dataScienceDetail],
    center: [12.00, -1.95],
  };
  if (!showDataScience) hideMapGroup(dataScience);

  const correctionChip = mapPill(
    scene,
    corrected ? "WED → TUE ✓" : "TUE → WED",
    [21.85, 2.95],
    FILL.warning,
    2.25,
    corrected ? COLOR.ml : COLOR.warning,
  );

  return {
    all: [
      ...ai.all,
      ...ml.all,
      ...dl.all,
      ...genai.all,
      ...flagged.all,
      ...spam.all,
      ...dog.all,
      ...reply.all,
      ...foundation.all,
      ...generation.all,
      ...dataScience.all,
      ...correctionChip.all,
    ],
    ai,
    ml,
    dl,
    genai,
    foundation,
    dataScience,
    flagged,
    spam,
    dog,
    reply,
    correctionChip,
    generation,
  };
}

export function hideMapGroup(group: MapGroup): void {
  group.all.forEach((item) => item.opacity(0));
}

function mapCard(
  scene: Scene,
  at: Vec2,
  fill: string,
  title: string,
  detail: string,
  width = 2.18,
  height = 0.78,
  titleHeight = 0.17,
): MapGroup {
  const panel = scene.add(
    Rectangle().size([width, height]).cornerRadius(0.18).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 7px 12px rgba(0,0,0,0.25))" }),
    { at: [at[0], at[1], 0.55] },
  );
  const heading = mapText(scene, title, [at[0], at[1] + 0.11], titleHeight, COLOR.ink, 950, 0.58);
  const subtitle = mapText(scene, detail, [at[0], at[1] - 0.17], 0.10, "rgba(248,250,252,0.76)", 680, 0.58);
  return { all: [panel, heading, subtitle], center: at };
}

function mapPill(
  scene: Scene,
  text: string,
  at: Vec2,
  fill: string,
  width: number,
  ink: string,
): MapGroup {
  const panel = scene.add(
    Rectangle().size([width, 0.58]).cornerRadius(0.25).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.62] },
  );
  const label = mapText(scene, text, at, 0.15, ink, 900, 0.66);
  return { all: [panel, label], center: at };
}

function mapText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  color: string,
  weight: number,
  z: number,
): Tattva {
  return scene.add(
    Label(text).height(height).color(color).css({ fontWeight: weight, letterSpacing: "0.035em" }),
    { at: [at[0], at[1], z] },
  );
}
