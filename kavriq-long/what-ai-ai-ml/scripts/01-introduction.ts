import { Scene, Timeline, Tattva, type Vec2 } from "veena/core";
import { Arrow, Line, Rectangle } from "veena/primitives";
import { WaxSealedEnvelopeLayered } from "veena/storytelling";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { CATEGORY, COLOR, FRAME } from "./lib/theme.ts";

/**
 * Segment 1 timebase
 * ------------------
 * Global animation start: 00:28:26
 * Global segment end:     01:25:09
 * Frame rate:             30 fps
 * Local duration:         56 seconds + 13 frames
 */
const FPS = FRAME.fps;
const frameTime = (seconds: number, frames = 0): number => seconds + frames / FPS;
// The closed flap leaves a V of the pocket uncovered beside the seal.
// The solid pocket below that notch is only about 0.8 world units tall,
// so the card stays at the small scale until it rises into the opening.
const EMAIL_ENVELOPE_SCALE = 0.145;
// 0.24 was the first readable letter. This is 2.2× that size.
const EMAIL_LETTER_SCALE = 0.24 * 2.2;
// Resting card is ~59% of the 16-wide frame so Tuesday, Wednesday, and the
// subject stay readable when a phone letterboxes this 16:9 shot.
const EMAIL_SCALE = 0.82;
const EMAIL_CARD_W = 11.42 * EMAIL_SCALE;
const EMAIL_CARD_H = 6.72 * EMAIL_SCALE;
const SLOT_W = 2.62;
const SLOT_H = 0.94;
const SLOT_X = EMAIL_CARD_W / 2 + 0.30 + SLOT_W / 2;
const SLOT_Y = EMAIL_CARD_H / 2 + 0.22 + SLOT_H / 2;
const EMAIL_INSIDE_Y = -1.67;
// Letter-sized card sits above the open pocket. Growth happens after this,
// on the way down to the resting pose, so the card does not swell inside the envelope.
const EMAIL_LIFT_Y = 1.90;
const ENVELOPE_BACK_Z = -0.50;
const ENVELOPE_FRONT_Z = 0.50;
// Paint order follows renderLayer, not this z. The pocket still moves behind
// the card in depth so it stays in front of the back paper after the layer drop.
const ENVELOPE_FRONT_BEHIND_Z = -0.20;

const CUE = {
  sampleEmail: frameTime(1, 29),
  fourSystems: frameTime(4, 15),
  flagged: frameTime(7, 15),
  spam: frameTime(10, 15),
  dog: frameTime(14, 15),
  draft: frameTime(17, 15),
  problem: frameTime(20, 15),
  dateMismatch: frameTime(23, 4),
  terminology: frameTime(31, 4),
  hallucination: frameTime(47, 18),
  end: frameTime(56, 13),
} as const;

interface ResultCard {
  all: Tattva[];
  panel: Tattva;
  title: Tattva;
}

export class IntroductionScene extends Scene {
  constructor() {
    super({
      width: FRAME.width,
      height: FRAME.height,
      background: COLOR.background,
    });
  }

  override construct(): void {
    const envelopeLayers = WaxSealedEnvelopeLayered({
      width: 4.80,
      height: 2.95,
      letterContent: false,
    });
    const envelopeBack = this.add(envelopeLayers.back, { at: [0, -0.35, ENVELOPE_BACK_Z] });
    const envelopeFront = this.add(envelopeLayers.front, { at: [0, -0.35, ENVELOPE_FRONT_Z] });
    const envelope = [envelopeBack, envelopeFront] as const;

    const email = addOpenEmailView(this, { at: [0, 0], scale: EMAIL_SCALE });
    const emailCore = email.all.filter((item) => !email.errorChip.includes(item));
    const emailRestingStates = emailCore.map((item) => ({ ...item.initialState }));

    // Layer -1 is the envelope back, layer 0 is the email, and layer 1 is the
    // envelope front. Paint order follows these layers, so the front pocket
    // stays above the card until the card has cleared the mouth.
    emailCore.forEach((item, index) => {
      const resting = emailRestingStates[index]!;
      item.at([
        resting.x * EMAIL_ENVELOPE_SCALE,
        EMAIL_INSIDE_Y + resting.y * EMAIL_ENVELOPE_SCALE,
        resting.z * EMAIL_ENVELOPE_SCALE,
      ]);
      item.scale3D([
        resting.scaleX * EMAIL_ENVELOPE_SCALE,
        resting.scaleY * EMAIL_ENVELOPE_SCALE,
        resting.scaleZ * EMAIL_ENVELOPE_SCALE,
      ]);
    });

    const positions = {
      flagged: [-SLOT_X, SLOT_Y] as Vec2,
      spam: [SLOT_X, SLOT_Y] as Vec2,
      dog: [-SLOT_X, -SLOT_Y] as Vec2,
      draft: [SLOT_X, -SLOT_Y] as Vec2,
    };

    const gears: GearTurn[] = [];
    const gearColors = ["#7F9EAE", "#7EA894", "#8E86B2", "#C490A2"];
    const slots = Object.values(positions).map((at, index) =>
      addEmptySlot(this, at, gearColors[index]!, gears, index),
    );
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
    const cards = [flagged, spam, dog, draft] as const;

    // One straight arrow per feature. Origins sit just outside the glyph
    // on the side facing the card, so the shafts do not cross each other
    // or run back through the words.
    const s = EMAIL_SCALE;
    const subjectY = 2.36 * s;
    const addressY = 1.78 * s;
    const avatarY = 1.66 * s;
    const linkY = -0.43 * s;
    const attachmentY = -1.03 * s;
    const draftY = -2.49 * s;
    const urgentLeft = -5.02 * s;
    const avatarLeft = -4.72 * s - 0.30 * s;
    const linkLeft = -4.34 * s;
    const flaggedEdge = -SLOT_X + SLOT_W / 2 - 0.08;
    const spamEdge = SLOT_X - SLOT_W / 2 + 0.08;
    const flaggedConnectors = [
      addArrow(this, [urgentLeft - 0.14, subjectY], [flaggedEdge, SLOT_Y + 0.24], COLOR.ai),
      addArrow(this, [avatarLeft, avatarY], [flaggedEdge, SLOT_Y], COLOR.ai),
      addArrow(this, [linkLeft - 0.14, linkY], [flaggedEdge, SLOT_Y - 0.24], COLOR.ai),
    ];
    const spamConnectors = [
      addArrow(this, [-0.86, subjectY], [spamEdge, SLOT_Y + 0.24], COLOR.ml),
      addArrow(this, [-0.70, addressY], [spamEdge, SLOT_Y], COLOR.ml),
      // A straight shot from the link to SPAM cuts the sentence above it.
      // Run right along the empty link row, past that sentence, then rise.
      addLeaderArrow(
        this,
        [
          [-2.08, linkY],
          [-0.16, linkY],
          [spamEdge, SLOT_Y - 0.24],
        ],
        COLOR.ml,
      ),
    ];
    const dogConnector = [
      addArrow(this, [linkLeft - 0.14, attachmentY], [-SLOT_X + 0.40, -SLOT_Y + SLOT_H / 2 - 0.08], COLOR.dl),
    ];
    const draftConnector = [
      addArrow(this, [-0.92, draftY], [spamEdge, -SLOT_Y + 0.10], COLOR.genai),
    ];
    const connectors = [
      ...flaggedConnectors,
      ...spamConnectors,
      ...dogConnector,
      ...draftConnector,
    ];

    // The mismatch travels around the left reading margin so it does not cross
    // the body copy or the draft text.
    const mismatchRailX = -EMAIL_CARD_W / 2 + 0.08;
    const mismatchTuesdayY = 0.36 * EMAIL_SCALE;
    const mismatchDraftY = -2.49 * EMAIL_SCALE;
    const mismatchTuesdayX = -4.34 * EMAIL_SCALE - 0.24;
    const mismatchDraftX = -5.05 * EMAIL_SCALE;
    const mismatchPath = [
      addDashedLine(this, [mismatchTuesdayX, mismatchTuesdayY], [mismatchRailX, mismatchTuesdayY], COLOR.warning),
      addDashedLine(this, [mismatchRailX, mismatchTuesdayY], [mismatchRailX, mismatchDraftY], COLOR.warning),
      raisePath(this.add(
        Arrow().from([mismatchRailX, mismatchDraftY]).to([mismatchDraftX, mismatchDraftY])
          .stroke({ color: COLOR.warning, width: 0.045 }).dash(0.12, 0.08),
      ), 0.20),
    ];

    const calloutY = SLOT_Y + SLOT_H / 2 + 0.05 + 0.24;
    const callouts = [
      addCallout(this, "AI", [-SLOT_X, calloutY], CATEGORY.ai.fill, COLOR.ai),
      addCallout(this, "MACHINE LEARNING", [SLOT_X, calloutY], CATEGORY.ml.fill, COLOR.ml),
      addCallout(this, "DEEP LEARNING", [-SLOT_X, -calloutY], CATEGORY.dl.fill, COLOR.dl),
      addCallout(this, "GENERATIVE AI", [SLOT_X, -calloutY], CATEGORY.genai.fill, COLOR.genai),
    ];
    // Depth, not render layer, decides paint order inside the 3D frame.
    // 0.50 covers the email, arrows, and result cards. The name pills sit at 0.60.
    const screenDim = this.add(
      Rectangle().size([18, 11]).fill(COLOR.background).css({ borderStyle: "none" }),
      { at: [0, 0, 0.50] },
    );

    const journeyLegend = addJourneyLegend(this, [0, 4.08]);
    const chipX = 4.02 * EMAIL_SCALE;
    const chipY = -1.98 * EMAIL_SCALE;
    const hallucination = this.add(
      Label("HALLUCINATION").height(0.145).color(COLOR.warning)
        .css({ fontWeight: 950, letterSpacing: "0.075em" }),
      { at: [chipX - 1.76 * EMAIL_SCALE / 2 - 0.86, chipY, 0.23] },
    );

    const verification = addVerificationBoundary(this);

    // Start from a fresh screen. Only the envelope and persistent branding are
    // initially visible.
    email.errorChip.forEach((item) => item.opacity(0));
    slots.flat().forEach((item) => item.opacity(0));
    cards.forEach((card) => card.all.forEach((item) => item.opacity(0)));
    connectors.forEach((item) => item.opacity(0));
    mismatchPath.forEach((item) => item.opacity(0));
    callouts.flat().forEach((item) => item.opacity(0));
    screenDim.opacity(0);
    journeyLegend.forEach((item) => item.opacity(0));
    hallucination.opacity(0);
    verification.forEach((item) => item.opacity(0));

    const timeline = new Timeline();

    // The 1 s 29 f lead-in is intentionally compact: enter and open without an
    // artificial settling pause.
    // The envelope is fully opaque from frame one. Animating only its authored
    // opening state keeps the small email occluded until it physically rises
    // through the opening.
    envelope.forEach((layer) => {
      timeline.animate(layer).at(0.22).duration(1.50)
        .ease("inOutCubic").to({ openProgress: 1 });
    });

    const emailRiseStart = CUE.sampleEmail - 0.95;
    const emailClearTime = CUE.sampleEmail - 0.08;
    // The high pose reads before the grow. Growth and the move down to the
    // resting position are one move.
    const emailGrowStart = emailClearTime + 0.16;

    emailCore.forEach((item, index) => {
      const resting = emailRestingStates[index]!;

      // Stage 1: come out of the pocket and stop high, still at letter size.
      timeline.animate(item).at(emailRiseStart).duration(emailClearTime - emailRiseStart)
        .ease("inOutCubic").to({
          x: resting.x * EMAIL_LETTER_SCALE,
          y: EMAIL_LIFT_Y + resting.y * EMAIL_LETTER_SCALE,
          z: resting.z * EMAIL_LETTER_SCALE,
          scaleX: resting.scaleX * EMAIL_LETTER_SCALE,
          scaleY: resting.scaleY * EMAIL_LETTER_SCALE,
          scaleZ: resting.scaleZ * EMAIL_LETTER_SCALE,
        });

      // Stage 2: grow to the resting card while travelling down onto it.
      timeline.animate(item).at(emailGrowStart).duration(0.88)
        .ease("inOutCubic").to({
          x: resting.x,
          y: resting.y,
          z: resting.z,
          scaleX: resting.scaleX,
          scaleY: resting.scaleY,
          scaleZ: resting.scaleZ,
        });
    });

    timeline.animate(envelopeFront).at(emailClearTime).duration(0.12)
      .ease("outCubic").to({ z: ENVELOPE_FRONT_BEHIND_Z });
    timeline.animate(envelopeBack).at(emailClearTime).duration(0.85)
      .ease("inCubic").to({ x: -11.40, y: -0.4 });
    timeline.animate(envelopeFront).at(emailClearTime).duration(0.85)
      .ease("inCubic").to({ x: -11.40, y: -0.4 });

    // Four destinations appear before any answer is explained.
    slots.forEach((slot, index) => {
      timeline.animate(slot).at(CUE.fourSystems + index * 0.07).duration(0.34)
        .ease("outCubic").appear();
    });

    revealFlagged(timeline, slots[0]!, flaggedConnectors, flagged, CUE.flagged, email);
    revealSpam(timeline, slots[1]!, spamConnectors, spam, CUE.spam, email);
    revealSingleResult(
      timeline,
      slots[2]!,
      dogConnector,
      dog,
      CUE.dog,
      email.attachment,
    );
    revealSingleResult(
      timeline,
      slots[3]!,
      draftConnector,
      draft,
      CUE.draft,
      email.reply,
    );

    // “But there is a problem.” Preserve every result while removing its visual
    // competition with the Tuesday/Wednesday discrepancy.
    cards.forEach((card) => {
      timeline.animate(card.all).at(CUE.problem).duration(0.48).ease("inOutCubic").fadeTo(0.44);
    });
    timeline.animate(connectors).at(CUE.problem).duration(0.48).ease("inOutCubic").fadeTo(0.30);

    timeline.animate(email.body[1]!).at(CUE.dateMismatch).duration(0.38)
      .ease("outCubic").scaleTo(1.07);
    timeline.animate(email.body[1]!).at(CUE.dateMismatch + 0.74).duration(0.30)
      .ease("inOutCubic").scaleTo(1);
    timeline.animate(email.reply[2]!).at(CUE.dateMismatch + 0.90).duration(0.38)
      .ease("outCubic").scaleTo(1.07);
    timeline.animate(mismatchPath).at(CUE.dateMismatch + 0.30).duration(0).appear();
    timeline.animate(mismatchPath).at(CUE.dateMismatch + 0.30).stagger(0.12)
      .duration(0.42).ease("outCubic").draw();
    timeline.animate(email.errorChip).at(CUE.dateMismatch + 1.10).stagger(0.04)
      .duration(0.32).ease("outCubic").appear();
    timeline.animate(email.errorChip).at(CUE.dateMismatch + 1.48).duration(0.26)
      .ease("outCubic").scaleTo(1.12);
    timeline.animate(email.errorChip).at(CUE.dateMismatch + 1.86).duration(0.30)
      .ease("inOutCubic").scaleTo(1);
    timeline.animate(email.reply[2]!).at(CUE.dateMismatch + 1.64).duration(0.30)
      .ease("inOutCubic").scaleTo(1);

    // TUE→WED stays on the draft. A parked screen chip would have to be
    // placed again on every later shot.

    // The spoken technology names are temporary callouts, not permanent peer
    // badges. Each one leaves after identifying its corresponding result.
    // The first name already matches the voice. The old 1.8 s gap let the
    // picture fall 3 s behind by Generative AI, so the four names now land
    // 0.8 s apart. The rest of the frame dims while they are up.
    timeline.animate(cards.flatMap((card) => card.all)).at(CUE.terminology)
      .duration(0.32).ease("inOutCubic").fadeTo(1);
    timeline.animate(connectors).at(CUE.terminology).duration(0.32)
      .ease("inOutCubic").fadeTo(1);
    timeline.animate(screenDim).at(CUE.terminology).duration(0.32)
      .ease("inOutCubic").fadeTo(0.62);

    const calloutTimes = [
      CUE.terminology + 0.30,
      CUE.terminology + 1.10,
      CUE.terminology + 1.90,
      CUE.terminology + 2.70,
    ];
    callouts.forEach((callout, index) => {
      const at = calloutTimes[index]!;
      timeline.animate(callout).at(at).stagger(0.035).duration(0.28)
        .ease("outCubic").appear();
      timeline.animate(cards[index]!.panel).at(at + 0.12).duration(0.28)
        .ease("outCubic").scaleTo(1.055);
      timeline.animate(cards[index]!.panel).at(at + 0.50).duration(0.28)
        .ease("inOutCubic").scaleTo(1);
      timeline.animate(callout).at(at + 1.05).duration(0.28)
        .ease("inCubic").fadeTo(0);
    });
    const pillsOver = calloutTimes[3]! + 1.05 + 0.28;
    timeline.animate(screenDim).at(pillsOver).duration(0.40)
      .ease("inOutCubic").fadeTo(0);

    timeline.animate(journeyLegend).at(CUE.terminology + 8.00).stagger(0.035)
      .duration(0.40).ease("outCubic").appear();

    // Hallucination is named late in the segment. The verification boundary is
    // deliberately unresolved: no tick and no “fixed” state.
    timeline.animate(email.errorChip).at(CUE.hallucination).duration(0.28)
      .ease("outCubic").scaleTo(1.12);
    timeline.animate(hallucination).at(CUE.hallucination + 0.12).duration(0.38)
      .ease("outCubic").appear();
    timeline.animate(email.errorChip).at(CUE.hallucination + 0.55).duration(0.28)
      .ease("inOutCubic").scaleTo(1);
    timeline.animate(verification.slice(0, 4)).at(CUE.hallucination + 3.55)
      .duration(0).appear();
    timeline.animate(verification.slice(0, 4)).at(CUE.hallucination + 3.55).stagger(0.08)
      .duration(0.48).ease("outCubic").draw();
    timeline.animate(verification[4]!).at(CUE.hallucination + 3.82)
      .duration(0.30).ease("outCubic").appear();

    // Force the exact editorial duration even though the last visual finishes
    // earlier and holds for the cut into Segment 2.
    timeline.wait(CUE.end);
    this.play(timeline);

    this.captureScreenshotsNamed([
      [CUE.sampleEmail + 1.0, "segment-01-email"],
      [CUE.fourSystems + 0.85, "segment-01-empty-slots"],
      [CUE.draft + 1.2, "segment-01-four-results"],
      [CUE.dateMismatch + 4.0, "segment-01-date-mismatch"],
      [CUE.hallucination + 5.0, "segment-01-hallucination"],
      [CUE.end - 0.20, "segment-01-final-frame"],
    ]);

    this.updater((time, states) => {
      // renderLayer outranks translated z, so the pocket has to change layer
      // once the card is out. Otherwise it keeps slicing the card on the exit.
      envelopeFront.layer(time >= emailClearTime ? -1 : 1);
      if (!states) return;
      for (const gear of gears) {
        const state = states.get(gear.part);
        if (!state) continue;
        state.rotationZ = gear.base + time * gear.speed;
      }
    });
  }
}

interface GearTurn {
  part: Tattva;
  base: number;
  speed: number;
}

function addEmptySlot(
  scene: Scene,
  at: Vec2,
  color: string,
  gears: GearTurn[],
  index: number,
): Tattva[] {
  const [x, y] = at;
  const panel = scene.add(
    Rectangle().size([SLOT_W, SLOT_H]).cornerRadius(0.20)
      .fill("rgba(20,28,50,0.22)")
      .stroke({ color: "rgba(154,167,193,0.26)", width: 0.025 })
      .css({ borderStyle: "none" }),
    { at: [x, y, 0.10] },
  );
  // Three meshing gears in the short slot. Speeds and the pose offset scale
  // with radius, so a tooth stays in the neighbor's valley while they turn.
  const phase = index * 14;
  const leftR = 0.33;
  const midR = 0.21;
  const rightR = 0.34;
  const rate = 22;
  const train = [
    { radius: leftR, teeth: 12, dx: -0.50, speed: rate, base: phase },
    { radius: midR, teeth: 8, dx: -0.005, speed: -rate * leftR / midR, base: 22.5 - phase * leftR / midR },
    { radius: rightR, teeth: 12, dx: 0.50, speed: rate * leftR / rightR, base: phase * leftR / rightR },
  ];
  const parts = train.map((gear) => addGear(
    scene,
    [x + gear.dx, y],
    gear.radius,
    gear.teeth,
    color,
    gear.base,
    gear.speed,
    gears,
  ));
  return [panel, ...parts];
}

function addGear(
  scene: Scene,
  at: Vec2,
  radius: number,
  teeth: number,
  color: string,
  base: number,
  speed: number,
  gears: GearTurn[],
): Tattva {
  const tip = radius;
  const root = radius * 0.73;
  const hole = radius * (radius < 0.26 ? 0.36 : 0.20);
  const box = radius * 2.2;
  const half = box / 2;
  const pitch = (Math.PI * 2) / teeth;
  const tipHalf = pitch * 0.20;
  const tipFlat = pitch * 0.11;
  const rootHalf = pitch * 0.32;
  const fmt = (n: number) => n.toFixed(3);
  const pt = (angle: number, r: number) =>
    `${fmt(Math.cos(angle) * r)} ${fmt(Math.sin(angle) * r)}`;
  // One silhouette: tapered teeth joined by the root circle, so the tooth
  // is part of the gear instead of a block stuck on a disc.
  let outline = `M ${pt(-rootHalf, root)}`;
  for (let i = 0; i < teeth; i++) {
    const center = i * pitch;
    const shoulder = tip * 0.96;
    outline += ` L ${pt(center - tipHalf, shoulder)}`;
    outline += ` L ${pt(center - tipFlat, tip)}`;
    outline += ` L ${pt(center + tipFlat, tip)}`;
    outline += ` L ${pt(center + tipHalf, shoulder)}`;
    outline += ` L ${pt(center + rootHalf, root)}`;
    outline += ` A ${fmt(root)} ${fmt(root)} 0 0 1 ${pt(center + pitch - rootHalf, root)}`;
  }
  outline += " Z";
  const holePath = `M ${fmt(hole)} 0 A ${fmt(hole)} ${fmt(hole)} 0 1 0 ${fmt(-hole)} 0 A ${fmt(hole)} ${fmt(hole)} 0 1 0 ${fmt(hole)} 0 Z`;
  // Larger gears get the radial slots from the reference. The small gear is a plain cog.
  let spokes = "";
  if (radius >= 0.26) {
    const inner = radius * 0.44;
    const outer = radius * 0.60;
    const width = radius * 0.075;
    for (let i = 0; i < 6; i++) {
      const angle = (i + 0.5) * (Math.PI * 2) / 6;
      const ix = Math.cos(angle) * inner;
      const iy = Math.sin(angle) * inner;
      const ox = Math.cos(angle) * outer;
      const oy = Math.sin(angle) * outer;
      spokes += `<line x1="${fmt(ix)}" y1="${fmt(iy)}" x2="${fmt(ox)}" y2="${fmt(oy)}" stroke="#070A16" stroke-width="${fmt(width)}" stroke-linecap="round" />`;
    }
  }
  const svg = `<svg width="100%" height="100%" viewBox="${fmt(-half)} ${fmt(-half)} ${fmt(box)} ${fmt(box)}" overflow="visible" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" fill-rule="evenodd" d="${outline} ${holePath}" />${spokes}</svg>`;
  const gear = new Tattva({ html: svg });
  gear.paintsOwnStroke = true;
  gear.worldSize = { width: box, height: box };
  gear.rotate(base);
  gears.push({ part: gear, base, speed });
  return scene.add(gear, { at: [at[0], at[1], 0.12] });
}

function addResultCard(
  scene: Scene,
  spec: { at: Vec2; fill: string; title: string; detail: string },
): ResultCard {
  const [x, y] = spec.at;
  const panel = scene.add(
    Rectangle().size([SLOT_W, SLOT_H]).cornerRadius(0.20).fill(spec.fill)
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
  return { all: [panel, title, detail], panel, title };
}

function addArrow(scene: Scene, from: Vec2, to: Vec2, color: string): Tattva {
  return raisePath(
    scene.add(Arrow().from(from).to(to).stroke({ color, width: 0.045 })),
    0.18,
  );
}

// One stroke with one head. The bend is a single path, so it draws
// continuously instead of as separate segments.
function addLeaderArrow(scene: Scene, points: Vec2[], color: string): Tattva {
  const stroke = 0.045;
  const head = 0.22;
  const wing = 0.09;
  const tip = points[points.length - 1]!;
  const before = points[points.length - 2]!;
  const dx = tip[0] - before[0];
  const dy = tip[1] - before[1];
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy;
  const ny = ux;
  const strokeEnd: Vec2 = [tip[0] - ux * head * 0.35, tip[1] - uy * head * 0.35];
  const base: Vec2 = [tip[0] - ux * head, tip[1] - uy * head];
  const left: Vec2 = [base[0] + nx * wing, base[1] + ny * wing];
  const right: Vec2 = [base[0] - nx * wing, base[1] - ny * wing];
  const route = [...points.slice(0, -1), strokeEnd];
  const svgY = (y: number) => -y;
  const xs = [...route.map((point) => point[0]), left[0], right[0], tip[0]];
  const svgYs = [...route.map((point) => svgY(point[1])), svgY(left[1]), svgY(right[1]), svgY(tip[1])];
  const pad = 0.08;
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minS = Math.min(...svgYs) - pad;
  const maxS = Math.max(...svgYs) + pad;
  const width = maxX - minX;
  const height = maxS - minS;
  const fmt = (value: number) => value.toFixed(3);
  const path = route
    .map((point, index) => `${index === 0 ? "M" : "L"} ${fmt(point[0])} ${fmt(svgY(point[1]))}`)
    .join(" ");
  const headPath = `M ${fmt(left[0])} ${fmt(svgY(left[1]))} L ${fmt(tip[0])} ${fmt(svgY(tip[1]))} L ${fmt(right[0])} ${fmt(svgY(right[1]))} Z`;
  const item = new Tattva({
    html: `<svg width="100%" height="100%" viewBox="${fmt(minX)} ${fmt(minS)} ${fmt(width)} ${fmt(height)}" overflow="visible" xmlns="http://www.w3.org/2000/svg"><path data-veena-path d="${path}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" /><path data-veena-arrowhead d="${headPath}" fill="currentColor" /></svg>`,
    css: { color },
  });
  item.revealKind = "path";
  item.paintsOwnStroke = true;
  item.worldSize = { width, height };
  return raisePath(scene.add(item.at([minX + width / 2, -(minS + height / 2)])), 0.18);
}

function addDashedLine(scene: Scene, from: Vec2, to: Vec2, color: string): Tattva {
  return raisePath(
    scene.add(Line().from(from).to(to).stroke({ color, width: 0.045 }).dash(0.12, 0.08)),
    0.20,
  );
}

function raisePath(item: Tattva, z: number): Tattva {
  item.at([item.initialState.x, item.initialState.y, z]);
  return item;
}

function addCallout(scene: Scene, text: string, at: Vec2, fill: string, accent: string): Tattva[] {
  const textHeight = 0.20;
  const width = Math.max(1.55, text.length * textHeight * 0.78 + 0.52);
  const pill = scene.add(
    Rectangle().size([width, 0.48]).cornerRadius(0.24)
      .fill(fill)
      .stroke({ color: accent, width: 0.035 })
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 16px ${accent}88)` }),
    { at: [at[0], at[1], 0.60] },
  );
  const label = scene.add(
    Label(text).height(textHeight).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.045em" }),
    { at: [at[0], at[1], 0.62] },
  );
  pill.layer(3);
  label.layer(3);
  return [pill, label];
}

function addJourneyLegend(scene: Scene, at: Vec2): Tattva[] {
  const textHeight = 0.17;
  const row: { text: string; color: string; gapAfter: number }[] = [
    { text: "OUR JOURNEY", color: COLOR.ink, gapAfter: 0.48 },
    { text: "AI", color: COLOR.ai, gapAfter: 0.18 },
    { text: "·", color: "rgba(248,250,252,0.42)", gapAfter: 0.18 },
    { text: "ML", color: COLOR.ml, gapAfter: 0.18 },
    { text: "·", color: "rgba(248,250,252,0.42)", gapAfter: 0.18 },
    { text: "DL", color: COLOR.dl, gapAfter: 0.18 },
    { text: "·", color: "rgba(248,250,252,0.42)", gapAfter: 0.18 },
    { text: "GENAI", color: COLOR.genai, gapAfter: 0 },
  ];
  const widthOf = (text: string) => text.length * textHeight * (text === "·" ? 0.42 : 0.72);
  const contentWidth = row.reduce((sum, item) => sum + widthOf(item.text) + item.gapAfter, 0);
  const panelWidth = contentWidth + 0.64;
  const panel = scene.add(
    Rectangle().size([panelWidth, 0.52]).cornerRadius(0.24)
      .fill("rgba(16,23,42,0.92)")
      .stroke({ color: "rgba(154,167,193,0.38)", width: 0.02 })
      .css({ borderStyle: "none" }),
    { at: [at[0], at[1], 25] },
  );
  const labels: Tattva[] = [];
  let cursor = at[0] - contentWidth / 2;
  for (const item of row) {
    const width = widthOf(item.text);
    labels.push(scene.add(
      Label(item.text).height(item.text === "·" ? 0.20 : textHeight).color(item.color)
        .css({ fontWeight: item.text === "OUR JOURNEY" ? 750 : 850, letterSpacing: "0.06em" }),
      { at: [cursor + width / 2, at[1], 26] },
    ));
    cursor += width + item.gapAfter;
  }
  return [panel, ...labels];
}

function addVerificationBoundary(scene: Scene): Tattva[] {
  const draftHalfW = 5.05 * EMAIL_SCALE;
  const draftHalfH = 0.68 * EMAIL_SCALE;
  const draftCenterY = -2.39 * EMAIL_SCALE;
  // Stay inside the draft's rounded rectangle. The top is tighter so the
  // dashes clear the TUE→WED pill without leaving the bar.
  const left = -draftHalfW + 0.08;
  const right = draftHalfW - 0.08;
  const top = draftCenterY + draftHalfH - 0.045;
  const bottom = draftCenterY - draftHalfH + 0.08;
  const lines = [
    addDashedLine(scene, [left, top], [right, top], COLOR.warning),
    addDashedLine(scene, [right, top], [right, bottom], COLOR.warning),
    addDashedLine(scene, [right, bottom], [left, bottom], COLOR.warning),
    addDashedLine(scene, [left, bottom], [left, top], COLOR.warning),
  ];
  const label = scene.add(
    Label("VERIFY OUTPUT").height(0.12).color(COLOR.warning)
      .css({ fontWeight: 900, letterSpacing: "0.065em" }),
    { at: [right - 0.78, bottom + 0.18, 0.23] },
  );
  return [...lines, label];
}

function revealFlagged(
  timeline: Timeline,
  slot: Tattva[],
  connectors: Tattva[],
  card: ResultCard,
  at: number,
  email: ReturnType<typeof addOpenEmailView>,
): void {
  timeline.animate(email.sender).at(at).duration(0.28).ease("outCubic").scaleTo(1.055);
  timeline.animate(email.subject).at(at + 0.12).duration(0.28).ease("outCubic").scaleTo(1.055);
  timeline.animate(email.confirmationLink).at(at + 0.24).duration(0.28)
    .ease("outCubic").scaleTo(1.055);
  timeline.animate(connectors).at(at + 0.22).duration(0).appear();
  timeline.animate(connectors).at(at + 0.22).stagger(0.10).duration(0.48)
    .ease("outCubic").draw();
  revealCard(timeline, slot, card, at + 0.30);
  timeline.animate([...email.sender, ...email.subject, ...email.confirmationLink])
    .at(at + 1.05).duration(0.30).ease("inOutCubic").scaleTo(1);
}

function revealSpam(
  timeline: Timeline,
  slot: Tattva[],
  connectors: readonly Tattva[],
  card: ResultCard,
  at: number,
  email: ReturnType<typeof addOpenEmailView>,
): void {
  timeline.animate(email.sender).at(at).duration(0.24).ease("outCubic").scaleTo(1.045);
  timeline.animate(email.subject).at(at + 0.10).duration(0.24).ease("outCubic").scaleTo(1.045);
  timeline.animate(email.confirmationLink).at(at + 0.20).duration(0.24)
    .ease("outCubic").scaleTo(1.045);
  timeline.animate(connectors).at(at + 0.22).duration(0).appear();
  timeline.animate(connectors).at(at + 0.22).stagger(0.08).duration(0.42)
    .ease("outCubic").draw();
  revealCard(timeline, slot, card, at + 0.38);
  timeline.animate([...email.sender, ...email.subject, ...email.confirmationLink])
    .at(at + 1.05).duration(0.30).ease("inOutCubic").scaleTo(1);
}

function revealSingleResult(
  timeline: Timeline,
  slot: Tattva[],
  connector: readonly Tattva[],
  card: ResultCard,
  at: number,
  source: Tattva[],
): void {
  timeline.animate(source).at(at).duration(0.32).ease("outCubic").scaleTo(1.065);
  timeline.animate(connector).at(at + 0.18).duration(0).appear();
  timeline.animate(connector).at(at + 0.18).stagger(0.12).duration(0.42)
    .ease("outCubic").draw();
  revealCard(timeline, slot, card, at + 0.26);
  timeline.animate(source).at(at + 0.95).duration(0.30).ease("inOutCubic").scaleTo(1);
}

function revealCard(
  timeline: Timeline,
  slot: Tattva[],
  card: ResultCard,
  at: number,
): void {
  timeline.animate(slot).at(at).duration(0.20).fadeTo(0);
  timeline.animate(card.all).at(at).stagger(0.035).duration(0.30)
    .ease("outCubic").appear();
  timeline.animate(card.panel).at(at + 0.28).duration(0.22)
    .ease("outCubic").scaleTo(1.06);
  timeline.animate(card.panel).at(at + 0.58).duration(0.24)
    .ease("inOutCubic").scaleTo(1);
  timeline.animate(card.title).at(at + 0.25).duration(0.50).indicate();
}

const runningInBrowser = typeof window !== "undefined";
const invokedDirectly = typeof process !== "undefined"
  && process.argv[1]?.includes("01-introduction") === true;
if (runningInBrowser || invokedDirectly) {
  await renderScene(import.meta.url, IntroductionScene, "01-introduction.mp4");
}
