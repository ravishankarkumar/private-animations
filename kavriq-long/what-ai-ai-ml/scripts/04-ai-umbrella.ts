import { Scene, Timeline } from "murali-js/core";
import { Circle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "./lib/theme.ts";
import { addCard, addHeading, addLine, addPill } from "./lib/ui.ts";
import { renderScene } from "./lib/render.ts";

class AIUmbrellaScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "ARTIFICIAL INTELLIGENCE", "The broad goal—not a synonym for machine learning");
    const ai = this.add(Circle().radius(1.28).fill("rgba(49,215,255,0.10)").stroke({ color: COLOR.ai, width: 0.055 }), { at: [0, 0.35, 0] });
    const aiLabel = this.add(Label("AI").height(0.78).color(COLOR.ai).css({ fontWeight: 950 }), { at: [0, 0.47, 0.02] });
    const aiSub = this.add(Label("Broad field and goal").height(0.18).color(COLOR.ink).css({ fontWeight: 700 }), { at: [0, -0.2, 0.02] });
    const abilities = [
      ["REASONING", -4.2, 1.55], ["PLANNING", -4.35, -0.35], ["PERCEPTION", 4.2, 1.55],
      ["LANGUAGE", 4.35, -0.35], ["LEARNING", 0, -2.0],
    ] as const;
    const abilityCards = abilities.flatMap(([title, x, y]) => addCard(this, {
      title, subtitle: "Intelligent task", color: COLOR.ai, at: [x, y], size: [2.65, 1.0],
    }));

    const timelineY = -3.05;
    const historyLine = addLine(this, [-5.5, timelineY], [5.5, timelineY], COLOR.muted, 0.025);
    const milestones = [
      ["1950s", "AI research", -5.0], ["1970s–80s", "Expert systems", -1.8],
      ["2010s", "Deep learning", 1.65], ["Today", "Generative systems", 4.8],
    ] as const;
    const milestoneVisuals = milestones.flatMap(([year, text, x]) => [
      ...addPill(this, year, [x, timelineY + 0.34], COLOR.ai, 1.2),
      this.add(Label(text).height(0.13).color(COLOR.muted), { at: [x, timelineY - 0.28, 0] }),
    ]);

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate([ai, aiLabel, aiSub]).at(0.8).stagger(0.12).duration(0.48).appear();
    timeline.animate(abilityCards).at(2.0).stagger(0.11).duration(0.42).appear();
    timeline.animate(historyLine).at(4.0).duration(0.7).draw();
    timeline.animate(milestoneVisuals).at(4.25).stagger(0.065).duration(0.35).appear();
    timeline.animate([ai, ...abilityCards]).at(7.0).stagger(0.02).duration(0.35).scaleTo(1.035);
    this.play(timeline);
    this.wait(1.4);
  }
}

await renderScene(import.meta.url, AIUmbrellaScene, "04-ai-umbrella.mp4");
