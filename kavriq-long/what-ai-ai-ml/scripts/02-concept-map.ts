import { Scene, Timeline } from "murali-js/core";
import { Circle, Rectangle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import { ALPHA, COLOR, FRAME } from "./lib/theme.ts";
import { addHeading, nodesAndEdges } from "./lib/ui.ts";
import { renderScene } from "./lib/render.ts";

class ConceptMapScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "THE HIGH-LEVEL MAP", "Field → method → architecture → reusable model → capability");
    const ai = this.add(Circle().radius(2.75).fill("rgba(49,215,255,0.06)").stroke({ color: COLOR.ai, width: 0.055 }), { at: [-1.65, -0.1, 0] });
    const ml = this.add(Circle().radius(2.15).fill("rgba(87,227,161,0.08)").stroke({ color: COLOR.ml, width: 0.055 }), { at: [-1.25, -0.22, 0.02] });
    const dl = this.add(Circle().radius(1.48).fill("rgba(155,109,255,0.10)").stroke({ color: COLOR.dl, width: 0.055 }), { at: [-0.85, -0.38, 0.04] });
    const genai = this.add(Circle().radius(1.03).fill("rgba(255,95,162,0.13)").stroke({ color: COLOR.genai, width: 0.055 }), { at: [0.38, -0.95, 0.06] });

    const aiLabel = this.add(Label("ARTIFICIAL INTELLIGENCE").height(0.25).color(COLOR.ai).css({ fontWeight: 900 }), { at: [-2.35, 1.95, 0.08] });
    const mlLabel = this.add(Label("MACHINE LEARNING").height(0.23).color(COLOR.ml).css({ fontWeight: 900 }), { at: [-1.85, 1.28, 0.08] });
    const dlLabel = this.add(Label("DEEP LEARNING").height(0.22).color(COLOR.dl).css({ fontWeight: 900 }), { at: [-1.2, 0.54, 0.08] });
    const genLabel = this.add(Label("GENERATIVE\nAI").height(0.21).color(COLOR.genai).css({ fontWeight: 900, textAlign: "center" }), { at: [0.38, -0.92, 0.08] });

    const foundationCard = this.add(Rectangle().size([2.75, 0.92]).cornerRadius(0.18).fill(ALPHA.foundation)
      .stroke({ color: COLOR.foundation, width: 0.045 }).css({ borderStyle: "none" }), { at: [4.35, 0.8, 0] });
    const foundationLabel = this.add(Label("FOUNDATION MODELS").height(0.22).color(COLOR.foundation).css({ fontWeight: 900 }), { at: [4.35, 0.91, 0.02] });
    const foundationSub = this.add(Label("Broadly trained • reusable").height(0.14).color(COLOR.muted), { at: [4.35, 0.55, 0.02] });
    const llmCard = this.add(Rectangle().size([2.2, 0.74]).cornerRadius(0.18).fill(ALPHA.foundation)
      .stroke({ color: COLOR.foundation, width: 0.035 }).css({ borderStyle: "none" }), { at: [4.35, -0.35, 0] });
    const llmLabel = this.add(Label("LLM  •  LANGUAGE").height(0.19).color(COLOR.foundation).css({ fontWeight: 850 }), { at: [4.35, -0.35, 0.02] });

    const network = nodesAndEdges(this, [2, 3, 3, 1], [4.3, -2.05], COLOR.dl, 0.82, 0.48);
    const networkLabel = this.add(Label("NEURAL NETWORK").height(0.15).color(COLOR.dl).css({ fontWeight: 850, letterSpacing: "0.08em" }), { at: [4.3, -3.03, 0] });

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.15).duration(0.6).appear();
    timeline.animate(ai).at(0.8).duration(0.75).draw();
    timeline.animate(aiLabel).at(1.15).duration(0.55).typewrite();
    timeline.animate(ml).at(2.0).duration(0.7).draw();
    timeline.animate(mlLabel).at(2.3).duration(0.5).typewrite();
    timeline.animate(dl).at(3.15).duration(0.7).draw();
    timeline.animate(dlLabel).at(3.45).duration(0.5).typewrite();
    timeline.animate([...network.edges, ...network.nodes]).at(3.7).stagger(0.025).duration(0.35).appear();
    timeline.animate(networkLabel).at(4.3).duration(0.45).typewrite();
    timeline.animate(genai).at(5.0).duration(0.7).draw();
    timeline.animate(genLabel).at(5.3).duration(0.5).typewrite();
    timeline.animate([foundationCard, foundationLabel, foundationSub]).at(6.45).stagger(0.12).duration(0.45).appear();
    timeline.animate([llmCard, llmLabel]).at(7.45).stagger(0.12).duration(0.45).appear();
    timeline.animate([ai, ml, dl, genai, foundationCard, llmCard]).at(9.1).stagger(0.08).duration(0.42).scaleTo(1.04);
    this.play(timeline);
    this.wait(1.8);
    this.captureScreenshotsNamed([[9.8, "concept-map"]]);
  }
}

await renderScene(import.meta.url, ConceptMapScene, "02-concept-map.mp4");
