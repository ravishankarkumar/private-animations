import { Scene, Timeline } from "veena/core";
import { Label } from "veena/text";
import { COLOR, FRAME } from "../lib/theme.ts";
import { addArrow, addCard, addHeading } from "../lib/ui.ts";
import { renderScene } from "../lib/render.ts";

class RisksAndGuardrailsScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "FLUENT DOES NOT ALWAYS MEAN FACTUAL", "Generated output can sound confident even when a detail is wrong");
    const source = addCard(this, {
      title: "Source email", subtitle: "The meetup is on Tuesday at 6 PM.",
      color: COLOR.ai, at: [-4.2, 1.15], size: [5.0, 1.7],
    });
    const draft = addCard(this, {
      title: "AI-drafted reply", subtitle: "Thank you. I’ll see you on Wednesday at 6 PM.",
      color: COLOR.genai, at: [4.2, 1.15], size: [5.0, 1.7],
    });
    const arrow = addArrow(this, [-1.6, 1.15], [1.6, 1.15], COLOR.genai);
    const warning = addCard(this, {
      title: "Incorrect detail", subtitle: "Tuesday became Wednesday", result: "VERIFY",
      color: COLOR.warning, at: [4.2, -0.35], size: [4.3, 1.2],
    });
    const riskSpecs = [
      ["Incorrect details", "Verify important claims", COLOR.warning], ["Bias", "Evaluate across groups", COLOR.gold],
      ["Privacy", "Protect sensitive data", COLOR.ai], ["Misuse", "Keep human oversight", COLOR.dl],
    ] as const;
    const guardrails = riskSpecs.map(([title, subtitle, color], index) => addCard(this, {
      title, subtitle, color, at: [-5.55 + index * 3.7, -2.25], size: [3.25, 1.35],
    }));
    const footer = this.add(
      Label("USEFUL ASSISTANT  ≠  UNQUESTIONABLE AUTHORITY").height(0.3).color(COLOR.ink).css({ fontWeight: 900, letterSpacing: "0.055em" }),
      { at: [0, -3.55, 0] },
    );

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate(source).at(0.75).stagger(0.04).duration(0.4).appear();
    timeline.animate(arrow).at(1.4).duration(0.45).draw();
    timeline.animate(draft).at(1.8).stagger(0.04).duration(0.4).appear();
    timeline.animate(warning).at(2.6).stagger(0.04).duration(0.4).appear();
    timeline.animate(warning[0]).at(3.15).duration(0.45).scaleTo(1.06);
    guardrails.forEach((card, index) => timeline.animate(card).at(3.85 + index * 0.22).stagger(0.03).duration(0.38).appear());
    timeline.animate(footer).at(5.15).duration(0.8).typewrite();
    this.play(timeline);
    this.wait(2.0);
  }
}

await renderScene(import.meta.url, RisksAndGuardrailsScene, "12-risks-and-guardrails.mp4");
