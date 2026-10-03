import { render } from "murali-js";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, timeline } from "murali-js/core";
import { FractalTree } from "murali-js/maths";
import { Label } from "murali-js/text";

const BG = "#04110D";
const GREEN = "#7CF7B4";
const INK = "#F2FFF8";
const MUTED = "#9AB9A9";

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

// Wider angle and a shorter child length keep later branches from crossing.
// The trunk and the first splits pass quickly; the canopy slows down.
const HOLDS = [0.22, 0.34, 0.5, 0.8, 1.25, 2, 3.2, 5, 7.2, 9.7];
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

class RecursiveTreeShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const clock = stageClock(HOLDS);
    const tree = this.add(
      FractalTree({ iterations: HOLDS.length - 1, trunkLength: 1.55, angle: 30, branchScale: 0.68 })
        .iteration(0)
        .stroke({ color: GREEN, width: 0.016 })
        .scale(1.23),
      { at: [0, 0.45] },
    );
    const title = this.add(
      Label("Recursive tree")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("Every branch splits in two")
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
      t.animate(tree).at(clock.at[0]!).duration(DRAW).ease("outCubic").draw();
      for (let iteration = 1; iteration <= last; iteration += 1) {
        t.animate(tree)
          .at(clock.at[iteration]!)
          .duration(FADE)
          .ease("linear")
          .to(tree.iterationState(iteration));
      }
      t.animate(tree)
        .at(arrived + 0.45)
        .duration(admire - 1.45)
        .ease("inOutSine")
        .scaleTo(1.29);
      t.wait(clock.end);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(0.5).ease("outCubic").untypewrite();
      t.animate(rule).duration(0.42).ease("outCubic").untypewrite();
    }));
    this.play(timeline((t) => {
      t.animate(tree).duration(0.7).ease("inOutCubic").moveTo([0, 4.55]);
      t.animate(tree).duration(0.7).ease("inOutCubic").scaleTo(0.78);
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

render(import.meta.url, RecursiveTreeShort, {
  output: sourcePath("../output/fractal-recursive-tree-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
