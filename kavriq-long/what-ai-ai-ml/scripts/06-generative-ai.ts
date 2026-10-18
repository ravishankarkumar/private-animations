import { LearningMeterGaugeField, NeuralNetwork, neuralNetwork } from "veena/ai";
import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Arrow, Circle, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { Newspaper, NewspaperOpening } from "veena/storytelling";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { COLOR, FRAME } from "./lib/theme.ts";

const SOLID = {
  ai: "#17647D",
  ml: "#1E7A55",
  dl: "#53368A",
  genai: "#C4485C",
  overlap: "#35194F",
  panel: "#11192C",
  panelSoft: "#172238",
} as const;

interface VisualGroup {
  all: Tattva[];
  center: Vec2;
}

interface TokenVisual extends VisualGroup {
  panel: Tattva;
  label: Tattva;
  target: Vec2;
}

class GenerativeAiAndInferenceScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    this.camera.position([0, 0, 8]).lookAt([0, 0, 0]).zoom(1);

    // -------------------------------------------------------------------
    // Veena's reusable newspaper montage.
    // -------------------------------------------------------------------
    const newspapers = [
      new Newspaper("AI Chatbots Capture the World's Attention")
        .keyword("AI")
        .publication("THE GLOBAL OBSERVER")
        .date("SPECIAL EDITION")
        .volume("TECHNOLOGY · 2022")
        .section("FRONT PAGE")
        .deck("Conversational systems move artificial intelligence into everyday life.")
        .layout("lead"),
      new Newspaper("Machines Write Text and Code")
        .keyword("GENERATE")
        .publication("THE DAILY SIGNAL")
        .date("MORNING EDITION")
        .section("TECHNOLOGY")
        .deck("New tools respond to ordinary language with fluent output.")
        .layout("columns"),
      new Newspaper("Images Created from a Few Words")
        .keyword("PROMPT")
        .publication("THE FUTURE CHRONICLE")
        .date("WEEKEND EDITION")
        .section("CREATIVE DESK")
        .deck("Generative systems expand from language into visual media.")
        .layout("tabloid"),
      new Newspaper("Everyone Is Talking About Generative AI")
        .keyword("GEN AI")
        .publication("THE WORLD JOURNAL")
        .date("LATE EDITION")
        .section("ANALYSIS")
        .deck("The ability to create—not merely classify—takes centre stage.")
        .layout("lead"),
    ];
    const opening = NewspaperOpening(newspapers, {
      title: "AI ENTERS THE CHAT",
      kicker: "THE GENERATIVE AI WAVE",
      publication: "THE KAVRIQ CHRONICLE",
      date: "SPECIAL REPORT",
      volume: "AI · ML · DL · GEN AI",
      finalBody: [
        "AI already classified images and detected spam. Conversation changed what the public could see and feel.",
        "One prompt could now produce language, code, images, audio, and video.",
      ],
      totalTime: 6.4,
      timing: {
        introDelay: 0.18,
        flashDuration: 0.74,
        flashStagger: 0.50,
        finalDelay: 0.28,
        finalRevealDuration: 1.02,
        endHold: 1.25,
      },
    }).addTo(this);

    // A deliberately quiet plate. The real camera feed is placed over this
    // interval during editing, so nothing behind it moves.
    const cameraPlate = this.add(
      Rectangle().size([15.2, 7.8]).cornerRadius(0.32).fill("#090D1B")
        .css({ borderStyle: "none" }),
      { at: [0, 0, -0.40] },
    ).opacity(0);
    const cameraPlateLabel = addText(
      this,
      "GENERATIVE AI  ·  FROM PROMPT TO OUTPUT",
      [0, -3.45],
      0.18,
      "rgba(248,250,252,0.32)",
      760,
      -0.30,
    ).opacity(0);

    // -------------------------------------------------------------------
    // Persistent email on the main screen.
    // -------------------------------------------------------------------
    const email = addOpenEmailView(this, { at: [0, 0.02], scale: 0.68 });
    hide(email.all);

    const draftCopy = addDraftCard(this, email.anchors.reply);
    hide(draftCopy.all);

    // -------------------------------------------------------------------
    // Upper screen: definition, fixed model, and generation loop.
    // -------------------------------------------------------------------
    const title = addText(this, "GENERATIVE AI", [0, 12.55], 0.44, COLOR.genai, 950, 0.42);
    const takeaway = addSolidPill(this, "CREATES A NEW OUTPUT", [0, 11.85], SOLID.genai, 4.75);
    hide([title, ...takeaway.all]);

    const promptPanel = this.add(
      Rectangle().size([9.6, 0.76]).cornerRadius(0.22).fill(SOLID.panelSoft)
        .stroke({ color: COLOR.genai, width: 0.035 }).css({ borderStyle: "none" }),
      { at: [0, 11.05, 0.34] },
    ).opacity(0);
    const promptLabel = addText(
      this,
      "Why is the mango called the king of fruits?",
      [0, 11.05],
      0.22,
      COLOR.ink,
      820,
      0.38,
    ).opacity(0);

    const modelPanel = this.add(
      Rectangle().size([4.55, 3.65]).cornerRadius(0.30).fill("#16162A")
        .stroke({ color: COLOR.genai, width: 0.05 })
        .css({ borderStyle: "none", filter: "drop-shadow(0 16px 32px rgba(255,95,162,0.15))" }),
      { at: [0, 8.68, 0.30] },
    ).opacity(0);
    const modelLabel = addText(this, "TRAINED MODEL", [0, 10.15], 0.22, COLOR.genai, 950, 0.38).opacity(0);
    const gauges = this.add(
      LearningMeterGaugeField(100, {
        epochs: 100,
        seed: 61,
        size: [4.05, 2.55],
        columns: 10,
        noise: 0.18,
        title: "100 OF MANY FIXED WEIGHTS",
        showEpoch: false,
        arcColor: "rgba(255,95,162,0.45)",
        needleColor: COLOR.gold,
        background: "rgba(12,15,29,0.88)",
      }).epoch(100),
      { at: [0, 8.55, 0.36] },
    ).opacity(0);
    const fixedWeights = addSolidPill(this, "WEIGHTS FIXED", [0, 6.56], SOLID.ml, 2.55);
    hide(fixedWeights.all);

    const contextCard = addSolidPill(this, "PROMPT + ANSWER SO FAR", [-5.25, 8.76], "#243654", 3.70);
    hide(contextCard.all);
    const contextArrow = this.add(
      Arrow().from([-3.35, 8.76]).to([-2.42, 8.76]).stroke({ color: COLOR.ai, width: 0.045 }),
      { at: [0, 0, 0.40] },
    ).opacity(0);
    const outputArrow = this.add(
      Arrow().from([2.42, 8.76]).to([3.23, 8.76]).stroke({ color: COLOR.genai, width: 0.045 }),
      { at: [0, 0, 0.40] },
    ).opacity(0);

    const candidates = [
      addCandidate(this, [4.70, 9.50], "The", "48%", true),
      addCandidate(this, [4.70, 8.76], "Mango", "31%", false),
      addCandidate(this, [4.70, 8.02], "It", "14%", false),
      addCandidate(this, [4.70, 7.28], "Because", "7%", false),
    ];
    candidates.forEach((candidate) => hide(candidate.all));

    const answerCaption = addText(this, "GENERATED ANSWER", [-5.85, 6.18], 0.16, COLOR.genai, 900, 0.40);
    answerCaption.opacity(0);
    const generatedTokens = createGeneratedTokens(this);
    generatedTokens.forEach((token) => hide(token.all));

    // Keep the compact loop beneath the model so it reads as a process,
    // rather than drawing another horizontal layer across the gauges.
    const loopSummary = addLoopSummary(this, [0, 5.65]);
    hide(loopSummary.all);

    // -------------------------------------------------------------------
    // Inference and training comparison.
    // -------------------------------------------------------------------
    const inferenceFrame = this.add(
      Rectangle().size([14.55, 8.00]).cornerRadius(0.34).fill("rgba(0,0,0,0)")
        .stroke({ color: COLOR.ml, width: 0.055 }).css({ borderStyle: "none" }),
      { at: [0, 9.05, 0.55] },
    ).opacity(0);
    const inferenceLabel = addSolidPill(this, "INFERENCE", [0, 12.28], SOLID.ml, 2.15);
    hide(inferenceLabel.all);

    const trainingPanel = addComparisonPanel(
      this,
      [-3.75, 8.80],
      "ONE TRAINING RUN",
      "MANY EXAMPLES",
      "WEIGHTS KEEP CHANGING",
      COLOR.dl,
    );
    const responsePanel = addComparisonPanel(
      this,
      [3.75, 8.80],
      "ONE GENERATED RESPONSE",
      "ONE GROWING CONTEXT",
      "WEIGHTS STAY FIXED",
      COLOR.genai,
    );
    hide([...trainingPanel.all, ...responsePanel.all]);
    const trainingDots = Array.from({ length: 28 }, (_, index) => this.add(
      Circle().radius(0.055 + (index % 3) * 0.008).fill(index % 2 === 0 ? COLOR.ai : COLOR.dl),
      { at: [-5.72 + (index % 7) * 0.34, 8.38 - Math.floor(index / 7) * 0.34, 0.50] },
    ).opacity(0));
    const responseDots = Array.from({ length: 6 }, (_, index) => this.add(
      Circle().radius(0.07).fill(COLOR.genai),
      { at: [2.82 + index * 0.37, 8.20, 0.50] },
    ).opacity(0));

    // -------------------------------------------------------------------
    // Tokens, IDs, vectors, and matrix operations.
    // -------------------------------------------------------------------
    const tokenHeading = addText(this, "TEXT BECOMES TOKENS", [0, 12.25], 0.35, COLOR.ink, 950, 0.44);
    tokenHeading.opacity(0);
    const tokenExamples = [
      addTokenExample(this, [-4.95, 10.48], "mango", "complete word"),
      addTokenExample(this, [-1.66, 10.48], "nutri", "part of a word"),
      addTokenExample(this, [1.66, 10.48], "tion", "part of a word"),
      addTokenExample(this, [4.95, 10.48], ",", "punctuation"),
    ];
    tokenExamples.forEach((token) => hide(token.all));
    const tokenIdStrip = addStrip(this, [0, 8.85], "TOKEN IDs", ["481", "9821", "417", "11"], COLOR.ai);
    hide(tokenIdStrip.all);
    const vectorStrip = addStrip(
      this,
      [0, 7.20],
      "NUMERICAL VECTORS",
      ["[.18 .72 …]", "[.91 .06 …]", "[.42 .55 …]", "[.03 .88 …]"],
      COLOR.dl,
    );
    hide(vectorStrip.all);

    const matrixHeading = addText(this, "MATRIX MULTIPLICATION", [0, 11.85], 0.30, COLOR.gold, 950, 0.48);
    matrixHeading.opacity(0);
    const matrixCells = addMatrixGrid(this, [0, 8.80], 8, 5);
    matrixCells.forEach((cell) => cell.opacity(0));
    const matrixCaption = addText(
      this,
      "NUMBERS FLOW THROUGH MANY LAYERS OF CALCULATION",
      [0, 6.05],
      0.20,
      COLOR.ink,
      850,
      0.46,
    ).opacity(0);

    // -------------------------------------------------------------------
    // Weight callback: training establishes patterns; inference uses them.
    // -------------------------------------------------------------------
    const languageModel = neuralNetwork([
      { id: "tokens", label: "TOKENS", nodes: 4 },
      { id: "h1", label: "LAYER 1", nodes: 6, activation: "ReLU" },
      { id: "h2", label: "LAYER 2", nodes: 6, activation: "ReLU" },
      { id: "h3", label: "LAYER …", nodes: 6, activation: "ReLU" },
      { id: "out", label: "NEXT TOKEN", nodes: 4 },
    ], { layerSpacing: 2.32, nodeSpacing: 0.55, nodeRadius: 0.12 });
    const network = this.add(NeuralNetwork(languageModel, {
      node: COLOR.dl,
      nodeIdle: "#29213F",
      edge: "rgba(155,109,255,0.26)",
      positive: COLOR.ml,
      negative: COLOR.warning,
      flow: COLOR.gold,
      text: COLOR.ink,
      showValues: false,
      edgeThickness: 0.019,
      pulseRadius: 0.07,
    }), { at: [0, 8.85, 0.42] }).opacity(0);
    const networkTitle = addText(this, "LEARNED PATTERNS LIVE IN THE WEIGHTS", [0, 12.05], 0.31, COLOR.dl, 950, 0.46);
    networkTitle.opacity(0);
    const patternPills = [
      addSolidPill(this, "LANGUAGE STRUCTURE", [-3.85, 6.12], "#243654", 3.10),
      addSolidPill(this, "FACTUAL ASSOCIATIONS", [0, 6.12], "#243654", 3.35),
      addSolidPill(this, "WRITING STYLE", [3.85, 6.12], "#243654", 2.70),
    ];
    patternPills.forEach((pill) => hide(pill.all));
    const networkFixed = addSolidPill(this, "WEIGHTS FIXED DURING INFERENCE", [0, 5.45], SOLID.ml, 4.75);
    hide(networkFixed.all);

    // -------------------------------------------------------------------
    // Master taxonomy on the screen to the right of the email.
    // -------------------------------------------------------------------
    const aiRegion = this.add(
      Rectangle().size([13.60, 7.55]).cornerRadius(0.38).fill(SOLID.ai).css({ borderStyle: "none" }),
      { at: [16, 0, 0.10] },
    );
    const mlRegion = this.add(
      Rectangle().size([7.40, 4.75]).cornerRadius(0.34).fill(SOLID.ml).css({ borderStyle: "none" }),
      { at: [18.05, -0.42, 0.20] },
    );
    const dlRegion = this.add(
      Rectangle().size([4.40, 2.60]).cornerRadius(0.30).fill(SOLID.dl).css({ borderStyle: "none" }),
      { at: [18.75, 0.15, 0.30] },
    );
    const genAiRegion = this.add(
      Rectangle().size([4.15, 1.65]).cornerRadius(0.29).fill(SOLID.genai).css({ borderStyle: "none" }),
      { at: [20.55, -1.35, 0.36] },
    ).opacity(0);
    const overlapRegion = this.add(
      Rectangle().size([2.25, 1.10]).cornerRadius(0.25).fill(SOLID.overlap).css({ borderStyle: "none" }),
      { at: [19.55, -0.75, 0.38] },
    ).opacity(0);
    const aiDiagramLabel = addText(this, "ARTIFICIAL INTELLIGENCE", [16, 3.27], 0.31, COLOR.ink, 950, 0.48);
    const mlDiagramLabel = addText(this, "MACHINE LEARNING", [15.65, 1.48], 0.25, COLOR.ink, 950, 0.48);
    const dlDiagramLabel = addText(this, "DEEP LEARNING", [18.70, 0.98], 0.22, COLOR.ink, 950, 0.48);
    const genAiDiagramLabel = addText(this, "GENERATIVE AI", [21.20, -0.85], 0.18, COLOR.ink, 950, 0.50);
    genAiDiagramLabel.opacity(0);

    const flaggedCard = addDiagramCard(this, [12.15, -0.40], SOLID.ai, "FLAGGED", "Rules");
    const spamCard = addDiagramCard(this, [15.75, -0.65], SOLID.ml, "SPAM 96%", "Learned score");
    const dogCard = addDiagramCard(this, [18.35, 0.02], SOLID.dl, "DOG 98%", "Deep network");
    const replyCard = addDiagramCard(this, [20.88, -1.58], SOLID.genai, "DRAFT REPLY", "Generated output");
    hide(replyCard.all);
    const diagramError = addSolidPill(this, "TUE → WED", [21.85, 2.95], "#3B2026", 2.10);

    // The right-hand taxonomy exists from frame zero, but begins outside the
    // camera view. GenAI elements remain hidden until the closing handoff.
    addKavriqBrand(this);

    // -------------------------------------------------------------------
    // Timeline — one continuous Segment 6 render.
    // -------------------------------------------------------------------
    const timeline = new Timeline();
    opening.animate(timeline, { at: 0 });
    timeline.animate(opening.all()).at(6.38).duration(0.30).fadeTo(0);
    timeline.animate([cameraPlate, cameraPlateLabel]).at(6.42).duration(0).appear();

    // Static camera interval: 6.42–14.20. No animation is scheduled here.
    timeline.animate([cameraPlate, cameraPlateLabel]).at(14.20).duration(0.35).fadeTo(0);
    timeline.animate(email.all).at(14.28).stagger(0.002).duration(0.45).appear();
    pulseScale(timeline, email.reply, 15.15, 0.48, 1.025);

    timeline.animate(draftCopy.all).at(15.85).stagger(0.05).duration(0.35).appear();
    timeline.animate(email.reply).at(16.02).duration(0.38).fadeTo(0.30);
    timeline.animateCamera(this.camera).at(16.10).duration(1.55).ease("inOutCubic")
      .frameTo([0, 4.5, 8], [0, 4.5, 0]);
    timeline.animateCamera(this.camera).at(16.10).duration(1.55).ease("inOutCubic").zoomTo(0.50);
    moveGroup(timeline, draftCopy.all, draftCopy.center, [0, 12.48], 16.10, 1.55, 0.82);
    timeline.animateCamera(this.camera).at(17.75).duration(1.35).ease("inOutCubic")
      .frameTo([0, 9, 8], [0, 9, 0]);
    timeline.animateCamera(this.camera).at(17.75).duration(1.35).ease("inOutCubic").zoomTo(1);
    timeline.animate(draftCopy.all).at(18.85).duration(0.30).fadeTo(0);

    timeline.animate(title).at(18.75).duration(0).appear();
    timeline.animate(title).at(18.75).duration(0.68).typewrite();
    timeline.animate(takeaway.all).at(19.62).stagger(0.06).duration(0.42).appear();
    pulseScale(timeline, takeaway.all, 20.28, 0.38, 1.035);

    timeline.animate([promptPanel, promptLabel]).at(21.80).stagger(0.08).duration(0.45).appear();
    timeline.animate([modelPanel, modelLabel, gauges]).at(22.45).stagger(0.10).duration(0.48).appear();
    timeline.animate(fixedWeights.all).at(23.15).stagger(0.05).duration(0.38).appear();
    timeline.animate(contextCard.all).at(23.75).stagger(0.04).duration(0.34).appear();
    timeline.animate([contextArrow, outputArrow]).at(24.05).stagger(0.10).duration(0.35).appear();

    // First next-token decision exposes candidates and scores.
    pulseScale(timeline, contextCard.all, 24.50, 0.42, 1.035);
    timeline.animate(modelPanel).at(24.75).duration(0.30).scaleTo(1.025);
    timeline.animate(modelPanel).at(25.05).duration(0.28).scaleTo(1);
    candidates.forEach((candidate, index) => {
      timeline.animate(candidate.all).at(25.10 + index * 0.10).stagger(0.03).duration(0.32).appear();
    });
    pulseScale(timeline, candidates[0]!.all, 26.05, 0.46, 1.045);
    timeline.animate(answerCaption).at(26.15).duration(0.36).appear();
    timeline.animate(candidates.flatMap((candidate) => candidate.all)).at(26.75).duration(0.28).fadeTo(0);

    // The answer keeps growing. Each settled token remains visible while the
    // next token begins immediately, avoiding a mechanical stop-start rhythm.
    generatedTokens.forEach((token, index) => {
      const at = 26.58 + index * 0.73;
      timeline.animate(token.all).at(at).stagger(0.018).duration(0.18).appear();
      moveGroup(timeline, token.all, token.center, token.target, at, 0.50, 1);
      timeline.animate(token.panel).at(at + 0.48).duration(0.25).fadeTo(0.16);
      timeline.animate(token.label).at(at + 0.48).duration(0.25).to({ color: COLOR.ink });
      timeline.animate(modelPanel).at(at + 0.34).duration(0.16).scaleTo(1.012);
      timeline.animate(modelPanel).at(at + 0.50).duration(0.18).scaleTo(1);
    });

    const generationEnd = 26.58 + generatedTokens.length * 0.73;
    timeline.animate([contextArrow, outputArrow, ...contextCard.all]).at(generationEnd + 0.20)
      .duration(0.30).fadeTo(0);
    timeline.animate([
      title,
      ...takeaway.all,
      answerCaption,
      ...generatedTokens.flatMap((token) => token.all),
    ]).at(generationEnd + 0.20).stagger(0.001).duration(0.35).fadeTo(0);
    timeline.animate(loopSummary.all).at(generationEnd + 0.45).stagger(0.035).duration(0.40).appear();

    // Static camera interval. Editors place the host over this exact hold.
    const cameraReturn = generationEnd + 1.00;
    const cameraExit = cameraReturn + 8.20;
    // No state changes between cameraReturn and cameraExit.
    timeline.animate(loopSummary.all).at(cameraExit).duration(0.20).fadeTo(0.62);
    timeline.animate(loopSummary.all).at(cameraExit + 0.20).duration(0.22).fadeTo(1);

    // Inference: the same trained weights are reused for another token.
    timeline.animate(inferenceFrame).at(cameraExit + 0.55).duration(0.42).appear();
    timeline.animate(inferenceLabel.all).at(cameraExit + 0.68).stagger(0.05).duration(0.38).appear();
    pulseScale(timeline, fixedWeights.all, cameraExit + 1.30, 0.42, 1.04);
    timeline.animate(modelPanel).at(cameraExit + 1.65).duration(0.24).scaleTo(1.028);
    timeline.animate(modelPanel).at(cameraExit + 1.89).duration(0.24).scaleTo(1);
    timeline.animate(loopSummary.all).at(cameraExit + 2.05).duration(0.22).fadeTo(0.62);
    timeline.animate(loopSummary.all).at(cameraExit + 2.27).duration(0.26).fadeTo(1);

    const generationStage: Tattva[] = [
      title,
      ...takeaway.all,
      promptPanel,
      promptLabel,
      modelPanel,
      modelLabel,
      gauges,
      ...fixedWeights.all,
      answerCaption,
      ...generatedTokens.flatMap((token) => token.all),
      ...loopSummary.all,
      inferenceFrame,
      ...inferenceLabel.all,
    ];
    timeline.animate(generationStage).at(cameraExit + 4.25).stagger(0.001).duration(0.46).fadeTo(0);

    // One training run versus one generated response.
    timeline.animate([...trainingPanel.all, ...responsePanel.all]).at(cameraExit + 4.85)
      .stagger(0.05).duration(0.48).appear();
    trainingDots.forEach((dot, index) => {
      timeline.animate(dot).at(cameraExit + 5.35 + index * 0.055).duration(0.20).appear();
      pulseScale(timeline, [dot], cameraExit + 7.30 + (index % 7) * 0.05, 0.24, 1.35);
    });
    responseDots.forEach((dot, index) => {
      timeline.animate(dot).at(cameraExit + 5.65 + index * 0.28).duration(0.22).appear();
    });
    timeline.animate(trainingPanel.meter).at(cameraExit + 5.20).duration(4.30).ease("inOutCubic").to({ epoch: 100 });
    timeline.animate(responsePanel.meter).at(cameraExit + 5.20).duration(4.30).to({ epoch: 100 });

    const comparisonStage = [
      ...trainingPanel.all,
      ...responsePanel.all,
      ...trainingDots,
      ...responseDots,
    ];
    timeline.animate(comparisonStage).at(cameraExit + 10.10).stagger(0.001).duration(0.44).fadeTo(0);

    // Tokenization and vectors.
    timeline.animate(tokenHeading).at(cameraExit + 10.55).duration(0).appear();
    timeline.animate(tokenHeading).at(cameraExit + 10.55).duration(0.62).typewrite();
    tokenExamples.forEach((token, index) => {
      timeline.animate(token.all).at(cameraExit + 11.30 + index * 0.38).stagger(0.04).duration(0.34).appear();
    });
    timeline.animate(tokenIdStrip.all).at(cameraExit + 13.55).stagger(0.04).duration(0.42).appear();
    timeline.animate(vectorStrip.all).at(cameraExit + 15.45).stagger(0.04).duration(0.42).appear();
    timeline.animate([
      tokenHeading,
      ...tokenExamples.flatMap((token) => token.all),
      ...tokenIdStrip.all,
      ...vectorStrip.all,
    ]).at(cameraExit + 18.10).stagger(0.001).duration(0.45).fadeTo(0);

    // Matrix-operation shorthand.
    timeline.animate(matrixHeading).at(cameraExit + 18.55).duration(0).appear();
    timeline.animate(matrixHeading).at(cameraExit + 18.55).duration(0.65).typewrite();
    matrixCells.forEach((cell, index) => {
      timeline.animate(cell).at(cameraExit + 19.30 + index * 0.035).duration(0.22).appear();
      pulseScale(
        timeline,
        [cell],
        cameraExit + 21.00 + ((index % 8) + Math.floor(index / 8)) * 0.10,
        0.28,
        1.16,
      );
    });
    timeline.animate(matrixCaption).at(cameraExit + 22.10).duration(0).appear();
    timeline.animate(matrixCaption).at(cameraExit + 22.10).duration(0.72).typewrite();
    timeline.animate([matrixHeading, matrixCaption, ...matrixCells]).at(cameraExit + 24.35)
      .stagger(0.001).duration(0.44).fadeTo(0);

    // Training learned the patterns; inference reuses them with fixed weights.
    timeline.animate([networkTitle, network]).at(cameraExit + 24.85).stagger(0.14).duration(0.55).appear();
    timeline.animate(network).at(cameraExit + 25.55).duration(3.10).ease("inOutCubic").to({ flowProgress: 1 });
    patternPills.forEach((pill, index) => {
      timeline.animate(pill.all).at(cameraExit + 27.20 + index * 0.55).stagger(0.04).duration(0.38).appear();
    });
    timeline.animate(networkFixed.all).at(cameraExit + 29.35).stagger(0.05).duration(0.40).appear();
    timeline.animate(network).at(cameraExit + 30.00).duration(0).to({ flowProgress: 0 });
    timeline.animate(network).at(cameraExit + 30.05).duration(2.25).ease("inOutCubic").to({ flowProgress: 1 });
    pulseScale(timeline, networkFixed.all, cameraExit + 30.50, 0.50, 1.035);

    const networkStage = [
      networkTitle,
      network,
      ...patternPills.flatMap((pill) => pill.all),
      ...networkFixed.all,
    ];
    timeline.animate(networkStage).at(cameraExit + 33.10).stagger(0.002).duration(0.48).fadeTo(0);

    // Add Generative AI to the right-hand master diagram.
    timeline.animateCamera(this.camera).at(cameraExit + 33.45).duration(1.65).ease("inOutCubic")
      .frameTo([8, 4.5, 8], [8, 4.5, 0]);
    timeline.animateCamera(this.camera).at(cameraExit + 33.45).duration(1.65).ease("inOutCubic").zoomTo(0.50);
    timeline.animateCamera(this.camera).at(cameraExit + 35.10).duration(1.45).ease("inOutCubic")
      .frameTo([16, 0, 8], [16, 0, 0]);
    timeline.animateCamera(this.camera).at(cameraExit + 35.10).duration(1.45).ease("inOutCubic").zoomTo(1);
    timeline.animate(genAiRegion).at(cameraExit + 36.10).duration(0.70).ease("outCubic").appear();
    timeline.animate(overlapRegion).at(cameraExit + 36.40).duration(0.62).ease("outCubic").appear();
    timeline.animate(genAiDiagramLabel).at(cameraExit + 36.95).duration(0).appear();
    timeline.animate(genAiDiagramLabel).at(cameraExit + 36.95).duration(0.58).typewrite();
    timeline.animate(replyCard.all).at(cameraExit + 37.75).stagger(0.05).duration(0.42).appear();
    pulseScale(timeline, replyCard.all, cameraExit + 38.55, 0.48, 1.045);
    pulseScale(timeline, diagramError.all, cameraExit + 39.20, 0.50, 1.05);

    this.play(timeline);
    this.wait(3.0);
    this.captureScreenshotsNamed([
      [2.1, "part-06-newspaper-montage"],
      [7.5, "part-06-camera-static-opening"],
      [15.4, "part-06-email-draft"],
      [20.4, "part-06-generative-ai-takeaway"],
      [26.2, "part-06-next-token-candidates"],
      [generationEnd - 0.6, "part-06-generated-answer"],
      [cameraReturn + 2.0, "part-06-camera-static-loop"],
      [cameraExit + 2.5, "part-06-inference"],
      [cameraExit + 8.5, "part-06-training-vs-inference"],
      [cameraExit + 16.4, "part-06-tokens-and-vectors"],
      [cameraExit + 22.6, "part-06-matrix-operations"],
      [cameraExit + 30.8, "part-06-learned-patterns"],
      [cameraExit + 39.4, "part-06-master-diagram"],
    ]);
  }
}

function addDraftCard(scene: Scene, at: Vec2): VisualGroup {
  const panel = scene.add(
    Rectangle().size([5.20, 1.15]).cornerRadius(0.22).fill(SOLID.genai)
      .css({ borderStyle: "none", filter: "drop-shadow(0 10px 18px rgba(255,95,162,0.20))" }),
    { at: [at[0], at[1], 0.42] },
  );
  const label = addText(scene, "AI DRAFT", [at[0], at[1] + 0.23], 0.17, COLOR.ink, 950, 0.46);
  const reply = addText(scene, "See you Wednesday at 10:00.", [at[0], at[1] - 0.18], 0.22, COLOR.ink, 760, 0.46);
  return { all: [panel, label, reply], center: at };
}

function addCandidate(
  scene: Scene,
  at: Vec2,
  token: string,
  score: string,
  selected: boolean,
): VisualGroup {
  const color = selected ? COLOR.genai : COLOR.muted;
  const fill = selected ? SOLID.genai : SOLID.panelSoft;
  const panel = scene.add(
    Rectangle().size([2.70, 0.58]).cornerRadius(0.17).fill(fill)
      .stroke({ color, width: selected ? 0 : 0.025 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.40] },
  );
  const tokenLabel = addText(scene, token, [at[0] - 0.62, at[1]], 0.17, COLOR.ink, 850, 0.44);
  const scoreLabel = addText(scene, score, [at[0] + 0.72, at[1]], 0.16, selected ? COLOR.ink : color, 850, 0.44);
  return { all: [panel, tokenLabel, scoreLabel], center: at };
}

function createGeneratedTokens(scene: Scene): TokenVisual[] {
  const rows: readonly (readonly string[])[] = [
    ["The", "mango", "is", "called", "the", "king", "of", "fruits"],
    ["for", "its", "flavour", ",", "nutrition", ",", "history", "and", "popularity", "."],
  ];
  const visuals: TokenVisual[] = [];
  rows.forEach((row, rowIndex) => {
    const widths = row.map((token) => Math.max(0.42, token.length * 0.105 + 0.24));
    const total = widths.reduce((sum, width) => sum + width, 0) + (row.length - 1) * 0.10;
    let cursor = -total / 2;
    row.forEach((token, index) => {
      const width = widths[index]!;
      const target: Vec2 = [cursor + width / 2, 5.74 - rowIndex * 0.58];
      cursor += width + 0.10;
      const origin: Vec2 = [2.82, 8.76];
      const panel = scene.add(
        Rectangle().size([width, 0.40]).cornerRadius(0.15).fill(SOLID.genai)
          .css({ borderStyle: "none" }),
        { at: [origin[0], origin[1], 0.46] },
      );
      const label = addText(scene, token, origin, 0.14, COLOR.ink, 820, 0.50);
      visuals.push({ all: [panel, label], panel, label, center: origin, target });
    });
  });
  return visuals;
}

function addLoopSummary(scene: Scene, at: Vec2): VisualGroup {
  const labels = ["PROMPT", "MODEL", "NEXT TOKEN", "APPEND", "REPEAT"];
  const widths = [1.50, 1.50, 2.05, 1.55, 1.50];
  const items: Tattva[] = [];
  const total = widths.reduce((sum, width) => sum + width, 0) + (labels.length - 1) * 0.82;
  let cursor = at[0] - total / 2;
  labels.forEach((label, index) => {
    const width = widths[index]!;
    const centerX = cursor + width / 2;
    items.push(
      scene.add(
        Rectangle().size([width, 0.58]).cornerRadius(0.20)
          .fill(index === 2 ? SOLID.genai : SOLID.panelSoft)
          .stroke({ color: index === 2 ? COLOR.genai : COLOR.grid, width: 0.025 })
          .css({ borderStyle: "none" }),
        { at: [centerX, at[1], 0.50] },
      ),
      addText(scene, label, [centerX, at[1]], 0.15, COLOR.ink, 880, 0.54),
    );
    cursor += width;
    if (index < labels.length - 1) {
      items.push(addText(scene, "→", [cursor + 0.41, at[1]], 0.23, COLOR.ai, 900, 0.54));
      cursor += 0.82;
    }
  });
  return { all: items, center: at };
}

function addComparisonPanel(
  scene: Scene,
  at: Vec2,
  title: string,
  lineOne: string,
  lineTwo: string,
  color: string,
): VisualGroup & { meter: ReturnType<typeof LearningMeterGaugeField> } {
  const panel = scene.add(
    Rectangle().size([6.50, 5.55]).cornerRadius(0.30).fill(SOLID.panel)
      .stroke({ color, width: 0.045 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.34] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 2.18], 0.25, color, 950, 0.42);
  const first = addText(scene, lineOne, [at[0], at[1] + 1.58], 0.17, COLOR.ink, 820, 0.42);
  const second = addText(scene, lineTwo, [at[0], at[1] - 1.82], 0.17, COLOR.ink, 820, 0.42);
  const meter = scene.add(
    LearningMeterGaugeField(12, {
      epochs: 100,
      seed: color === COLOR.dl ? 11 : 29,
      size: [4.60, 1.95],
      columns: 6,
      noise: color === COLOR.dl ? 0.28 : 0,
      title: color === COLOR.dl ? "WEIGHTS ADJUST" : "WEIGHTS LOCKED",
      showEpoch: false,
      arcColor: color,
      needleColor: COLOR.gold,
      background: "rgba(9,13,27,0.86)",
    }).epoch(color === COLOR.dl ? 0 : 100),
    { at: [at[0], at[1] - 0.35, 0.42] },
  );
  return { all: [panel, heading, first, second, meter], center: at, meter };
}

function addTokenExample(scene: Scene, at: Vec2, token: string, description: string): VisualGroup {
  const panel = scene.add(
    Rectangle().size([2.72, 1.58]).cornerRadius(0.24).fill(SOLID.panelSoft)
      .stroke({ color: COLOR.genai, width: 0.035 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.38] },
  );
  const tokenLabel = addText(scene, token, [at[0], at[1] + 0.24], 0.28, COLOR.genai, 950, 0.44);
  const detail = addText(scene, description.toUpperCase(), [at[0], at[1] - 0.38], 0.13, COLOR.muted, 760, 0.44);
  return { all: [panel, tokenLabel, detail], center: at };
}

function addStrip(
  scene: Scene,
  at: Vec2,
  title: string,
  values: readonly string[],
  color: string,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([12.0, 1.20]).cornerRadius(0.24).fill(SOLID.panel)
      .stroke({ color, width: 0.035 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.36] },
  );
  const titleLabel = addText(scene, title, [at[0] - 4.85, at[1]], 0.17, color, 920, 0.42);
  const items: Tattva[] = [panel, titleLabel];
  values.forEach((value, index) => {
    const x = at[0] - 2.85 + index * 1.90;
    items.push(
      scene.add(
        Rectangle().size([1.55, 0.58]).cornerRadius(0.16).fill("#243654")
          .css({ borderStyle: "none" }),
        { at: [x, at[1], 0.42] },
      ),
      addText(scene, value, [x, at[1]], 0.15, COLOR.ink, 820, 0.46),
    );
  });
  return { all: items, center: at };
}

function addMatrixGrid(scene: Scene, at: Vec2, columns: number, rows: number): Tattva[] {
  const cells: Tattva[] = [];
  const cellWidth = 0.72;
  const cellHeight = 0.58;
  const gap = 0.10;
  const startX = at[0] - ((columns - 1) * (cellWidth + gap)) / 2;
  const startY = at[1] + ((rows - 1) * (cellHeight + gap)) / 2;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const value = (((row + 3) * (column + 5) * 17) % 97) / 97;
      const color = value > 0.66 ? COLOR.genai : value > 0.33 ? COLOR.dl : COLOR.ai;
      cells.push(scene.add(
        Rectangle().size([cellWidth, cellHeight]).cornerRadius(0.10).fill(color)
          .opacity(0.30 + value * 0.60).css({ borderStyle: "none" }),
        {
          at: [
            startX + column * (cellWidth + gap),
            startY - row * (cellHeight + gap),
            0.44,
          ],
        },
      ));
    }
  }
  return cells;
}

function addDiagramCard(scene: Scene, at: Vec2, fill: string, title: string, detail: string): VisualGroup {
  const panel = scene.add(
    Rectangle().size([2.18, 0.78]).cornerRadius(0.18).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 7px 12px rgba(0,0,0,0.25))" }),
    { at: [at[0], at[1], 0.55] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 0.11], 0.17, COLOR.ink, 950, 0.58);
  const subtitle = addText(scene, detail, [at[0], at[1] - 0.17], 0.11, "rgba(248,250,252,0.76)", 680, 0.58);
  return { all: [panel, heading, subtitle], center: at };
}

function addSolidPill(scene: Scene, text: string, at: Vec2, fill: string, width: number): VisualGroup {
  const panel = scene.add(
    Rectangle().size([width, 0.56]).cornerRadius(0.25).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.42] },
  );
  const label = addText(scene, text, at, 0.16, COLOR.ink, 900, 0.46);
  return { all: [panel, label], center: at };
}

function addText(
  scene: Scene,
  text: string,
  at: Vec2,
  height: number,
  color: string,
  weight: number,
  z = 0.34,
): Tattva {
  return scene.add(
    Label(text).height(height).color(color).css({ fontWeight: weight, letterSpacing: "0.035em" }),
    { at: [at[0], at[1], z] },
  );
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

function pulseScale(
  timeline: Timeline,
  items: readonly Tattva[],
  at: number,
  duration: number,
  scale: number,
): void {
  const half = duration / 2;
  timeline.animate(items).at(at).duration(half).ease("outCubic").scaleTo(scale);
  timeline.animate(items).at(at + half).duration(half).ease("inOutCubic").scaleTo(1);
}

function hide(items: readonly Tattva[]): void {
  items.forEach((item) => item.opacity(0));
}

function addKavriqBrand(scene: Scene): void {
  const kavriq = KavriqSplashLogo({ color: "#08A9C4" }).scale(0.28);
  scene.addBranding(kavriq, { at: [7.42, 3.78, 20] });
  const motion = KavriqSplashMotion(kavriq);
  const inheritedPhase = 3.21;
  scene.updater((time, states) => {
    motion.update((inheritedPhase + time) % motion.duration, states);
  });
}

await renderScene(
  import.meta.url,
  GenerativeAiAndInferenceScene,
  "06-generative-ai-and-inference.mp4",
);
