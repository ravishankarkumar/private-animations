import { Scene, Timeline } from "murali-js/core";
import { COLOR, FRAME } from "./lib/theme.ts";
import { addOpenEmailView } from "./lib/open-email.ts";
import { renderScene } from "./lib/render.ts";

class EmailCardPreviewScene extends Scene {
  constructor() {
    super({ width: FRAME.width, height: FRAME.height, background: COLOR.background });
  }

  override construct(): void {
    const email = addOpenEmailView(this, { at: [0, -0.03], scale: 0.96 });
    const timeline = new Timeline();
    timeline.animate(email.all).at(0).stagger(0.012).duration(0.42).appear();
    timeline.animate(email.reply).at(0.62).duration(0.28).scaleTo(1.012);
    timeline.animate(email.errorChip).at(0.92).duration(0.24).scaleTo(1.06);
    this.play(timeline);
    this.wait(1.2);
    this.captureScreenshotsNamed([[1.35, "open-email-card"]]);
  }
}

await renderScene(import.meta.url, EmailCardPreviewScene, "00-email-card-preview.mp4");
