import { KavriqSplashLogo, KavriqSplashMotion } from "veena/composite";
import { Scene, Timeline, type Tattva, type Vec2 } from "veena/core";
import { Arrow, Circle, Rectangle } from "veena/primitives";
import { Label } from "veena/text";
import { addFinalConceptMap } from "../lib/final-concept-map.ts";
import { addOpenEmailView } from "../lib/open-email.ts";
import { renderScene } from "../lib/render.ts";
import { COLOR, FRAME } from "../lib/theme.ts";

const FILL = {
  panel: "#11192C",
  panelSoft: "#172238",
  neutral: "#243654",
  warning: "#3B2026",
  verified: "#173C32",
  human: "#17647D",
  model: "#9A5A20",
} as const;

interface VisualGroup {
  all: Tattva[];
  center: Vec2;
}

class HallucinationsRisksAndVerificationScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    this.camera.position([16, 0, 8]).lookAt([16, 0, 0]).zoom(1);

    // Two map states make the correction persistent without changing the map's taxonomy.
    const incorrectMap = addFinalConceptMap(this, { corrected: false, dataScienceVisible: false });
    const correctedMap = addFinalConceptMap(this, { corrected: true, dataScienceVisible: false });
    hide(correctedMap.all);
    const correctedCore = correctedMap.all.filter((item) => !correctedMap.dataScience.all.includes(item));

    const email = addOpenEmailView(this, { at: [0, 0.02], scale: 0.68 });
    const sourceDate = addCard(this, [-5.35, -0.10], [3.35, 1.45], FILL.verified, "SOURCE EMAIL", "TUESDAY", COLOR.ml);
    const draftDate = addCard(this, [5.35, -0.10], [3.35, 1.45], FILL.warning, "DRAFT REPLY", "WEDNESDAY", COLOR.warning);
    const mismatch = this.add(
      Arrow().from([-3.55, -0.10]).to([3.55, -0.10]).stroke({ color: COLOR.warning, width: 0.055 }),
    ).opacity(0);
    const mismatchLabel = addPill(this, "DOES NOT MATCH", [0, 0.28], FILL.warning, 3.15, COLOR.warning);
    const hallucinationTitle = addText(this, "HALLUCINATION", [0, 3.72], 0.46, COLOR.warning, 950).opacity(0);
    const hallucinationDefinition = addPill(
      this, "PLAUSIBLE-SOUNDING · BUT INCORRECT", [0, 3.02], FILL.warning, 7.35, COLOR.ink, 0.19,
    );
    hide([...sourceDate.all, ...draftDate.all, ...mismatchLabel.all, ...hallucinationDefinition.all]);

    // Upper explainer screen: a short callback to next-token prediction.
    const upperTitle = addText(this, "WHY CAN THIS HAPPEN?", [0, 12.65], 0.40, COLOR.ink, 950).opacity(0);
    const emailEvidence = addCard(this, [-5.25, 9.20], [3.25, 1.80], FILL.verified, "ORIGINAL EMAIL", "…meeting is TUESDAY…", COLOR.ml);
    const model = addCard(this, [-0.70, 9.20], [3.25, 2.25], FILL.model, "GENERATIVE MODEL", "Predicts the next token", COLOR.foundation);
    const inputArrow = this.add(
      Arrow().from([-3.48, 9.20]).to([-2.45, 9.20]).stroke({ color: COLOR.foundation, width: 0.045 }),
    ).opacity(0);
    const candidateTitle = addText(this, "NEXT-TOKEN CANDIDATES", [4.35, 11.15], 0.20, COLOR.muted, 850).opacity(0);
    const candidates = [
      addScore(this, [4.35, 10.35], "WEDNESDAY", "42%", COLOR.warning, FILL.warning),
      addScore(this, [4.35, 9.42], "TUESDAY", "34%", COLOR.ml, FILL.verified),
      addScore(this, [4.35, 8.49], "THURSDAY", "12%", COLOR.muted, FILL.panelSoft),
    ];
    const outputArrow = this.add(
      Arrow().from([1.08, 9.20]).to([2.50, 9.72]).stroke({ color: COLOR.foundation, width: 0.045 }),
    ).opacity(0);
    const likelyNotTrue = addPill(this, "LIKELY  ≠  TRUE", [-0.70, 7.37], FILL.warning, 3.25, COLOR.warning, 0.20);
    const prediction = addCard(
      this, [-3.65, 6.35], [6.25, 1.20], FILL.model,
      "PREDICTION", "WHAT IS LIKELY TO COME NEXT", COLOR.foundation,
    );
    const verification = addCard(
      this, [3.65, 6.35], [6.25, 1.20], FILL.verified,
      "VERIFICATION", "WHAT THE EVIDENCE SUPPORTS", COLOR.ml,
    );
    const predictionStage = [
      upperTitle, ...emailEvidence.all, ...model.all, inputArrow, candidateTitle,
      ...candidates.flatMap((group) => group.all), outputArrow, ...likelyNotTrue.all,
      ...prediction.all, ...verification.all,
    ];
    hide(predictionStage.filter((item) => item !== upperTitle && item !== inputArrow && item !== outputArrow && item !== candidateTitle));

    // Verification is a separate, explicit path to trusted evidence.
    const generatedClaim = addCard(this, [-5.20, 9.20], [3.15, 1.65], FILL.warning, "GENERATED CLAIM", "WEDNESDAY", COLOR.warning);
    const trustedSources = [
      addCard(this, [0.25, 10.50], [3.40, 1.20], FILL.verified, "ORIGINAL EMAIL", "TUESDAY", COLOR.ml),
      addCard(this, [0.25, 9.00], [3.40, 1.20], FILL.panelSoft, "CALENDAR", "Trusted tool", COLOR.ai),
      addCard(this, [0.25, 7.50], [3.40, 1.20], FILL.panelSoft, "VERIFIED DOCUMENT", "Trusted source", COLOR.ai),
    ];
    const checkArrows: Tattva[] = trustedSources.map((source) => this.add(
      Arrow().from([-3.48, 9.20]).to([source.center[0] - 1.90, source.center[1]])
        .stroke({ color: COLOR.ml, width: 0.04 }),
    ).opacity(0));
    const verifiedResult = addCard(this, [5.25, 9.20], [3.25, 1.65], FILL.verified, "SUPPORTED DATE", "TUESDAY  ✓", COLOR.ml);
    const resultArrow = this.add(
      Arrow().from([2.10, 10.50]).to([3.45, 9.20]).stroke({ color: COLOR.ml, width: 0.045 }),
    ).opacity(0);
    const mitigation = addPill(this, "GENERATE  →  CHECK SOURCE  →  CORRECT", [0, 6.25], FILL.verified, 8.40, COLOR.ink, 0.20);
    const verificationStage = [
      ...generatedClaim.all, ...trustedSources.flatMap((source) => source.all), ...checkArrows,
      ...verifiedResult.all, resultArrow, ...mitigation.all,
    ];
    hide(verificationStage.filter((item) => !checkArrows.includes(item) && item !== resultArrow));

    // Corrected reply overlay on the main email.
    const correctedReply = addCard(
      this, [0, -1.605], [6.87, 0.93], FILL.verified,
      "AI DRAFT · VERIFIED", "See you Tuesday at 10:00.", COLOR.ml,
    );
    const correctedChip = addPill(this, "WED → TUE ✓", [2.75, -1.23], FILL.verified, 2.20, COLOR.ml, 0.14);
    hide([...correctedReply.all, ...correctedChip.all]);

    // Five risks share one layout so attention stays on the concept and action.
    const riskTitle = addText(this, "HALLUCINATIONS ARE NOT THE ONLY RISK", [0, 12.55], 0.34, COLOR.ink, 950).opacity(0);
    const riskCards = [
      addRiskCard(this, "HALLUCINATION", "A fluent claim can still be wrong", "VERIFY FACTS", ["WEDNESDAY", "SOURCE: TUESDAY"]),
      addRiskCard(this, "BIAS", "Learned patterns can be uneven", "AUDIT AND CHECK", ["GROUP A  █████", "GROUP B  ██"]),
      addRiskCard(this, "PRIVATE DATA", "Sensitive fields require protection", "PROTECT", ["NAME", "PHONE", "ACCOUNT NUMBER"]),
      addRiskCard(this, "SYNTHETIC MEDIA", "A convincing imitation may be a deepfake", "DISCLOSE", ["IMAGE · AUDIO · VIDEO", "DEEPFAKE ⊂ SYNTHETIC MEDIA"]),
      addRiskCard(this, "THE JOB YOU NEED", "Success elsewhere is not a guarantee", "TEST", ["PASS", "PASS", "EDGE CASE: FAIL"]),
    ];
    riskCards.forEach((group) => hide(group.all));

    const actions = addPill(
      this, "VERIFY  ·  AUDIT  ·  PROTECT  ·  DISCLOSE  ·  TEST",
      [0, 9.05], FILL.human, 11.60, COLOR.ink, 0.20,
    );
    hide(actions.all);
    const aiOutput = addCard(this, [-5.10, 7.40], [3.15, 1.35], FILL.model, "AI OUTPUT", "Fast · unverified", COLOR.foundation);
    const humanReview = addCard(this, [0, 7.40], [3.15, 1.35], FILL.human, "HUMAN REVIEW", "Approve or correct", COLOR.ai);
    const finalAction = addCard(this, [5.10, 7.40], [3.15, 1.35], FILL.verified, "ACTION", "Use the checked result", COLOR.ml);
    const reviewArrows: Tattva[] = [
      this.add(Arrow().from([-3.35, 7.40]).to([-1.75, 7.40]).stroke({ color: COLOR.ai, width: 0.05 })).opacity(0),
      this.add(Arrow().from([1.75, 7.40]).to([3.35, 7.40]).stroke({ color: COLOR.ml, width: 0.05 })).opacity(0),
    ];
    const reviewStage = [...actions.all, ...aiOutput.all, ...humanReview.all, ...finalAction.all, ...reviewArrows];
    hide(reviewStage.filter((item) => !reviewArrows.includes(item)));

    const finalTakeaway = addCard(
      this, [0, 2.95], [10.50, 1.65], FILL.human,
      "USE AI FOR SPEED", "KEEP VERIFICATION FOR TRUST", COLOR.ink,
    );
    const accessRule = addCard(
      this, [0, -3.35], [10.50, 1.35], FILL.warning,
      "THE GOLDEN RULE", "NEVER GIVE AI MORE ACCESS THAN IT NEEDS", COLOR.warning,
    );
    hide([...finalTakeaway.all, ...accessRule.all]);

    addKavriqBrand(this);
    const timeline = new Timeline();

    pulseScale(timeline, incorrectMap.correctionChip.all, 0.70, 0.60, 1.08);
    timeline.animateCamera(this.camera).at(2.20).duration(1.40).ease("inOutCubic")
      .frameTo([8, 0, 8], [8, 0, 0]);
    timeline.animateCamera(this.camera).at(2.20).duration(1.40).ease("inOutCubic").zoomTo(0.50);
    timeline.animateCamera(this.camera).at(3.60).duration(1.40).ease("inOutCubic")
      .frameTo([0, 0, 8], [0, 0, 0]);
    timeline.animateCamera(this.camera).at(3.60).duration(1.40).ease("inOutCubic").zoomTo(1);

    timeline.animate(sourceDate.all).at(5.15).stagger(0.05).duration(0.40).appear();
    timeline.animate(draftDate.all).at(5.55).stagger(0.05).duration(0.40).appear();
    timeline.animate(mismatch).at(6.15).duration(0.42).appear();
    timeline.animate(mismatchLabel.all).at(6.45).stagger(0.04).duration(0.34).appear();
    timeline.animate(hallucinationTitle).at(7.15).duration(0).appear();
    timeline.animate(hallucinationTitle).at(7.15).duration(0.62).typewrite();
    timeline.animate(hallucinationDefinition.all).at(7.95).stagger(0.04).duration(0.42).appear();
    pulseScale(timeline, draftDate.all, 9.15, 0.50, 1.05);

    const mainMismatch = [
      ...sourceDate.all, ...draftDate.all, mismatch, ...mismatchLabel.all,
      hallucinationTitle, ...hallucinationDefinition.all,
    ];
    timeline.animate(mainMismatch).at(11.10).stagger(0.001).duration(0.38).fadeTo(0);
    timeline.animate(email.all).at(11.10).duration(0.38).fadeTo(0.18);
    moveCamera(timeline, this.camera, [0, 9], 11.10);

    timeline.animate(upperTitle).at(14.10).duration(0).appear();
    timeline.animate(upperTitle).at(14.10).duration(0.55).typewrite();
    timeline.animate(emailEvidence.all).at(14.75).stagger(0.05).duration(0.40).appear();
    timeline.animate(inputArrow).at(15.15).duration(0.32).appear();
    timeline.animate(model.all).at(15.35).stagger(0.05).duration(0.40).appear();
    timeline.animate(outputArrow).at(16.05).duration(0.32).appear();
    timeline.animate(candidateTitle).at(16.15).duration(0.32).appear();
    candidates.forEach((candidate, index) => {
      timeline.animate(candidate.all).at(16.55 + index * 0.42).stagger(0.03).duration(0.32).appear();
    });
    pulseScale(timeline, candidates[0]!.all, 18.15, 0.56, 1.06);
    timeline.animate(likelyNotTrue.all).at(18.75).stagger(0.04).duration(0.36).appear();
    timeline.animate(prediction.all).at(19.55).stagger(0.04).duration(0.40).appear();
    timeline.animate(verification.all).at(20.15).stagger(0.04).duration(0.40).appear();
    pulseScale(timeline, [...prediction.all, ...verification.all], 21.10, 0.48, 1.025);

    timeline.animate(predictionStage).at(24.00).stagger(0.001).duration(0.40).fadeTo(0);
    timeline.animate(generatedClaim.all).at(24.45).stagger(0.04).duration(0.38).appear();
    trustedSources.forEach((source, index) => {
      timeline.animate(source.all).at(25.00 + index * 0.45).stagger(0.03).duration(0.34).appear();
      timeline.animate(checkArrows[index]!).at(25.20 + index * 0.45).duration(0.30).appear();
    });
    pulseScale(timeline, trustedSources[0]!.all, 27.10, 0.48, 1.05);
    timeline.animate(resultArrow).at(27.45).duration(0.32).appear();
    timeline.animate(verifiedResult.all).at(27.65).stagger(0.04).duration(0.40).appear();
    timeline.animate(mitigation.all).at(28.55).stagger(0.04).duration(0.42).appear();
    pulseScale(timeline, mitigation.all, 29.30, 0.48, 1.035);

    timeline.animate(verificationStage).at(31.20).stagger(0.001).duration(0.40).fadeTo(0);
    moveCamera(timeline, this.camera, [0, 0], 31.20);
    timeline.animate(email.all).at(33.75).duration(0.42).fadeTo(1);
    timeline.animate(email.reply).at(34.35).duration(0.35).fadeTo(0);
    timeline.animate(email.errorChip).at(34.35).duration(0.35).fadeTo(0);
    timeline.animate(correctedReply.all).at(34.60).stagger(0.05).duration(0.40).appear();
    timeline.animate(correctedChip.all).at(35.20).stagger(0.04).duration(0.36).appear();
    pulseScale(timeline, [...correctedReply.all, ...correctedChip.all], 35.85, 0.54, 1.035);

    timeline.animate([...email.all, ...correctedReply.all, ...correctedChip.all]).at(38.10)
      .stagger(0.001).duration(0.40).fadeTo(0);
    moveCamera(timeline, this.camera, [0, 9], 38.10);
    timeline.animate(riskTitle).at(40.95).duration(0).appear();
    timeline.animate(riskTitle).at(40.95).duration(0.62).typewrite();

    const riskStarts = [41.70, 48.00, 54.30, 60.60, 67.20];
    riskCards.forEach((risk, index) => {
      const start = riskStarts[index]!;
      timeline.animate(risk.all).at(start).stagger(0.06).duration(0.42).appear();
      pulseScale(timeline, risk.all, start + 1.10, 0.52, 1.025);
      timeline.animate(risk.all).at(start + 5.55).stagger(0.001).duration(0.38).fadeTo(0);
    });

    timeline.animate(riskTitle).at(73.10).duration(0.35).fadeTo(0);
    timeline.animate(actions.all).at(73.30).stagger(0.04).duration(0.44).appear();
    pulseScale(timeline, actions.all, 74.20, 0.50, 1.035);
    timeline.animate(aiOutput.all).at(75.15).stagger(0.04).duration(0.38).appear();
    timeline.animate(reviewArrows[0]!).at(75.65).duration(0.32).appear();
    timeline.animate(humanReview.all).at(75.85).stagger(0.04).duration(0.38).appear();
    pulseScale(timeline, humanReview.all, 77.00, 0.54, 1.05);
    timeline.animate(reviewArrows[1]!).at(77.45).duration(0.32).appear();
    timeline.animate(finalAction.all).at(77.70).stagger(0.04).duration(0.38).appear();
    pulseScale(timeline, finalAction.all, 78.45, 0.46, 1.04);

    timeline.animate(reviewStage).at(80.40).stagger(0.001).duration(0.38).fadeTo(0);
    moveCamera(timeline, this.camera, [0, 0], 80.35);
    timeline.animate(email.all).at(82.95).duration(0.40).fadeTo(0.20);
    timeline.animate([...correctedReply.all, ...correctedChip.all]).at(83.05).stagger(0.04).duration(0.40).appear();
    timeline.animate(finalTakeaway.all).at(83.40).stagger(0.05).duration(0.45).appear();
    pulseScale(timeline, finalTakeaway.all, 84.25, 0.50, 1.035);
    timeline.animate(accessRule.all).at(87.10).stagger(0.05).duration(0.44).appear();
    pulseScale(timeline, accessRule.all, 88.10, 0.54, 1.035);

    // Swap the map state while it is off camera, then return to the corrected map.
    timeline.animate(incorrectMap.all).at(88.80).duration(0).fadeTo(0);
    timeline.animate(correctedCore).at(88.80).duration(0).appear();
    timeline.animate([...email.all, ...correctedReply.all, ...correctedChip.all, ...finalTakeaway.all, ...accessRule.all])
      .at(90.05).stagger(0.001).duration(0.38).fadeTo(0);
    timeline.animate(actions.all).at(90.05).duration(0).fadeTo(0);
    moveCamera(timeline, this.camera, [16, 0], 90.05);
    pulseScale(timeline, correctedMap.correctionChip.all, 93.10, 0.56, 1.07);

    this.play(timeline);
    this.wait(3.0);
    this.captureScreenshotsNamed([
      [1.10, "part-08-map-callback"],
      [8.70, "part-08-hallucination"],
      [18.35, "part-08-next-token-prediction"],
      [21.60, "part-08-prediction-vs-verification"],
      [29.25, "part-08-trusted-source-check"],
      [35.95, "part-08-corrected-reply"],
      [43.40, "part-08-hallucination-action"],
      [50.20, "part-08-bias-action"],
      [56.50, "part-08-private-data-action"],
      [63.00, "part-08-synthetic-media-action"],
      [69.55, "part-08-test-action"],
      [78.55, "part-08-human-review"],
      [88.20, "part-08-final-rules"],
      [93.30, "part-08-corrected-map"],
    ]);
  }
}

function addRiskCard(
  scene: Scene,
  title: string,
  meaning: string,
  action: string,
  examples: string[],
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([11.50, 4.70]).cornerRadius(0.34).fill(FILL.panel)
      .css({ borderStyle: "none", filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.24))" }),
    { at: [0, 8.90, 0.35] },
  );
  const heading = addText(scene, title, [0, 10.45], 0.36, COLOR.warning, 950, 0.48);
  const detail = addText(scene, meaning, [0, 9.72], 0.20, COLOR.ink, 700, 0.48);
  const chips = examples.map((text, index) => (
    addPill(scene, text, [-3.40 + index * (6.80 / Math.max(1, examples.length - 1)), 8.75], FILL.panelSoft, 2.75, COLOR.ink, 0.13)
  ));
  const actionCard = addPill(scene, action, [0, 7.42], FILL.warning, 5.20, COLOR.warning, 0.21);
  return { all: [panel, heading, detail, ...chips.flatMap((chip) => chip.all), ...actionCard.all], center: [0, 8.90] };
}

function addScore(scene: Scene, at: Vec2, token: string, score: string, accent: string, fill: string): VisualGroup {
  const panel = scene.add(
    Rectangle().size([3.75, 0.72]).cornerRadius(0.20).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.42] },
  );
  const label = addText(scene, token, [at[0] - 0.52, at[1]], 0.15, COLOR.ink, 900, 0.48);
  const value = addText(scene, score, [at[0] + 1.12, at[1]], 0.16, accent, 950, 0.48);
  return { all: [panel, label, value], center: at };
}

function addCard(
  scene: Scene,
  at: Vec2,
  size: Vec2,
  fill: string,
  title: string,
  detail: string,
  accent: string,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size(size).cornerRadius(0.25).fill(fill)
      .css({ borderStyle: "none", filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.22))" }),
    { at: [at[0], at[1], 0.42] },
  );
  const heading = addText(scene, title, [at[0], at[1] + 0.27], 0.18, accent, 950, 0.50);
  const subtitle = addText(scene, detail, [at[0], at[1] - 0.25], 0.16, COLOR.ink, 720, 0.50);
  return { all: [panel, heading, subtitle], center: at };
}

function addPill(
  scene: Scene,
  text: string,
  at: Vec2,
  fill: string,
  width: number,
  ink: string,
  textHeight = 0.16,
): VisualGroup {
  const panel = scene.add(
    Rectangle().size([width, 0.62]).cornerRadius(0.27).fill(fill).css({ borderStyle: "none" }),
    { at: [at[0], at[1], 0.50] },
  );
  const label = addText(scene, text, at, textHeight, ink, 900, 0.54);
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

function moveCamera(timeline: Timeline, camera: Scene["camera"], target: Vec2, at: number): void {
  const midpoint: Vec2 = target[0] === 16 ? [8, target[1]] : [0, 4.5];
  timeline.animateCamera(camera).at(at).duration(1.45).ease("inOutCubic")
    .frameTo([midpoint[0], midpoint[1], 8], [midpoint[0], midpoint[1], 0]);
  timeline.animateCamera(camera).at(at).duration(1.45).ease("inOutCubic").zoomTo(0.50);
  timeline.animateCamera(camera).at(at + 1.45).duration(1.35).ease("inOutCubic")
    .frameTo([target[0], target[1], 8], [target[0], target[1], 0]);
  timeline.animateCamera(camera).at(at + 1.45).duration(1.35).ease("inOutCubic").zoomTo(1);
}

function pulseScale(timeline: Timeline, items: readonly Tattva[], at: number, duration: number, scale: number): void {
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
  const inheritedPhase = 5.27;
  scene.updater((time, states) => {
    motion.update((inheritedPhase + time) % motion.duration, states);
  });
}

await renderScene(
  decodeURIComponent(new URL(import.meta.url).pathname),
  HallucinationsRisksAndVerificationScene,
  "08-hallucinations-risks-and-verification.mp4",
);
