import { Scene, Timeline } from "murali-js/core";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "./lib/theme.ts";
import { addArrow, addCard, addHeading, addPill, addProgressBar } from "./lib/ui.ts";
import { renderScene } from "./lib/render.ts";

class NextTokenGenerationScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "HOW AN LLM GENERATES TEXT", "Predict a likely next token, append it, and repeat");
    const prompt = addCard(this, {
      title: "Prompt + current context", subtitle: "Thanks for the invitation.", detail: "I’ll …",
      color: COLOR.ai, at: [-5.05, 0.8], size: [4.0, 2.0],
    });
    const model = addCard(this, {
      title: "LLM", subtitle: "Context → probabilities", color: COLOR.foundation,
      at: [-0.65, 0.8], size: [2.55, 1.8],
    });
    const inputArrow = addArrow(this, [-3.0, 0.8], [-2.0, 0.8], COLOR.foundation);
    const outputArrow = addArrow(this, [0.7, 0.8], [1.55, 0.8], COLOR.foundation);
    const candidates = [["join", 0.48], ["be", 0.24], ["review", 0.16], ["confirm", 0.08]] as const;
    const bars = candidates.map(([token, probability], index) => {
      const y = 1.85 - index * 0.72;
      const bar = addProgressBar(this, [4.35, y], 3.2, probability, COLOR.genai);
      const label = this.add(
        Label(`${token}  ${Math.round(probability * 100)}%`).height(0.16).color(COLOR.ink).css({ fontWeight: 800 }),
        { at: [4.35, y + 0.28, 0.03] },
      );
      return [...bar, label];
    });
    const selected = addPill(this, "join", [4.35, -1.35], COLOR.genai, 1.4);
    const appendArrow = addArrow(this, [3.7, -1.55], [1.5, -2.5], COLOR.genai);
    const updated = addCard(this, {
      title: "Updated context", subtitle: "Thanks for the invitation. I’ll join …",
      color: COLOR.genai, at: [0, -2.75], size: [7.4, 1.15],
    });
    const repeat = this.add(
      Label("REPEAT  →  PREDICT  →  APPEND").height(0.27).color(COLOR.muted).css({ fontWeight: 900, letterSpacing: "0.08em" }),
      { at: [0, -3.7, 0] },
    );

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate(prompt).at(0.75).stagger(0.04).duration(0.4).appear();
    timeline.animate(inputArrow).at(1.35).duration(0.38).draw();
    timeline.animate(model).at(1.7).stagger(0.04).duration(0.4).appear();
    timeline.animate(outputArrow).at(2.25).duration(0.38).draw();
    bars.forEach((bar, index) => timeline.animate(bar).at(2.6 + index * 0.2).stagger(0.025).duration(0.35).appear());
    timeline.animate(selected).at(3.65).stagger(0.04).duration(0.4).appear();
    timeline.animate(selected[0]).at(4.15).duration(0.4).scaleTo(1.08);
    timeline.animate(appendArrow).at(4.55).duration(0.45).draw();
    timeline.animate(updated).at(4.9).stagger(0.04).duration(0.4).appear();
    timeline.animate(repeat).at(5.7).duration(0.7).typewrite();
    timeline.animate(model[0]).at(6.65).duration(0.4).scaleTo(1.05);
    timeline.animate(updated[0]).at(7.1).duration(0.4).scaleTo(1.035);
    this.play(timeline);
    this.wait(1.8);
  }
}

await renderScene(import.meta.url, NextTokenGenerationScene, "11-next-token-generation.mp4");
