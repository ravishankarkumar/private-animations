import { Scene, Timeline } from "murali-js/core";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "./lib/theme.ts";
import { addArrow, addCard, addHeading } from "./lib/ui.ts";
import { renderScene } from "./lib/render.ts";

class AppliedAIStackScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "AI IS THE COMPLETE SYSTEM", "Machine learning is one technique inside the product");
    const aiDefinition = this.add(Label("AI  =  BROAD GOAL / COMPLETE SYSTEM").height(0.34).color(COLOR.ai).css({ fontWeight: 900 }), { at: [0, 2.3, 0] });
    const mlDefinition = this.add(Label("ML  =  ONE TECHNIQUE USED TO BUILD IT").height(0.3).color(COLOR.ml).css({ fontWeight: 900 }), { at: [0, 1.7, 0] });

    const specs = [
      ["Incoming\nemail", "Input", COLOR.ai, -5.25],
      ["ML\nmodel", "Learned signal", COLOR.ml, -2.65],
      ["Rules +\nsafeguards", "Policy", COLOR.ai, 0],
      ["Inbox\nexperience", "Product", COLOR.foundation, 2.65],
      ["User\ndecision", "Judgment", COLOR.genai, 5.25],
    ] as const;
    const cards = specs.map(([title, subtitle, color, x]) => addCard(this, {
      title, subtitle, color, at: [x, -0.45], size: [2.15, 1.6],
    }));
    const arrows = specs.slice(0, -1).map(([, , , x], index) => addArrow(this, [x + 1.1, -0.45], [specs[index + 1][3] - 1.1, -0.45], COLOR.muted));
    const footer = this.add(Label("The model is important—but it is not the whole application.").height(0.25).color(COLOR.ink).css({ fontWeight: 750 }), { at: [0, -2.15, 0] });

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate(aiDefinition).at(0.85).duration(0.7).typewrite();
    timeline.animate(mlDefinition).at(1.55).duration(0.7).typewrite();
    cards.forEach((card, index) => {
      const at = 2.5 + index * 0.8;
      timeline.animate(card).at(at).stagger(0.035).duration(0.34).appear();
      if (index > 0) timeline.animate(arrows[index - 1]).at(at - 0.25).duration(0.35).draw();
    });
    timeline.animate(cards[1][0]).at(6.75).duration(0.45).scaleTo(1.05);
    timeline.animate(footer).at(7.15).duration(0.8).typewrite();
    this.play(timeline);
    this.wait(1.4);
  }
}

await renderScene(import.meta.url, AppliedAIStackScene, "05-applied-ai-stack.mp4");
