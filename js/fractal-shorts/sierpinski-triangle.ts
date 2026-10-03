import { render } from "murali-js";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, timeline } from "murali-js/core";
import { SierpinskiTriangle } from "murali-js/maths";
import { Label } from "murali-js/text";

const BG = "#090617";
const VIOLET = "#C69CFF";
const INK = "#FFF8FF";
const MUTED = "#B5A6C5";

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

// Depth 6 keeps the holes open after YouTube recompresses a phone-sized frame.
// Holds grow so the opening moves and the later holes can be read.
const HOLDS = [0.35, 0.6, 1, 1.8, 3.2, 6, 15];
const LEAD = 0;
const DRAW = 0.5;
const FADE = 0.22;

function stageClock(holds: readonly number[]): { at: number[]; end: number } {
  const at: number[] = [];
  let time = LEAD;
  for (let index = 0; index < holds.length; index += 1) {
    at.push(time);
    time += (index === 0 ? DRAW : FADE) + holds[index]!;
  }
  return { at, end: time };
}

class SierpinskiTriangleShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const clock = stageClock(HOLDS);
    const triangle = this.add(
      SierpinskiTriangle({ iterations: HOLDS.length - 1, size: 6.3 })
        .iteration(0)
        .stroke({ color: VIOLET, width: 0.024 }),
      { at: [0, 0.25] },
    );
    const title = this.add(
      Label("Sierpinski triangle")
        .height(0.4)
        .color(INK)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("Remove the middle")
        .height(0.24)
        .color(MUTED)
        .css({ fontWeight: 500 }),
      { at: [0, 6.28] },
    );
    const subscribe = this.add(
      YouTubeSubscribe("Kavriq", {
        handle: "@kavriq",
        message: "Subscribe for more visual stories",
        layout: "compact",
        size: [5.2, 3.5],
      }).opacity(0).layer(60),
      { at: [0, -0.7] },
    );

    const last = HOLDS.length - 1;
    const arrived = clock.at[last]! + FADE;
    const admire = HOLDS[last]!;

    this.play(timeline((t) => {
      t.animate(title).duration(0.01).revealText(1, 1);
      t.animate(rule).duration(0.01).revealText(1, 1);
      t.animate(title).at(0.05).duration(0.4).appear();
      t.animate(rule).at(0.18).duration(0.35).appear();
      t.animate(triangle).at(clock.at[0]!).duration(DRAW).ease("outCubic").draw();
      for (let iteration = 1; iteration <= last; iteration += 1) {
        t.animate(triangle)
          .at(clock.at[iteration]!)
          .duration(FADE)
          .ease("linear")
          .to(triangle.iterationState(iteration));
      }
      t.animate(triangle)
        .at(arrived + 0.45)
        .duration(admire - 1.45)
        .ease("inOutSine")
        .scaleTo(1.04);
      t.wait(clock.end);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(0.5).ease("outCubic").untypewrite();
      t.animate(rule).duration(0.42).ease("outCubic").untypewrite();
    }));
    this.play(timeline((t) => {
      t.animate(triangle).duration(0.7).ease("inOutCubic").moveTo([0, 4.25]);
      t.animate(triangle).duration(0.7).ease("inOutCubic").scaleTo(0.58);
    }));
    this.play(YouTubeSubscribeSequence(subscribe, {
      entranceDuration: 0.6,
      subscribeAt: 0.95,
      bellAt: 1.6,
      actionDuration: 0.45,
    }));
    this.wait(2.5);
  }
}

render(import.meta.url, SierpinskiTriangleShort, {
  output: sourcePath("../output/fractal-sierpinski-triangle-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
