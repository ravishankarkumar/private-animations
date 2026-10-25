import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Arrow, Circle, Line, Rectangle, ShapeMorph, worldPath } from "veena/primitives";
import { LetterScroll } from "veena/storytelling";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { CATEGORY, COLOR, FRAME } from "./lib/theme.ts";

/**
 * Segment 2 preview timing
 * ------------------------
 * These cues are intentionally collected in one place. Once the recorded
 * narration is available, only these values need to be retimed.
 *
 * The live-camera footage is composited above LIVE_CAMERA_START..END. Veena
 * holds one completely static frame underneath that interval.
 */
const LIVE_CAMERA_START = 23;
const LIVE_CAMERA_END = 58;
const CAMERA_HOLD_DURATION = LIVE_CAMERA_END - LIVE_CAMERA_START;

const CUE = {
  focusFlagged: 0.55,
  duplicateFlagged: 1.45,
  showAdjacentScreen: 2.15,
  enterAdjacentScreen: 3.35,
  rules: 4.55,
  openScroll: 5.10,
  unknownSender: 7.10,
  urgentWording: 9.15,
  confirmationLink: 11.20,
  eliza: 13.35,
  timeline: 14.30,
  highlightEliza: 16.85,
  highlightSixties: 18.05,
  returnFromCamera: LIVE_CAMERA_END,
  end: 67.5,
} as const;

const EMAIL_SCALE = 0.82;
const EMAIL_CARD_W = 11.42 * EMAIL_SCALE;
const EMAIL_CARD_H = 6.72 * EMAIL_SCALE;
const CARD_W = 2.62;
const CARD_H = 0.94;
const CARD_X = EMAIL_CARD_W / 2 + 0.30 + CARD_W / 2;
const CARD_Y = EMAIL_CARD_H / 2 + 0.22 + CARD_H / 2;
const MAIN_SCREEN_CENTER: Vec2 = [0, 0];
const DIAGRAM_SCREEN_CENTER: Vec2 = [16, 0];
const FOCUS_CARD_CENTER: Vec2 = [16, 3.52];
const SMALL_BALL_RADIUS = 0.58;
// Final AI circle matches Segment 3. Radius 4.20 leaves equal radial steps
// for Machine Learning, Deep Learning, and Generative AI (5:4:3:2). The
// centre sits just below the frame centre so later circles can share this
// bottom, with only a thin gap, as in the desktop Venn.
const LARGE_AI_RADIUS = 4.20;
const LARGE_AI_BOTTOM = -4.25;
const LARGE_AI_CENTER_Y = LARGE_AI_BOTTOM + LARGE_AI_RADIUS;
const LARGE_ML_RADIUS = (LARGE_AI_RADIUS * 4) / 5;
const LARGE_ML_CENTER_Y = LARGE_AI_BOTTOM + 0.07 + LARGE_ML_RADIUS;
const LARGE_AI_LABEL_Y = (
  LARGE_AI_CENTER_Y + LARGE_AI_RADIUS + LARGE_ML_CENTER_Y + LARGE_ML_RADIUS
) / 2;
const LARGE_AI_SCALE = LARGE_AI_RADIUS / SMALL_BALL_RADIUS;
const BALL_START_Y = -0.35;
const FLOOR_Y = -3.70;
const BALL_REST_Y = FLOOR_Y + SMALL_BALL_RADIUS;
const GRAVITY = 9.8;
const RESTITUTION = 0.58;
const REST_VELOCITY = 0.34;

interface ResultCard {
  all: Tattva[];
  panel: Tattva;
  title: Tattva;
  detail: Tattva;
  center: Vec2;
}

interface FocusCard {
  all: Tattva[];
  entry: Tattva[];
  panel: Tattva;
  flaggedTitle: Tattva;
  rulesTitle: Tattva;
  flaggedDetail: Tattva;
  rulesDetail: Tattva;
  longAiTitle: Tattva;
  aiTitle: Tattva;
  center: Vec2;
}

interface ChecklistLine {
  all: Tattva[];
  skeleton: Tattva[];
  box: Tattva;
  check: Tattva;
  label: Tattva;
}

interface Milestone {
  all: Tattva[];
  dot: Tattva;
  year: Tattva;
  label: Tattva;
}

export class RuleBasedAiScene extends Scene {
  constructor() {
    super({
      width: FRAME.width,
      height: FRAME.height,
      background: COLOR.background,
    });
  }

  override construct(): void {
    // Reconstruct the important pieces of Segment 1's final composition. The
    // same email scale, card dimensions, positions, and semantic colours are
    // used so the cut does not feel like a new layout.
    const email = addOpenEmailView(this, { at: MAIN_SCREEN_CENTER, scale: EMAIL_SCALE });
    const positions = {
      flagged: [-CARD_X, CARD_Y] as Vec2,
      spam: [CARD_X, CARD_Y] as Vec2,
      dog: [-CARD_X, -CARD_Y] as Vec2,
      draft: [CARD_X, -CARD_Y] as Vec2,
    };

    const flagged = addResultCard(this, {
      at: positions.flagged,
      fill: CATEGORY.ai.fill,
      title: "FLAGGED",
      detail: "SUSPICIOUS",
    });
    const spam = addResultCard(this, {
      at: positions.spam,
      fill: CATEGORY.ml.fill,
      title: "SPAM",
      detail: "CLASSIFIED",
    });
    const dog = addResultCard(this, {
      at: positions.dog,
      fill: CATEGORY.dl.fill,
      title: "DOG DETECTED",
      detail: "ATTACHMENT",
    });
    const draft = addResultCard(this, {
      at: positions.draft,
      fill: CATEGORY.genai.fill,
      title: "DRAFT REPLY",
      detail: "GENERATED RESPONSE",
    });

    const flaggedConnectors = [
      addArrow(this, [-4.18, 1.94], [-CARD_X + CARD_W / 2, CARD_Y + 0.24], COLOR.ai),
      addArrow(this, [-4.04, 1.36], [-CARD_X + CARD_W / 2, CARD_Y], COLOR.ai),
      addArrow(this, [-3.57, -0.35], [-CARD_X + CARD_W / 2, CARD_Y - 0.24], COLOR.ai),
    ];
    const otherConnectors = [
      addArrow(this, [3.65, 1.94], [CARD_X - CARD_W / 2, CARD_Y], COLOR.ml),
      addArrow(this, [-3.25, -0.84], [-CARD_X + CARD_W / 2, -CARD_Y], COLOR.dl),
      addArrow(this, [3.15, -2.04], [CARD_X - CARD_W / 2, -CARD_Y], COLOR.genai),
    ];
    const journeyLegend = addJourneyLegend(this, [0, 4.08]);

    // This exact duplicate leaves the result layout and becomes the rule-based
    // explanation. The original FLAGGED card stays behind and dims.
    const focusCard = addFocusCard(this, positions.flagged);
    focusCard.all.forEach((item) => item.opacity(0));

    const scroll = this.add(
      LetterScroll({
        title: "CHECKLIST",
        body: "\u200B",
        signature: "\u200B",
        width: 6.30,
        height: 6.90,
        paperColor: "#E7D7B8",
        paperEdge: "#B69B72",
        inkColor: "#75634E",
        rollerColor: "#725033",
      }).roll(),
      { at: [16, -0.18, 0.12] },
    ).opacity(0);

    const checklist = [
      addChecklistLine(this, "Urgent wording", [16.00, 1.02], 2.15),
      addChecklistLine(this, "\u200B", [16.00, 0.48], 2.58),
      addChecklistLine(this, "\u200B", [16.00, -0.06], 1.88),
      addChecklistLine(this, "Unknown sender", [16.00, -0.60], 2.34),
      addChecklistLine(this, "\u200B", [16.00, -1.14], 2.50),
      addChecklistLine(this, "Confirmation link", [16.00, -1.68], 2.70),
    ];
    checklist.flatMap((line) => line.all).forEach((item) => item.opacity(0));

    // The authored line is the actual timeline baseline. After the camera
    // insert it bends into the large AI region through Veena's ShapeMorph.
    const timelineLine = Line()
      .from([-4.85, 0])
      .to([4.85, 0])
      .stroke({ color: COLOR.ai, width: 0.055 });
    const aiCircle = Circle()
      .radius(SMALL_BALL_RADIUS)
      .fill(CATEGORY.ai.fill)
      // Keep the Venn region visually solid: its edge and interior use one
      // colour rather than reading as a filled circle with a separate outline.
      .stroke({ color: CATEGORY.ai.fill, width: 0.010 });
    const aiRegion = this.add(
      ShapeMorph(timelineLine, aiCircle)
        .interpolation("uniform-bend", { side: "right", length: "fit" }),
      { at: [16, -0.35, 0.08] },
    ).opacity(0);

    const floor = this.add(
      Line().from([12.25, FLOOR_Y]).to([19.75, FLOOR_Y])
        .stroke({ color: "rgba(154,167,193,0.55)", width: 0.035 }),
    );
    floor.at([floor.initialState.x, floor.initialState.y, 0.06]).opacity(0);

    const milestones = [
      addMilestone(this, 11.20, "1956", "AI BECOMES\nA FIELD"),
      addMilestone(this, 13.10, "1959", "MACHINE\nLEARNING"),
      addMilestone(this, 14.85, "1966", "ELIZA"),
      addMilestone(this, 16.80, "1980s", "EXPERT SYSTEMS\nBOOM"),
      addMilestone(this, 18.90, "2012", "DEEP-LEARNING\nBREAKTHROUGH"),
      addMilestone(this, 20.85, "2022", "CHATGPT\nLAUNCHES"),
    ];
    milestones.flatMap((item) => item.all).forEach((item) => item.opacity(0));
    const eliza = milestones[2]!;
    // Sits behind the 1966 dot. indicate() only grows a caption 12% and
    // lightens it slightly, which does not read at this size.
    const elizaRing = this.add(
      Circle().radius(0.20).fill("transparent").stroke({ color: COLOR.ai, width: 0.055 }),
      { at: [eliza.dot.initialState.x, eliza.dot.initialState.y, 0.11] },
    ).opacity(0);

    addFrozenKavriqBrand(this, LIVE_CAMERA_START, LIVE_CAMERA_END);

    const timeline = new Timeline();

    // Focus the FLAGGED result without dimming the email itself.
    timeline.animate([spam.all, dog.all, draft.all].flat())
      .at(CUE.focusFlagged).duration(0.42).ease("outCubic").fadeTo(0.18);
    timeline.animate(otherConnectors)
      .at(CUE.focusFlagged).duration(0.42).ease("outCubic").fadeTo(0.16);
    timeline.animate(journeyLegend)
      .at(CUE.focusFlagged).duration(0.42).ease("outCubic").fadeTo(0.28);
    timeline.animate(flagged.panel)
      .at(CUE.focusFlagged).duration(0.24).ease("outCubic").scaleTo(1.07);
    timeline.animate(flagged.panel)
      .at(CUE.focusFlagged + 0.28).duration(0.24).ease("inOutCubic").scaleTo(1);

    // Materialize the copy at the same coordinates, then move it while the
    // camera reveals the adjacent 16:9 screen.
    timeline.animate(focusCard.entry)
      .at(CUE.duplicateFlagged).duration(0.12).appear();
    timeline.animate(flagged.all)
      .at(CUE.duplicateFlagged + 0.16).duration(0.34).ease("outCubic").fadeTo(0.20);
    timeline.animate(flaggedConnectors)
      .at(CUE.duplicateFlagged + 0.16).duration(0.34).ease("outCubic").fadeTo(0.24);

    moveGroupTo(
      timeline,
      focusCard.all,
      positions.flagged,
      FOCUS_CARD_CENTER,
      CUE.showAdjacentScreen,
      2.05,
    );
    timeline.animateCamera(this.camera)
      .at(CUE.showAdjacentScreen).duration(1.15).ease("inOutCubic")
      .frameTo([8, 0, 8], [8, 0, 0]);
    timeline.animateCamera(this.camera)
      .at(CUE.showAdjacentScreen).duration(1.15).ease("inOutCubic").zoomTo(0.5);
    timeline.animateCamera(this.camera)
      .at(CUE.enterAdjacentScreen).duration(1.30).ease("inOutCubic")
      .frameTo([16, 0, 8], [16, 0, 0]);
    timeline.animateCamera(this.camera)
      .at(CUE.enterAdjacentScreen).duration(1.30).ease("inOutCubic").zoomTo(1);

    // Rewrite the copied card while it travels. The outgoing words erase from
    // right to left; the replacement words write from left to right. Keeping
    // the panel itself intact makes this read as one card changing purpose,
    // rather than two labels being swapped.
    const unwriteAt = CUE.showAdjacentScreen + 0.96;
    const writeAt = unwriteAt + 0.38;
    timeline.animate(focusCard.flaggedTitle)
      .at(unwriteAt).duration(0.38).ease("inOutCubic").untypewrite();
    timeline.animate(focusCard.flaggedDetail)
      .at(unwriteAt + 0.04).duration(0.42).ease("inOutCubic").untypewrite();
    timeline.animate([focusCard.rulesTitle, focusCard.rulesDetail])
      .at(writeAt).duration(0).appear();
    timeline.animate(focusCard.rulesTitle)
      .at(writeAt).duration(0.48).ease("inOutCubic").typewrite();
    timeline.animate(focusCard.rulesDetail)
      .at(writeAt + 0.08).duration(0.62).ease("inOutCubic").typewrite();

    // The rewritten RULES card has arrived; now open its checklist.
    timeline.animate(scroll)
      .at(CUE.openScroll).duration(0.25).ease("outCubic").appear();
    timeline.animate(scroll)
      .at(CUE.openScroll + 0.12).duration(1.45).ease("inOutCubic")
      .to({ unrollProgress: 1 });

    // Reserve the final row geometry with six static social-feed-style
    // skeletons. Rules replace rows 4, 1, and 6, in that order, without
    // changing the parchment layout.
    const skeletonAt = CUE.openScroll + 1.28;
    checklist.forEach((line, index) => {
      const appearAt = skeletonAt + index * 0.07;
      timeline.animate(line.skeleton)
        .at(appearAt).stagger(0.035).duration(0.24).ease("outCubic").appear();
    });

    revealChecklistLine(timeline, checklist[3]!, CUE.unknownSender);
    revealChecklistLine(timeline, checklist[0]!, CUE.urgentWording);
    revealChecklistLine(timeline, checklist[5]!, CUE.confirmationLink);

    // Clear the checklist, roll the parchment closed, and only then remove
    // the compact scroll. This preserves the physical logic of the object.
    timeline.animate(checklist.flatMap((line) => line.all))
      .at(CUE.eliza).duration(0.22).ease("inCubic").fadeTo(0);
    timeline.animate(scroll)
      .at(CUE.eliza + 0.22).duration(0.58).ease("inOutCubic")
      .to({ unrollProgress: 0 });
    timeline.animate(scroll)
      .at(CUE.eliza + 0.82).duration(0.18).ease("inCubic").fadeTo(0);
    timeline.animate(focusCard.panel)
      .at(CUE.eliza).duration(0.45).ease("inCubic").fadeTo(0);
    timeline.animate([focusCard.rulesTitle, focusCard.rulesDetail])
      .at(CUE.eliza).duration(0.35).ease("inCubic").fadeTo(0);
    timeline.animate(focusCard.longAiTitle)
      .at(CUE.eliza + 0.24).duration(0.45).ease("outCubic").appear();
    timeline.animate(focusCard.longAiTitle)
      .at(CUE.eliza).duration(0.92).ease("inOutCubic")
      .moveTo([16, 3.55, 0.26]);

    timeline.animate(aiRegion)
      .at(CUE.timeline).duration(0.55).ease("outCubic").appear();
    milestones.forEach((milestone, index) => {
      const at = CUE.timeline + 0.40 + index * 0.34;
      timeline.animate(milestone.all)
        .at(at).stagger(0.035).duration(0.34).ease("outCubic").appear();
    });
    // Two narration beats on the same marker: first the name ELIZA, then the
    // 1966 date standing in for the spoken "1960s".
    const pulseElizaRing = (at: number): void => {
      timeline.animate(elizaRing).at(at).duration(0.12).ease("outCubic").fadeTo(1);
      timeline.animate(elizaRing).at(at).duration(0.55).ease("outCubic").scaleTo(1.85);
      timeline.animate(elizaRing).at(at + 0.22).duration(0.40).ease("inCubic").fadeTo(0);
      timeline.animate(elizaRing).at(at + 0.64).duration(0).scaleTo(1);
    };
    const pulseElizaDot = (at: number, scale: number): void => {
      timeline.animate(eliza.dot).at(at).duration(0.22).ease("outCubic").scaleTo(scale);
      timeline.animate(eliza.dot).at(at + 0.62).duration(0.24).ease("inOutCubic").scaleTo(1);
    };
    pulseElizaRing(CUE.highlightEliza);
    pulseElizaDot(CUE.highlightEliza, 2.25);
    timeline.animate(eliza.label)
      .at(CUE.highlightEliza).duration(0.22).ease("outCubic").scaleTo(2.35);
    timeline.animate(eliza.label)
      .at(CUE.highlightEliza).duration(0.22).ease("outCubic").setColor(COLOR.ai);
    timeline.animate(eliza.label)
      .at(CUE.highlightEliza).duration(0.22).ease("outCubic")
      .moveTo([
        eliza.label.initialState.x,
        eliza.label.initialState.y - 0.22,
        eliza.label.initialState.z,
      ]);
    timeline.animate(eliza.year)
      .at(CUE.highlightEliza).duration(0.22).ease("outCubic").scaleTo(1.28);
    timeline.animate(eliza.label)
      .at(CUE.highlightEliza + 0.68).duration(0.26).ease("inOutCubic").scaleTo(1);
    timeline.animate(eliza.label)
      .at(CUE.highlightEliza + 0.68).duration(0.26).ease("inOutCubic").setColor(COLOR.muted);
    timeline.animate(eliza.label)
      .at(CUE.highlightEliza + 0.68).duration(0.26).ease("inOutCubic")
      .moveTo([
        eliza.label.initialState.x,
        eliza.label.initialState.y,
        eliza.label.initialState.z,
      ]);
    timeline.animate(eliza.year)
      .at(CUE.highlightEliza + 0.68).duration(0.26).ease("inOutCubic").scaleTo(1);

    pulseElizaRing(CUE.highlightSixties);
    pulseElizaDot(CUE.highlightSixties, 2);
    timeline.animate(eliza.year)
      .at(CUE.highlightSixties).duration(0.22).ease("outCubic").scaleTo(1.55);
    timeline.animate(eliza.year)
      .at(CUE.highlightSixties).duration(0.22).ease("outCubic").setColor(COLOR.ai);
    timeline.animate(eliza.year)
      .at(CUE.highlightSixties + 0.64).duration(0.26).ease("inOutCubic").scaleTo(1);
    timeline.animate(eliza.year)
      .at(CUE.highlightSixties + 0.64).duration(0.26).ease("inOutCubic").setColor(COLOR.ink);

    // LIVE_CAMERA_START..END intentionally contains no scene motion. The
    // branding updater is frozen too, so the background remains pixel-stable
    // while the talking-head footage is placed above it in editing.

    const returnAt = CUE.returnFromCamera;
    timeline.animate(milestones.flatMap((milestone) => milestone.all))
      .at(returnAt).duration(0.48).ease("inCubic").fadeTo(0);
    timeline.animate(aiRegion)
      .at(returnAt + 0.42).duration(1.25).ease("inOutCubic").morphTo(1);
    timeline.animate(focusCard.longAiTitle)
      .at(returnAt + 0.42).duration(0.42).ease("inCubic").fadeTo(0);
    timeline.animate(focusCard.aiTitle)
      .at(returnAt + 0.72).duration(0.42).ease("outCubic").appear();
    timeline.animate(focusCard.aiTitle)
      .at(returnAt + 0.42).duration(1.25).ease("inOutCubic")
      .moveTo([16, 1.05, 0.26]);
    timeline.animate(floor)
      .at(returnAt + 0.86).duration(0.35).ease("outCubic").appear();

    // The ball now follows y = y0 - 1/2 gt². At each collision, its upward
    // velocity is multiplied by RESTITUTION. No authored pauses or arbitrary
    // easing curves occur between impacts.
    const fallAt = returnAt + 1.82;
    const fallDuration = bouncingBallDuration(
      BALL_START_Y,
      BALL_REST_Y,
      GRAVITY,
      RESTITUTION,
      REST_VELOCITY,
    );
    const settledAt = fallAt + fallDuration;
    this.addUpdater(aiRegion, ({ time, state }) => {
      if (time < fallAt || time > settledAt) return;
      state.y = bouncingBallY(
        time - fallAt,
        BALL_START_Y,
        BALL_REST_Y,
        GRAVITY,
        RESTITUTION,
        REST_VELOCITY,
      );
    }, { from: fallAt, until: settledAt });

    // Commit the physical resting state into the timeline. After a short
    // settled beat, the small ball grows into the diagram region and the AI
    // label visibly travels from outside to inside it.
    timeline.animate(aiRegion).at(settledAt).duration(0)
      .moveTo([16, BALL_REST_Y, 0.08]);
    const growAt = settledAt + 0.38;
    timeline.animate(floor)
      .at(growAt).duration(0.40).ease("inCubic").fadeTo(0);
    timeline.animate(aiRegion)
      .at(growAt).duration(1.45).ease("inOutCubic")
      .moveTo([16, LARGE_AI_CENTER_Y, 0.08]);
    timeline.animate(aiRegion)
      .at(growAt).duration(1.45).ease("inOutCubic").scaleTo(LARGE_AI_SCALE);
    timeline.animate(focusCard.aiTitle)
      .at(growAt + 0.12).duration(1.25).ease("inOutCubic")
      .moveTo([16, LARGE_AI_LABEL_Y, 0.26]);

    timeline.wait(CUE.end);
    this.play(timeline);

    this.captureScreenshotsNamed([
      [0, "segment-02-continuity"],
      [CUE.rules + 0.55, "segment-02-rules-card"],
      [CUE.confirmationLink + 0.90, "segment-02-checklist"],
      [CUE.highlightEliza + 0.32, "segment-02-eliza-highlight"],
      [CUE.highlightSixties + 0.32, "segment-02-1960s-highlight"],
      [(LIVE_CAMERA_START + LIVE_CAMERA_END) / 2, "segment-02-camera-static"],
      [fallAt - 0.08, "segment-02-small-ball"],
      [fallAt + 0.55, "segment-02-ball-falling"],
      [settledAt + 0.16, "segment-02-ball-settled"],
      [growAt + 1.55, "segment-02-ai-region"],
    ]);
  }
}

function addResultCard(
  scene: Scene,
  spec: { at: Vec2; fill: string; title: string; detail: string },
): ResultCard {
  const [x, y] = spec.at;
  const panel = scene.add(
    Rectangle().size([CARD_W, CARD_H]).cornerRadius(0.20).fill(spec.fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 16px ${spec.fill}4D)` }),
    { at: [x, y, 0.22] },
  );
  const title = scene.add(
    Label(spec.title).height(spec.title.length > 10 ? 0.18 : 0.21).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.045em" }),
    { at: [x, y + 0.12, 0.24] },
  );
  const detail = scene.add(
    Label(spec.detail).height(0.115).color("rgba(248,250,252,0.76)")
      .css({ fontWeight: 720, letterSpacing: "0.055em" }),
    { at: [x, y - 0.20, 0.24] },
  );
  return { all: [panel, title, detail], panel, title, detail, center: spec.at };
}

function addFocusCard(scene: Scene, at: Vec2): FocusCard {
  const panel = scene.add(
    Rectangle().size([CARD_W, CARD_H]).cornerRadius(0.20).fill(CATEGORY.ai.fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 16px ${CATEGORY.ai.fill}4D)` }),
    { at: [at[0], at[1], 0.24] },
  );
  const flaggedTitle = scene.add(
    Label("FLAGGED").height(0.21).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.045em" }),
    { at: [at[0], at[1] + 0.12, 0.26] },
  );
  const rulesTitle = scene.add(
    Label("RULES").height(0.21).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.045em" }),
    { at: [at[0], at[1] + 0.12, 0.26] },
  ).opacity(0);
  const flaggedDetail = scene.add(
    Label("SUSPICIOUS").height(0.115).color("rgba(248,250,252,0.76)")
      .css({ fontWeight: 720, letterSpacing: "0.055em" }),
    { at: [at[0], at[1] - 0.20, 0.26] },
  );
  const rulesDetail = scene.add(
    Label("RULE-BASED CHECKS").height(0.115).color("rgba(248,250,252,0.76)")
      .css({ fontWeight: 720, letterSpacing: "0.055em" }),
    { at: [at[0], at[1] - 0.20, 0.26] },
  ).opacity(0);
  const longAiTitle = scene.add(
    Label("ARTIFICIAL INTELLIGENCE").height(0.34).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.045em" }),
    { at: [at[0], at[1] + 0.12, 0.26] },
  ).opacity(0);
  const aiTitle = scene.add(
    Label("AI").height(0.44).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.055em" }),
    { at: [at[0], at[1] + 0.12, 0.26] },
  ).opacity(0);
  return {
    all: [panel, flaggedTitle, rulesTitle, flaggedDetail, rulesDetail, longAiTitle, aiTitle],
    entry: [panel, flaggedTitle, flaggedDetail],
    panel,
    flaggedTitle,
    rulesTitle,
    flaggedDetail,
    rulesDetail,
    longAiTitle,
    aiTitle,
    center: at,
  };
}

function addChecklistLine(
  scene: Scene,
  text: string,
  at: Vec2,
  skeletonWidth: number,
): ChecklistLine {
  const checkboxX = at[0] - 1.47;
  const textLeft = at[0] - 1.08;
  const textSlotWidth = 2.72;
  const textCenterX = textLeft + textSlotWidth / 2;
  const skeletonBox = scene.add(
    Rectangle().size([0.30, 0.30]).cornerRadius(0.07).fill("#9A876A")
      .css({ borderStyle: "none" }),
    { at: [checkboxX, at[1], 0.20] },
  );
  const skeletonBar = scene.add(
    Rectangle().size([skeletonWidth, 0.24]).cornerRadius(0.12).fill("#A89677")
      .css({ borderStyle: "none" }),
    { at: [textLeft + skeletonWidth / 2, at[1], 0.20] },
  );
  const box = scene.add(
    Rectangle().size([0.30, 0.30]).cornerRadius(0.045)
      .fill("#178A5B")
      .css({ borderStyle: "none" }),
    { at: [checkboxX, at[1], 0.20] },
  );
  const check = scene.add(
    worldPath()
      .moveTo(-0.082, 0.004)
      .lineTo(-0.022, -0.058)
      .lineTo(0.092, 0.078)
      .stroke({ color: "#F4E7C9", width: 0.034 }),
    { at: [checkboxX, at[1], 0.22] },
  );
  const label = scene.add(
    Label(text).height(0.22).reserveText("Confirmation link ").color("#3F3429")
      .typewriter().css({ fontWeight: 820 }),
    { at: [textCenterX, at[1], 0.22] },
  );
  return {
    all: [skeletonBox, skeletonBar, box, check, label],
    skeleton: [skeletonBox, skeletonBar],
    box,
    check,
    label,
  };
}

function revealChecklistLine(timeline: Timeline, line: ChecklistLine, at: number): void {
  timeline.animate(line.skeleton)
    .at(at).duration(0.20).ease("inCubic").fadeTo(0);
  timeline.animate(line.box)
    .at(at + 0.10).duration(0.22).ease("outCubic").appear();
  timeline.animate(line.check)
    .at(at + 0.20).duration(0).appear();
  timeline.animate(line.check)
    .at(at + 0.20).duration(0.24).ease("outCubic").draw();
  timeline.animate(line.label).at(at + 0.16).duration(0).appear();
  timeline.animate(line.label).at(at + 0.16).duration(0.58).ease("linear").typewrite();
}

function addMilestone(
  scene: Scene,
  x: number,
  year: string,
  text: string,
): Milestone {
  const dot = scene.add(
    Circle().radius(0.105).fill(COLOR.ai),
    { at: [x, -0.35, 0.14] },
  );
  const tick = scene.add(
    Line().from([x, -0.30]).to([x, 0.05]).stroke({ color: COLOR.ai, width: 0.035 }),
  );
  tick.at([tick.initialState.x, tick.initialState.y, 0.12]);
  const yearLabel = scene.add(
    Label(year).height(0.18).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.055em" }),
    { at: [x, 0.30, 0.16] },
  );
  const label = scene.add(
    Label(text).height(0.115).color(COLOR.muted)
      .css({ fontWeight: 780, letterSpacing: "0.035em", textAlign: "center" }),
    { at: [x, -0.95, 0.16] },
  );
  return { all: [tick, dot, yearLabel, label], dot, year: yearLabel, label };
}

function addJourneyLegend(scene: Scene, at: Vec2): Tattva[] {
  const [x, y] = at;
  const panel = scene.add(
    Rectangle().size([5.10, 0.52]).cornerRadius(0.24).fill("#10172A")
      .stroke({ color: "#334260", width: 0.025 }).css({ borderStyle: "none" }),
    { at: [x, y, 0.18] },
  );
  const title = scene.add(
    Label("OUR JOURNEY").height(0.135).color(COLOR.ink)
      .css({ fontWeight: 900, letterSpacing: "0.055em" }),
    { at: [x - 1.75, y, 0.20] },
  );
  const labels = [
    ["AI", COLOR.ai, -0.67],
    ["·", COLOR.muted, -0.23],
    ["ML", COLOR.ml, 0.15],
    ["·", COLOR.muted, 0.61],
    ["DL", COLOR.dl, 1.00],
    ["·", COLOR.muted, 1.45],
    ["GENAI", COLOR.genai, 1.95],
  ] as const;
  const parts = labels.map(([text, color, offset]) => scene.add(
    Label(text).height(0.135).color(color).css({ fontWeight: 900, letterSpacing: "0.04em" }),
    { at: [x + offset, y, 0.20] },
  ));
  return [panel, title, ...parts];
}

function addArrow(scene: Scene, from: Vec2, to: Vec2, color: string): Tattva {
  const item = scene.add(
    Arrow().from(from).to(to).stroke({ color, width: 0.045 }),
  );
  item.at([item.initialState.x, item.initialState.y, 0.18]);
  return item;
}

function moveGroupTo(
  timeline: Timeline,
  items: readonly Tattva[],
  from: Vec2,
  to: Vec2,
  at: number,
  duration: number,
): void {
  items.forEach((item) => {
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic")
      .moveTo([
        to[0] + item.initialState.x - from[0],
        to[1] + item.initialState.y - from[1],
        item.initialState.z,
      ]);
  });
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
    // Continue from the end of Segment 1 instead of restarting the logo loop.
    motion.update((motionTime + 56.43) % motion.duration, states);
  });
}

const runningInBrowser = typeof window !== "undefined";
const invokedDirectly = typeof process !== "undefined"
  && process.argv[1]?.includes("02-rule-based-ai") === true;
if (runningInBrowser || invokedDirectly) {
  await renderScene(import.meta.url, RuleBasedAiScene, "02-rule-based-ai.mp4");
}
