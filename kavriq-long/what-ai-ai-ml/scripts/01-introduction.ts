import { Scene, Timeline, type Tattva, type Vec2 } from "murali-js/core";
import { KavriqSplashLogo, KavriqSplashMotion } from "murali-js/composite";
import { Rectangle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import { PageTurn } from "murali-js/storytelling";
import { EnvelopeOpeningSequence, WaxSealedEnvelope } from "murali-scene-kit";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { COLOR, FRAME } from "./lib/theme.ts";
import { addArrow } from "./lib/ui.ts";

const SOLID = {
  ai: "#17647D",
  ml: "#1E7A55",
  dl: "#53368A",
  genai: "#C4485C",
} as const;

class TerminologyPage extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const ai = this.add(
      Label("ARTIFICIAL INTELLIGENCE").height(0.66).color(COLOR.ai)
        .css({ fontWeight: 950, letterSpacing: "-0.025em" }),
      { at: [0, 2.15, 0.05] },
    );
    const ml = this.add(
      Label("MACHINE LEARNING").height(0.48).color(COLOR.ml)
        .css({ fontWeight: 900, letterSpacing: "-0.018em" }),
      { at: [-2.55, 0.55, 0.05] },
    );
    const separator = this.add(
      Label("•").height(0.42).color(COLOR.muted).css({ fontWeight: 900 }),
      { at: [0, 0.55, 0.05] },
    );
    const dl = this.add(
      Label("DEEP LEARNING").height(0.48).color(COLOR.dl)
        .css({ fontWeight: 900, letterSpacing: "-0.018em" }),
      { at: [2.55, 0.55, 0.05] },
    );
    const genai = this.add(
      Label("GENERATIVE AI").height(0.58).color(COLOR.genai)
        .css({ fontWeight: 950, letterSpacing: "-0.022em" }),
      { at: [0, -1.35, 0.05] },
    );
    const underline = this.add(
      Rectangle().size([5.35, 0.045]).cornerRadius(0.02).fill(COLOR.genai),
      { at: [0, -1.88, 0.04] },
    );

    const timeline = new Timeline();
    timeline.animate(ai).at(0.35).duration(0.90).typewrite();
    timeline.animate(ml).at(2.15).duration(0.85).typewrite();
    timeline.animate(separator).at(3.08).duration(0.20).appear();
    timeline.animate(dl).at(3.32).duration(0.82).typewrite();
    timeline.animate(genai).at(4.75).duration(0.88).typewrite();
    timeline.animate(underline).at(5.45).duration(0.55).draw();
    timeline.animate([ai, ml, dl, genai]).at(6.35).stagger(0.05).duration(0.38).scaleTo(1.025);
    this.play(timeline);
    this.wait(32);
  }
}

interface ResultCard {
  all: Tattva[];
  panel: Tattva;
  result: Tattva;
}

class EmailPage extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const envelope = this.add(WaxSealedEnvelope({
      width: 5.15,
      height: 3.18,
      recipient: "One practical example",
      sealColor: "#8B2635",
      sealMark: "K",
      showEmailMark: true,
    }), { at: [0, -0.25, 0.32] });

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

    const connectors = [
      addArrow(this, email.anchors.subject, [-4.52, 1.55], COLOR.ai),
      addArrow(this, email.anchors.body, [4.52, 1.55], COLOR.ml),
      addArrow(this, email.anchors.attachment, [-4.52, -1.55], COLOR.dl),
      addArrow(this, email.anchors.reply, [4.52, -1.55], COLOR.genai),
    ].map((arrow) => raise(arrow));
    const cards = [flagged, spam, dog, draft] as const;

    // Everything after the envelope reveal starts hidden. The nested page uses
    // the parent clock, so its timings include the terminology page and turn.
    email.all.forEach((item) => item.opacity(0));
    cards.forEach((card) => card.all.forEach((item) => item.opacity(0)));
    connectors.forEach((item) => item.opacity(0));
    email.errorChip.forEach((item) => item.opacity(0));

    const timeline = new Timeline();
    timeline.add(EnvelopeOpeningSequence(envelope, {
      at: 7.30,
      entranceDuration: 0.55,
      duration: 2.25,
    }), { at: 0 });

    // The full email replaces the stylized letter as it leaves the envelope.
    timeline.animate(email.all).at(10.35).stagger(0.004).duration(0.62).ease("outCubic").appear();
    timeline.animate(email.all).at(10.35).stagger(0.002).duration(0.68).ease("outCubic").scaleTo(1.018);
    timeline.animate(email.all).at(11.12).stagger(0.002).duration(0.35).ease("inOutCubic").scaleTo(1);
    timeline.animate(envelope).at(10.70).duration(0.75).ease("inCubic").moveTo([-7.8, -0.3, 0.32]);
    timeline.animate(envelope).at(10.82).duration(0.62).ease("inCubic").fadeTo(0);

    // “Four different AI systems work on the same email.”
    timeline.animate(email.all).at(12.30).stagger(0.002).duration(0.34).ease("outCubic").scaleTo(1.01);
    timeline.animate(email.all).at(12.78).stagger(0.002).duration(0.30).ease("inOutCubic").scaleTo(1);

    revealResult(timeline, connectors[0]!, flagged, 14.30);
    revealResult(timeline, connectors[1]!, spam, 17.25);
    revealResult(timeline, connectors[2]!, dog, 20.15);
    revealResult(timeline, connectors[3]!, draft, 23.05);

    // Tuesday in the message, Wednesday in the generated draft.
    timeline.animate(email.body[1]!).at(26.05).duration(0.40).ease("outCubic").scaleTo(1.065);
    timeline.animate(email.body[1]!).at(26.88).duration(0.34).ease("inOutCubic").scaleTo(1);
    timeline.animate(email.reply[2]!).at(27.18).duration(0.40).ease("outCubic").scaleTo(1.065);
    timeline.animate(email.errorChip).at(27.62).stagger(0.04).duration(0.28).ease("outCubic").appear();
    timeline.animate(email.errorChip).at(28.08).duration(0.30).ease("outCubic").scaleTo(1.10);
    timeline.animate(email.errorChip).at(28.62).duration(0.30).ease("inOutCubic").scaleTo(1);
    timeline.animate(email.reply[2]!).at(28.72).duration(0.34).ease("inOutCubic").scaleTo(1);

    // “Hallucinations, right?” Keep the question alive for the later section.
    timeline.animate(draft.all).at(30.15).duration(0.35).ease("outCubic").scaleTo(1.065);
    timeline.animate(email.errorChip).at(30.25).duration(0.35).ease("outCubic").scaleTo(1.12);
    timeline.animate(draft.all).at(31.00).duration(0.32).ease("inOutCubic").scaleTo(1);
    timeline.animate(email.errorChip).at(31.00).duration(0.32).ease("inOutCubic").scaleTo(1);

    const chipPark: Vec2 = [6.35, 3.72];
    email.errorChip.forEach((piece) => {
      timeline.animate(piece).at(32.25).duration(0.78).ease("inOutCubic")
        .moveTo([chipPark[0], chipPark[1], piece.initialState.z + 0.35]);
    });

    this.play(timeline);
    this.wait(3.2);
  }
}

class IntroductionScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const terminology = new TerminologyPage();
    const email = new EmailPage();
    const turn = PageTurn(terminology, email)
      .direction("left")
      .style({
        curlWidth: 0.72,
        paperColor: COLOR.panelSoft,
        shadowBlur: 24,
        shadowOpacity: 0.38,
      })
      .timing({ duration: 1.35 })
      .addTo(this);

    // Persistent channel branding: the canonical Kavriq water-drop grows,
    // detaches, falls, and splashes on a seamless 4.2-second loop.
    const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
    this.addBranding(kavriq, { at: [7.42, 3.78, 20] });
    const kavriqMotion = KavriqSplashMotion(kavriq);
    this.updater((time, states) => {
      kavriqMotion.update(time % kavriqMotion.duration, states);
    });

    const timeline = new Timeline();
    turn.animate(timeline, { at: 7.15 });
    this.play(timeline);
    this.wait(29.5);
    this.captureScreenshotsNamed([
      [5.75, "part-01-terminology"],
      [12.20, "part-01-email"],
      [24.80, "part-01-four-results"],
      [33.30, "part-01-hallucination-hook"],
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
  return { all: [panel, result, detail], panel, result };
}

function revealResult(
  timeline: Timeline,
  connector: Tattva,
  card: ResultCard,
  at: number,
): void {
  timeline.animate(connector).at(at).duration(0).appear();
  timeline.animate(connector).at(at).duration(0.42).ease("outCubic").draw();
  timeline.animate(card.all).at(at + 0.20).stagger(0.035).duration(0.32).ease("outCubic").appear();
  timeline.animate(card.panel).at(at + 0.62).duration(0.24).ease("outCubic").scaleTo(1.06);
  timeline.animate(card.panel).at(at + 0.94).duration(0.25).ease("inOutCubic").scaleTo(1);
  timeline.animate(card.result).at(at + 0.58).duration(0.48).indicate();
}

function raise(item: Tattva, z = 0.18): Tattva {
  item.at([item.initialState.x, item.initialState.y, z]);
  return item;
}

await renderScene(import.meta.url, IntroductionScene, "01-introduction.mp4");
