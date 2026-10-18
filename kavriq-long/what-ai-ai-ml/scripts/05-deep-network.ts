import { CanvasTattva, type CanvasContext } from "veena/adapters";
import {
  BiologicalNeuron,
  LearningMeterGaugeField,
  NeuralNetwork,
  neuralNetwork,
} from "veena/ai";
import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type TattvaState, type Vec2 } from "veena/core";
import { Circle, Line, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { ALPHA, COLOR, FRAME } from "./lib/theme.ts";

const SOLID = {
  ai: "#17647D",
  ml: "#1E7A55",
  dl: "#53368A",
  genai: "#C4485C",
} as const;

interface VisualGroup {
  all: Tattva[];
  center: Vec2;
}

interface ResultCard extends VisualGroup {
  panel: Tattva;
  result: Tattva;
}

interface DenseNetworkState extends TattvaState {
  progress: number;
  signal: number;
}

class DeepLearningAndNeuralNetworksScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    // ---------------------------------------------------------------------
    // Persistent world: email, upper explainer, and master taxonomy.
    // ---------------------------------------------------------------------
    const email = addOpenEmailView(this, { at: [0, 0.02], scale: 0.68 });
    const emailMain = email.all.filter((item) => !email.errorChip.includes(item));
    placeScaledGroup(emailMain, [0, 0.02], [-4.52, 0], 0.58);
    email.errorChip.forEach((piece) => piece.at([6.35, 3.72, piece.initialState.z + 0.35]));

    const flagged = addResultCard(this, [-5.78, 3.62], SOLID.ai, "FLAGGED", "Rule-based checks");
    const spam = addResultCard(this, [-3.18, 3.62], SOLID.ml, "SPAM 96%", "Learned score");
    const dog = addResultCard(this, [-5.78, -3.62], SOLID.dl, "DOG 98%", "Image recognised");
    const draft = addResultCard(this, [-3.18, -3.62], SOLID.genai, "DRAFT", "AI-generated reply");
    [flagged, spam, dog, draft].forEach((card) => {
      card.all.forEach((item) => item.scale(0.82).opacity(0.18));
    });

    // The card that leaves the email screen. The muted original stays behind.
    const dogCopy = addResultCard(this, [-5.78, -3.62], SOLID.dl, "DOG 98%", "Image recognised");
    hide(dogCopy.all);

    const machineLearningTitle = addTitleCard(this, "MACHINE LEARNING", [0, 12.82], COLOR.ml, 5.50, ALPHA.ml);
    const deepLearningTitle = addTitleCard(this, "DEEP LEARNING", [0, 11.84], COLOR.dl, 4.70, ALPHA.dl);
    hide([...machineLearningTitle, ...deepLearningTitle]);

    // Existing taxonomy from Segment 3. It lives on the screen immediately
    // to the right of the email and remains ready for the closing handoff.
    const aiBoundary = this.add(
      Rectangle().size([13.60, 7.55]).cornerRadius(0.34)
        .fill(ALPHA.ai).stroke({ color: COLOR.ai, width: 0.055 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 0 28px rgba(49,215,255,0.12))" }),
      { at: [16, 0, 0.10] },
    );
    const aiLabel = addText(this, "ARTIFICIAL INTELLIGENCE", [16, 3.25], 0.34, COLOR.ai, 950, 0.16);
    const mlBoundary = this.add(
      Rectangle().size([7.25, 4.55]).cornerRadius(0.30)
        .fill(ALPHA.ml).stroke({ color: COLOR.ml, width: 0.055 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 0 24px rgba(87,227,161,0.12))" }),
      { at: [18.05, -0.45, 0.20] },
    );
    const mlDiagramLabel = addText(this, "MACHINE LEARNING", [18.05, 1.38], 0.28, COLOR.ml, 950, 0.25);
    const diagramFlagged = addResultCard(this, [12.15, -0.45], SOLID.ai, "FLAGGED", "Rules");
    const diagramSpam = addResultCard(this, [16.35, -0.68], SOLID.ml, "SPAM 96%", "Learned score");
    diagramFlagged.all.forEach((item) => item.scale(0.86));
    diagramSpam.all.forEach((item) => item.scale(0.78));

    const dlBoundary = this.add(
      Rectangle().size([3.45, 2.58]).cornerRadius(0.27)
        .fill(ALPHA.dl).stroke({ color: COLOR.dl, width: 0.055 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 0 24px rgba(155,109,255,0.18))" }),
      { at: [19.35, -0.72, 0.30] },
    ).opacity(0);
    const dlDiagramLabel = addText(this, "DEEP LEARNING", [19.35, 0.16], 0.24, COLOR.dl, 950, 0.35);
    dlDiagramLabel.opacity(0);
    const diagramDog = addResultCard(this, [19.35, -0.88], SOLID.dl, "DOG 98%", "Neural network");
    hide(diagramDog.all);

    // ---------------------------------------------------------------------
    // Labelled-image training: supervised learning and the hierarchy.
    // ---------------------------------------------------------------------
    const modelPanel = this.add(
      Rectangle().size([3.70, 2.78]).cornerRadius(0.28)
        .fill(ALPHA.dl).stroke({ color: COLOR.dl, width: 0.05 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 12px 26px rgba(155,109,255,0.16))" }),
      { at: [0.65, 8.92, 0.24] },
    ).opacity(0);
    const modelLabel = addText(this, "MODEL", [0.65, 9.92], 0.26, COLOR.dl, 950, 0.30);
    modelLabel.opacity(0);
    const modelState = addText(this, "LEARNING FROM LABELS", [0.65, 8.00], 0.17, COLOR.ink, 800, 0.30);
    modelState.opacity(0);
    const supervisedChip = addSolidPill(this, "SUPERVISED LEARNING", [0.65, 6.78], SOLID.ml, 3.75);
    hide(supervisedChip.all);

    const trainingPictures = [
      addAnimalCard(this, [-5.15, 10.20], "CAT", "◉", COLOR.gold),
      addAnimalCard(this, [-5.15, 9.30], "DOG", "◆", COLOR.dl),
      addAnimalCard(this, [-5.15, 8.40], "HORSE", "♞", COLOR.ai),
      addAnimalCard(this, [-5.15, 7.50], "DOG", "◆", COLOR.dl),
      addAnimalCard(this, [-5.15, 6.60], "CAT", "◉", COLOR.gold),
    ];
    trainingPictures.forEach((picture) => hide(picture.all));
    const trainedStamp = addSolidPill(this, "TRAINED MODEL", [0.65, 8.92], SOLID.dl, 3.00);
    hide(trainedStamp.all);

    const takeaway = addText(
      this,
      "DEEP LEARNING = MACHINE LEARNING WITH MANY-LAYER NEURAL NETWORKS",
      [0, 5.70],
      0.20,
      COLOR.ink,
      900,
      0.35,
    );
    takeaway.opacity(0);

    // ---------------------------------------------------------------------
    // Compact plot-price callback: two parameters versus many weights.
    // ---------------------------------------------------------------------
    const plotGroup = addCompactPlot(this, [-3.55, 8.75]);
    hide(plotGroup.all);
    const linearMeters = this.add(
      LearningMeterGaugeField([
        { id: "a", initial: -0.72, target: 0.66, color: COLOR.ml },
        { id: "b", initial: 0.74, target: -0.18, color: COLOR.ai },
      ], {
        epochs: 100,
        size: [3.50, 1.95],
        columns: 2,
        noise: 0.12,
        title: "TWO PARAMETERS: a AND b",
        showEpoch: false,
        arcColor: COLOR.grid,
        needleColor: COLOR.ink,
        background: "rgba(16,23,42,0.90)",
      }),
      { at: [3.65, 8.82, 0.30] },
    ).opacity(0);
    const manyWeights = addText(this, "A NEURAL NETWORK ADJUSTS MANY MORE", [0, 6.55], 0.22, COLOR.dl, 900, 0.34);
    manyWeights.opacity(0);

    // ---------------------------------------------------------------------
    // Training network, layer anatomy, and input conversion.
    // ---------------------------------------------------------------------
    const compactModel = neuralNetwork([
      { id: "input", label: "INPUT", nodes: ["x₁", "x₂"] },
      { id: "hidden", label: "HIDDEN", nodes: ["h₁", "h₂", "h₃"], activation: "ReLU" },
      { id: "output", label: "OUTPUT", nodes: ["dog", "other"] },
    ], {
      layerSpacing: 2.25,
      nodeSpacing: 0.78,
      nodeRadius: 0.18,
      weights: [
        [[0.16, -0.74], [0.88, 0.31], [-0.42, 0.65]],
        [[0.73, -0.34, 0.56], [-0.22, 0.61, -0.47]],
      ],
    });
    const compactNetwork = this.add(NeuralNetwork(compactModel, {
      node: COLOR.dl,
      nodeIdle: "#27213F",
      edge: "rgba(155,109,255,0.32)",
      positive: COLOR.ml,
      negative: COLOR.warning,
      flow: COLOR.gold,
      text: COLOR.ink,
      showValues: true,
      valueDigits: 1,
      edgeThickness: 0.026,
      pulseRadius: 0.09,
    }), { at: [1.20, 8.90, 0.34] }).opacity(0);

    const networkMeters = this.add(
      LearningMeterGaugeField(10, {
        epochs: 100,
        seed: 23,
        size: [4.90, 1.28],
        columns: 5,
        noise: 0.19,
        title: "WEIGHTS ON CONNECTIONS",
        showEpoch: true,
        arcColor: "rgba(155,109,255,0.52)",
        needleColor: COLOR.gold,
        background: "rgba(16,23,42,0.86)",
      }),
      { at: [1.20, 6.42, 0.34] },
    ).opacity(0);

    // A second render instance represents the same trained network in the
    // later inference composition. Keeping it separate prevents repeated
    // opacity tracks from interfering with the earlier training sequence.
    const inferenceNetwork = this.add(NeuralNetwork(compactModel, {
      node: COLOR.dl,
      nodeIdle: "#27213F",
      edge: "rgba(155,109,255,0.32)",
      positive: COLOR.ml,
      negative: COLOR.warning,
      flow: COLOR.gold,
      text: COLOR.ink,
      showValues: true,
      valueDigits: 1,
      edgeThickness: 0.026,
      pulseRadius: 0.09,
    }), { at: [1.20, 8.90, 0.34] }).opacity(0);
    const inferenceMeters = this.add(
      LearningMeterGaugeField(10, {
        epochs: 100,
        seed: 23,
        size: [4.90, 1.28],
        columns: 5,
        noise: 0.19,
        title: "WEIGHTS ON CONNECTIONS",
        showEpoch: true,
        arcColor: "rgba(155,109,255,0.52)",
        needleColor: COLOR.gold,
        background: "rgba(16,23,42,0.86)",
      }).epoch(100),
      { at: [1.20, 6.42, 0.34] },
    ).opacity(0);

    const pixelsBox = addSolidPill(this, "PIXELS → NUMBERS", [-5.15, 8.90], SOLID.ai, 2.95);
    const imageCard = addAnimalCard(this, [-6.15, 10.05], "DOG", "◆", COLOR.dl);
    const vector = addSolidPill(this, "[ .82  .14  .63  … ]", [-3.35, 8.90], "#243654", 2.70);
    hide([...pixelsBox.all, ...imageCard.all, ...vector.all]);

    const deepModel = neuralNetwork([
      { id: "input", label: "INPUT LAYER", nodes: 3 },
      { id: "hidden1", label: "HIDDEN 1", nodes: 5, activation: "ReLU" },
      { id: "hidden2", label: "HIDDEN 2", nodes: 5, activation: "ReLU" },
      { id: "hidden3", label: "HIDDEN 3", nodes: 5, activation: "ReLU" },
      { id: "hidden4", label: "HIDDEN …", nodes: 5, activation: "ReLU" },
      { id: "output", label: "OUTPUT LAYER", nodes: 3 },
    ], { layerSpacing: 1.75, nodeSpacing: 0.56, nodeRadius: 0.13 });
    const deepNetwork = this.add(NeuralNetwork(deepModel, {
      node: COLOR.dl,
      nodeIdle: "#27213F",
      edge: "rgba(155,109,255,0.22)",
      positive: COLOR.ml,
      negative: COLOR.warning,
      flow: COLOR.gold,
      text: COLOR.ink,
      showValues: false,
      edgeThickness: 0.018,
      pulseRadius: 0.065,
    }), { at: [0, 8.85, 0.36] }).opacity(0);
    const depthCaption = addText(this, "DEEP = MANY LAYERS BETWEEN INPUT AND ANSWER", [0, 6.05], 0.22, COLOR.dl, 900, 0.36);
    depthCaption.opacity(0);

    // ---------------------------------------------------------------------
    // Biological-neuron analogy.
    // ---------------------------------------------------------------------
    const analogyNetwork = this.add(NeuralNetwork(compactModel, {
      node: COLOR.dl,
      nodeIdle: "#27213F",
      edge: "rgba(155,109,255,0.30)",
      flow: COLOR.gold,
      text: COLOR.ink,
      showValues: false,
      edgeThickness: 0.026,
      pulseRadius: 0.085,
    }), { at: [-3.65, 8.80, 0.34] }).opacity(0);
    const biologicalNeuron = this.add(BiologicalNeuron({
      membraneColor: COLOR.dl,
      cellColor: "#2C2250",
      nucleusColor: COLOR.genai,
      myelinColor: COLOR.muted,
      inputSignalColor: COLOR.ai,
      signalColor: COLOR.gold,
      axonLength: 4.2,
    }).scale(0.67), { at: [3.10, 8.90, 0.38] }).opacity(0);
    const analogyNotEquals = addText(this, "ANALOGY  ≠  A LITERAL BRAIN", [0, 5.95], 0.22, COLOR.warning, 900, 0.40);
    analogyNotEquals.opacity(0);

    // ---------------------------------------------------------------------
    // Weights, inference, and classification.
    // ---------------------------------------------------------------------
    const weightsCard = addPanelWithLines(this, [5.65, 8.85], "WEIGHTS", ["+0.8", "−0.4", "+0.6", "+0.2"], COLOR.dl);
    hide(weightsCard.all);
    const fixedChip = addSolidPill(this, "WEIGHTS FIXED", [0.95, 11.35], SOLID.ml, 2.65);
    hide(fixedChip.all);
    const inferenceInput = addAnimalCard(this, [-5.75, 8.85], "NEW DOG IMAGE", "◆", COLOR.dl);
    hide(inferenceInput.all);
    const classScores = addPanelWithLines(this, [4.55, 8.85], "CLASS SCORES", ["DOG  .98", "CAT  .01", "OTHER  .01"], COLOR.ai);
    hide(classScores.all);
    const inferenceResult = addResultCard(this, [6.15, 8.85], SOLID.dl, "DOG 98%", "Prediction");
    hide(inferenceResult.all);
    const inferenceCaption = addText(this, "INFERENCE = ONE FORWARD PASS", [0.75, 5.40], 0.22, COLOR.ml, 900, 0.40);
    inferenceCaption.opacity(0);

    // ---------------------------------------------------------------------
    // Dense network beat: six planes, one hundred nodes per plane.
    // ---------------------------------------------------------------------
    const denseNetwork = this.add(createDenseNetwork(), { at: [0, 8.88, 0.42] }).opacity(0);
    const denseTitle = addText(this, "A SIMPLIFIED VIEW OF SCALE", [0, 11.98], 0.30, COLOR.ink, 950, 0.48);
    const denseSubtitle = addText(this, "6 LAYERS  ·  100 NODES PER LAYER", [0, 11.50], 0.18, COLOR.dl, 850, 0.48);
    denseTitle.opacity(0);
    denseSubtitle.opacity(0);

    const finalHierarchy = addText(
      this,
      "EVERY DL SYSTEM IS ML  ·  NOT EVERY ML SYSTEM IS DL",
      [16, -3.25],
      0.19,
      COLOR.ink,
      900,
      0.50,
    );
    finalHierarchy.opacity(0);

    addKavriqBrand(this);
    this.camera.position([0, 0, 8]).lookAt([0, 0, 0]).zoom(1);

    // ---------------------------------------------------------------------
    // Timeline — one continuous Segment 5 render.
    // ---------------------------------------------------------------------
    const timeline = new Timeline();

    // Dog result leaves the email and becomes the topic upstairs.
    timeline.animate(dog.all).at(0.35).duration(0.48).fadeTo(1);
    timeline.animate(dog.result).at(0.52).duration(0.48).indicate();
    timeline.animate(dogCopy.all).at(1.05).stagger(0.025).duration(0.30).appear();
    timeline.animate(dog.all).at(1.30).duration(0.38).fadeTo(0.18);
    timeline.animateCamera(this.camera).at(1.25).duration(1.65).ease("inOutCubic")
      .frameTo([0, 4.5, 8], [0, 4.5, 0]);
    timeline.animateCamera(this.camera).at(1.25).duration(1.65).ease("inOutCubic").zoomTo(0.50);
    moveGroup(timeline, dogCopy.all, dogCopy.center, [0, 12.82], 1.30, 1.60, 1.04);
    timeline.animate(dogCopy.all).at(2.90).duration(0.28).fadeTo(0);
    timeline.animate(machineLearningTitle).at(2.88).stagger(0.04).duration(0.38).appear();
    timeline.animateCamera(this.camera).at(3.10).duration(1.30).ease("inOutCubic")
      .frameTo([0, 9, 8], [0, 9, 0]);
    timeline.animateCamera(this.camera).at(3.10).duration(1.30).ease("inOutCubic").zoomTo(1);

    // Labelled examples establish supervised learning.
    timeline.animate([modelPanel, modelLabel, modelState]).at(4.75).stagger(0.10).duration(0.42).appear();
    trainingPictures.forEach((picture, index) => {
      const at = 5.35 + index * 1.03;
      timeline.animate(picture.all).at(at).stagger(0.025).duration(0.28).appear();
      moveGroup(timeline, picture.all, picture.center, [0.30, 8.92], at + 0.30, 0.68, 0.66);
      timeline.animate(picture.all).at(at + 0.82).duration(0.20).fadeTo(0);
      timeline.animate(modelPanel).at(at + 0.60).duration(0.30).scaleTo(1.025);
      timeline.animate(modelPanel).at(at + 0.90).duration(0.28).scaleTo(1);
    });
    timeline.animate(supervisedChip.all).at(7.40).stagger(0.05).duration(0.38).appear();
    timeline.animate([modelLabel, modelState]).at(10.45).duration(0.30).fadeTo(0);
    timeline.animate(trainedStamp.all).at(10.50).stagger(0.05).duration(0.42).appear();

    // Make the hierarchy sentence dominant before adding detail.
    timeline.animate(deepLearningTitle).at(11.35).stagger(0.05).duration(0.42).appear();
    timeline.animate(takeaway).at(12.05).duration(0).appear();
    timeline.animate(takeaway).at(12.05).duration(0.85).typewrite();
    timeline.animate(deepLearningTitle).at(13.10).duration(0.28).ease("outCubic").scaleTo(1.035);
    timeline.animate(deepLearningTitle).at(13.38).duration(0.28).ease("inOutCubic").scaleTo(1);

    const supervisedStage = [modelPanel, modelLabel, modelState, ...supervisedChip.all, ...trainedStamp.all, takeaway];
    timeline.animate(supervisedStage).at(15.15).stagger(0.004).duration(0.44).fadeTo(0);

    // Two plot parameters become the many weights of a neural network.
    timeline.animate(plotGroup.all).at(15.75).stagger(0.06).duration(0.48).appear();
    timeline.animate(linearMeters).at(16.05).duration(0.45).appear();
    timeline.animate(linearMeters).at(16.55).duration(5.00).ease("inOutCubic").to({ epoch: 100 });
    timeline.animate(plotGroup.line).at(16.55).duration(5.00).ease("inOutCubic").rotateTo(22);
    timeline.animate(manyWeights).at(20.45).duration(0).appear();
    timeline.animate(manyWeights).at(20.45).duration(0.70).typewrite();
    timeline.animate([...plotGroup.all, linearMeters, manyWeights]).at(22.80).stagger(0.004).duration(0.46).fadeTo(0);

    // Compact network: images become numbers, signals move, weights adjust.
    timeline.animate(compactNetwork).at(23.10).duration(0.52).appear();
    timeline.animate(networkMeters).at(23.35).duration(0.45).appear();
    timeline.animate(pixelsBox.all).at(23.65).stagger(0.04).duration(0.36).appear();
    for (let cycle = 0; cycle < 5; cycle += 1) {
      const at = 24.25 + cycle * 2.20;
      timeline.animate([compactNetwork, networkMeters]).at(at).duration(0.12).fadeTo(1);
      timeline.animate(imageCard.all).at(at).stagger(0.025).duration(0.28).appear();
      moveGroup(timeline, imageCard.all, imageCard.center, [-5.15, 8.90], at + 0.26, 0.48, 0.74);
      timeline.animate(imageCard.all).at(at + 0.62).duration(0.20).fadeTo(0);
      timeline.animate(vector.all).at(at + 0.62).stagger(0.025).duration(0.28).appear();
      moveGroup(timeline, vector.all, vector.center, [-1.82, 8.90], at + 0.88, 0.52, 0.74);
      timeline.animate(vector.all).at(at + 1.28).duration(0.18).fadeTo(0);
      timeline.animate(compactNetwork).at(at + 0.78).duration(0.22).ease("inOutCubic").to({ flowProgress: 0 });
      timeline.animate(compactNetwork).at(at + 1.02).duration(0.86).ease("inOutCubic").to({ flowProgress: 1 });
      timeline.animate(networkMeters).at(at + 1.05).duration(0.92).ease("inOutCubic")
        .to({ epoch: (cycle + 1) * 20 });
    }

    // Pull the layers apart and show why the word "deep" is used.
    timeline.animate([compactNetwork, networkMeters, ...pixelsBox.all]).at(35.65).duration(0.42).fadeTo(0);
    timeline.animate(deepNetwork).at(36.10).duration(0.62).appear();
    timeline.animate(deepNetwork).at(36.90).duration(1.45).ease("inOutCubic").to({ flowProgress: 1 });
    timeline.animate(depthCaption).at(38.20).duration(0).appear();
    timeline.animate(depthCaption).at(38.20).duration(0.78).typewrite();
    timeline.animate(deepNetwork).at(40.10).duration(0).to({ flowProgress: 0 });
    timeline.animate(deepNetwork).at(40.12).duration(1.45).ease("inOutCubic").to({ flowProgress: 1 });
    timeline.animate([deepNetwork, depthCaption]).at(43.20).duration(0.50).fadeTo(0);

    // Neural is an analogy, not an identity.
    timeline.animate([analogyNetwork, biologicalNeuron]).at(43.75).stagger(0.18).duration(0.55).appear();
    timeline.animate(analogyNetwork).at(44.75).duration(1.20).ease("inOutCubic").to({ flowProgress: 1 });
    timeline.animate(biologicalNeuron).at(45.00).duration(1.05).to({ inputProgress: 1 });
    timeline.animate(biologicalNeuron).at(46.05).duration(0.55).to({ charge: 1 });
    timeline.animate(biologicalNeuron).at(46.60).duration(1.25).to({ signalProgress: 1 });
    timeline.animate(analogyNotEquals).at(47.55).duration(0).appear();
    timeline.animate(analogyNotEquals).at(47.55).duration(0.62).typewrite();
    timeline.animate([analogyNetwork, biologicalNeuron, analogyNotEquals]).at(51.00).duration(0.48).fadeTo(0);

    // Isolate representative values without visually removing them.
    timeline.animate(inferenceNetwork).at(51.45).duration(0.50).appear();
    timeline.animate(inferenceMeters).at(51.55).duration(0.50).appear();
    timeline.animate(weightsCard.all).at(52.35).stagger(0.08).duration(0.42).appear();
    timeline.animate(weightsCard.all).at(53.20).duration(0.28).ease("outCubic").scaleTo(1.035);
    timeline.animate(weightsCard.all).at(53.48).duration(0.28).ease("inOutCubic").scaleTo(1);

    // Inference: fixed weights and exactly one forward pass.
    timeline.animate(weightsCard.all).at(55.65).duration(0.38).fadeTo(0);
    timeline.animate(inferenceMeters).at(55.65).duration(0.40).fadeTo(0.22);
    timeline.animate(fixedChip.all).at(55.75).stagger(0.05).duration(0.40).appear();
    timeline.animate(inferenceInput.all).at(56.25).stagger(0.04).duration(0.36).appear();
    moveGroup(timeline, inferenceInput.all, inferenceInput.center, [-2.00, 8.85], 57.00, 0.82, 0.72);
    timeline.animate(inferenceInput.all).at(57.68).duration(0.20).fadeTo(0);
    timeline.animate(inferenceNetwork).at(57.65).duration(0).to({ flowProgress: 0 });
    timeline.animate(inferenceNetwork).at(57.68).duration(1.30).ease("inOutCubic").to({ flowProgress: 1 });
    timeline.animate(classScores.all).at(59.00).stagger(0.07).duration(0.42).appear();
    timeline.animate(classScores.all).at(60.15).duration(0.36).fadeTo(0);
    timeline.animate(inferenceResult.all).at(60.25).stagger(0.06).duration(0.42).appear();
    timeline.animate(inferenceResult.result).at(60.85).duration(0.52).indicate();
    timeline.animate(inferenceCaption).at(61.35).duration(0).appear();
    timeline.animate(inferenceCaption).at(61.35).duration(0.68).typewrite();

    // Scale beat. This stays in the same Murali scene and can later be swapped
    // for the higher-detail Rust fly-through without changing adjacent timing.
    const inferenceStage = [inferenceNetwork, inferenceMeters, ...fixedChip.all, ...inferenceResult.all, inferenceCaption];
    timeline.animate(inferenceStage).at(64.60).stagger(0.003).duration(0.46).fadeTo(0);
    timeline.animate(deepLearningTitle).at(64.60).duration(0.46).fadeTo(0);
    timeline.animate([denseTitle, denseSubtitle]).at(65.10).stagger(0.14).duration(0.48).appear();
    timeline.animate(denseNetwork).at(65.35).duration(0.70).appear();
    timeline.animate(denseNetwork).at(65.35).duration(7.80).ease("inOutCubic").to({ progress: 1, signal: 1 });
    timeline.animate(denseNetwork).at(66.00).duration(6.80).ease("inOutCubic").scaleTo(1.08);
    timeline.animate([denseNetwork, denseTitle, denseSubtitle]).at(73.55).duration(0.52).fadeTo(0);
    timeline.animate(deepLearningTitle).at(73.72).duration(0.42).appear();

    // Return to the master diagram: AI contains ML, and ML contains DL.
    timeline.animateCamera(this.camera).at(74.10).duration(1.65).ease("inOutCubic")
      .frameTo([8, 4.5, 8], [8, 4.5, 0]);
    timeline.animateCamera(this.camera).at(74.10).duration(1.65).ease("inOutCubic").zoomTo(0.50);
    moveGroup(timeline, deepLearningTitle, [0, 11.84], [19.35, 0.16], 74.25, 1.70, 0.72);
    timeline.animate(dlBoundary).at(75.55).duration(0.18).appear();
    timeline.animate(dlBoundary).at(75.55).duration(0.86).ease("outCubic").scaleTo(1);
    timeline.animate(deepLearningTitle).at(76.02).duration(0.28).fadeTo(0);
    timeline.animate(dlDiagramLabel).at(76.02).duration(0.40).appear();
    timeline.animate(diagramDog.all).at(76.35).stagger(0.04).duration(0.38).appear();
    timeline.animateCamera(this.camera).at(76.70).duration(1.45).ease("inOutCubic")
      .frameTo([16, 0, 8], [16, 0, 0]);
    timeline.animateCamera(this.camera).at(76.70).duration(1.45).ease("inOutCubic").zoomTo(1);

    timeline.animate(aiBoundary).at(78.30).duration(0.36).scaleTo(1.018);
    timeline.animate(aiBoundary).at(78.68).duration(0.30).scaleTo(1);
    timeline.animate(mlBoundary).at(79.00).duration(0.36).scaleTo(1.025);
    timeline.animate(mlBoundary).at(79.38).duration(0.30).scaleTo(1);
    timeline.animate(dlBoundary).at(79.70).duration(0.36).scaleTo(1.045);
    timeline.animate(dlBoundary).at(80.08).duration(0.30).scaleTo(1);
    timeline.animate(mlBoundary).at(80.55).duration(0.28).ease("outCubic").scaleTo(1.025);
    timeline.animate(mlBoundary).at(80.83).duration(0.28).ease("inOutCubic").scaleTo(1);
    timeline.animate(finalHierarchy).at(80.25).duration(0).appear();
    timeline.animate(finalHierarchy).at(80.25).duration(0.86).typewrite();
    timeline.animate(diagramDog.result).at(82.00).duration(0.55).indicate();

    this.play(timeline);
    this.wait(3.0);
    this.captureScreenshotsNamed([
      [0.0, "part-05-continuity"],
      [8.8, "part-05-supervised-training"],
      [13.6, "part-05-deep-learning-takeaway"],
      [20.9, "part-05-two-parameters"],
      [32.3, "part-05-network-training"],
      [39.4, "part-05-many-layers"],
      [48.4, "part-05-neuron-analogy"],
      [53.8, "part-05-weights"],
      [62.5, "part-05-inference"],
      [70.2, "part-05-dense-network"],
      [82.5, "part-05-master-diagram"],
    ]);
  }
}

function addResultCard(
  scene: Scene,
  at: Vec2,
  fill: string,
  result: string,
  detail: string,
): ResultCard {
  const panel = scene.add(
    Rectangle().size([2.34, 0.88]).cornerRadius(0.20).fill(fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 14px ${fill}40)` }),
    { at: [at[0], at[1], 0.22] },
  );
  const resultLabel = addText(scene, result, [at[0], at[1] + 0.11], 0.21, COLOR.ink, 950, 0.25);
  const detailLabel = addText(scene, detail, [at[0], at[1] - 0.20], 0.125, "rgba(248,250,252,0.78)", 650, 0.25);
  return { all: [panel, resultLabel, detailLabel], panel, result: resultLabel, center: at };
}

function addTitleCard(
  scene: Scene,
  text: string,
  at: Vec2,
  color: string,
  width: number,
  fill: string,
): Tattva[] {
  return [
    scene.add(
      Rectangle().size([width, 0.76]).cornerRadius(0.23).fill(fill)
        .stroke({ color, width: 0.045 }).css({ borderStyle: "none" }),
      { at: [at[0], at[1], 0.30] },
    ),
    addText(scene, text, at, 0.27, color, 950, 0.34),
  ];
}

function addAnimalCard(
  scene: Scene,
  at: Vec2,
  label: string,
  icon: string,
  color: string,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([2.30, 0.72]).cornerRadius(0.17).fill("#151E34")
      .stroke({ color, width: 0.03 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.28] },
  );
  const iconLabel = addText(scene, icon, [at[0] - 0.72, at[1]], 0.25, color, 900, 0.32);
  const text = addText(scene, label, [at[0] + 0.25, at[1]], 0.18, COLOR.ink, 900, 0.32);
  return { all: [panel, iconLabel, text], center: at };
}

function addSolidPill(scene: Scene, text: string, at: Vec2, fill: string, width: number): VisualGroup {
  const panel = scene.add(
    Rectangle().size([width, 0.55]).cornerRadius(0.26).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.38] },
  );
  const label = addText(scene, text, at, 0.17, COLOR.ink, 900, 0.42);
  return { all: [panel, label], center: at };
}

function addPanelWithLines(
  scene: Scene,
  at: Vec2,
  title: string,
  lines: readonly string[],
  color: string,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([2.55, 2.55]).cornerRadius(0.24).fill("#11192C")
      .stroke({ color, width: 0.04 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.38] },
  );
  const items: Tattva[] = [panel, addText(scene, title, [at[0], at[1] + 0.88], 0.20, color, 950, 0.42)];
  lines.forEach((line, index) => {
    items.push(addText(scene, line, [at[0], at[1] + 0.38 - index * 0.40], 0.17, COLOR.ink, 760, 0.42));
  });
  return { all: items, center: at };
}

function addCompactPlot(scene: Scene, at: Vec2): VisualGroup & { line: Tattva } {
  const [x, y] = at;
  const panel = scene.add(
    Rectangle().size([6.15, 4.15]).cornerRadius(0.24).fill("#10172A")
      .stroke({ color: COLOR.grid, width: 0.035 }).css({ borderStyle: "none" }),
    { at: [x, y, 0.24] },
  );
  const xAxis = scene.add(Line().from([x - 2.42, y - 1.40]).to([x + 2.42, y - 1.40])
    .stroke({ color: COLOR.muted, width: 0.035 }), { at: [0, 0, 0.28] });
  const yAxis = scene.add(Line().from([x - 2.42, y - 1.40]).to([x - 2.42, y + 1.40])
    .stroke({ color: COLOR.muted, width: 0.035 }), { at: [0, 0, 0.28] });
  const points = [
    [-1.95, -0.96], [-1.35, -0.72], [-0.75, -0.26], [-0.05, 0.05], [0.65, 0.54], [1.40, 0.93], [2.00, 1.20],
  ].map(([dx, dy]) => scene.add(
    Circle().radius(0.095).fill(COLOR.ml), { at: [x + dx!, y + dy!, 0.34] },
  ));
  const fitLine = scene.add(
    Line().from([x - 2.15, y - 0.15]).to([x + 2.15, y - 0.15])
      .stroke({ color: COLOR.gold, width: 0.055 }),
    { at: [0, 0, 0.32] },
  );
  const title = addText(scene, "PLOT PRICE MODEL", [x, y + 1.70], 0.20, COLOR.ink, 900, 0.34);
  const equation = addText(scene, "y = ax + b", [x + 1.58, y - 1.78], 0.19, COLOR.gold, 850, 0.34);
  return { all: [panel, xAxis, yAxis, ...points, fitLine, title, equation], center: at, line: fitLine };
}

function createDenseNetwork(): CanvasTattva<DenseNetworkState> {
  const layers = 6;
  const nodesPerLayer = 100;
  const points = Array.from({ length: layers }, (_, layer) =>
    Array.from({ length: nodesPerLayer }, (_, index) => ({
      x: 0.08 + (layer / (layers - 1)) * 0.84,
      y: 0.08 + hash(layer * 1009 + index * 37) * 0.84,
      born: (layer * nodesPerLayer + index) / (layers * nodesPerLayer),
    })),
  );
  return new CanvasTattva<DenseNetworkState>({
    draw({ canvas, context }: CanvasContext, state, sample) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const reveal = clamp(state.progress, 0, 1);
      const signal = clamp(state.signal, 0, 1);
      const px = (x: number) => x * canvas.width;
      const py = (y: number) => y * canvas.height;
      context.lineCap = "round";

      for (let layer = 0; layer < layers - 1; layer += 1) {
        const left = points[layer]!;
        const right = points[layer + 1]!;
        for (let index = 0; index < nodesPerLayer; index += 1) {
          const from = left[index]!;
          for (let branch = 0; branch < 2; branch += 1) {
            const targetIndex = (index * 17 + layer * 23 + branch * 41) % nodesPerLayer;
            const to = right[targetIndex]!;
            const born = Math.max(from.born, to.born);
            if (reveal < born) continue;
            const wave = Math.max(0, 1 - Math.abs(signal - (layer + 0.5) / (layers - 1)) * 5.5);
            context.strokeStyle = `rgba(155,109,255,${0.07 + wave * 0.30})`;
            context.lineWidth = 1 + wave * 1.7;
            context.beginPath();
            context.moveTo(px(from.x), py(from.y));
            context.lineTo(px(to.x), py(to.y));
            context.stroke();
          }
        }
      }

      points.forEach((layerPoints, layer) => {
        const wave = Math.max(0, 1 - Math.abs(signal - layer / (layers - 1)) * 5.5);
        layerPoints.forEach((point) => {
          if (reveal < point.born) return;
          const flicker = 0.72 + 0.28 * Math.sin(sample.time * 2.4 + point.born * 31);
          context.fillStyle = `rgba(205,188,255,${0.48 + wave * 0.48})`;
          context.beginPath();
          context.arc(px(point.x), py(point.y), 2.1 + wave * 2.0 + flicker * 0.6, 0, Math.PI * 2);
          context.fill();
        });
      });
    },
  }, { size: [13.7, 5.8], state: { progress: 0, signal: 0 } });
}

function addText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  color: string,
  weight: number,
  z = 0.30,
): Tattva {
  return scene.add(
    Label(text).height(height).color(color).css({ fontWeight: weight, letterSpacing: "0.035em" }),
    { at: [at[0], at[1], z] },
  );
}

function placeScaledGroup(items: readonly Tattva[], fromCenter: Vec2, toCenter: Vec2, scale: number): void {
  items.forEach((item) => {
    const localX = item.initialState.x - fromCenter[0];
    const localY = item.initialState.y - fromCenter[1];
    item.at([
      toCenter[0] + localX * scale,
      toCenter[1] + localY * scale,
      item.initialState.z,
    ]).scale(scale);
  });
}

function moveGroup(
  timeline: Timeline,
  items: readonly Tattva[],
  fromCenter: Vec2,
  toCenter: Vec2,
  at: number,
  duration: number,
  scale: number,
): void {
  items.forEach((item) => {
    const localX = item.initialState.x - fromCenter[0];
    const localY = item.initialState.y - fromCenter[1];
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic")
      .moveTo([
        toCenter[0] + localX * scale,
        toCenter[1] + localY * scale,
        item.initialState.z,
      ]);
    timeline.animate(item).at(at).duration(duration).ease("inOutCubic").scaleTo(scale);
  });
}

function hide(items: readonly Tattva[]): void {
  items.forEach((item) => item.opacity(0));
}

function hash(value: number): number {
  const sine = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  return sine - Math.floor(sine);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  const inheritedPhase = 2.36;
  scene.updater((time, states) => {
    motion.update((inheritedPhase + time) % motion.duration, states);
  });
}

await renderScene(
  import.meta.url,
  DeepLearningAndNeuralNetworksScene,
  "05-deep-learning-and-neural-networks.mp4",
);
