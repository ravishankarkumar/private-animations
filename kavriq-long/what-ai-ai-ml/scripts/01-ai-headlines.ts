import { Newspaper, NewspaperOpening } from "murali-js/storytelling";
import { Scene, Timeline } from "murali-js/core";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "./lib/theme.ts";
import { renderScene } from "./lib/render.ts";

class AIHeadlinesScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: "#0C0B0A" });
  }

  override construct(): void {
    const newspapers = [
      new Newspaper("AI Assistants Move Into Daily Work")
        .keyword("AI")
        .publication("THE TECHNOLOGY OBSERVER")
        .date("SPECIAL EDITION")
        .section("ARTIFICIAL INTELLIGENCE")
        .deck("New systems change how people write, search, and create.")
        .layout("lead"),
      new Newspaper("Generative Models Transform Creative Tools")
        .keyword("GENERATIVE AI")
        .publication("THE DIGITAL CHRONICLE")
        .date("MORNING EDITION")
        .section("CREATIVE TECHNOLOGY")
        .layout("columns"),
      new Newspaper("Deepfakes Raise New Questions")
        .keyword("DEEPFAKES")
        .publication("THE WORLD JOURNAL")
        .date("WEEKEND EDITION")
        .section("MEDIA")
        .layout("tabloid"),
      new Newspaper("Foundation Models Power New Products")
        .keyword("FOUNDATION MODELS")
        .publication("THE COMPUTE REVIEW")
        .date("ANALYSIS")
        .section("RESEARCH")
        .layout("columns"),
      new Newspaper("The Vocabulary of AI Keeps Growing")
        .keyword("NEW ERA")
        .publication("THE DAILY SIGNAL")
        .date("EXPLAINER")
        .section("TECHNOLOGY")
        .layout("lead"),
    ];

    const opening = NewspaperOpening(newspapers, {
      title: "AI TAKES CENTER STAGE",
      kicker: "THE STORY EVERYONE IS DISCUSSING",
      publication: "KAVRIQ EXPLAINED",
      date: "SPECIAL REPORT",
      volume: "AI · ML · DL · GEN AI",
      totalTime: 6.4,
    }).addTo(this);

    const featured = [
      ["AI", COLOR.ai, -4.7, 1.55, 0.68],
      ["Machine Learning", COLOR.ml, -1.4, 1.7, 0.48],
      ["Deep Learning", COLOR.dl, 2.5, 1.55, 0.5],
      ["Neural Network", COLOR.dl, -3.8, -0.15, 0.38],
      ["Foundation Model", COLOR.foundation, 0, 0.1, 0.45],
      ["LLM", COLOR.foundation, 3.7, -0.05, 0.62],
      ["Generative AI", COLOR.genai, 0.7, -1.62, 0.56],
    ] as const;
    const featuredLabels = featured.map(([text, color, x, y, size]) => this.add(
      Label(text).height(size).color(color).css({ fontWeight: 900, letterSpacing: "-0.025em" }),
      { at: [x, y, 0] },
    ));
    const filler = [
      ["tokens", -5.5, 0.55], ["agents", 5.25, 0.7], ["training", -4.9, -1.2],
      ["inference", 4.8, -1.25], ["multimodal", -2.1, -2.5], ["prompting", 3.1, -2.45],
      ["automation", -0.1, 2.65], ["synthetic media", 4.3, 2.45], ["data", -5.4, 2.35],
    ] as const;
    const fillerLabels = filler.map(([text, x, y]) => this.add(
      Label(text).height(0.25).color(COLOR.muted).opacity(0.62).css({ fontWeight: 700 }),
      { at: [x, y, 0] },
    ));

    const timeline = new Timeline();
    opening.animate(timeline);
    timeline.animate(opening.visual).at(6.4).duration(0.6).disappear();
    timeline.animate(featuredLabels).at(6.75).stagger(0.2).duration(0.45).appear();
    timeline.animate(fillerLabels).at(8.25).stagger(0.08).duration(0.32).appear();
    fillerLabels.forEach((label) => {
      timeline.animate(label).at(11.2).duration(0.5).to({ opacity: 0.18 });
    });
    timeline.animate(featuredLabels).at(11.35).duration(0.6).scaleTo(1.04);
    this.play(timeline);
    this.wait(1.2);
    this.captureScreenshotsNamed([[9.5, "ai-word-cloud"]]);
  }
}

await renderScene(import.meta.url, AIHeadlinesScene, "01-ai-headlines.mp4");
