import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Arrow, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { addFinalConceptMap } from "../lib/final-concept-map.ts";
import { addOpenEmailView } from "../lib/open-email.ts";
import { renderScene } from "../lib/render.ts";
import { COLOR, FRAME } from "../lib/theme.ts";

const FILL = {
  ai: "#17647D",
  ml: "#1E7A55",
  dl: "#53368A",
  genai: "#C4485C",
  foundation: "#9A5A20",
  dataScience: "#677585",
  panel: "#11192C",
  panelSoft: "#172238",
  neutral: "#243654",
  verified: "#173C32",
} as const;

interface VisualGroup {
  all: Tattva[];
  center: Vec2;
}

class SummaryScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    this.camera.position([16, 0, 8]).lookAt([16, 0, 0]).zoom(1);

    const map = addFinalConceptMap(this, { corrected: true, dataScienceVisible: false });
    const recapTitle = addPill(this, "PUTTING EVERYTHING TOGETHER", [16, 3.75], FILL.panel, 7.10, COLOR.ink, 0.22);
    hide(recapTitle.all);

    const takeawaySpecs: Array<[string, string, string]> = [
      ["ARTIFICIAL INTELLIGENCE", "BROAD GOAL · LEARNING OPTIONAL", FILL.ai],
      ["MACHINE LEARNING", "LEARNS PATTERNS FROM EXAMPLES", FILL.ml],
      ["DEEP LEARNING", "NEURAL NETWORKS WITH MANY LAYERS", FILL.dl],
      ["GENERATIVE AI", "CREATES NEW OUTPUT", FILL.genai],
      ["FOUNDATION MODEL", "ONE SHARED BASE · MANY JOBS", FILL.foundation],
      ["LLM", "LANGUAGE · ONE TOKEN AT A TIME", FILL.foundation],
      ["APPLICATION", "MODELS + RULES + TOOLS + SAFETY", FILL.neutral],
      ["DATA SCIENCE", "UNDERSTAND DATA · GUIDE DECISIONS", FILL.dataScience],
    ];
    const takeaways = takeawaySpecs.map(([title, detail, fill]) => (
      addTakeaway(this, [16, -3.73], title, detail, fill)
    ));
    takeaways.forEach((takeaway) => hide(takeaway.all));

    // A temporary application frame answers a different question from the taxonomy.
    const applicationFrame = this.add(
      Rectangle().size([4.85, 3.70]).cornerRadius(0.30).fill("rgba(17,25,44,0.94)")
        .stroke({ color: COLOR.ai, width: 0.04 }).css({ borderStyle: "none" }),
      { at: [19.10, 0.05, 0.72] },
    ).opacity(0);
    const applicationTitle = addText(this, "AI APPLICATION", [19.10, 1.48], 0.20, COLOR.ai, 950, 0.76).opacity(0);
    const applicationModel = addCard(
      this, [19.10, 0.55], [3.65, 0.82], FILL.foundation,
      "MODEL", "One component", COLOR.foundation, 0.78,
    );
    const applicationParts = [
      addPill(this, "RULES", [17.85, -0.45], FILL.neutral, 1.35, COLOR.ink, 0.11),
      addPill(this, "TOOLS", [19.10, -0.45], FILL.neutral, 1.35, COLOR.ink, 0.11),
      addPill(this, "SAFETY", [20.35, -0.45], FILL.neutral, 1.35, COLOR.ink, 0.11),
    ];
    const applicationStage = [
      applicationFrame, applicationTitle, ...applicationModel.all,
      ...applicationParts.flatMap((part) => part.all),
    ];
    hide(applicationStage.filter((item) => item !== applicationFrame && item !== applicationTitle));

    const relationshipBanner = addPill(
      this, "AI  ⊃  MACHINE LEARNING  ⊃  DEEP LEARNING",
      [16, 3.75], FILL.panel, 9.10, COLOR.ink, 0.20,
    );
    const overlapBanner = addPill(
      this, "GENERATIVE AI OVERLAPS DEEP LEARNING",
      [16, -3.72], FILL.genai, 8.10, COLOR.ink, 0.18,
    );
    hide([...relationshipBanner.all, ...overlapBanner.all]);

    // Main email recap screen.
    const email = addOpenEmailView(this, { at: [0, 0.05], scale: 0.58 });
    const correctedReply = addCard(
      this, [0, -1.335], [5.86, 0.80], FILL.verified,
      "AI DRAFT · VERIFIED", "See you Tuesday at 10:00.", COLOR.ml,
    );
    const correctedChip = addPill(this, "WED → TUE ✓", [2.35, -1.02], FILL.verified, 1.90, COLOR.ml, 0.12);
    const resultCards = [
      addCard(this, [-5.55, 2.25], [3.25, 1.15], FILL.ai, "FLAGGED", "Rule-based AI", COLOR.ai),
      addCard(this, [5.55, 2.25], [3.25, 1.15], FILL.ml, "SPAM 96%", "Machine Learning", COLOR.ml),
      addCard(this, [-5.55, -2.30], [3.25, 1.15], FILL.dl, "DOG 98%", "Deep Learning", COLOR.dl),
      addCard(this, [5.55, -2.30], [3.25, 1.15], FILL.genai, "DRAFT REPLY", "Generative AI", COLOR.genai),
    ];
    const resultArrows = [
      this.add(Arrow().from([-3.75, 2.02]).to([-3.15, 1.25]).stroke({ color: COLOR.ai, width: 0.04 })),
      this.add(Arrow().from([3.75, 2.02]).to([3.15, 1.25]).stroke({ color: COLOR.ml, width: 0.04 })),
      this.add(Arrow().from([-3.75, -2.10]).to([-3.15, -1.15]).stroke({ color: COLOR.dl, width: 0.04 })),
      this.add(Arrow().from([3.75, -2.10]).to([3.15, -1.15]).stroke({ color: COLOR.genai, width: 0.04 })),
    ];
    const resultsHeadline = addPill(this, "FOUR RESULTS · ONE EMAIL · DIFFERENT MECHANISMS", [0, 3.78], FILL.panel, 10.20, COLOR.ink, 0.20);
    const systemsNote = addPill(
      this, "SEPARATE SYSTEMS — OR ONE SHARED MODEL INSIDE A LARGER APPLICATION",
      [0, -3.78], FILL.foundation, 12.25, COLOR.ink, 0.15,
    );
    const emailStage = [
      ...email.all, ...correctedReply.all, ...correctedChip.all,
      ...resultCards.flatMap((card) => card.all), ...resultArrows,
      ...resultsHeadline.all, ...systemsNote.all,
    ];
    hide(emailStage);

    const verificationReminder = addTakeaway(
      this, [16, -3.73], "FLUENT DOES NOT MEAN VERIFIED", "CHECK THE CLAIM AGAINST THE SOURCE", FILL.verified,
    );
    hide(verificationReminder.all);

    // Closing prompt on the upper screen.
    const subscribe = addCard(
      this, [0, 11.65], [11.20, 1.55], FILL.ai,
      "SUBSCRIBE FOR MORE VISUAL BREAKDOWNS", "AI · SOFTWARE · TECHNOLOGY", COLOR.ink,
    );
    const nextTitle = addText(this, "WHAT SHOULD WE OPEN NEXT?", [0, 9.95], 0.36, COLOR.ink, 950).opacity(0);
    const nextCards = [
      addCard(this, [-4.55, 8.15], [3.75, 1.75], FILL.foundation, "MODEL TRAINING", "How learning happens", COLOR.foundation),
      addCard(this, [0, 8.15], [3.75, 1.75], FILL.dl, "NEURAL NETWORKS", "Inside the layers", COLOR.dl),
      addCard(this, [4.55, 8.15], [3.75, 1.75], FILL.genai, "THE MODEL THAT WRITES", "Tokens into text", COLOR.genai),
    ];
    hide([...subscribe.all, ...nextCards.flatMap((card) => card.all)]);

    addKavriqBrand(this);
    const timeline = new Timeline();

    timeline.animate(recapTitle.all).at(0.40).stagger(0.04).duration(0.42).appear();

    const conceptGroups = [map.ai, map.ml, map.dl, map.genai, map.foundation, map.foundation];
    const startTimes = [1.25, 6.65, 12.10, 17.55, 23.00, 28.45];
    conceptGroups.forEach((group, index) => {
      const start = startTimes[index]!;
      if (index > 0) timeline.animate(takeaways[index - 1]!.all).at(start - 0.28).duration(0.28).fadeTo(0);
      timeline.animate(takeaways[index]!.all).at(start).stagger(0.04).duration(0.38).appear();
      pulseScale(timeline, group.all, start + 0.55, 0.55, 1.045);
    });
    pulseScale(timeline, map.flagged.all, 3.40, 0.46, 1.05);
    pulseScale(timeline, map.spam.all, 8.95, 0.46, 1.05);
    pulseScale(timeline, map.dog.all, 14.35, 0.46, 1.05);
    pulseScale(timeline, map.reply.all, 19.85, 0.46, 1.05);
    pulseScale(timeline, map.generation.all, 25.35, 0.46, 1.05);

    // The application is drawn around a model briefly, not added as a taxonomy region.
    timeline.animate(takeaways[5]!.all).at(33.55).duration(0.28).fadeTo(0);
    timeline.animate(takeaways[6]!.all).at(33.65).stagger(0.04).duration(0.38).appear();
    timeline.animate(applicationStage).at(34.05).stagger(0.05).duration(0.42).appear();
    pulseScale(timeline, applicationModel.all, 35.10, 0.50, 1.045);
    pulseScale(timeline, applicationParts.flatMap((part) => part.all), 36.00, 0.50, 1.035);
    timeline.animate(applicationStage).at(38.55).stagger(0.001).duration(0.38).fadeTo(0);

    // Data Science enters only when named, as an overlap rather than a child of AI.
    timeline.animate(takeaways[6]!.all).at(38.55).duration(0.28).fadeTo(0);
    timeline.animate(map.dataScience.all).at(39.00).stagger(0.05).duration(0.46).appear();
    timeline.animate(takeaways[7]!.all).at(39.15).stagger(0.04).duration(0.40).appear();
    pulseScale(timeline, map.dataScience.all, 40.20, 0.58, 1.04);

    timeline.animate(takeaways[7]!.all).at(44.60).duration(0.30).fadeTo(0);
    timeline.animate(recapTitle.all).at(44.60).duration(0.30).fadeTo(0);
    timeline.animate(relationshipBanner.all).at(44.90).stagger(0.04).duration(0.40).appear();
    pulseScale(timeline, map.ai.all, 45.55, 0.48, 1.025);
    pulseScale(timeline, map.ml.all, 46.20, 0.48, 1.035);
    pulseScale(timeline, map.dl.all, 46.85, 0.48, 1.045);
    timeline.animate(overlapBanner.all).at(47.55).stagger(0.04).duration(0.40).appear();
    pulseScale(timeline, [...map.dl.all, ...map.genai.all], 48.35, 0.56, 1.035);
    pulseScale(timeline, map.dataScience.all, 49.35, 0.54, 1.035);
    pulseScale(timeline, map.foundation.all, 51.00, 0.52, 1.05);
    pulseScale(timeline, map.generation.all, 51.60, 0.48, 1.06);
    pulseScale(timeline, map.reply.all, 52.20, 0.48, 1.05);

    // Return to the concrete email for the four-result recap.
    timeline.animate([...relationshipBanner.all, ...overlapBanner.all]).at(54.40).duration(0.34).fadeTo(0);
    moveCamera(timeline, this.camera, [0, 0], 54.35);
    timeline.animate(emailStage).at(57.15).stagger(0.025).duration(0.48).appear();
    resultCards.forEach((card, index) => {
      pulseScale(timeline, card.all, 58.55 + index * 0.55, 0.42, 1.045);
    });
    pulseScale(timeline, systemsNote.all, 62.20, 0.50, 1.025);
    pulseScale(timeline, [...correctedReply.all, ...correctedChip.all], 65.40, 0.52, 1.045);

    timeline.animate(emailStage).at(68.00).stagger(0.001).duration(0.38).fadeTo(0);
    moveCamera(timeline, this.camera, [16, 0], 68.00);
    timeline.animate(verificationReminder.all).at(70.75).stagger(0.04).duration(0.40).appear();
    pulseScale(timeline, map.correctionChip.all, 71.35, 0.56, 1.07);
    pulseScale(timeline, verificationReminder.all, 72.05, 0.50, 1.035);
    timeline.animate(verificationReminder.all).at(75.25).duration(0.34).fadeTo(0);

    moveCamera(timeline, this.camera, [0, 9], 75.20);
    timeline.animate(subscribe.all).at(78.00).stagger(0.05).duration(0.44).appear();
    timeline.animate(nextTitle).at(79.00).duration(0).appear();
    timeline.animate(nextTitle).at(79.00).duration(0.58).typewrite();
    nextCards.forEach((card, index) => {
      timeline.animate(card.all).at(79.85 + index * 0.38).stagger(0.04).duration(0.40).appear();
      pulseScale(timeline, card.all, 81.45 + index * 0.62, 0.44, 1.035);
    });

    this.play(timeline);
    this.wait(4.0);
    this.captureScreenshotsNamed([
      [2.90, "part-09-ai"],
      [9.10, "part-09-machine-learning"],
      [14.55, "part-09-deep-learning"],
      [20.05, "part-09-generative-ai"],
      [25.55, "part-09-foundation-model"],
      [30.85, "part-09-llm"],
      [35.85, "part-09-application"],
      [40.45, "part-09-data-science"],
      [49.10, "part-09-final-relationships"],
      [60.30, "part-09-four-results"],
      [65.65, "part-09-verified-email"],
      [72.20, "part-09-fluent-not-verified"],
      [82.90, "part-09-subscribe-and-next"],
    ]);
  }
}

function addTakeaway(scene: Scene, at: Vec2, title: string, detail: string, fill: string): VisualGroup {
  const panel = scene.add(
    Rectangle().size([9.80, 0.95]).cornerRadius(0.27).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 9px 16px rgba(0,0,0,0.24))" }),
    { at: [at[0], at[1], 0.82] },
  );
  const heading = addText(scene, title, [at[0] - 2.35, at[1]], 0.17, COLOR.ink, 950, 0.86);
  const meaning = addText(scene, detail, [at[0] + 1.55, at[1]], 0.14, COLOR.ink, 760, 0.86);
  return { all: [panel, heading, meaning], center: at };
}

function addCard(
  scene: Scene,
  at: Vec2,
  size: Vec2,
  fill: string,
  title: string,
  detail: string,
  accent: string,
  z = 0.42,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size(size).cornerRadius(0.25).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.22))" }),
    { at: [at[0], at[1], z] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 0.25], 0.18, accent, 950, z + 0.08);
  const subtitle = addText(scene, detail, [at[0], at[1] - 0.25], 0.14, COLOR.ink, 700, z + 0.08);
  return { all: [panel, heading, subtitle], center: at };
}

function addPill(
  scene: Scene,
  text: string,
  at: Vec2,
  fill: string,
  width: number,
  ink: string,
  textHeight = 0.16,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([width, 0.62]).cornerRadius(0.27).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.88] },
  );
  const label = addText(scene, text, at, textHeight, ink, 900, 0.92);
  return { all: [panel, label], center: at };
}

function addText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  color: string,
  weight: number,
  z = 0.34,
): Tattva {
  return scene.add(
    Label(text).height(height).color(color).css({ fontWeight: weight, letterSpacing: "0.035em" }),
    { at: [at[0], at[1], z] },
  );
}

function moveCamera(timeline: Timeline, camera: Scene["camera"], target: Vec2, at: number): void {
  const midpoint: Vec2 = target[0] === 16 ? [8, target[1]] : [0, 4.5];
  timeline.animateCamera(camera).at(at).duration(1.45).ease("inOutCubic")
    .frameTo([midpoint[0], midpoint[1], 8], [midpoint[0], midpoint[1], 0]);
  timeline.animateCamera(camera).at(at).duration(1.45).ease("inOutCubic").zoomTo(0.50);
  timeline.animateCamera(camera).at(at + 1.45).duration(1.35).ease("inOutCubic")
    .frameTo([target[0], target[1], 8], [target[0], target[1], 0]);
  timeline.animateCamera(camera).at(at + 1.45).duration(1.35).ease("inOutCubic").zoomTo(1);
}

function pulseScale(timeline: Timeline, items: readonly Tattva[], at: number, duration: number, scale: number): void {
  const half = duration / 2;
  timeline.animate(items).at(at).duration(half).ease("outCubic").scaleTo(scale);
  timeline.animate(items).at(at + half).duration(half).ease("inOutCubic").scaleTo(1);
}

function hide(items: readonly Tattva[]): void {
  items.forEach((item) => item.opacity(0));
}

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  const inheritedPhase = 5.82;
  scene.updater((time, states) => {
    motion.update((inheritedPhase + time) % motion.duration, states);
  });
}

await renderScene(
  decodeURIComponent(new URL(import.meta.url).pathname),
  SummaryScene,
  "09-summary.mp4",
);
