import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Circle, Line, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { ALPHA, COLOR, FRAME } from "./lib/theme.ts";
import { addArrow } from "./lib/ui.ts";

const SOLID = {
  ai: "#17647D",
  ml: "#1E7A55",
  dl: "#53368A",
  genai: "#C4485C",
} as const;

interface ResultCard {
  all: Tattva[];
  panel: Tattva;
  result: Tattva;
  center: Vec2;
}

interface MiniEmail {
  all: Tattva[];
  center: Vec2;
}

interface ParameterGauge {
  all: Tattva[];
  fill: Tattva;
}

class MachineLearningScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    // -----------------------------------------------------------------------
    // Persistent three-screen world inherited from Segment 2.
    // -----------------------------------------------------------------------
    const email = addOpenEmailView(this, { at: [0, 0.02], scale: 0.68 });
    const emailMain = email.all.filter((item) => !email.errorChip.includes(item));
    placeScaledGroup(emailMain, [0, 0.02], [-4.52, 0], 0.58);
    email.errorChip.forEach((piece) => piece.at([6.35, 3.72, piece.initialState.z + 0.35]));

    const flagged = addResultCard(this, {
      at: [-5.78, 3.62], fill: SOLID.ai,
      result: "FLAGGED", detail: "Rule-based checks",
    });
    const spam = addResultCard(this, {
      at: [-3.18, 3.62], fill: SOLID.ml,
      result: "SPAM 96%", detail: "Learned score",
    });
    const dog = addResultCard(this, {
      at: [-5.78, -3.62], fill: SOLID.dl,
      result: "DOG 98%", detail: "Image recognized",
    });
    const draft = addResultCard(this, {
      at: [-3.18, -3.62], fill: SOLID.genai,
      result: "DRAFT", detail: "AI-generated reply",
    });
    const resultCards = [flagged, spam, dog, draft] as const;
    resultCards.forEach((card) => {
      card.all.forEach((item) => item.scale(0.82).opacity(0.18));
    });

    const connectors = [
      addArrow(this, email.anchors.subject, [-4.52, 3.62], COLOR.ai),
      addArrow(this, email.anchors.body, [-3.18, 3.62], COLOR.ml),
      addArrow(this, email.anchors.attachment, [-4.52, -3.62], COLOR.dl),
      addArrow(this, email.anchors.reply, [-3.18, -3.62], COLOR.genai),
    ];
    connectors.forEach((arrow) => arrow.at([arrow.initialState.x, arrow.initialState.y, 0.18]));
    bindArrow(this, connectors[0]!, email.subject[0]!, flagged.panel, [2.34, 0.88]);
    bindArrow(this, connectors[1]!, email.body[1]!, spam.panel, [2.34, 0.88]);
    bindArrow(this, connectors[2]!, email.attachment[0]!, dog.panel, [2.34, 0.88]);
    bindArrow(this, connectors[3]!, email.reply[0]!, draft.panel, [2.34, 0.88]);

    const aiBoundary = this.add(
      Rectangle().size([13.60, 7.55]).cornerRadius(0.34)
        .fill(ALPHA.ai).stroke({ color: COLOR.ai, width: 0.055 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 0 28px rgba(49,215,255,0.12))" }),
      { at: [16, 0, 0.12] },
    );
    const aiLabel = this.add(
      Label("AI").height(0.52).color(COLOR.ai)
        .css({ fontWeight: 950, letterSpacing: "0.07em" }),
      { at: [16, 3.25, 0.18] },
    );
    const aiDefinition = this.add(
      Label("TASKS ASSOCIATED WITH INTELLIGENCE").height(0.15).color(COLOR.muted)
        .css({ fontWeight: 750, letterSpacing: "0.045em" }),
      { at: [16, 2.80, 0.18] },
    );
    const aiFlagged = addResultCard(this, {
      at: [16, 0], fill: SOLID.ai,
      result: "FLAGGED", detail: "Rule-based checks",
    });
    aiFlagged.all.forEach((item) => item.scale(1.08));

    // Match the exact closing camera of Segment 2 before returning to email.
    this.camera.position([16, 0, 8]).lookAt([16, 0, 0]).zoom(1);

    // The copy leaving the email screen and the title it becomes upstairs.
    const spamCopy = addResultCard(this, {
      at: [-3.18, 3.62], fill: SOLID.ml,
      result: "SPAM 96%", detail: "Learned score",
    });
    hide(spamCopy.all);
    const mlTitle = addTitleCard(this, "MACHINE LEARNING", [0, 12.55], COLOR.ml, 5.25);
    hide(mlTitle);

    // -----------------------------------------------------------------------
    // Labelled-email learning demonstration.
    // -----------------------------------------------------------------------
    const learningLabel = addText(this, "LEARNING", [0, 11.55], 0.32, COLOR.ml, 900);
    learningLabel.opacity(0);
    const trainingDefinition = addText(
      this, "TRAINING = LEARNING FROM EXAMPLES", [0, 6.72], 0.22, COLOR.ml, 900,
    );
    trainingDefinition.opacity(0);

    const modelPanel = this.add(
      Rectangle().size([3.65, 3.25]).cornerRadius(0.28)
        .fill(ALPHA.ml).stroke({ color: COLOR.ml, width: 0.045 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 12px 24px rgba(87,227,161,0.12))" }),
      { at: [0.45, 8.95, 0.16] },
    ).opacity(0);
    const modelLabel = addText(this, "MODEL PARAMETERS", [0.45, 10.18], 0.16, COLOR.ml, 850);
    modelLabel.opacity(0);
    const gauges = Array.from({ length: 8 }, (_, index) =>
      addGauge(this, [-0.82 + index * 0.36, 8.82], index),
    );
    gauges.forEach((gauge) => hide(gauge.all));

    const labelledEmails = [
      addMiniEmail(this, [-5.10, 10.25], "SPAM", "Urgent transfer", COLOR.warning),
      addMiniEmail(this, [-5.10, 9.30], "NOT SPAM", "Team update", COLOR.ml),
      addMiniEmail(this, [-5.10, 8.35], "SPAM", "Prize waiting", COLOR.warning),
      addMiniEmail(this, [-5.10, 7.40], "NOT SPAM", "Project review", COLOR.ml),
    ];
    labelledEmails.forEach((card) => hide(card.all));

    const mathVeil = this.add(
      Rectangle().size([4.25, 3.75]).cornerRadius(0.30).fill("rgba(7,10,22,0.90)")
        .stroke({ color: COLOR.ml, width: 0.03 }).css({ borderStyle: "none" }),
      { at: [0.45, 8.95, 0.48] },
    ).opacity(0);
    const mathSymbols = addText(this, "Σ  ∂  ×  +  =", [0.45, 9.35], 0.42, COLOR.ml, 850, 0.50);
    const notMagic = addText(this, "NOT MAGIC. MATHEMATICS.", [0.45, 8.55], 0.24, COLOR.ink, 900, 0.50);
    mathSymbols.opacity(0);
    notMagic.opacity(0);

    const lock = addText(this, "PARAMETERS LOCKED", [0.45, 7.38], 0.15, COLOR.ai, 850);
    lock.opacity(0);
    const inferenceDefinition = addText(
      this, "INFERENCE = USING A TRAINED MODEL", [3.95, 6.72], 0.20, COLOR.ai, 900,
    );
    inferenceDefinition.opacity(0);
    const inferenceEmail = addMiniEmail(this, [-4.80, 8.95], "NEW EMAIL", "Unknown sender", COLOR.ai);
    hide(inferenceEmail.all);
    const spamOutput = addResultCard(this, {
      at: [4.75, 8.95], fill: SOLID.ml,
      result: "SPAM", detail: "96%",
    });
    hide(spamOutput.all);

    // -----------------------------------------------------------------------
    // Plot-price CSV and graph.
    // -----------------------------------------------------------------------
    const plotTitle = addText(this, "PLOT PRICES IN MUZAFFARPUR", [0, 11.45], 0.28, COLOR.ink, 900);
    plotTitle.opacity(0);
    const csv = addCsvCard(this, [0, 8.78]);
    hide(csv.all);

    const graph = addGraph(this);
    hide(graph.all);

    const data = [
      { area: 1.0, price: 19 },
      { area: 1.6, price: 25 },
      { area: 2.2, price: 36 },
      { area: 2.9, price: 43 },
      { area: 3.5, price: 52 },
      { area: 4.6, price: 67 },
      { area: 5.0, price: 76 },
    ] as const;
    const graphPoints = data.map(({ area, price }) => graphPoint(area, price));
    const csvDots = data.map((_, index) => this.add(
      Circle().radius(0.105).fill(COLOR.ml).stroke({ color: COLOR.ink, width: 0.018 }),
      { at: [3.34, 9.55 - index * 0.38, 0.32] },
    ).opacity(0));

    const estimatePoint = graphPoint(4, 60);
    const estimateDot = this.add(
      Circle().radius(0.14).fill(COLOR.gold).stroke({ color: COLOR.ink, width: 0.025 }),
      { at: [estimatePoint[0], estimatePoint[1], 0.36] },
    ).opacity(0);
    const estimateVertical = this.add(atZ(
      Line().from([estimatePoint[0], 6.65]).to(estimatePoint)
        .stroke({ color: COLOR.gold, width: 0.04 }),
      0.30,
    )).opacity(0);
    const estimateHorizontal = this.add(atZ(
      Line().from(estimatePoint).to([-6.05, estimatePoint[1]])
        .stroke({ color: COLOR.gold, width: 0.04 }),
      0.30,
    )).opacity(0);
    const estimateX = addText(this, "4,000", [estimatePoint[0], 6.30], 0.14, COLOR.gold, 850);
    const estimateY = addText(this, "₹60 LAKH", [-5.58, estimatePoint[1] + 0.22], 0.16, COLOR.gold, 900);
    const intuition = addText(this, "YOUR ESTIMATE", [-2.50, 10.65], 0.17, COLOR.gold, 900);
    [estimateX, estimateY, intuition].forEach((item) => item.opacity(0));

    // Training states: deliberate line adjustments, residuals, parameters and error.
    const lineStates = [
      addFitState(this, [[-5.55, 9.65], [1.05, 8.15]], "a = -3", "b = 58", "ERROR 82%", 0),
      addFitState(this, [[-5.55, 7.25], [1.05, 9.15]], "a = 7", "b = 12", "ERROR 49%", 1),
      addFitState(this, [[-5.55, 7.55], [1.05, 10.25]], "a = 11", "b = 7", "ERROR 21%", 2),
      addFitState(this, [[-5.55, 7.45], [1.05, 10.62]], "a = 14", "b = 4", "ERROR 8%", 3),
    ];
    lineStates.forEach((state) => hide(state.all));
    const baseEquation = addText(this, "y = ax + b", [4.55, 10.35], 0.38, COLOR.ink, 850);
    const trainedEquation = addText(this, "y = 14x + 4", [4.55, 8.32], 0.31, COLOR.ml, 900);
    const trainedStamp = addPill(this, "TRAINED", [4.55, 6.95], COLOR.ml, 2.15);
    baseEquation.opacity(0);
    trainedEquation.opacity(0);
    hide(trainedStamp);

    const inferenceInput = addText(this, "4,000 sq ft  →  x = 4", [4.55, 9.35], 0.19, COLOR.ai, 850);
    const substitution = addText(this, "y = 14(4) + 4 = 60", [4.55, 8.72], 0.23, COLOR.ink, 850);
    inferenceInput.opacity(0);
    substitution.opacity(0);
    const inferenceVertical = this.add(atZ(
      Line().from([estimatePoint[0], 6.65]).to(estimatePoint)
        .stroke({ color: COLOR.ai, width: 0.045 }),
      0.42,
    )).opacity(0);
    const inferenceHorizontal = this.add(atZ(
      Line().from(estimatePoint).to([-6.05, estimatePoint[1]])
        .stroke({ color: COLOR.ai, width: 0.045 }),
      0.42,
    )).opacity(0);
    const inferencePrice = addText(this, "₹60 LAKH", [-5.58, estimatePoint[1] + 0.22], 0.17, COLOR.ai, 900);
    inferencePrice.opacity(0);

    // Compact recap model.
    const recapPanel = this.add(
      Rectangle().size([5.00, 2.65]).cornerRadius(0.30).fill(ALPHA.ml)
        .stroke({ color: COLOR.ml, width: 0.05 }).css({ borderStyle: "none" }),
      { at: [0, 9.25, 0.20] },
    ).opacity(0);
    const recapTitle = addText(this, "MODEL", [0, 10.05], 0.30, COLOR.ml, 950);
    const recapEquation = addText(this, "y = ax + b", [0, 9.38], 0.25, COLOR.ink, 850);
    const recapParameters = addText(this, "a = 14     b = 4     LOCKED", [0, 8.62], 0.18, COLOR.ai, 850);
    const recapTraining = addText(
      this, "TRAINING  —  adjust parameters using examples", [0, 7.35], 0.19, COLOR.ml, 850,
    );
    const recapInference = addText(
      this, "INFERENCE  —  use the trained model", [0, 6.78], 0.19, COLOR.ai, 850,
    );
    const recapInput = addPill(this, "4,000 SQ FT", [-4.20, 9.25], COLOR.ai, 2.25);
    const recapOutput = addPill(this, "₹60 LAKH", [4.20, 9.25], COLOR.ml, 2.10);
    const recapAll = [
      recapPanel, recapTitle, recapEquation, recapParameters,
      recapTraining, recapInference, ...recapInput, ...recapOutput,
    ];
    hide(recapAll);

    // Final ML region inside the persistent AI diagram.
    const mlBoundary = this.add(
      Rectangle().size([7.25, 4.55]).cornerRadius(0.30).fill(ALPHA.ml)
        .stroke({ color: COLOR.ml, width: 0.055 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 0 24px rgba(87,227,161,0.12))" }),
      { at: [18.05, -0.45, 0.22] },
    ).opacity(0);
    const mlDiagramLabel = addText(this, "MACHINE LEARNING", [18.05, 1.32], 0.30, COLOR.ml, 950, 0.28);
    mlDiagramLabel.opacity(0);
    const diagramSpam = addResultCard(this, {
      at: [18.05, -0.48], fill: SOLID.ml,
      result: "SPAM 96%", detail: "Learned score",
    });
    hide(diagramSpam.all);
    const finalTakeaway = addText(
      this, "ML IS ONE WAY TO BUILD AI", [16, -3.22], 0.20, COLOR.ink, 900, 0.30,
    );
    finalTakeaway.opacity(0);

    addKavriqBrand(this);

    // -----------------------------------------------------------------------
    // Timeline — one continuous Segment 3 render.
    // -----------------------------------------------------------------------
    const timeline = new Timeline();

    // Start on Segment 2's closing frame, then return to the email example.
    timeline.animateCamera(this.camera).at(0.35).duration(1.25).ease("inOutCubic")
      .frameTo([0, 0, 8], [0, 0, 0]);
    timeline.animate(spam.all).at(1.75).duration(0.42).fadeTo(1);
    timeline.animate(spam.result).at(1.82).duration(0.52).indicate();
    timeline.animate(spamCopy.all).at(2.30).stagger(0.025).duration(0.26).appear();
    timeline.animate(spam.all).at(2.55).duration(0.38).fadeTo(0.18);

    // Pull back, carry the copied result upstairs, and let it become the title.
    timeline.animateCamera(this.camera).at(2.50).duration(1.55).ease("inOutCubic")
      .frameTo([0, 4.5, 8], [0, 4.5, 0]);
    timeline.animateCamera(this.camera).at(2.50).duration(1.55).ease("inOutCubic").zoomTo(0.50);
    moveGroup(timeline, spamCopy.all, spamCopy.center, [0, 12.55], 2.55, 1.55, 1.04);
    timeline.animate(spamCopy.all).at(4.10).duration(0.30).fadeTo(0);
    timeline.animate(mlTitle).at(4.08).stagger(0.04).duration(0.38).appear();
    timeline.animateCamera(this.camera).at(4.18).duration(1.25).ease("inOutCubic")
      .frameTo([0, 9, 8], [0, 9, 0]);
    timeline.animateCamera(this.camera).at(4.18).duration(1.25).ease("inOutCubic").zoomTo(1);

    // Labelled examples change model parameters: the training beat.
    timeline.animate(learningLabel).at(5.55).duration(0).appear();
    timeline.animate(learningLabel).at(5.55).duration(0.55).typewrite();
    timeline.animate([modelPanel, modelLabel]).at(6.05).stagger(0.10).duration(0.38).appear();
    timeline.animate(gauges.flatMap((gauge) => gauge.all)).at(6.32).stagger(0.035).duration(0.32).appear();
    labelledEmails.forEach((card, index) => {
      const at = 6.85 + index * 1.32;
      timeline.animate(card.all).at(at).stagger(0.02).duration(0.28).appear();
      moveGroup(timeline, card.all, card.center, [0.15, 8.95], at + 0.38, 0.72, 0.68);
      timeline.animate(card.all).at(at + 0.92).duration(0.22).fadeTo(0);
      gauges.forEach((gauge, gaugeIndex) => {
        if ((gaugeIndex + index) % 3 !== 0) return;
        const scale = 0.38 + ((gaugeIndex * 5 + index * 3) % 7) * 0.09;
        timeline.animate(gauge.fill).at(at + 0.72).duration(0.48).ease("inOutCubic").scaleTo(scale);
      });
    });
    timeline.animate(learningLabel).at(12.20).duration(0.30).fadeTo(0);
    timeline.animate(trainingDefinition).at(12.28).duration(0).appear();
    timeline.animate(trainingDefinition).at(12.28).duration(0.65).typewrite();

    // Mathematics, not magic.
    timeline.animate(mathVeil).at(13.55).duration(0.30).appear();
    timeline.animate(mathSymbols).at(13.72).duration(0.52).typewrite();
    timeline.animate(notMagic).at(14.28).duration(0.62).typewrite();
    timeline.animate([mathVeil, mathSymbols, notMagic]).at(15.60).duration(0.40).fadeTo(0);

    // Freeze parameters for inference and pass one new email through.
    timeline.animate(trainingDefinition).at(16.25).duration(0.55).moveTo([-3.72, 6.72, 0.24]);
    timeline.animate(lock).at(16.52).duration(0.35).appear();
    timeline.animate(inferenceDefinition).at(16.85).duration(0).appear();
    timeline.animate(inferenceDefinition).at(16.85).duration(0.65).typewrite();
    timeline.animate(inferenceEmail.all).at(18.05).stagger(0.025).duration(0.28).appear();
    moveGroup(timeline, inferenceEmail.all, inferenceEmail.center, [0.15, 8.95], 18.42, 0.78, 0.68);
    timeline.animate(inferenceEmail.all).at(19.05).duration(0.22).fadeTo(0);
    timeline.animate(spamOutput.all).at(19.30).stagger(0.04).duration(0.34).appear();
    timeline.animate(spamOutput.result).at(19.72).duration(0.48).indicate();

    // Clear the email demonstration and introduce the CSV.
    const trainingVisuals = [
      modelPanel, modelLabel, ...gauges.flatMap((gauge) => gauge.all),
      trainingDefinition, inferenceDefinition, lock, ...spamOutput.all,
    ];
    timeline.animate(trainingVisuals).at(21.15).stagger(0.006).duration(0.42).fadeTo(0);
    timeline.animate(plotTitle).at(21.82).duration(0).appear();
    timeline.animate(plotTitle).at(21.82).duration(0.62).typewrite();
    timeline.animate(csv.all).at(22.45).stagger(0.025).duration(0.42).appear();
    moveGroup(timeline, csv.all, csv.center, [4.70, 8.78], 24.25, 0.88, 0.86);
    timeline.animate(graph.all).at(24.42).stagger(0.08).duration(0.55).appear();
    csvDots.forEach((dot, index) => {
      const at = 25.25 + index * 0.54;
      timeline.animate(csv.rowHighlights[index]!).at(at).duration(0.20).fadeTo(0.42);
      timeline.animate(dot).at(at + 0.10).duration(0.18).appear();
      timeline.animate(dot).at(at + 0.10).duration(0.58).ease("inOutCubic")
        .moveTo([graphPoints[index]![0], graphPoints[index]![1], 0.32]);
      timeline.animate(csv.rowHighlights[index]!).at(at + 0.48).duration(0.20).fadeTo(0);
    });

    // Human intuition: guides but no model line.
    timeline.animate(estimateDot).at(29.60).duration(0.24).appear();
    timeline.animate(estimateVertical).at(29.82).duration(0).appear();
    timeline.animate(estimateVertical).at(29.82).duration(0.50).draw();
    timeline.animate(estimateHorizontal).at(30.32).duration(0).appear();
    timeline.animate(estimateHorizontal).at(30.32).duration(0.46).draw();
    timeline.animate(estimateX).at(29.82).duration(0.30).appear();
    timeline.animate(estimateY).at(30.58).duration(0.34).appear();
    timeline.animate(intuition).at(30.85).duration(0.50).typewrite();

    // Remove the intuitive guides, then train y=ax+b in four clear steps.
    const estimateVisuals = [
      estimateDot, estimateVertical, estimateHorizontal, estimateX, estimateY, intuition,
    ];
    timeline.animate(estimateVisuals).at(33.10).duration(0.36).fadeTo(0);
    timeline.animate(csv.all).at(33.15).duration(0.40).fadeTo(0.04);
    timeline.animate(baseEquation).at(33.55).duration(0).appear();
    timeline.animate(baseEquation).at(33.55).duration(0.62).typewrite();
    lineStates.forEach((state, index) => {
      const at = 34.45 + index * 1.35;
      if (index > 0) timeline.animate(lineStates[index - 1]!.all).at(at).duration(0.24).fadeTo(0);
      timeline.animate(state.all).at(at).stagger(0.025).duration(0.36).appear();
      timeline.animate(state.line).at(at).duration(0.46).draw();
    });
    timeline.animate(trainedEquation).at(39.78).duration(0).appear();
    timeline.animate(trainedEquation).at(39.78).duration(0.56).typewrite();
    timeline.animate(trainedStamp).at(40.28).stagger(0.05).duration(0.34).appear();

    // Inference: the trained line does not move.
    timeline.animate(
      lineStates[3]!.all.filter((item) => item !== lineStates[3]!.line),
    ).at(41.12).duration(0.34).fadeTo(0);
    timeline.animate(inferenceInput).at(41.55).duration(0).appear();
    timeline.animate(inferenceInput).at(41.55).duration(0.58).typewrite();
    timeline.animate(substitution).at(42.35).duration(0).appear();
    timeline.animate(substitution).at(42.35).duration(0.72).typewrite();
    timeline.animate(inferenceVertical).at(43.05).duration(0).appear();
    timeline.animate(inferenceVertical).at(43.05).duration(0.52).draw();
    timeline.animate(inferenceHorizontal).at(43.57).duration(0).appear();
    timeline.animate(inferenceHorizontal).at(43.57).duration(0.48).draw();
    timeline.animate(inferencePrice).at(44.08).duration(0.34).appear();
    timeline.animate(inferencePrice).at(44.35).duration(0.50).indicate();

    // Compress the graph and equation into a model card, then recap both terms.
    const graphStage = [
      ...graph.all, ...csv.all, ...csvDots, ...lineStates.flatMap((state) => state.all),
      baseEquation, trainedEquation, ...trainedStamp, inferenceInput, substitution,
      inferenceVertical, inferenceHorizontal, inferencePrice,
    ];
    timeline.animate(graphStage).at(46.20).stagger(0.002).duration(0.50).fadeTo(0);
    timeline.animate(recapPanel).at(46.62).duration(0.34).appear();
    timeline.animate([recapTitle, recapEquation, recapParameters]).at(46.85).stagger(0.16).duration(0.38).appear();
    timeline.animate(recapTraining).at(48.15).duration(0).appear();
    timeline.animate(recapTraining).at(48.15).duration(0.64).typewrite();
    timeline.animate(recapParameters).at(48.75).duration(0.42).indicate();
    timeline.animate(recapInference).at(49.55).duration(0).appear();
    timeline.animate(recapInference).at(49.55).duration(0.62).typewrite();
    timeline.animate(recapInput).at(50.40).stagger(0.04).duration(0.32).appear();
    moveGroup(timeline, recapInput, [-4.20, 9.25], [-1.75, 9.25], 50.82, 0.62, 0.82);
    timeline.animate(recapOutput).at(51.45).stagger(0.04).duration(0.32).appear();

    // Return to the taxonomy: ML becomes a region inside AI.
    timeline.animate(recapAll).at(53.35).stagger(0.004).duration(0.42).fadeTo(0);
    timeline.animate(plotTitle).at(53.35).duration(0.35).fadeTo(0);
    timeline.animateCamera(this.camera).at(53.90).duration(1.55).ease("inOutCubic")
      .frameTo([8, 4.5, 8], [8, 4.5, 0]);
    timeline.animateCamera(this.camera).at(53.90).duration(1.55).ease("inOutCubic").zoomTo(0.50);
    moveGroup(timeline, mlTitle, [0, 12.55], [18.05, 1.32], 54.18, 1.62, 0.74);
    moveGroup(timeline, aiFlagged.all, [16, 0], [12.15, -0.45], 54.85, 1.10, 0.88);
    timeline.animate(mlBoundary).at(55.28).duration(0.18).appear();
    timeline.animate(mlBoundary).at(55.28).duration(0.82).ease("outCubic").scaleTo(1);
    timeline.animate(mlTitle).at(55.78).duration(0.30).fadeTo(0);
    timeline.animate(mlDiagramLabel).at(55.78).duration(0.42).appear();
    timeline.animate(diagramSpam.all).at(56.18).stagger(0.035).duration(0.34).appear();
    timeline.animateCamera(this.camera).at(56.55).duration(1.45).ease("inOutCubic")
      .frameTo([16, 0, 8], [16, 0, 0]);
    timeline.animateCamera(this.camera).at(56.55).duration(1.45).ease("inOutCubic").zoomTo(1);
    timeline.animate(mlBoundary).at(58.18).duration(0.42).scaleTo(1.025);
    timeline.animate(mlBoundary).at(58.72).duration(0.34).scaleTo(1);
    timeline.animate(finalTakeaway).at(58.45).duration(0).appear();
    timeline.animate(finalTakeaway).at(58.45).duration(0.64).typewrite();

    this.play(timeline);
    this.wait(3.2);
    this.captureScreenshotsNamed([
      [0, "part-03-continuity"],
      [5.65, "part-03-ml-screen"],
      [12.90, "part-03-training"],
      [20.10, "part-03-inference"],
      [28.80, "part-03-plot-data"],
      [31.30, "part-03-intuition"],
      [40.70, "part-03-trained-line"],
      [44.70, "part-03-plot-inference"],
      [51.90, "part-03-model-recap"],
      [59.35, "part-03-ai-diagram"],
    ]);
  }
}

function addResultCard(
  scene: Scene,
  spec: { at: Vec2; fill: string; result: string; detail: string },
): ResultCard {
  const [x, y] = spec.at;
  const panel = scene.add(
    Rectangle().size([2.34, 0.88]).cornerRadius(0.20).fill(spec.fill)
      .css({ borderStyle: "none", filter: `drop-shadow(0 8px 14px ${spec.fill}40)` }),
    { at: [x, y, 0.20] },
  );
  const result = scene.add(
    Label(spec.result).height(0.21).color(COLOR.ink)
      .css({ fontWeight: 950, letterSpacing: "0.045em" }),
    { at: [x, y + 0.11, 0.22] },
  );
  const detail = scene.add(
    Label(spec.detail).height(0.125).color("rgba(248,250,252,0.78)")
      .css({ fontWeight: 650 }),
    { at: [x, y - 0.20, 0.22] },
  );
  return { all: [panel, result, detail], panel, result, center: spec.at };
}

function addTitleCard(scene: Scene, text: string, at: Vec2, color: string, width: number): Tattva[] {
  return [
    scene.add(
      Rectangle().size([width, 0.86]).cornerRadius(0.24).fill(ALPHA.ml)
        .stroke({ color, width: 0.045 }).css({ borderStyle: "none" }),
      { at: [at[0], at[1], 0.22] },
    ),
    addText(scene, text, at, 0.30, color, 950, 0.24),
  ];
}

function addText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  color: string,
  weight: number,
  z = 0.24,
): Tattva {
  return scene.add(
    Label(text).height(height).color(color).css({ fontWeight: weight, letterSpacing: "0.035em" }),
    { at: [at[0], at[1], z] },
  );
}

function addMiniEmail(scene: Scene, at: Vec2, tag: string, subject: string, color: string): MiniEmail {
  const [x, y] = at;
  const panel = scene.add(
    Rectangle().size([2.65, 0.72]).cornerRadius(0.15).fill(COLOR.panel)
      .stroke({ color, width: 0.03 }).css({ borderStyle: "none" }),
    { at: [x, y, 0.24] },
  );
  const tagLabel = addText(scene, tag, [x - 0.77, y + 0.12], 0.125, color, 900, 0.26);
  const subjectLabel = addText(scene, subject, [x, y - 0.16], 0.12, COLOR.muted, 700, 0.26);
  return { all: [panel, tagLabel, subjectLabel], center: at };
}

function addGauge(scene: Scene, at: Vec2, index: number): ParameterGauge {
  const [x, y] = at;
  const track = scene.add(
    Rectangle().size([0.22, 1.48]).cornerRadius(0.09).fill(COLOR.panelSoft)
      .stroke({ color: COLOR.grid, width: 0.018 }).css({ borderStyle: "none" }),
    { at: [x, y, 0.22] },
  );
  const fill = scene.add(
    Rectangle().size([0.16, 1.18]).cornerRadius(0.07).fill(index % 2 === 0 ? COLOR.ml : COLOR.ai)
      .css({ borderStyle: "none" }),
    { at: [x, y, 0.24] },
  ).scale(0.28 + (index % 4) * 0.11);
  return { all: [track, fill], fill };
}

function addCsvCard(scene: Scene, center: Vec2): {
  all: Tattva[];
  rowHighlights: Tattva[];
  center: Vec2;
} {
  const [x, y] = center;
  const all: Tattva[] = [];
  const rowHighlights: Tattva[] = [];
  all.push(scene.add(
    Rectangle().size([5.05, 4.15]).cornerRadius(0.24).fill(COLOR.panel)
      .stroke({ color: COLOR.grid, width: 0.04 }).css({ borderStyle: "none" }),
    { at: [x, y, 0.18] },
  ));
  all.push(addText(scene, "MUZAFFARPUR-PLOT-PRICES.CSV", [x, y + 1.67], 0.18, COLOR.ml, 900, 0.22));
  all.push(addText(scene, "PLOT SIZE (SQ FT)", [x - 1.18, y + 1.20], 0.13, COLOR.muted, 850, 0.22));
  all.push(addText(scene, "PRICE (₹ LAKH)", [x + 1.25, y + 1.20], 0.13, COLOR.muted, 850, 0.22));
  const rows = [
    ["1,000", "19"], ["1,600", "25"], ["2,200", "36"], ["2,900", "43"],
    ["3,500", "52"], ["4,600", "67"], ["5,000", "76"],
  ];
  rows.forEach((row, index) => {
    const rowY = y + 0.76 - index * 0.38;
    const highlight = scene.add(
      Rectangle().size([4.55, 0.31]).cornerRadius(0.06).fill(ALPHA.ml).css({ borderStyle: "none" }),
      { at: [x, rowY, 0.20] },
    ).opacity(0);
    rowHighlights.push(highlight);
    all.push(highlight);
    all.push(addText(scene, row[0]!, [x - 1.18, rowY], 0.13, COLOR.ink, 720, 0.23));
    all.push(addText(scene, row[1]!, [x + 1.25, rowY], 0.13, COLOR.ink, 720, 0.23));
  });
  return { all, rowHighlights, center };
}

function addGraph(scene: Scene): { all: Tattva[] } {
  const xAxis = scene.add(atZ(
    Line().from([-6.05, 6.65]).to([1.30, 6.65]).stroke({ color: COLOR.ink, width: 0.045 }),
    0.20,
  ));
  const yAxis = scene.add(atZ(
    Line().from([-6.05, 6.65]).to([-6.05, 10.92]).stroke({ color: COLOR.ink, width: 0.045 }),
    0.20,
  ));
  const xLabel = addText(scene, "PLOT SIZE (SQ FT)", [-2.40, 6.12], 0.15, COLOR.muted, 800);
  const yLabel = addText(scene, "PRICE (₹ LAKH)", [-6.55, 10.60], 0.14, COLOR.muted, 800);
  const xTicks = [1, 2, 3, 4, 5].map((value) =>
    addText(scene, `${value}k`, [graphPoint(value, 0)[0], 6.38], 0.12, COLOR.muted, 700),
  );
  const yTicks = [20, 40, 60, 80].map((value) =>
    addText(scene, `${value}`, [-6.34, graphPoint(0, value)[1]], 0.12, COLOR.muted, 700),
  );
  return { all: [xAxis, yAxis, xLabel, yLabel, ...xTicks, ...yTicks] };
}

function graphPoint(areaInThousands: number, priceInLakhs: number): Vec2 {
  return [
    -6.05 + (areaInThousands / 5.5) * 7.20,
    6.65 + (priceInLakhs / 85) * 4.05,
  ];
}

function addFitState(
  scene: Scene,
  endpoints: readonly [Vec2, Vec2],
  slope: string,
  intercept: string,
  error: string,
  index: number,
): { all: Tattva[]; line: Tattva } {
  const line = scene.add(atZ(
    Line().from(endpoints[0]).to(endpoints[1]).stroke({ color: COLOR.ml, width: 0.055 }),
    0.34,
  ));
  const a = addPill(scene, slope, [4.55, 9.62], COLOR.ml, 1.75);
  const b = addPill(scene, intercept, [4.55, 9.05], COLOR.ml, 1.75);
  const errorLabel = addText(
    scene, error, [4.55, 7.62], 0.17,
    index === 3 ? COLOR.ml : COLOR.warning, 900,
  );

  const residuals: Tattva[] = [];
  const points = [
    graphPoint(1.0, 19), graphPoint(1.6, 25), graphPoint(2.2, 36),
    graphPoint(2.9, 43), graphPoint(3.5, 52), graphPoint(4.6, 67), graphPoint(5.0, 76),
  ];
  const [from, to] = endpoints;
  points.forEach((point) => {
    const ratio = (point[0] - from[0]) / Math.max(to[0] - from[0], 0.001);
    const lineY = from[1] + (to[1] - from[1]) * ratio;
    residuals.push(scene.add(atZ(
      Line().from(point).to([point[0], lineY]).stroke({ color: "rgba(255,107,95,0.55)", width: 0.022 }),
      0.30,
    )));
  });
  return { all: [line, ...a, ...b, errorLabel, ...residuals], line };
}

function addPill(scene: Scene, text: string, at: Vec2, color: string, width: number): Tattva[] {
  return [
    scene.add(
      Rectangle().size([width, 0.42]).cornerRadius(0.20)
        .fill(color === COLOR.ml ? ALPHA.ml : ALPHA.ai)
        .stroke({ color, width: 0.025 }).css({ borderStyle: "none" }),
      { at: [at[0], at[1], 0.26] },
    ),
    addText(scene, text, at, 0.145, color, 850, 0.28),
  ];
}

function hide(items: readonly Tattva[]): void {
  items.forEach((item) => item.opacity(0));
}

function atZ<T extends Tattva>(item: T, z: number): T {
  item.at([item.initialState.x, item.initialState.y, z]);
  return item;
}

function placeScaledGroup(
  items: readonly Tattva[],
  fromCenter: Vec2,
  toCenter: Vec2,
  scale: number,
): void {
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

function bindArrow(
  scene: Scene,
  arrow: Tattva,
  source: Tattva,
  targetPanel: Tattva,
  targetSize: Vec2,
): void {
  const baseLength = Math.max(arrow.worldSize?.width ?? 1, 0.001);
  scene.addUpdater(arrow, ({ state, stateOf }) => {
    const sourceState = stateOf(source);
    const targetState = stateOf(targetPanel);
    if (!sourceState || !targetState) return;

    const towardSourceX = sourceState.x - targetState.x;
    const towardSourceY = sourceState.y - targetState.y;
    const halfWidth = targetSize[0] * Math.abs(targetState.scaleX) / 2;
    const halfHeight = targetSize[1] * Math.abs(targetState.scaleY) / 2;
    const edgeDivisor = Math.max(
      Math.abs(towardSourceX) / Math.max(halfWidth, 0.001),
      Math.abs(towardSourceY) / Math.max(halfHeight, 0.001),
      1,
    );
    const endX = targetState.x + towardSourceX / edgeDivisor;
    const endY = targetState.y + towardSourceY / edgeDivisor;
    const dx = endX - sourceState.x;
    const dy = endY - sourceState.y;
    const length = Math.max(Math.hypot(dx, dy), 0.001);

    state.x = (sourceState.x + endX) / 2;
    state.y = (sourceState.y + endY) / 2;
    state.z = 0.18;
    state.rotationZ = Math.atan2(dy, dx) * 180 / Math.PI;
    state.scaleX = length / baseLength;
    state.scaleY = 1;
    state.opacity = 1;
  });
}

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  scene.updater((time, states) => {
    // Continue approximately from Segment 2's final splash phase.
    motion.update((time + 86.2) % motion.duration, states);
  });
}

await renderScene(import.meta.url, MachineLearningScene, "03-machine-learning.mp4");
