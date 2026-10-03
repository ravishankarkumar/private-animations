import { render } from "murali-js";
import { Scene, timeline, type Tattva } from "murali-js/core";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Arrow, Rectangle } from "murali-js/primitives";
import { Fireworks } from "murali-js/storytelling";
import { Label } from "murali-js/text";

const BG = "#070A16";
const PANEL = "#141C32";
const INK = "#F8FAFC";
const MUTED = "#9AA7C1";
const CYAN = "#31D7FF";
const VIOLET = "#9B6DFF";
const PINK = "#FF5FA2";
const GREEN = "#57E3A1";

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

const roundedCard = (size: readonly [number, number], fill: string, stroke: string) =>
  Rectangle()
    .size(size)
    .cornerRadius(0.24)
    .fill(fill)
    .stroke({ color: stroke, width: 0.045 })
    .css({ borderStyle: "none" });

/** How an LLM predicts text, formatted as a YouTube Short. */
class LLMNextTokenShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const mainVisuals: Tattva[] = [];
    const addMain = <T extends Tattva>(tattva: T, at?: readonly [number, number]): T => {
      const added = this.add(tattva, at ? { at } : undefined);
      mainVisuals.push(added);
      return added;
    };

    const eyebrow = addMain(
      Label("LLMs • VISUALIZED")
        .height(0.23)
        .color(CYAN)
        .css({ fontWeight: 850, letterSpacing: "0.17em" }),
      [0, 7.18],
    );
    const title = addMain(
      Label("HOW DOES AN LLM WRITE?")
        .height(0.55)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "-0.035em" }),
      [0, 6.55],
    );
    const hook = addMain(
      Label("It predicts just ONE token at a time")
        .height(0.24)
        .color(MUTED)
        .css({ fontWeight: 650 }),
      [0, 6.05],
    );

    const queryCard = addMain(roundedCard([6.8, 1.15], PANEL, "#34476F"), [0, 5.0]);
    const queryTag = addMain(
      Label("QUERY").height(0.16).color(CYAN).css({ fontWeight: 850, letterSpacing: "0.14em" }),
      [-2.65, 5.3],
    );
    const query = addMain(
      Label("“Why are flamingos pink?”")
        .height(0.3)
        .color(INK)
        .css({ fontWeight: 750 }),
      [0, 4.9],
    );

    const tokenizerArrow = addMain(
      Arrow().from([0, 4.42]).to([0, 4.04]).stroke({ color: CYAN, width: 0.05 }),
    );
    const tokenizerCard = addMain(
      roundedCard([3.5, 0.82], "rgba(49,215,255,0.10)", CYAN),
      [0, 3.62],
    );
    const tokenizer = addMain(
      Label("TOKENIZER").height(0.3).color(CYAN).css({ fontWeight: 900, letterSpacing: "0.08em" }),
      [0, 3.62],
    );

    const tokenSpecs = [
      { text: "Why", x: -3.0, width: 0.95 },
      { text: "are", x: -1.85, width: 0.9 },
      { text: "flamingo", x: -0.25, width: 2.1 },
      { text: "s", x: 1.35, width: 0.6 },
      { text: "pink", x: 2.35, width: 1.15 },
      { text: "?", x: 3.25, width: 0.55 },
    ];
    const tokenCards = tokenSpecs.map(({ text, x, width }) => ({
      card: addMain(roundedCard([width, 0.78], "#1B2744", "#60739F"), [x, 2.65]),
      label: addMain(Label(text).height(0.2).color(INK).css({ fontWeight: 750 }), [x, 2.65]),
    }));
    const tokensTag = addMain(
      Label("TOKENS").height(0.15).color(MUTED).css({ fontWeight: 850, letterSpacing: "0.14em" }),
      [0, 3.05],
    );

    const llmArrow = addMain(
      Arrow().from([0, 2.25]).to([0, 1.92]).stroke({ color: VIOLET, width: 0.055 }),
    );
    const llmCard = addMain(
      roundedCard([6.25, 1.18], "rgba(155,109,255,0.16)", VIOLET),
      [0, 1.35],
    );
    const llm = addMain(
      Label("LARGE LANGUAGE MODEL")
        .height(0.38)
        .color(INK)
        .css({ fontWeight: 900, letterSpacing: "0.015em" }),
      [0, 1.52],
    );
    const llmCaption = addMain(
      Label("SCORES EVERY POSSIBLE NEXT TOKEN")
        .height(0.16)
        .color("#C4B5FD")
        .css({ fontWeight: 750, letterSpacing: "0.09em" }),
      [0, 1.08],
    );

    const probabilityTag = addMain(
      Label("NEXT-TOKEN PROBABILITIES")
        .height(0.17)
        .color(MUTED)
        .css({ fontWeight: 850, letterSpacing: "0.11em" }),
      [0, 0.48],
    );
    const candidates = [
      { token: "Flamingos", probability: "46%", y: -0.05, width: 4.1, color: PINK },
      { token: "They", probability: "24%", y: -0.62, width: 2.55, color: VIOLET },
      { token: "Because", probability: "18%", y: -1.19, width: 1.9, color: CYAN },
      { token: "The", probability: "8%", y: -1.76, width: 0.9, color: "#64748B" },
    ];
    const candidateVisuals = candidates.map(({ token, probability, y, width, color }) => {
      const tokenLabel = addMain(
        Label(token).height(0.2).color(INK).css({ fontWeight: 750, textAlign: "right" }),
        [-2.65, y],
      );
      const bar = addMain(
        Rectangle()
          .size([width, 0.34])
          .cornerRadius(0.12)
          .fill(color)
          .css({ borderStyle: "none" })
          .opacity(0)
          .scale3D([0.02, 1, 1]),
        [-0.15 + width / 2, y],
      );
      const percent = addMain(
        Label(probability).height(0.18).color(INK).css({ fontWeight: 900 }),
        [2.9, y],
      );
      return { tokenLabel, bar, percent };
    });

    const secondCandidates = [
      { token: "are", probability: "71%", y: -0.05, width: 4.1, color: GREEN },
      { token: "have", probability: "12%", y: -0.62, width: 2.0, color: VIOLET },
      { token: "can", probability: "9%", y: -1.19, width: 1.45, color: CYAN },
      { token: "often", probability: "5%", y: -1.76, width: 0.82, color: "#64748B" },
    ];
    const secondCandidateVisuals = secondCandidates.map(({ token, probability, y, width, color }) => {
      const tokenLabel = addMain(
        Label(token).height(0.2).color(INK).css({ fontWeight: 750, textAlign: "right" }),
        [-2.65, y],
      );
      const bar = addMain(
        Rectangle()
          .size([width, 0.34])
          .cornerRadius(0.12)
          .fill(color)
          .css({ borderStyle: "none" })
          .opacity(0)
          .scale3D([0.02, 1, 1]),
        [-0.15 + width / 2, y],
      );
      const percent = addMain(
        Label(probability).height(0.18).color(INK).css({ fontWeight: 900 }),
        [2.9, y],
      );
      return { tokenLabel, bar, percent };
    });

    const selectionArrow = addMain(
      Arrow().from([0, -2.08]).to([0, -2.48]).stroke({ color: GREEN, width: 0.055 }),
    );
    const secondSelectionArrow = addMain(
      Arrow().from([0, -2.08]).to([0, -2.48]).stroke({ color: GREEN, width: 0.055 }),
    );
    const outputCard = addMain(
      roundedCard([5.4, 1.0], "rgba(87,227,161,0.11)", GREEN),
      [0, -3.0],
    );
    const outputTag = addMain(
      Label("SELECTED NEXT TOKEN")
        .height(0.15)
        .color(GREEN)
        .css({ fontWeight: 850, letterSpacing: "0.12em" }),
      [0, -2.76],
    );
    const selectedToken = addMain(
      Label("Flamingos").height(0.34).color(INK).css({ fontWeight: 900 }),
      [0, -3.16],
    );

    const loopArrow = addMain(
      Arrow().from([-3.3, -2.85]).to([-3.3, 4.78]).stroke({ color: GREEN, width: 0.055 }),
    );
    const loopLabel = addMain(
      Label("APPEND + RUN AGAIN")
        .height(0.16)
        .color(GREEN)
        .css({ fontWeight: 850, letterSpacing: "0.1em" })
        .rotate(90),
      [-3.63, 1.0],
    );
    const updatedContextTag = addMain(
      Label("UPDATED CONTEXT")
        .height(0.16)
        .color(GREEN)
        .css({ fontWeight: 850, letterSpacing: "0.12em" }),
      [-2.25, 5.3],
    );
    const updatedQuery = addMain(
      Label("Why are flamingos pink?  +  Flamingos")
        .height(0.25)
        .color(INK)
        .css({ fontWeight: 750 }),
      [0.25, 4.9],
    );
    const secondProbabilityTag = addMain(
      Label("LOOP 2 • SCORE THE NEXT TOKEN AGAIN")
        .height(0.17)
        .color(GREEN)
        .css({ fontWeight: 850, letterSpacing: "0.075em" }),
      [0, 0.48],
    );
    const secondOutputTag = addMain(
      Label("NEXT TOKEN CHOSEN")
        .height(0.15)
        .color(GREEN)
        .css({ fontWeight: 850, letterSpacing: "0.12em" }),
      [0, -2.76],
    );
    const answerAfterFirstLoop = addMain(
      Label("ANSWER SO FAR:  Flamingos")
        .height(0.24)
        .color(INK)
        .css({ fontWeight: 850, letterSpacing: "0.025em" }),
      [-0.25, -4.05],
    );
    const flyingNextToken = addMain(
      Label("are").height(0.2).color(INK).css({ fontWeight: 750 }),
      [-2.65, -0.05],
    );

    const quickLoopCaption = addMain(
      Label("PREDICT  →  APPEND  →  REPEAT")
        .height(0.2)
        .color(CYAN)
        .css({ fontWeight: 850, letterSpacing: "0.07em" }),
      [0, -2.7],
    );
    const quickLoopPlate = addMain(
      roundedCard([6.5, 1.5], "rgba(49,215,255,0.08)", CYAN),
      [0, -3.75],
    );
    const quickAnswerBase = addMain(
      Label("Flamingos are").height(0.3).color(INK).css({ fontWeight: 900 }),
      [-1.45, -3.87],
    );
    const quickPink = addMain(
      Label("pink").height(0.25).color(PINK).css({ fontWeight: 900 }),
      [0, 1.35],
    );
    const quickBecause = addMain(
      Label("because").height(0.25).color(VIOLET).css({ fontWeight: 900 }),
      [0, 1.35],
    );
    const quickEllipsis = addMain(
      Label("…").height(0.3).color(MUTED).css({ fontWeight: 900 }),
      [2.15, -3.87],
    );
    const tokenThree = addMain(
      Label("TOKEN 3").height(0.16).color(PINK).css({ fontWeight: 850, letterSpacing: "0.12em" }),
      [0, -3.25],
    );
    const tokenFour = addMain(
      Label("TOKEN 4").height(0.16).color(VIOLET).css({ fontWeight: 850, letterSpacing: "0.12em" }),
      [0, -3.25],
    );

    const subscribe = this.add(
      YouTubeSubscribe("Kavriq", {
        handle: "@kavriq",
        message: "Subscribe for more AI visuals",
        layout: "compact",
        size: [5.4, 3.8],
      }).opacity(0),
      { at: [0, 1.2] },
    );
    const fireworks = this.add(
      Fireworks()
        .fit(this)
        .burstCount(8)
        .particlesPerBurst(42)
        .cycleDuration(5.2)
        .spread(1.85)
        .gravity(1.3)
        .glow(1)
        .seed(41)
        .timeOffset(-24.0)
        .layer(10)
        .opacity(0),
    );
    const learnedTitle = this.add(
      Label("YOU JUST LEARNED\nHOW LLMs GENERATE TEXT")
        .height(0.52)
        .color(INK)
        .depthMode("overlay")
        .layer(12)
        .css({ fontWeight: 900, letterSpacing: "-0.015em", lineHeight: "1.12" }),
      { at: [0, 1.15] },
    );
    const learnedSubtitle = this.add(
      Label("ONE TOKEN AT A TIME")
        .height(0.24)
        .color(CYAN)
        .depthMode("overlay")
        .layer(12)
        .css({ fontWeight: 850, letterSpacing: "0.13em" }),
      { at: [0, -0.35] },
    );
    const finalSummary = this.add(
      Label("LLMs BUILD ANSWERS\nONE TOKEN AT A TIME")
        .height(0.6)
        .color(INK)
        .depthMode("overlay")
        .layer(8)
        .css({ fontWeight: 900, letterSpacing: "-0.015em", lineHeight: "1.14" }),
      { at: [0, 0.75] },
    );
    const finalSummarySub = this.add(
      Label("PREDICT  •  APPEND  •  REPEAT")
        .height(0.22)
        .color(CYAN)
        .depthMode("overlay")
        .layer(8)
        .css({ fontWeight: 850, letterSpacing: "0.1em" }),
      { at: [0, -0.75] },
    );

    this.play(timeline((local) => {
      local.animate(eyebrow).duration(0.4).appear();
      local.animate(title).at(0.15).duration(0.7).typewrite();
      local.animate(hook).at(0.75).duration(0.5).appear();

      local.animate(queryCard).at(1.35).duration(0.42).appear();
      local.animate(queryTag).at(1.55).duration(0.3).appear();
      local.animate(query).at(1.75).duration(0.75).typewrite();
      local.animate(tokenizerArrow).at(2.55).duration(0.35).draw();
      local.animate(tokenizerCard).at(2.8).duration(0.38).appear();
      local.animate(tokenizer).at(2.98).duration(0.4).typewrite();

      local.animate(tokensTag).at(3.45).duration(0.3).appear();
      local.animate(tokenCards.map(({ card }) => card)).at(3.65).stagger(0.13).duration(0.32).appear();
      local.animate(tokenCards.map(({ label }) => label)).at(3.78).stagger(0.13).duration(0.28).appear();

      local.animate(llmArrow).at(4.75).duration(0.36).draw();
      local.animate(llmCard).at(5.0).duration(0.45).appear();
      local.animate([llm, llmCaption]).at(5.2).stagger(0.22).duration(0.4).appear();

      local.animate(probabilityTag).at(6.05).duration(0.4).appear();
      candidateVisuals.forEach(({ tokenLabel, bar, percent }, index) => {
        const start = 6.35 + index * 0.36;
        local.animate(tokenLabel).at(start).duration(0.28).appear();
        local.animate(bar).at(start).duration(0.08).appear();
        local.animate(bar).at(start + 0.08).duration(0.6).ease("outCubic").scale3DTo([1, 1, 1]);
        local.animate(percent).at(start + 0.35).duration(0.25).appear();
      });

      local.animate(candidateVisuals[0].tokenLabel).at(8.1).duration(0.55).indicate();
      local.animate(selectionArrow).at(8.5).duration(0.38).draw();
      local.animate(outputCard).at(8.75).duration(0.42).appear();
      local.animate(outputTag).at(8.95).duration(0.3).appear();
      local.animate(selectedToken).at(9.15).duration(0.5).typewrite();

      // Append the first choice, feed the updated context back in, and visibly
      // run the exact same scoring loop for the following token.
      local.animate(answerAfterFirstLoop).at(9.85).duration(0.75).typewrite();
      local.animate([
        queryTag,
        query,
        tokenizerArrow,
        tokenizerCard,
        tokenizer,
        tokensTag,
        llmArrow,
        probabilityTag,
        selectionArrow,
        outputCard,
        outputTag,
        selectedToken,
        ...tokenCards.flatMap(({ card, label }) => [card, label]),
        ...candidateVisuals.flatMap(({ tokenLabel, bar, percent }) => [tokenLabel, bar, percent]),
      ]).at(10.55).stagger(0.008).duration(0.34).disappear();

      local.animate(loopArrow).at(10.65).duration(0.72).draw();
      local.animate(loopLabel).at(10.9).duration(0.4).appear();
      local.animate(updatedContextTag).at(11.25).duration(0.35).appear();
      local.animate(updatedQuery).at(11.4).duration(0.45).appear();
      local.animate(llmCard).at(12.05).duration(0.55).scaleTo(1.04);
      local.animate(llmCard).at(12.6).duration(0.35).scaleTo(1);

      local.animate(secondProbabilityTag).at(12.85).duration(0.4).appear();
      secondCandidateVisuals.forEach(({ tokenLabel, bar, percent }, index) => {
        const start = 13.15 + index * 0.32;
        local.animate(tokenLabel).at(start).duration(0.25).appear();
        local.animate(bar).at(start).duration(0.08).appear();
        local.animate(bar).at(start + 0.08).duration(0.55).ease("outCubic").scale3DTo([1, 1, 1]);
        local.animate(percent).at(start + 0.3).duration(0.22).appear();
      });
      local.animate(secondCandidateVisuals[0].tokenLabel).at(14.65).duration(0.5).indicate();
      local.animate(secondSelectionArrow).at(14.85).duration(0.35).draw();
      local.animate(outputCard).at(14.95).duration(0.35).appear();
      local.animate(secondOutputTag).at(15.08).duration(0.28).appear();
      local.animate(flyingNextToken).at(14.9).duration(0.08).appear();
      local.animate(flyingNextToken)
        .at(15.05).duration(0.55).ease("inOutCubic").moveTo([0, -3.16]);
      local.animate(flyingNextToken).at(15.05).duration(0.55).scaleTo(1.65);
      local.animate(flyingNextToken)
        .at(15.85).duration(0.7).ease("inOutCubic").moveTo([1.95, -4.05]);
      local.animate(flyingNextToken).at(15.85).duration(0.7).scaleTo(1.2);
      local.animate([secondSelectionArrow, outputCard, secondOutputTag])
        .at(16.58).stagger(0.04).duration(0.28).disappear();
      local.animate([
        answerAfterFirstLoop,
        flyingNextToken,
        updatedContextTag,
        updatedQuery,
        loopArrow,
        loopLabel,
        secondProbabilityTag,
        ...secondCandidateVisuals.flatMap(({ tokenLabel, bar, percent }) => [tokenLabel, bar, percent]),
      ]).at(17.05).stagger(0.006).duration(0.32).disappear();

      local.animate(quickLoopCaption).at(17.15).duration(0.4).appear();
      local.animate(quickLoopPlate).at(17.28).duration(0.4).appear();
      local.animate(quickAnswerBase).at(17.45).duration(0.4).appear();
      local.animate(tokenThree).at(17.45).duration(0.3).appear();
      local.animate(quickPink).at(17.55).duration(0.08).appear();
      local.animate(quickPink).at(17.6).duration(0.65).ease("inOutCubic").moveTo([0.08, -3.87]);
      local.animate(quickPink).at(17.6).duration(0.65).scaleTo(1.15);
      local.animate(tokenThree).at(18.25).duration(0.18).disappear();
      local.animate(tokenFour).at(18.34).duration(0.28).appear();
      local.animate(quickBecause).at(18.42).duration(0.08).appear();
      local.animate(quickBecause).at(18.47).duration(0.68).ease("inOutCubic").moveTo([1.05, -3.87]);
      local.animate(quickBecause).at(18.47).duration(0.68).scaleTo(1.08);
      local.animate(quickEllipsis).at(19.2).duration(0.35).appear();
      local.animate(quickLoopPlate).at(19.55).duration(0.55).scaleTo(1.03);
      local.animate(quickLoopPlate).at(20.1).duration(0.35).scaleTo(1);

      local.animate(mainVisuals).at(20.65).stagger(0.008).duration(0.45).disappear();
    }));
    this.play(timeline((local) => {
      local.animate(finalSummary).duration(0.7).ease("outCubic").appear();
      local.animate(finalSummarySub).at(0.35).duration(0.6).appear();
      local.animate(finalSummary).at(1.45).duration(0.65).indicate();
      local.animate([finalSummary, finalSummarySub]).at(2.65).duration(0.5).disappear();
    }));
    this.play(timeline((local) => {
      local.animate(fireworks).duration(0.22).appear();
      local.animate(learnedTitle).at(0.25).duration(0.65).ease("outCubic").appear();
      local.animate(learnedSubtitle).at(0.55).duration(0.6).ease("outCubic").appear();
      local.animate(learnedTitle).at(2.75).duration(0.65).indicate();
      local.animate([learnedTitle, learnedSubtitle, fireworks]).at(3.65).duration(0.55).disappear();
    }));
    this.play(YouTubeSubscribeSequence(subscribe, {
      entranceDuration: 0.55,
      subscribeAt: 0.85,
      bellAt: 1.45,
      actionDuration: 0.45,
    }));
    this.wait(2.2);
  }
}

render(import.meta.url, LLMNextTokenShort, {
  output: sourcePath("../output/llm-next-token-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.18,
  },
});
