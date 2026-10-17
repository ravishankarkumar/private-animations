import { Scene, Timeline } from "murali-js/core";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "../lib/theme.ts";
import { addArrow, addCard, addHeading, addPill, addProgressBar } from "../lib/ui.ts";
import { renderScene } from "../lib/render.ts";

class MLTrainingInferenceScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "MACHINE LEARNING", "One way to build AI: learn patterns from examples");
    const trainingTag = addPill(this, "TRAINING", [-4.9, 2.25], COLOR.ml, 1.55);
    const examples = [
      addCard(this, { title: "Email A", subtitle: "Prize waiting", result: "SPAM", color: COLOR.warning, at: [-5.1, 1.25], size: [2.35, 1.25] }),
      addCard(this, { title: "Email B", subtitle: "Team update", result: "NOT SPAM", color: COLOR.ml, at: [-5.1, -0.25], size: [2.35, 1.25] }),
      addCard(this, { title: "Email C", subtitle: "Urgent transfer", result: "SPAM", color: COLOR.warning, at: [-5.1, -1.75], size: [2.35, 1.25] }),
    ];
    const model = addCard(this, {
      title: "Spam model", subtitle: "Learns statistical patterns", detail: "Parameters update", color: COLOR.ml,
      at: [-1.45, -0.25], size: [3.2, 1.8],
    });
    const trainingArrows = examples.map((_, index) => addArrow(this, [-3.9, 1.25 - index * 1.5], [-3.05, -0.25], COLOR.ml));

    const divider = this.add(Label("TRAINING  →  INFERENCE").height(0.2).color(COLOR.muted).css({ fontWeight: 850, letterSpacing: "0.08em" }), { at: [1.1, 2.25, 0] });
    const newEmail = addCard(this, {
      title: "New email", subtitle: "Unknown sender", detail: "Review the attached link", color: COLOR.ai,
      at: [1.35, 0.4], size: [2.9, 1.55],
    });
    const inferenceArrow = addArrow(this, [2.85, 0.4], [3.55, 0.4], COLOR.ml);
    const output = addCard(this, {
      title: "Prediction", subtitle: "Inference output", result: "SPAM 96%", color: COLOR.ml,
      at: [5.05, 0.4], size: [2.75, 1.55],
    });
    const probabilityBar = addProgressBar(this, [5.05, -0.8], 2.7, 0.96, COLOR.ml);
    const compare = [
      ...addPill(this, "TRAINING: LEARN PARAMETERS", [-2.3, -3.0], COLOR.ml, 3.4),
      ...addPill(this, "INFERENCE: USE PARAMETERS", [2.3, -3.0], COLOR.ai, 3.4),
    ];

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.15).duration(0.5).appear();
    timeline.animate(trainingTag).at(0.7).stagger(0.08).duration(0.35).appear();
    examples.forEach((card, index) => {
      timeline.animate(card).at(1.15 + index * 0.55).stagger(0.025).duration(0.3).appear();
      timeline.animate(trainingArrows[index]).at(1.5 + index * 0.55).duration(0.38).draw();
    });
    timeline.animate(model).at(2.1).stagger(0.04).duration(0.42).appear();
    timeline.animate(model[0]).at(3.2).duration(0.4).scaleTo(1.05);
    timeline.animate(divider).at(4.0).duration(0.7).typewrite();
    timeline.animate(newEmail).at(4.55).stagger(0.04).duration(0.4).appear();
    timeline.animate(inferenceArrow).at(5.25).duration(0.4).draw();
    timeline.animate(output).at(5.5).stagger(0.04).duration(0.4).appear();
    timeline.animate(probabilityBar).at(6.15).stagger(0.08).duration(0.45).appear();
    timeline.animate(compare).at(7.15).stagger(0.1).duration(0.42).appear();
    this.play(timeline);
    this.wait(1.8);
    this.captureScreenshotsNamed([[7.8, "training-vs-inference"]]);
  }
}

await renderScene(import.meta.url, MLTrainingInferenceScene, "06-ml-training-inference.mp4");
