import { Scene, Timeline } from "veena/core";
import { Label } from "veena/text";
import { COLOR, FRAME } from "../lib/theme.ts";
import { addArrow, addCard, addHeading, addPill } from "../lib/ui.ts";
import { renderScene } from "../lib/render.ts";

class MLTypesDataScienceScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "WAYS A MACHINE CAN LEARN", "Useful vocabulary—but a story for another day");
    const ml = addCard(this, { title: "Machine Learning", subtitle: "Shared category", color: COLOR.ml, at: [0, 1.65], size: [3.4, 1.3] });
    const types = [
      addCard(this, { title: "Supervised", subtitle: "Labeled examples", color: COLOR.ml, at: [-4.9, -0.25], size: [2.75, 1.25] }),
      addCard(this, { title: "Unsupervised", subtitle: "Find structure", color: COLOR.ml, at: [-1.65, -0.25], size: [2.75, 1.25] }),
      addCard(this, { title: "Semi-supervised", subtitle: "Few labels + more data", color: COLOR.ml, at: [1.65, -0.25], size: [2.75, 1.25] }),
      addCard(this, { title: "Reinforcement", subtitle: "Rewards and feedback", color: COLOR.ml, at: [4.9, -0.25], size: [2.75, 1.25] }),
    ];
    const typeArrows = [-4.9, -1.65, 1.65, 4.9].map((x) => addArrow(this, [0, 0.95], [x, 0.45], COLOR.ml));
    const aside = this.add(Label("All four are learning setups within ML").height(0.25).color(COLOR.ink).css({ fontWeight: 750 }), { at: [0, -1.45, 0] });

    const dataScience = addCard(this, {
      title: "Data Science", subtitle: "Insight and decisions", detail: "Statistics • SQL • experiments • visualization",
      color: COLOR.muted, at: [-3.65, -0.25], size: [4.7, 1.8],
    });
    const aiSystems = addCard(this, {
      title: "AI Systems", subtitle: "Act on new input", detail: "Automation • safeguards • deployment",
      color: COLOR.ai, at: [3.65, -0.25], size: [4.7, 1.8],
    });
    const sharedML = addPill(this, "SHARED TOOL: MACHINE LEARNING", [0, -2.0], COLOR.ml, 4.0);
    const dsArrow = addArrow(this, [-2.1, -1.15], [-0.65, -1.8], COLOR.ml);
    const aiArrow = addArrow(this, [2.1, -1.15], [0.65, -1.8], COLOR.ml);
    const subscribe = [
      ...addPill(this, "SUBSCRIBE", [4.95, -3.35], COLOR.genai, 1.75),
      this.add(Label("More visual technology explainers").height(0.15).color(COLOR.muted), { at: [2.75, -3.35, 0] }),
    ];

    const typeVisuals = [...ml, ...types.flat(), ...typeArrows, aside];
    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate(ml).at(0.75).stagger(0.04).duration(0.4).appear();
    timeline.animate(typeArrows).at(1.35).stagger(0.08).duration(0.38).draw();
    timeline.animate(types.flat()).at(1.65).stagger(0.04).duration(0.36).appear();
    timeline.animate(aside).at(3.15).duration(0.7).typewrite();
    timeline.animate(typeVisuals).at(5.0).stagger(0.005).duration(0.45).disappear();
    timeline.animate([...dataScience, ...aiSystems]).at(5.35).stagger(0.035).duration(0.42).appear();
    timeline.animate([dsArrow, aiArrow]).at(6.1).stagger(0.12).duration(0.42).draw();
    timeline.animate(sharedML).at(6.45).stagger(0.08).duration(0.4).appear();
    timeline.animate(subscribe).at(8.0).stagger(0.12).duration(0.4).appear();
    this.play(timeline);
    this.wait(1.8);
  }
}

await renderScene(import.meta.url, MLTypesDataScienceScene, "07-ml-types-data-science.mp4");
