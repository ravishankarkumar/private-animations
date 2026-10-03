import { render } from "murali-js";
import { YouTubeSubscribe, YouTubeSubscribeSequence } from "murali-js/composite";
import { Scene, timeline } from "murali-js/core";
import { KochSnowflake } from "murali-js/maths";
import { Label } from "murali-js/text";

const BG = "#040812";
const ICE = "#77E6FF";
const INK = "#F4FBFF";
const MUTED = "#8BA8B7";

const sourcePath = (relativePath: string): string =>
  typeof window === "undefined"
    ? decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
    : relativePath;

// Each stage stays up longer than the one before it. The first shapes
// pass quickly so the short is already moving; the last hold is the look.
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

class KochSnowflakeShort extends Scene {
  constructor() {
    super({ frame: "portrait", background: BG, fps: 30 });
  }

  override construct(): void {
    const clock = stageClock(HOLDS);
    const snowflake = this.add(
      KochSnowflake({ iterations: HOLDS.length - 1, radius: 3.5 })
        .iteration(0)
        .stroke({ color: ICE, width: 0.03 }),
      { at: [0, 0.3] },
    );
    const title = this.add(
      Label("Koch snowflake")
        .height(0.42)
        .color(INK)
        .css({ fontWeight: 700, letterSpacing: "-0.03em" }),
      { at: [0, 6.9] },
    );
    const rule = this.add(
      Label("Each side becomes four")
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
      t.animate(snowflake).at(clock.at[0]!).duration(DRAW).ease("outCubic").draw();
      for (let iteration = 1; iteration <= last; iteration += 1) {
        t.animate(snowflake)
          .at(clock.at[iteration]!)
          .duration(FADE)
          .ease("linear")
          .to(snowflake.iterationState(iteration));
      }
      t.animate(snowflake)
        .at(arrived + 0.45)
        .duration(admire - 1.45)
        .ease("inOutSine")
        .scaleTo(1.06);
      t.wait(clock.end);
    }));
    this.play(timeline((t) => {
      t.animate(title).duration(0.5).ease("outCubic").untypewrite();
      t.animate(rule).duration(0.42).ease("outCubic").untypewrite();
    }));
    this.play(timeline((t) => {
      t.animate(snowflake).duration(0.7).ease("inOutCubic").moveTo([0, 4.55]);
      t.animate(snowflake).duration(0.7).ease("inOutCubic").scaleTo(0.62);
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

render(import.meta.url, KochSnowflakeShort, {
  output: sourcePath("../output/fractal-koch-snowflake-short.mp4"),
  fps: 30,
  audio: {
    source: sourcePath("../../resources/audio/raag-pahadi.mp3"),
    volume: 0.2,
  },
});
