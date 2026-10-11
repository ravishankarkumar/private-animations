import { Scene, Timeline } from "murali-js/core";
import { Circle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import { ALPHA, COLOR, FRAME } from "./lib/theme.ts";
import { addCard, addHeading, addLine, addPill } from "./lib/ui.ts";
import { renderScene } from "./lib/render.ts";

class RecapMapScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "ONE MAP. FIVE TERMS.", "Different scopes, methods, model families, and capabilities");
    const ai = this.add(Circle().radius(2.55).fill(ALPHA.ai).stroke({ color: COLOR.ai, width: 0.05 }), { at: [-3.4, 0.25, 0] });
    const ml = this.add(Circle().radius(1.92).fill(ALPHA.ml).stroke({ color: COLOR.ml, width: 0.05 }), { at: [-3.25, 0.12, 0.02] });
    const dl = this.add(Circle().radius(1.28).fill(ALPHA.dl).stroke({ color: COLOR.dl, width: 0.05 }), { at: [-3.05, 0, 0.04] });
    const gen = this.add(Circle().radius(0.68).fill(ALPHA.genai).stroke({ color: COLOR.genai, width: 0.05 }), { at: [-2.6, -0.2, 0.06] });
    const labels = [
      this.add(Label("AI · broad goal").height(0.2).color(COLOR.ai).css({ fontWeight: 900 }), { at: [-4.25, 2.05, 0.1] }),
      this.add(Label("ML · learns from data").height(0.18).color(COLOR.ml).css({ fontWeight: 850 }), { at: [-4.0, 1.35, 0.1] }),
      this.add(Label("DL · neural networks").height(0.16).color(COLOR.dl).css({ fontWeight: 850 }), { at: [-3.65, 0.72, 0.1] }),
      this.add(Label("GenAI").height(0.16).color(COLOR.genai).css({ fontWeight: 900 }), { at: [-2.6, -0.2, 0.1] }),
    ];
    const foundation = addCard(this, {
      title: "Foundation model", subtitle: "Broadly pre-trained; useful across tasks",
      color: COLOR.foundation, at: [2.7, 1.6], size: [4.5, 1.35],
    });
    const foundationLink = addLine(this, [0.42, 1.2], [-1.95, 0.15], COLOR.foundation, 0.045);
    const dataScience = addCard(this, {
      title: "Data science", subtitle: "Understand data and support decisions",
      color: COLOR.gold, at: [3.55, -0.25], size: [4.4, 1.35],
    });
    const overlapLink = addLine(this, [1.3, -0.2], [-1.35, 0], COLOR.ml, 0.045);
    const emailSpine = addCard(this, {
      title: "The email example", subtitle: "AI: whole system  •  ML: spam patterns  •  DL: representations",
      detail: "Foundation model: reusable base  •  GenAI: drafts the reply",
      color: COLOR.ink, at: [0, -2.35], size: [11.2, 1.45],
    });
    const finalPills = [
      addPill(this, "AI · goal", [-4.8, -3.55], COLOR.ai, 1.75),
      addPill(this, "ML · method", [-2.4, -3.55], COLOR.ml, 1.9),
      addPill(this, "DL · approach", [0, -3.55], COLOR.dl, 2.05),
      addPill(this, "FM · model", [2.4, -3.55], COLOR.foundation, 1.85),
      addPill(this, "GenAI · capability", [4.95, -3.55], COLOR.genai, 2.5),
    ];

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate(ai).at(0.75).duration(0.5).draw();
    timeline.animate(ml).at(1.15).duration(0.5).draw();
    timeline.animate(dl).at(1.55).duration(0.45).draw();
    timeline.animate(gen).at(1.9).duration(0.4).draw();
    timeline.animate(labels).at(2.25).stagger(0.16).duration(0.35).appear();
    timeline.animate(foundation).at(3.0).stagger(0.04).duration(0.4).appear();
    timeline.animate(foundationLink).at(3.45).duration(0.4).draw();
    timeline.animate(dataScience).at(3.9).stagger(0.04).duration(0.4).appear();
    timeline.animate(overlapLink).at(4.35).duration(0.4).draw();
    timeline.animate(emailSpine).at(4.9).stagger(0.035).duration(0.4).appear();
    finalPills.forEach((pill, index) => timeline.animate(pill).at(5.85 + index * 0.16).stagger(0.025).duration(0.35).appear());
    this.play(timeline);
    this.wait(2.4);
  }
}

await renderScene(import.meta.url, RecapMapScene, "13-recap-map.mp4");
