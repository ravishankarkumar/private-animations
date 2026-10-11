import { Scene, Timeline } from "murali-js/core";
import { Label } from "murali-js/text";
import { COLOR, FRAME } from "./lib/theme.ts";
import { addArrow, addCard, addEmailMessage, addHeading } from "./lib/ui.ts";
import { renderScene } from "./lib/render.ts";

class FoundationModelsScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const heading = addHeading(this, "FOUNDATION MODELS", "Learn broadly once, then adapt to many downstream tasks");
    const sourceSpecs = [
      ["Books", "Long-form language"], ["Web pages", "Broad public knowledge"],
      ["Code", "Patterns and structure"], ["Documents", "Specialized writing"],
    ] as const;
    const sources = sourceSpecs.map(([title, subtitle], index) => addCard(this, {
      title, subtitle, color: COLOR.muted, at: [-5.6, 1.75 - index * 1.05], size: [2.65, 0.82],
    }));
    const foundation = addCard(this, {
      title: "Foundation model", subtitle: "Broad pre-training", detail: "Adapt or prompt for a task",
      color: COLOR.foundation, at: [-1.4, 0.25], size: [3.7, 2.65],
    });
    const llm = addCard(this, {
      title: "LLM", subtitle: "A language-focused foundation model",
      color: COLOR.foundation, at: [-1.4, -1.65], size: [3.4, 0.85],
    });
    const taskSpecs = [
      ["Summarize", "Shorten the email", COLOR.genai], ["Classify", "Spam or not spam", COLOR.ml],
      ["Extract", "Find date and venue", COLOR.ai], ["Translate", "Change the language", COLOR.dl],
      ["Draft", "Write a reply", COLOR.genai],
    ] as const;
    const tasks = taskSpecs.map(([title, subtitle, color], index) => addCard(this, {
      title, subtitle, color, at: [4.95, 2.0 - index * 0.92], size: [3.0, 0.72],
    }));
    const sourceArrows = sourceSpecs.map((_, index) =>
      addArrow(this, [-4.2, 1.75 - index * 1.05], [-3.35, 0.75 - index * 0.3], COLOR.foundation));
    const taskArrows = taskSpecs.map((_, index) =>
      addArrow(this, [0.5, 0.7 - index * 0.25], [3.35, 2.0 - index * 0.92], COLOR.foundation));
    const email = addEmailMessage(this, [0.25, -3.25], 0.52);
    const caption = this.add(
      Label("One base model can help across the email workflow.").height(0.18).color(COLOR.muted).css({ fontWeight: 700 }),
      { at: [3.55, -3.25, 0] },
    );

    const timeline = new Timeline();
    timeline.animate(heading).at(0).stagger(0.12).duration(0.5).appear();
    sources.forEach((card, index) => timeline.animate(card).at(0.75 + index * 0.18).stagger(0.02).duration(0.35).appear());
    timeline.animate(sourceArrows).at(1.55).stagger(0.12).duration(0.38).draw();
    timeline.animate(foundation).at(2.0).stagger(0.04).duration(0.45).appear();
    timeline.animate(llm).at(2.7).stagger(0.04).duration(0.4).appear();
    timeline.animate(taskArrows).at(3.2).stagger(0.1).duration(0.35).draw();
    tasks.forEach((card, index) => timeline.animate(card).at(3.65 + index * 0.18).stagger(0.02).duration(0.35).appear());
    timeline.animate(email.all).at(4.85).stagger(0.02).duration(0.35).appear();
    timeline.animate(caption).at(5.35).duration(0.7).typewrite();
    timeline.animate(foundation[0]).at(6.35).duration(0.45).scaleTo(1.05);
    this.play(timeline);
    this.wait(1.8);
  }
}

await renderScene(import.meta.url, FoundationModelsScene, "10-foundation-models.mp4");
