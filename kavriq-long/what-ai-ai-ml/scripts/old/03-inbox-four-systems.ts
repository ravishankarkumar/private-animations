import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { COLOR, FRAME } from "../lib/theme.ts";
import { addArrow } from "../lib/ui.ts";
import { addOpenEmailView } from "../lib/open-email.ts";
import { renderScene } from "../lib/render.ts";

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
}

class InboxFourSystemsScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    // The email is readable on frame one. Its smaller scale reserves clean
    // margins for four results without replacing the recurring object.
    const email = addOpenEmailView(this, { at: [0, 0.04], scale: 0.78 });

    const flagged = addResultCard(this, {
      at: [-5.62, 1.45], fill: SOLID.ai, result: "FLAGGED", detail: "Rule-based AI  •  3 checks",
    });
    const spam = addResultCard(this, {
      at: [5.62, 1.45], fill: SOLID.ml, result: "96%", detail: "Machine learning  •  spam score",
    });
    const dog = addResultCard(this, {
      at: [-5.62, -1.42], fill: SOLID.dl, result: "DOG 98%", detail: "Deep learning  •  image",
    });
    const draft = addResultCard(this, {
      at: [5.62, -1.42], fill: SOLID.genai, result: "DRAFT", detail: "Generative AI  •  reply",
    });
    const cards = [flagged, spam, dog, draft] as const;

    const flagTargets: Vec2[] = [[-4.48, 1.72], [-4.48, 1.45], [-4.48, 1.18]];
    const flagSources = [email.anchors.subject, email.anchors.sender, email.anchors.confirmationLink];
    const flagArrows = flagSources.map((source, index) => raise(addArrow(this, source, flagTargets[index]!, COLOR.ai)));
    const flagChecks = flagSources.map((source) => addCheck(this, [source[0] + 0.42, source[1]]));
    const dogArrow = raise(addArrow(this, email.anchors.attachment, [-4.48, -1.42], COLOR.dl));
    const draftArrow = raise(addArrow(this, email.anchors.reply, [4.48, -1.42], COLOR.genai));
    const learnedMails = addLearnedMails(this, [
      { at: [2.55, 1.15], text: "SPAM", spam: true },
      { at: [3.15, 0.55], text: "NOT SPAM", spam: false },
      { at: [2.35, -0.05], text: "SPAM", spam: true },
      { at: [3.25, -0.65], text: "NOT SPAM", spam: false },
    ]);
    const legend = addDimLegend(this);

    email.errorChip.forEach((item) => item.opacity(0));
    cards.forEach((card) => card.all.forEach((item) => item.opacity(0)));

    const timeline = new Timeline();

    // “The email says … Tuesday at 10.”
    timeline.animate(email.body[1]!).at(0.25).duration(0.42).ease("outCubic").scaleTo(1.055);
    timeline.animate(email.body[1]!).at(1.45).duration(0.38).ease("inOutCubic").scaleTo(1);

    // “But the draft response says Wednesday.”
    timeline.animate(email.reply[2]!).at(2.20).duration(0.42).ease("outCubic").scaleTo(1.055);
    timeline.animate(email.errorChip).at(2.72).stagger(0.04).duration(0.28).ease("outCubic").appear();
    timeline.animate(email.errorChip).at(3.12).duration(0.25).ease("outCubic").scaleTo(1.06);
    timeline.animate(email.errorChip).at(3.48).duration(0.28).ease("inOutCubic").scaleTo(1);
    timeline.animate(email.reply[2]!).at(3.58).duration(0.36).ease("inOutCubic").scaleTo(1);

    // “This one email put four different AI systems to work.”
    timeline.animate(email.all).at(4.55).stagger(0.002).duration(0.34).ease("inOutCubic").scaleTo(1.008);
    timeline.animate(email.all).at(5.02).stagger(0.002).duration(0.32).ease("inOutCubic").scaleTo(1);

    // Three separate checks. No arrow from Tuesday or the dog.
    flagArrows.forEach((arrow, index) => {
      const at = 6.10 + index * 0.16;
      timeline.animate(arrow).at(at).duration(0.24).ease("outCubic").draw();
      timeline.animate(flagChecks[index]!).at(at + 0.12).duration(0.16).ease("outCubic").appear();
    });
    revealCard(timeline, flagged, 6.55);

    // Old labeled emails collapse into one score. The dog stays unconnected.
    revealLearnedScore(timeline, learnedMails, spam, [5.62, 1.45], 8.15);
    revealResult(timeline, dogArrow, dog, 10.35);
    revealResult(timeline, draftArrow, draft, 12.15);

    // “People call all four of these AI.” All four cards stay bright.
    cards.forEach((card) => {
      timeline.animate(card.all).at(14.05).duration(0.28).ease("outCubic").scaleTo(1.05);
      timeline.animate(card.all).at(14.55).duration(0.30).ease("inOutCubic").scaleTo(1);
    });

    // “The draft wrote the wrong day.”
    timeline.animate(draft.all).at(16.35).duration(0.28).ease("outCubic").scaleTo(1.08);
    timeline.animate(email.reply[2]!).at(16.45).duration(0.28).ease("outCubic").scaleTo(1.055);
    timeline.animate(email.errorChip).at(16.55).duration(0.28).ease("outCubic").scaleTo(1.10);
    timeline.animate(draft.all).at(17.15).duration(0.32).ease("inOutCubic").scaleTo(1);
    timeline.animate(email.reply[2]!).at(17.15).duration(0.32).ease("inOutCubic").scaleTo(1);
    timeline.animate(email.errorChip).at(17.15).duration(0.32).ease("inOutCubic").scaleTo(1);

    // Lock the chip to the top-right corner. The term legend appears dim, with no name lit.
    const chipPark: Vec2 = [7.09, 4.14];
    email.errorChip.forEach((piece) => {
      timeline.animate(piece).at(17.55).duration(0.70).ease("inOutCubic")
        .moveTo([chipPark[0], chipPark[1], piece.initialState.z]);
    });
    timeline.animate(legend).at(17.70).duration(0.40).ease("outCubic").fadeTo(0.34);

    this.play(timeline);
    this.wait(1.55);
    this.captureScreenshotsNamed([
      [13.40, "inbox-four-systems"],
      [17.20, "cold-open-wrong-day"],
      [18.60, "chip-and-legend"],
    ]);
  }
}

function raise(item: Tattva, z = 0.2): Tattva {
  item.at([item.initialState.x, item.initialState.y, z]);
  return item;
}

function addCheck(scene: Scene, at: Vec2): Tattva {
  return scene.add(
    Label("✓").height(0.18).color(COLOR.ai).opacity(0).css({ fontWeight: 900 }),
    { at: [at[0], at[1], 0.3] },
  );
}

interface LearnedMailSpec {
  at: Vec2;
  text: string;
  spam: boolean;
}

function addLearnedMails(scene: Scene, specs: readonly LearnedMailSpec[]): Tattva[][] {
  return specs.map((spec) => {
    const [x, y] = spec.at;
    const fill = spec.spam ? "#14382C" : "#1A2236";
    const ink = spec.spam ? COLOR.ml : COLOR.muted;
    const width = spec.spam ? 1.15 : 1.45;
    const panel = scene.add(
      Rectangle().size([width, 0.36]).cornerRadius(0.12).fill(fill).opacity(0)
        .css({ borderStyle: "none" }),
      { at: [x, y, 0.2] },
    );
    const label = scene.add(
      Label(spec.text).height(0.13).color(ink).opacity(0)
        .css({ fontWeight: 800, letterSpacing: "0.04em" }),
      { at: [x, y, 0.22] },
    );
    return [panel, label];
  });
}

function addDimLegend(scene: Scene): Tattva[] {
  const names = ["AI", "ML", "DL", "GenAI", "LLM", "Data science"];
  return names.map((name, index) => scene.add(
    Label(name).height(0.15).color(COLOR.ink).opacity(0)
      .css({ fontWeight: 700, letterSpacing: "0.03em" }),
    { at: [-6.95, 3.95 - index * 0.30, 0.3] },
  ));
}

function revealCard(timeline: Timeline, card: ResultCard, at: number): void {
  timeline.animate(card.all).at(at).stagger(0.035).duration(0.30).ease("outCubic").appear();
  timeline.animate(card.panel).at(at + 0.36).duration(0.22).ease("outCubic").scaleTo(1.06);
  timeline.animate(card.panel).at(at + 0.62).duration(0.24).ease("inOutCubic").scaleTo(1);
  timeline.animate(card.result).at(at + 0.40).duration(0.44).indicate();
}

function revealLearnedScore(
  timeline: Timeline,
  mails: readonly Tattva[][],
  card: ResultCard,
  target: Vec2,
  at: number,
): void {
  mails.forEach((mail, index) => {
    timeline.animate(mail).at(at + index * 0.12).duration(0.16).ease("outCubic").appear();
    mail.forEach((piece) => {
      timeline.animate(piece).at(at + 0.58).duration(0.42).ease("inCubic")
        .moveTo([target[0], target[1], piece.initialState.z]);
    });
    timeline.animate(mail).at(at + 0.98).duration(0.16).ease("inCubic").fadeTo(0);
  });
  revealCard(timeline, card, at + 1.05);
}

function revealResult(timeline: Timeline, connector: Tattva, card: ResultCard, at: number): void {
  timeline.animate(connector).at(at).duration(0.32).ease("outCubic").draw();
  timeline.animate(card.all).at(at + 0.16).stagger(0.035).duration(0.30).ease("outCubic").appear();
  timeline.animate(card.panel).at(at + 0.55).duration(0.22).ease("outCubic").scaleTo(1.06);
  timeline.animate(card.panel).at(at + 0.82).duration(0.24).ease("inOutCubic").scaleTo(1);
  timeline.animate(card.result).at(at + 0.58).duration(0.44).indicate();
}

function addResultCard(
  scene: Scene,
  spec: { at: Vec2; fill: string; result: string; detail: string },
): ResultCard {
  const [x, y] = spec.at;
  const panel = scene.add(
    Rectangle().size([2.18, 0.82]).cornerRadius(0.20).fill(spec.fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 14px ${spec.fill}35)` }),
    { at: [x, y, 0.12] },
  );
  const result = scene.add(
    Label(spec.result).height(0.20).color(COLOR.ink)
      .css({ fontWeight: 900, letterSpacing: "0.045em" }),
    { at: [x, y + 0.10, 0.14] },
  );
  const detail = scene.add(
    Label(spec.detail).height(0.12).color("rgba(248,250,252,0.76)")
      .css({ fontWeight: 650, letterSpacing: "0.005em" }),
    { at: [x, y - 0.19, 0.14] },
  );
  return { all: [panel, result, detail], panel, result };
}

await renderScene(import.meta.url, InboxFourSystemsScene, "03-inbox-four-systems.mp4");
