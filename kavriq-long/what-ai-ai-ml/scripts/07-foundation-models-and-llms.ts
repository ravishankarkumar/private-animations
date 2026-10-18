import { LearningMeterGaugeField } from "veena/ai";
import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Arrow, Circle, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";
import { COLOR, FRAME } from "./lib/theme.ts";

const SOLID = {
  ai: "#17647D",
  ml: "#1E7A55",
  dl: "#53368A",
  genai: "#C4485C",
  overlap: "#35194F",
  foundation: "#9A5A20",
  panel: "#11192C",
  panelSoft: "#172238",
  neutral: "#243654",
  warning: "#3B2026",
} as const;

interface VisualGroup {
  all: Tattva[];
  center: Vec2;
}

interface TaskVisual extends VisualGroup {
  connector: Tattva;
}

class FoundationModelsAndLlmsScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    this.camera.position([16, 0, 8]).lookAt([16, 0, 0]).zoom(1);

    // ------------------------------------------------------------------
    // Segment 6 continuity: the completed taxonomy on the right screen.
    // ------------------------------------------------------------------
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
    );
    const overlapRegion = this.add(
      Rectangle().size([2.25, 1.10]).cornerRadius(0.25).fill(SOLID.overlap).css({ borderStyle: "none" }),
      { at: [19.55, -0.75, 0.38] },
    );
    const aiDiagramLabel = addText(this, "ARTIFICIAL INTELLIGENCE", [16, 3.27], 0.31, COLOR.ink, 950, 0.48);
    const mlDiagramLabel = addText(this, "MACHINE LEARNING", [15.65, 1.48], 0.25, COLOR.ink, 950, 0.48);
    const dlDiagramLabel = addText(this, "DEEP LEARNING", [18.70, 0.98], 0.22, COLOR.ink, 950, 0.48);
    const genAiDiagramLabel = addText(this, "GENERATIVE AI", [21.20, -0.85], 0.18, COLOR.ink, 950, 0.50);

    const flaggedCard = addDiagramCard(this, [12.15, -0.40], SOLID.ai, "FLAGGED", "Rules");
    const spamCard = addDiagramCard(this, [15.75, -0.65], SOLID.ml, "SPAM 96%", "Learned score");
    const dogCard = addDiagramCard(this, [18.35, 0.02], SOLID.dl, "DOG 98%", "Deep network");
    const replyCard = addDiagramCard(this, [20.88, -1.58], SOLID.genai, "DRAFT REPLY", "Generated output");
    const diagramError = addSolidPill(this, "TUE → WED", [21.85, 2.95], SOLID.warning, 2.10, COLOR.warning);

    const foundationDiagramCard = addDiagramCard(
      this,
      [19.55, 0.05],
      SOLID.foundation,
      "FOUNDATION MODEL",
      "LLM · shared base",
      1.86,
      0.76,
      0.135,
    );
    hide(foundationDiagramCard.all);
    const generatesArrow = this.add(
      Arrow().from([20.18, -0.37]).to([20.63, -1.02]).stroke({ color: COLOR.foundation, width: 0.04 }),
    ).opacity(0);
    const generatesLabel = addText(this, "GENERATES", [20.77, -0.58], 0.10, COLOR.foundation, 900, 0.63).opacity(0);

    const diagramAll: Tattva[] = [
      aiRegion,
      mlRegion,
      dlRegion,
      genAiRegion,
      overlapRegion,
      aiDiagramLabel,
      mlDiagramLabel,
      dlDiagramLabel,
      genAiDiagramLabel,
      ...flaggedCard.all,
      ...spamCard.all,
      ...dogCard.all,
      ...replyCard.all,
      ...diagramError.all,
    ];

    // ------------------------------------------------------------------
    // Main email screen and the "separate models?" question.
    // ------------------------------------------------------------------
    const email = addOpenEmailView(this, { at: [0, 0.02], scale: 0.68 });
    const jobSlots = [
      addOutlineSlot(this, [-6.20, 2.40], "SUMMARIZE"),
      addOutlineSlot(this, [6.20, 2.40], "URGENCY"),
      addOutlineSlot(this, [-6.20, 0.85], "DATE"),
      addOutlineSlot(this, [6.20, 0.85], "TRANSLATE"),
      addOutlineSlot(this, [6.20, -0.70], "DRAFT"),
    ];
    jobSlots.forEach((slot) => hide(slot.all));
    const separateQuestion = addSolidPill(this, "FIVE JOBS · FIVE MODELS?", [0, 3.95], SOLID.neutral, 5.10, COLOR.ink);
    hide(separateQuestion.all);
    const notNecessarily = addSolidPill(this, "NOT NECESSARILY", [0, 3.95], SOLID.foundation, 3.85, COLOR.ink);
    hide(notNecessarily.all);

    // ------------------------------------------------------------------
    // Upper screen: broad training and the reusable foundation model.
    // ------------------------------------------------------------------
    const foundationTitle = addText(this, "FOUNDATION MODEL", [0, 12.62], 0.42, COLOR.foundation, 950, 0.52);
    foundationTitle.opacity(0);
    const modelPanel = this.add(
      Rectangle().size([4.50, 3.20]).cornerRadius(0.32).fill(SOLID.foundation)
        .css({ borderStyle: "none", filter: "drop-shadow(0 15px 28px rgba(255,159,67,0.22))" }),
      { at: [0, 8.75, 0.38] },
    ).opacity(0);
    const modelLabel = addText(this, "BROADLY TRAINED MODEL", [0, 10.03], 0.20, COLOR.ink, 950, 0.50).opacity(0);
    const modelGauges = this.add(
      LearningMeterGaugeField(40, {
        epochs: 100,
        seed: 73,
        size: [3.82, 2.08],
        columns: 8,
        noise: 0.20,
        title: "SHARED MODEL WEIGHTS",
        showEpoch: false,
        arcColor: "rgba(255,159,67,0.62)",
        needleColor: COLOR.gold,
        background: "rgba(24,14,8,0.48)",
      }).epoch(0),
      { at: [0, 8.62, 0.46] },
    ).opacity(0);

    const sourceLabels = ["TEXT", "IMAGES", "DOCUMENTS", "CODE", "AUDIO"];
    const sourceXs = [-5.60, -2.80, 0, 2.80, 5.60];
    const sourceCards = sourceLabels.map((label, index) => (
      addSolidPill(this, label, [sourceXs[index]!, 11.48], SOLID.panelSoft, 2.20, COLOR.ink)
    ));
    sourceCards.forEach((card) => hide(card.all));
    const sourceArrows = sourceXs.map((x) => this.add(
      Arrow().from([x, 11.10]).to([x * 0.24, 10.42]).stroke({ color: COLOR.foundation, width: 0.035 }),
    ).opacity(0));

    const sharedTakeaway = addSolidPill(
      this,
      "ONE BROADLY TRAINED MODEL CAN SUPPORT MANY JOBS",
      [0, 12.10],
      SOLID.foundation,
      11.30,
      COLOR.ink,
      0.18,
    );
    hide(sharedTakeaway.all);
    const sharedBase = addSolidPill(this, "FOUNDATION MODEL · SHARED BASE", [0, 6.63], SOLID.foundation, 5.60, COLOR.ink);
    hide(sharedBase.all);

    // ------------------------------------------------------------------
    // One model, five concrete email jobs.
    // ------------------------------------------------------------------
    const miniEmail = addMiniEmail(this, [-5.55, 8.90]);
    hide(miniEmail.all);
    const inputArrow = this.add(
      Arrow().from([-4.18, 8.90]).to([-2.45, 8.90]).stroke({ color: COLOR.ai, width: 0.045 }),
    ).opacity(0);
    const tasks = [
      addTask(this, [4.82, 11.15], "SUMMARIZE", "Three-line overview", SOLID.foundation),
      addTask(this, [4.82, 10.03], "CLASSIFY URGENCY", "HIGH PRIORITY", SOLID.foundation),
      addTask(this, [4.82, 8.91], "EXTRACT DATE", "TUESDAY", SOLID.foundation),
      addTask(this, [4.82, 7.79], "TRANSLATE", "Mensaje traducido", SOLID.foundation),
      addTask(this, [4.82, 6.67], "DRAFT A REPLY", "See you Wednesday…", SOLID.genai),
    ];
    tasks.forEach((task) => hide(task.all));

    const instructionCards = [
      addSolidPill(this, "SUMMARIZE", [0, 11.42], SOLID.neutral, 2.55, COLOR.ink),
      addSolidPill(this, "EXTRACT DATE", [0, 11.42], SOLID.neutral, 2.85, COLOR.ink),
      addSolidPill(this, "DRAFT REPLY", [0, 11.42], SOLID.neutral, 2.75, COLOR.ink),
    ];
    instructionCards.forEach((card) => hide(card.all));
    const adaptationChip = addSolidPill(
      this,
      "PROMPT · TOOLS · TASK ADAPTATION",
      [0, 6.30],
      SOLID.panelSoft,
      6.20,
      COLOR.foundation,
      0.15,
    );
    hide(adaptationChip.all);

    // Use separate model instances for later explanatory stages. Keeping each
    // stage independent avoids opacity tracks from a later re-entry changing
    // the model's visibility in an earlier scene.
    const applicationModel = addCard(
      this,
      [0, 8.90],
      [4.20, 2.25],
      SOLID.foundation,
      "MODEL",
      "Foundation model · shared base",
    );
    hide(applicationModel.all);
    const llmModel = addCard(
      this,
      [0, 8.75],
      [4.50, 3.10],
      SOLID.foundation,
      "LANGUAGE MODEL",
      "Shared learned weights",
    );
    hide(llmModel.all);
    const multimodalModel = addGaugeModel(this, [0, 8.75], "BROADLY TRAINED MODEL");
    hide(multimodalModel.all);

    // ------------------------------------------------------------------
    // The model sits inside a larger application system.
    // ------------------------------------------------------------------
    const appFrame = this.add(
      Rectangle().size([14.30, 7.50]).cornerRadius(0.38).fill("rgba(0,0,0,0)")
        .stroke({ color: COLOR.ai, width: 0.055 }).css({ borderStyle: "none" }),
      { at: [0, 9.00, 0.25] },
    ).opacity(0);
    const appTitle = addSolidPill(this, "EMAIL APPLICATION", [0, 12.35], SOLID.ai, 3.75, COLOR.ink);
    hide(appTitle.all);
    const appComponents = [
      addSolidPill(this, "RULES", [-5.40, 10.55], SOLID.neutral, 2.05, COLOR.ink),
      addSolidPill(this, "SEARCH", [5.40, 10.55], SOLID.neutral, 2.05, COLOR.ink),
      addSolidPill(this, "TOOLS", [-5.40, 8.85], SOLID.neutral, 2.05, COLOR.ink),
      addSolidPill(this, "SAFETY CHECKS", [5.40, 8.85], SOLID.neutral, 2.80, COLOR.ink),
      addSolidPill(this, "OTHER SOFTWARE", [0, 6.15], SOLID.neutral, 3.10, COLOR.ink),
    ];
    appComponents.forEach((component) => hide(component.all));
    const appConnectors = [
      addConnector(this, [-4.30, 10.32], [-2.05, 9.55], COLOR.ai),
      addConnector(this, [4.30, 10.32], [2.05, 9.55], COLOR.ai),
      addConnector(this, [-4.30, 8.85], [-2.35, 8.85], COLOR.ai),
      addConnector(this, [4.00, 8.85], [2.35, 8.85], COLOR.ai),
      addConnector(this, [0, 6.55], [0, 7.10], COLOR.ai),
    ];
    appConnectors.forEach((connector) => connector.opacity(0));
    // ------------------------------------------------------------------
    // LLM definition and short token-generation callback.
    // ------------------------------------------------------------------
    const llmBadge = addSolidPill(this, "LARGE LANGUAGE MODEL · LLM", [0, 10.40], "#6F3F18", 5.30, COLOR.ink);
    hide(llmBadge.all);
    const llmTakeaway = addSolidPill(this, "LANGUAGE · TOKEN BY TOKEN", [0, 12.20], SOLID.foundation, 5.70, COLOR.ink);
    hide(llmTakeaway.all);
    const languagePrompt = addSolidPill(this, "SUMMARIZE THIS EMAIL", [-5.10, 8.78], SOLID.panelSoft, 3.75, COLOR.ink);
    hide(languagePrompt.all);
    const llmInputArrow = addConnector(this, [-3.15, 8.78], [-2.40, 8.78], COLOR.foundation);
    llmInputArrow.opacity(0);
    const tokenLabels = ["Meeting", "moved", "to", "Tuesday"];
    const tokenXs = [3.22, 4.22, 5.08, 6.12];
    const tokenCards = tokenLabels.map((token, index) => (
      addSolidPill(this, token, [tokenXs[index]!, 8.78], SOLID.genai, Math.max(0.82, token.length * 0.13 + 0.40), COLOR.ink, 0.14)
    ));
    tokenCards.forEach((token) => hide(token.all));
    const llmOutputArrow = addConnector(this, [2.35, 8.78], [2.75, 8.78], COLOR.genai);
    llmOutputArrow.opacity(0);

    // ------------------------------------------------------------------
    // Four terms answer four different questions.
    // ------------------------------------------------------------------
    const comparisonTitle = addText(this, "RELATED TERMS · DIFFERENT MEANINGS", [0, 12.30], 0.36, COLOR.ink, 950, 0.48);
    comparisonTitle.opacity(0);
    const comparisonCards = [
      addComparisonCard(this, [-3.65, 10.15], "GENERATIVE AI", "CAPABILITY", "CREATES NEW OUTPUT", SOLID.genai),
      addComparisonCard(this, [3.65, 10.15], "FOUNDATION MODEL", "SHARED BASE", "REUSED ACROSS TASKS", SOLID.foundation),
      addComparisonCard(this, [-3.65, 7.55], "LLM", "MODEL", "WORKS WITH LANGUAGE", "#6F3F18"),
      addComparisonCard(this, [3.65, 7.55], "APPLICATION", "PRODUCT", "BUILT AROUND MODELS", SOLID.neutral),
    ];
    comparisonCards.forEach((card) => hide(card.all));

    // ------------------------------------------------------------------
    // Generic chat application: application outside, model inside.
    // ------------------------------------------------------------------
    const chatFrame = this.add(
      Rectangle().size([12.80, 6.75]).cornerRadius(0.38).fill(SOLID.panel)
        .stroke({ color: COLOR.ai, width: 0.05 }).css({ borderStyle: "none" }),
      { at: [0, 8.90, 0.27] },
    ).opacity(0);
    const chatTitle = addText(this, "CHAT APPLICATION", [0, 11.70], 0.31, COLOR.ai, 950, 0.47).opacity(0);
    const chatModel = addCard(this, [0, 8.90], [4.15, 2.25], SOLID.foundation, "MODEL", "Foundation model / LLM");
    hide(chatModel.all);
    const chatParts = [
      addSolidPill(this, "TOOLS", [-4.40, 9.75], SOLID.neutral, 2.05, COLOR.ink),
      addSolidPill(this, "RULES", [4.40, 9.75], SOLID.neutral, 2.05, COLOR.ink),
      addSolidPill(this, "SEARCH", [-4.40, 8.05], SOLID.neutral, 2.05, COLOR.ink),
      addSolidPill(this, "SAFETY", [4.40, 8.05], SOLID.neutral, 2.05, COLOR.ink),
    ];
    chatParts.forEach((part) => hide(part.all));
    const appNotModel = addSolidPill(this, "APPLICATION ≠ MODEL", [0, 5.85], SOLID.ai, 4.10, COLOR.ink);
    hide(appNotModel.all);

    // ------------------------------------------------------------------
    // Multimodal callback using this email and its dog attachment.
    // ------------------------------------------------------------------
    const multimodalTitle = addSolidPill(this, "MULTIMODAL · TEXT + IMAGE", [0, 12.18], SOLID.foundation, 5.85, COLOR.ink);
    hide(multimodalTitle.all);
    const textInput = addCard(this, [-5.15, 9.55], [3.10, 1.45], SOLID.panelSoft, "TEXT", "Meeting moved to Tuesday");
    const imageInput = addDogInput(this, [-5.15, 7.70]);
    hide([...textInput.all, ...imageInput.all]);
    const multimodalArrows = [
      addConnector(this, [-3.55, 9.55], [-2.35, 9.12], COLOR.foundation),
      addConnector(this, [-3.55, 7.70], [-2.35, 8.42], COLOR.foundation),
    ];
    multimodalArrows.forEach((arrow) => arrow.opacity(0));
    const descriptionOutput = addCard(this, [5.05, 9.45], [3.65, 1.45], SOLID.foundation, "IMAGE DESCRIPTION", "A dog appears in the attachment");
    const multimodalReply = addCard(this, [5.05, 7.55], [3.65, 1.45], SOLID.genai, "DRAFT TOKEN", "See you Wednesday…");
    hide([...descriptionOutput.all, ...multimodalReply.all]);
    const optionalInputs = addSolidPill(this, "AUDIO · VIDEO", [0, 6.15], SOLID.panelSoft, 3.20, COLOR.muted);
    hide(optionalInputs.all);

    // ------------------------------------------------------------------
    // Final main-screen hub: capability does not guarantee truth.
    // ------------------------------------------------------------------
    const endEmail = addMiniEmail(this, [-5.40, -0.05]);
    const endModel = addCard(this, [-1.35, -0.05], [2.85, 2.10], SOLID.foundation, "ONE MODEL", "Foundation model / LLM");
    const endTasks = [
      addTask(this, [3.45, 2.35], "SUMMARIZE", "Thread overview", SOLID.foundation, [0.10, -0.05]),
      addTask(this, [3.45, 1.20], "URGENCY", "HIGH PRIORITY", SOLID.foundation, [0.10, -0.05]),
      addTask(this, [3.45, 0.05], "EXTRACT DATE", "TUESDAY", SOLID.foundation, [0.10, -0.05]),
      addTask(this, [3.45, -1.10], "TRANSLATE", "Mensaje traducido", SOLID.foundation, [0.10, -0.05]),
      addTask(this, [3.45, -2.25], "DRAFT REPLY", "WEDNESDAY", SOLID.genai, [0.10, -0.05]),
    ];
    const endInput = addConnector(this, [-3.92, -0.05], [-2.83, -0.05], COLOR.ai);
    const endError = addSolidPill(this, "TUE → WED", [5.72, -2.25], SOLID.warning, 2.05, COLOR.warning);
    const truthBridge = addSolidPill(this, "MANY SKILLS ≠ GUARANTEED TRUTH", [0, 3.88], SOLID.warning, 6.65, COLOR.ink, 0.18);
    const endHubAll: Tattva[] = [
      ...endEmail.all,
      ...endModel.all,
      ...endTasks.flatMap((task) => task.all),
      endInput,
      ...endError.all,
      ...truthBridge.all,
    ];
    hide(endHubAll);

    addKavriqBrand(this);

    // ------------------------------------------------------------------
    // Timeline — one continuous Segment 7 render.
    // ------------------------------------------------------------------
    const timeline = new Timeline();

    // Callback to the four mechanisms already placed on the map.
    pulseScale(timeline, flaggedCard.all, 0.65, 0.48, 1.045);
    pulseScale(timeline, spamCard.all, 1.55, 0.48, 1.045);
    pulseScale(timeline, dogCard.all, 2.45, 0.48, 1.045);
    pulseScale(timeline, replyCard.all, 3.35, 0.48, 1.045);

    // Return to the email and ask whether five jobs need five models.
    timeline.animateCamera(this.camera).at(4.15).duration(1.45).ease("inOutCubic")
      .frameTo([8, 0, 8], [8, 0, 0]);
    timeline.animateCamera(this.camera).at(4.15).duration(1.45).ease("inOutCubic").zoomTo(0.50);
    timeline.animateCamera(this.camera).at(5.60).duration(1.45).ease("inOutCubic")
      .frameTo([0, 0, 8], [0, 0, 0]);
    timeline.animateCamera(this.camera).at(5.60).duration(1.45).ease("inOutCubic").zoomTo(1);
    timeline.animate(separateQuestion.all).at(7.20).stagger(0.05).duration(0.38).appear();
    jobSlots.forEach((slot, index) => {
      timeline.animate(slot.all).at(7.75 + index * 0.26).stagger(0.03).duration(0.34).appear();
    });
    pulseScale(timeline, jobSlots.flatMap((slot) => slot.all), 9.55, 0.54, 1.035);
    timeline.animate([...separateQuestion.all, ...jobSlots.flatMap((slot) => slot.all)]).at(10.35)
      .stagger(0.002).duration(0.38).fadeTo(0);
    timeline.animate(notNecessarily.all).at(10.48).stagger(0.05).duration(0.38).appear();
    pulseScale(timeline, notNecessarily.all, 11.10, 0.44, 1.045);

    // Move to the upper explainer screen.
    timeline.animate([notNecessarily.all, email.all].flat()).at(12.15).stagger(0.001).duration(0.38).fadeTo(0);
    timeline.animateCamera(this.camera).at(12.10).duration(1.55).ease("inOutCubic")
      .frameTo([0, 4.5, 8], [0, 4.5, 0]);
    timeline.animateCamera(this.camera).at(12.10).duration(1.55).ease("inOutCubic").zoomTo(0.50);
    timeline.animateCamera(this.camera).at(13.65).duration(1.35).ease("inOutCubic")
      .frameTo([0, 9, 8], [0, 9, 0]);
    timeline.animateCamera(this.camera).at(13.65).duration(1.35).ease("inOutCubic").zoomTo(1);

    timeline.animate(foundationTitle).at(14.65).duration(0).appear();
    timeline.animate(foundationTitle).at(14.65).duration(0.62).typewrite();
    timeline.animate([modelPanel, modelLabel, modelGauges]).at(15.35).stagger(0.10).duration(0.48).appear();

    sourceCards.forEach((source, index) => {
      timeline.animate(source.all).at(16.25 + index * 0.24).stagger(0.03).duration(0.32).appear();
      timeline.animate(sourceArrows[index]!).at(16.70 + index * 0.24).duration(0.34).appear();
    });
    timeline.animate(modelGauges).at(17.10).duration(4.20).ease("inOutCubic").to({ epoch: 100 });
    sourceCards.forEach((source, index) => {
      pulseScale(timeline, source.all, 18.15 + index * 0.34, 0.36, 1.035);
    });

    const sourcesAll = [...sourceCards.flatMap((source) => source.all), ...sourceArrows];
    timeline.animate(sourcesAll).at(21.55).stagger(0.002).duration(0.40).fadeTo(0);
    timeline.animate(foundationTitle).at(21.55).duration(0.35).fadeTo(0);
    timeline.animate(sharedTakeaway.all).at(22.00).stagger(0.05).duration(0.46).appear();
    pulseScale(timeline, sharedTakeaway.all, 23.00, 0.50, 1.035);
    timeline.animate(sharedTakeaway.all).at(24.55).duration(0.38).fadeTo(0);
    timeline.animate(foundationTitle).at(24.62).duration(0.36).appear();
    timeline.animate(sharedBase.all).at(24.80).stagger(0.04).duration(0.36).appear();

    // One email enters one shared base and five useful results emerge.
    timeline.animate(miniEmail.all).at(25.60).stagger(0.04).duration(0.40).appear();
    timeline.animate(inputArrow).at(26.05).duration(0.36).appear();
    tasks.forEach((task, index) => {
      timeline.animate(task.connector).at(26.45 + index * 0.72).duration(0.30).appear();
      timeline.animate(task.all.filter((item) => item !== task.connector)).at(26.65 + index * 0.72)
        .stagger(0.04).duration(0.38).appear();
      pulseScale(timeline, task.all.filter((item) => item !== task.connector), 27.15 + index * 0.72, 0.34, 1.025);
    });
    pulseScale(timeline, [modelPanel, modelLabel, modelGauges], 30.75, 0.56, 1.025);

    // Instructions change; the shared model stays fixed.
    timeline.animate(tasks.flatMap((task) => task.all)).at(32.25).stagger(0.002).duration(0.38).fadeTo(0.28);
    timeline.animate(instructionCards[0]!.all).at(32.70).stagger(0.04).duration(0.30).appear();
    timeline.animate(instructionCards[0]!.all).at(34.10).duration(0.28).fadeTo(0);
    timeline.animate(instructionCards[1]!.all).at(34.12).stagger(0.04).duration(0.30).appear();
    timeline.animate(instructionCards[1]!.all).at(35.55).duration(0.28).fadeTo(0);
    timeline.animate(instructionCards[2]!.all).at(35.57).stagger(0.04).duration(0.30).appear();
    timeline.animate(adaptationChip.all).at(36.10).stagger(0.04).duration(0.34).appear();
    pulseScale(timeline, adaptationChip.all, 37.10, 0.44, 1.025);

    const hubStage = [
      foundationTitle,
      modelPanel,
      modelLabel,
      modelGauges,
      ...sharedBase.all,
      ...miniEmail.all,
      inputArrow,
      ...tasks.flatMap((task) => task.all),
      ...instructionCards.flatMap((card) => card.all),
      ...adaptationChip.all,
    ];
    timeline.animate(hubStage).at(39.15).stagger(0.001).duration(0.42).fadeTo(0);

    // A model is one component inside an application.
    timeline.animate([appFrame, ...appTitle.all, ...applicationModel.all])
      .at(39.70).stagger(0.05).duration(0.44).appear();
    appComponents.forEach((component, index) => {
      timeline.animate(component.all).at(40.55 + index * 0.32).stagger(0.03).duration(0.32).appear();
      timeline.animate(appConnectors[index]!).at(40.78 + index * 0.32).duration(0.30).appear();
    });
    pulseScale(timeline, applicationModel.all, 43.20, 0.54, 1.035);
    pulseScale(timeline, appComponents.flatMap((component) => component.all), 44.10, 0.54, 1.025);

    const applicationStage = [
      appFrame,
      ...appTitle.all,
      ...appComponents.flatMap((component) => component.all),
      ...appConnectors,
      ...applicationModel.all,
    ];
    timeline.animate(applicationStage).at(47.35).stagger(0.001).duration(0.42).fadeTo(0);

    // LLM: the language-focused model and a short token callback.
    timeline.animate(llmModel.all).at(47.85).stagger(0.08).duration(0.42).appear();
    timeline.animate(llmBadge.all).at(48.25).stagger(0.04).duration(0.36).appear();
    timeline.animate(llmTakeaway.all).at(49.05).stagger(0.04).duration(0.40).appear();
    pulseScale(timeline, llmTakeaway.all, 49.90, 0.44, 1.035);
    timeline.animate(languagePrompt.all).at(51.10).stagger(0.04).duration(0.34).appear();
    timeline.animate(llmInputArrow).at(51.45).duration(0.30).appear();
    timeline.animate(llmOutputArrow).at(51.80).duration(0.30).appear();
    tokenCards.forEach((token, index) => {
      timeline.animate(token.all).at(52.10 + index * 0.62).stagger(0.025).duration(0.25).appear();
      pulseScale(timeline, token.all, 52.35 + index * 0.62, 0.30, 1.045);
    });

    const llmStage = [
      ...llmModel.all,
      ...llmBadge.all,
      ...llmTakeaway.all,
      ...languagePrompt.all,
      llmInputArrow,
      llmOutputArrow,
      ...tokenCards.flatMap((token) => token.all),
    ];
    timeline.animate(llmStage).at(56.30).stagger(0.001).duration(0.42).fadeTo(0);

    // Four labels that answer four different questions.
    timeline.animate(comparisonTitle).at(56.75).duration(0).appear();
    timeline.animate(comparisonTitle).at(56.75).duration(0.62).typewrite();
    comparisonCards.forEach((card, index) => {
      timeline.animate(card.all).at(57.70 + index * 1.45).stagger(0.05).duration(0.42).appear();
      pulseScale(timeline, card.all, 58.25 + index * 1.45, 0.38, 1.025);
    });
    timeline.animate([comparisonTitle, ...comparisonCards.flatMap((card) => card.all)]).at(65.20)
      .stagger(0.001).duration(0.45).fadeTo(0);

    // The product surrounds the model; it is not synonymous with it.
    timeline.animate([chatFrame, chatTitle, ...chatModel.all]).at(65.70).stagger(0.08).duration(0.46).appear();
    chatParts.forEach((part, index) => {
      timeline.animate(part.all).at(66.65 + index * 0.32).stagger(0.03).duration(0.32).appear();
    });
    timeline.animate(appNotModel.all).at(68.35).stagger(0.05).duration(0.40).appear();
    pulseScale(timeline, appNotModel.all, 69.05, 0.46, 1.035);

    const chatStage = [
      chatFrame,
      chatTitle,
      ...chatModel.all,
      ...chatParts.flatMap((part) => part.all),
      ...appNotModel.all,
    ];
    timeline.animate(chatStage).at(72.15).stagger(0.001).duration(0.42).fadeTo(0);

    // Multimodal: the same model receives text and image inputs.
    timeline.animate(multimodalModel.all).at(72.55).stagger(0.08).duration(0.42).appear();
    timeline.animate(multimodalTitle.all).at(72.85).stagger(0.04).duration(0.40).appear();
    timeline.animate([...textInput.all, ...imageInput.all]).at(73.60).stagger(0.05).duration(0.42).appear();
    timeline.animate(multimodalArrows).at(74.35).stagger(0.12).duration(0.34).appear();
    timeline.animate(descriptionOutput.all).at(75.15).stagger(0.05).duration(0.40).appear();
    timeline.animate(multimodalReply.all).at(76.25).stagger(0.05).duration(0.40).appear();
    timeline.animate(optionalInputs.all).at(77.20).stagger(0.04).duration(0.36).appear();
    pulseScale(timeline, multimodalModel.all, 78.10, 0.50, 1.025);

    const multimodalStage = [
      ...multimodalModel.all,
      ...multimodalTitle.all,
      ...textInput.all,
      ...imageInput.all,
      ...multimodalArrows,
      ...descriptionOutput.all,
      ...multimodalReply.all,
      ...optionalInputs.all,
    ];
    timeline.animate(multimodalStage).at(81.10).stagger(0.001).duration(0.42).fadeTo(0);

    // Return to the email example and let the contradiction land.
    timeline.animateCamera(this.camera).at(81.10).duration(1.55).ease("inOutCubic")
      .frameTo([0, 4.5, 8], [0, 4.5, 0]);
    timeline.animateCamera(this.camera).at(81.10).duration(1.55).ease("inOutCubic").zoomTo(0.50);
    timeline.animateCamera(this.camera).at(82.65).duration(1.40).ease("inOutCubic")
      .frameTo([0, 0, 8], [0, 0, 0]);
    timeline.animateCamera(this.camera).at(82.65).duration(1.40).ease("inOutCubic").zoomTo(1);
    timeline.animate(endHubAll.filter((item) => !truthBridge.all.includes(item))).at(83.65)
      .stagger(0.025).duration(0.42).appear();
    pulseScale(timeline, endTasks[2]!.all, 85.55, 0.46, 1.04);
    pulseScale(timeline, endTasks[4]!.all, 86.30, 0.46, 1.04);
    pulseScale(timeline, endError.all, 87.00, 0.52, 1.06);
    timeline.animate(truthBridge.all).at(87.55).stagger(0.05).duration(0.42).appear();
    pulseScale(timeline, truthBridge.all, 88.30, 0.46, 1.035);
    endTasks.forEach((task, index) => {
      if (index !== 4) timeline.animate(task.all).at(89.25).duration(0.38).fadeTo(0.38);
    });
    pulseScale(timeline, [...endTasks[4]!.all, ...endError.all], 89.70, 0.56, 1.055);

    // Add the concrete Foundation Model / LLM card to the existing map.
    timeline.animate(endHubAll).at(92.05).stagger(0.001).duration(0.40).fadeTo(0);
    timeline.animateCamera(this.camera).at(92.05).duration(1.55).ease("inOutCubic")
      .frameTo([8, 0, 8], [8, 0, 0]);
    timeline.animateCamera(this.camera).at(92.05).duration(1.55).ease("inOutCubic").zoomTo(0.50);
    timeline.animateCamera(this.camera).at(93.60).duration(1.45).ease("inOutCubic")
      .frameTo([16, 0, 8], [16, 0, 0]);
    timeline.animateCamera(this.camera).at(93.60).duration(1.45).ease("inOutCubic").zoomTo(1);
    moveGroup(timeline, dogCard.all, dogCard.center, [17.55, 0.15], 95.00, 0.75, 0.88);
    timeline.animate(foundationDiagramCard.all).at(95.35).stagger(0.05).duration(0.42).appear();
    timeline.animate([generatesArrow, generatesLabel]).at(96.05).stagger(0.10).duration(0.36).appear();
    pulseScale(timeline, foundationDiagramCard.all, 96.65, 0.50, 1.045);
    pulseScale(timeline, replyCard.all, 97.35, 0.50, 1.035);
    pulseScale(timeline, diagramError.all, 98.15, 0.52, 1.055);

    this.play(timeline);
    this.wait(3.0);
    this.captureScreenshotsNamed([
      [2.70, "part-07-diagram-callback"],
      [9.35, "part-07-five-jobs-question"],
      [18.90, "part-07-broad-training"],
      [23.30, "part-07-foundation-takeaway"],
      [30.20, "part-07-one-model-five-jobs"],
      [37.20, "part-07-task-adaptation"],
      [43.60, "part-07-application-system"],
      [53.80, "part-07-llm-token-callback"],
      [62.45, "part-07-four-term-comparison"],
      [69.25, "part-07-application-not-model"],
      [77.20, "part-07-multimodal"],
      [89.95, "part-07-many-skills-not-truth"],
      [98.35, "part-07-master-diagram"],
    ]);
  }
}

function addOutlineSlot(scene: Scene, at: Vec2, title: string): VisualGroup {
  const panel = scene.add(
    Rectangle().size([2.25, 0.82]).cornerRadius(0.20).fill("rgba(17,25,44,0.82)")
      .stroke({ color: COLOR.foundation, width: 0.035 }).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.46] },
  );
  const label = addText(scene, title, at, 0.14, COLOR.foundation, 900, 0.50);
  return { all: [panel, label], center: at };
}

function addTask(
  scene: Scene,
  at: Vec2,
  title: string,
  result: string,
  resultFill: string,
  connectorFrom: Vec2 = [2.30, 8.90],
): TaskVisual {
  const connector = scene.add(
    Arrow().from(connectorFrom)
      .to([at[0] - 1.68, at[1]]).stroke({ color: COLOR.foundation, width: 0.035 }),
  );
  const panel = scene.add(
    Rectangle().size([3.25, 0.88]).cornerRadius(0.20).fill(resultFill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.46] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 0.17], 0.14, COLOR.ink, 950, 0.50);
  const detail = addText(scene, result, [at[0], at[1] - 0.18], 0.12, "rgba(248,250,252,0.82)", 680, 0.50);
  return { all: [connector, panel, heading, detail], center: at, connector };
}

function addGaugeModel(scene: Scene, at: Vec2, title: string): VisualGroup {
  const panel = scene.add(
    Rectangle().size([4.50, 3.20]).cornerRadius(0.32).fill(SOLID.foundation)
      .css({ borderStyle: "none", filter: "drop-shadow(0 15px 28px rgba(255,159,67,0.22))" }),
    { at: [at[0], at[1], 0.38] },
  );
  const label = addText(scene, title, [at[0], at[1] + 1.28], 0.20, COLOR.ink, 950, 0.50);
  const gauges = scene.add(
    LearningMeterGaugeField(40, {
      epochs: 100,
      seed: 91,
      size: [3.82, 2.08],
      columns: 8,
      noise: 0.16,
      title: "SHARED MODEL WEIGHTS",
      showEpoch: false,
      arcColor: "rgba(255,159,67,0.62)",
      needleColor: COLOR.gold,
      background: "rgba(24,14,8,0.48)",
    }).epoch(100),
    { at: [at[0], at[1] - 0.13, 0.46] },
  );
  return { all: [panel, label, gauges], center: at };
}

function addComparisonCard(
  scene: Scene,
  at: Vec2,
  title: string,
  kind: string,
  meaning: string,
  fill: string,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([6.30, 2.15]).cornerRadius(0.28).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.22))" }),
    { at: [at[0], at[1], 0.40] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 0.58], 0.24, COLOR.ink, 950, 0.48);
  const kindLabel = addText(scene, kind, [at[0], at[1] + 0.05], 0.15, COLOR.gold, 900, 0.48);
  const detail = addText(scene, meaning, [at[0], at[1] - 0.52], 0.16, COLOR.ink, 760, 0.48);
  return { all: [panel, heading, kindLabel, detail], center: at };
}

function addMiniEmail(scene: Scene, at: Vec2): VisualGroup {
  const panel = scene.add(
    Rectangle().size([2.65, 3.00]).cornerRadius(0.24).fill(SOLID.panel)
      .css({ borderStyle: "none", filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.22))" }),
    { at: [at[0], at[1], 0.42] },
  );
  const title = addText(scene, "EMAIL", [at[0], at[1] + 1.13], 0.19, COLOR.ai, 950, 0.48);
  const subject = addText(scene, "Meeting moved", [at[0], at[1] + 0.55], 0.16, COLOR.ink, 800, 0.48);
  const date = addSolidPill(scene, "TUESDAY · 10:00", [at[0], at[1] - 0.10], SOLID.neutral, 2.12, COLOR.ink, 0.12);
  const attachment = addSolidPill(scene, "DOG PHOTO", [at[0], at[1] - 0.73], SOLID.dl, 1.75, COLOR.ink, 0.12);
  return { all: [panel, title, subject, ...date.all, ...attachment.all], center: at };
}

function addDogInput(scene: Scene, at: Vec2): VisualGroup {
  const panel = scene.add(
    Rectangle().size([3.10, 1.45]).cornerRadius(0.23).fill(SOLID.dl).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.42] },
  );
  const face = scene.add(Circle().radius(0.33).fill("#D59A62"), { at: [at[0] - 0.82, at[1], 0.48] });
  const eyeLeft = scene.add(Circle().radius(0.045).fill("#10131C"), { at: [at[0] - 0.92, at[1] + 0.06, 0.50] });
  const eyeRight = scene.add(Circle().radius(0.045).fill("#10131C"), { at: [at[0] - 0.72, at[1] + 0.06, 0.50] });
  const label = addText(scene, "IMAGE", [at[0] + 0.48, at[1] + 0.18], 0.18, COLOR.ink, 950, 0.50);
  const detail = addText(scene, "dog-photo.jpg", [at[0] + 0.48, at[1] - 0.22], 0.13, COLOR.ink, 650, 0.50);
  return { all: [panel, face, eyeLeft, eyeRight, label, detail], center: at };
}

function addCard(
  scene: Scene,
  at: Vec2,
  size: Vec2,
  fill: string,
  title: string,
  detail: string,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size(size).cornerRadius(0.26).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.22))" }),
    { at: [at[0], at[1], 0.42] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 0.27], 0.20, COLOR.ink, 950, 0.50);
  const subtitle = addText(scene, detail, [at[0], at[1] - 0.27], 0.13, "rgba(248,250,252,0.82)", 680, 0.50);
  return { all: [panel, heading, subtitle], center: at };
}

function addDiagramCard(
  scene: Scene,
  at: Vec2,
  fill: string,
  title: string,
  detail: string,
  width = 2.18,
  height = 0.78,
  titleHeight = 0.17,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([width, height]).cornerRadius(0.18).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 7px 12px rgba(0,0,0,0.25))" }),
    { at: [at[0], at[1], 0.55] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 0.11], titleHeight, COLOR.ink, 950, 0.58);
  const subtitle = addText(scene, detail, [at[0], at[1] - 0.17], 0.10, "rgba(248,250,252,0.76)", 680, 0.58);
  return { all: [panel, heading, subtitle], center: at };
}

function addSolidPill(
  scene: Scene,
  text: string,
  at: Vec2,
  fill: string,
  width: number,
  ink: string,
  textHeight = 0.16,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([width, 0.58]).cornerRadius(0.25).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.50] },
  );
  const label = addText(scene, text, at, textHeight, ink, 900, 0.54);
  return { all: [panel, label], center: at };
}

function addConnector(scene: Scene, from: Vec2, to: Vec2, color: string): Tattva {
  return scene.add(
    Arrow().from(from).to(to).stroke({ color, width: 0.04 }),
  );
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
  const inheritedPhase = 4.18;
  scene.updater((time, states) => {
    motion.update((inheritedPhase + time) % motion.duration, states);
  });
}

await renderScene(
  decodeURIComponent(new URL(import.meta.url).pathname),
  FoundationModelsAndLlmsScene,
  "07-foundation-models-and-llms.mp4",
);
