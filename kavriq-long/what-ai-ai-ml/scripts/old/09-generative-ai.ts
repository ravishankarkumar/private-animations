import { Scene, Timeline } from "murali-js/core";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "../lib/theme.ts";
import { addArrow, addCard, addEmailMessage, addHeading, addPill } from "../lib/ui.ts";
import { renderScene } from "../lib/render.ts";

class GenerativeAIComparisonScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "GENERATIVE AI", "Create a new output instead of only choosing a label");
    const email = addEmailMessage(this, [0, 1.45], 0.58);
    const left = addCard(this, {
      title: "Discriminative model", subtitle: "Choose or predict a category", detail: "Is this email spam?",
      result: "SPAM 96%", color: COLOR.ml, at: [-3.7, -0.65], size: [5.2, 2.15],
    });
    const right = addCard(this, {
      title: "Generative model", subtitle: "Produce a new sample", detail: "Draft a polite reply",
      color: COLOR.genai, at: [3.7, -0.65], size: [5.2, 2.15],
    });
    const leftArrow = addArrow(this, [-0.85, 0.72], [-2.5, 0.2], COLOR.ml);
    const rightArrow = addArrow(this, [0.85, 0.72], [2.5, 0.2], COLOR.genai);
    const tokens = ["Thanks", "for", "reaching", "out", "…"].map((token, index) =>
      addPill(this, token, [2.2 + index * 0.78, -1.32], COLOR.genai, index === 2 ? 1.05 : 0.72));
    const contrast = this.add(Label("CLASSIFY  ≠  GENERATE").height(0.32).color(COLOR.ink).css({ fontWeight: 900, letterSpacing: "0.08em" }), { at: [0, -3.0, 0] });

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate(email.all).at(0.75).stagger(0.025).duration(0.38).appear();
    timeline.animate([leftArrow, rightArrow]).at(1.5).stagger(0.18).duration(0.42).draw();
    timeline.animate([...left, ...right]).at(1.85).stagger(0.03).duration(0.4).appear();
    tokens.forEach((token, index) => {
      timeline.animate(token).at(3.5 + index * 0.48).stagger(0.03).duration(0.32).appear();
    });
    timeline.animate(left[0]).at(5.9).duration(0.4).scaleTo(1.05);
    timeline.animate(right[0]).at(6.35).duration(0.4).scaleTo(1.05);
    timeline.animate(contrast).at(7.1).duration(0.85).typewrite();
    this.play(timeline);
    this.wait(1.6);
  }
}

await renderScene(import.meta.url, GenerativeAIComparisonScene, "09-generative-ai.mp4");
