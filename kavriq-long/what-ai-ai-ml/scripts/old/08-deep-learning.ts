import { NeuralNetwork, neuralNetwork } from "murali-js/ai";
import { Scene, Timeline } from "murali-js/core";
import { Circle } from "murali-js/primitives";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "../lib/theme.ts";
import { addHeading, addPill } from "../lib/ui.ts";
import { renderScene } from "../lib/render.ts";

class DeepLearningScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "DEEP LEARNING", "Machine learning using neural networks with many layers");
    const model = neuralNetwork([
      { id: "input", label: "Pixels", nodes: ["x₁", "x₂", "x₃"] },
      { id: "hidden1", label: "Edges", nodes: ["h₁", "h₂", "h₃", "h₄"], activation: "ReLU" },
      { id: "hidden2", label: "Shapes", nodes: ["z₁", "z₂", "z₃"], activation: "ReLU" },
      { id: "output", label: "Prediction", nodes: ["ŷ"], activation: "sigmoid" },
    ], { layerSpacing: 2.45, nodeSpacing: 0.72, nodeRadius: 0.17 });
    const network = this.add(NeuralNetwork(model, {
      node: COLOR.dl,
      nodeIdle: "#25203D",
      edge: "rgba(155,109,255,0.28)",
      positive: COLOR.ml,
      negative: COLOR.warning,
      flow: COLOR.dl,
      text: COLOR.ink,
      edgeThickness: 0.022,
      pulseRadius: 0.08,
      showValues: false,
    }), { at: [0, 0.25, 0] });
    const input = addPill(this, "DOG IMAGE", [-5.75, 0.25], COLOR.ai, 1.65);
    const wrong = addPill(this, "CAT 54%", [5.6, 0.25], COLOR.warning, 1.55);
    const error = addPill(this, "ERROR", [5.6, -1.15], COLOR.warning, 1.35);
    const feedbackPulse = this.add(Circle().radius(0.11).fill(COLOR.warning).opacity(0), { at: [5.0, -1.15, 0.1] });
    const trainingLoop = this.add(Label("PREDICT  →  MEASURE ERROR  →  UPDATE WEIGHTS  →  REPEAT")
      .height(0.2).color(COLOR.muted).css({ fontWeight: 800, letterSpacing: "0.05em" }), { at: [0, -2.55, 0] });
    const features = [
      ...addPill(this, "PIXELS", [-3.8, -3.25], COLOR.dl, 1.25),
      ...addPill(this, "EDGES", [-1.3, -3.25], COLOR.dl, 1.25),
      ...addPill(this, "TEXTURES + SHAPES", [1.35, -3.25], COLOR.dl, 2.35),
      ...addPill(this, "DOG", [4.2, -3.25], COLOR.dl, 1.15),
    ];
    const locked = addPill(this, "WEIGHTS LOCKED • INFERENCE", [0, 2.45], COLOR.ml, 3.45);
    const correct = addPill(this, "DOG 98%", [5.6, 0.25], COLOR.ml, 1.55);

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    timeline.animate(network).at(0.75).duration(0.55).appear();
    timeline.animate(input).at(1.2).stagger(0.08).duration(0.35).appear();
    timeline.animate(network).at(1.6).duration(1.35).to({ flowProgress: 1 });
    timeline.animate(wrong).at(2.75).stagger(0.08).duration(0.35).appear();
    timeline.animate(error).at(3.45).stagger(0.08).duration(0.35).appear();
    timeline.animate(feedbackPulse).at(3.8).duration(0.08).appear();
    timeline.animate(feedbackPulse).at(3.86).duration(1.1).ease("inOutCubic").moveTo([-5.0, -1.15]);
    timeline.animate(feedbackPulse).at(4.95).duration(0.1).disappear();
    timeline.animate(network).at(4.2).duration(0.45).scaleTo(1.035);
    timeline.animate(trainingLoop).at(5.0).duration(1.0).typewrite();
    timeline.animate(features).at(6.2).stagger(0.1).duration(0.38).appear();
    timeline.animate([...wrong, ...error]).at(8.1).stagger(0.02).duration(0.35).disappear();
    timeline.animate(locked).at(8.35).stagger(0.08).duration(0.4).appear();
    timeline.animate(network).at(8.75).duration(0).to({ flowProgress: 0 });
    timeline.animate(network).at(9.0).duration(1.05).to({ flowProgress: 1 });
    timeline.animate(correct).at(9.85).stagger(0.08).duration(0.36).appear();
    this.play(timeline);
    this.wait(1.8);
    this.captureScreenshotsNamed([[10.4, "deep-learning-inference"]]);
  }
}

await renderScene(import.meta.url, DeepLearningScene, "08-deep-learning.mp4");
